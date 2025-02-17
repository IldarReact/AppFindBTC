'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import type { Cell } from '@/shared/types/game.types';
import { logger } from '@/shared/lib/logger';
import {
  loadOrCreateUserCells,
  mineResources,
  updateUserBalance,
  updateUserCells,
  ROW_STRUCTURE,
} from './cellsService';
import { useToolStore } from '@/features/shop/model/model/toolStore';
import { initializeUserWithBasicTool } from '../Shop/cellsService';

const HexGame = () => {
  const { user, setUser } = useUserStore();
  const [cells, setCells] = useState<Cell[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({
    hexWidth: 50,
    hexHeight: 0,
    vertDistance: 0,
    horizDistance: 0,
  });
  const { selectedTool } = useToolStore();

  const MAX_CELLS_IN_ROW = Math.max(...ROW_STRUCTURE);

  const calculateDimensions = () => {
    const containerWidth = window.innerWidth;
    let hexWidth = 50;

    if (containerWidth < 480) {
      hexWidth = 33;
    } else if (containerWidth < 768) {
      hexWidth = 45;
    } else if (containerWidth < 1024) {
      hexWidth = 50;
    }

    const hexHeight = (hexWidth * Math.sqrt(3)) / 2;
    const vertDistance = hexHeight * 0.85;
    const horizDistance = hexWidth * 1.1;

    setDimensions({
      hexWidth,
      hexHeight,
      vertDistance,
      horizDistance,
    });
  };

  useEffect(() => {
    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  useEffect(() => {
    const loadCells = async () => {
      if (!user?.id) {
        setError('User is not authorized');
        setIsLoading(false);
        return;
      }

      try {
        const userCells = await loadOrCreateUserCells(user.id);
        setCells(userCells);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error('Error loading cells:', errorMessage);
        setError('Failed to load game board');
      } finally {
        setIsLoading(false);
      }
    };

    loadCells();
  }, [user?.id]);

  useEffect(() => {
    const initTools = async () => {
      if (user?.id) {
        try {
          const tools = await initializeUserWithBasicTool(user.id);
          if (tools) {
            setUser({
              ...user,
              tools,
            });
          }
        } catch (error) {
          logger.error('Error initializing tools:', error as Error);
        }
      }
    };

    initTools();
  }, [user, setUser]);

  const handleCellClick = async (cell: Cell) => {
    if (!user?.id || cell.mined) return;

    if (!selectedTool || selectedTool.uses <= 0) {
      setError('Select a mining tool');
      return;
    }

    try {
      const toolPower = selectedTool ? selectedTool.power : 1;
      const minedResources = mineResources(cell, toolPower);
      const updatedCell = { ...cell, mined: true };
      const updatedCells = cells.map((c) =>
        c.id === cell.id ? updatedCell : c,
      );

      setCells(updatedCells);

      const newBalance = {
        $: user.balance.$ || 0,
        ETH: (user.balance.ETH || 0) + minedResources.ETH,
        TON: (user.balance.TON || 0) + minedResources.TON,
      };

      const updatedTools = user.tools.map((tool) =>
        tool.id === selectedTool.id ? { ...tool, uses: tool.uses - 1 } : tool,
      );

      const updatedUser = {
        ...user,
        balance: newBalance,
        tools: updatedTools,
        cells: updatedCells,
        miningCount: (user.miningCount || 0) + 1,
      };

      setUser(updatedUser);

      await Promise.all([
        updateUserCells(user.id, updatedCells),
        updateUserBalance(user.id, newBalance),
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Error while mining cell:', errorMessage);
      setError('Error while mining resources');
    }
  };

  const getCellColor = (cell: Cell) => {
    if (!cell.mined) {
      return '#000067';
    }

    if (cell.resources.ETH > 0) {
      return '#f7931a';
    }
    if (cell.resources.TON > 0) {
      return '#5bc0de';
    }
    return '#ccc';
  };

  if (isLoading) return <div>Loading the playing field...</div>;
  if (error) return <div>Error: {error}</div>;

  const gridCells: Cell[][] = [];
  let cellIndex = 0;

  for (let rowIndex = 0; rowIndex < ROW_STRUCTURE.length; rowIndex++) {
    const rowCells: Cell[] = [];
    for (let i = 0; i < ROW_STRUCTURE[rowIndex]; i++) {
      if (cellIndex < cells.length) {
        rowCells.push(cells[cellIndex]);
      } else {
        rowCells.push({
          id: `empty-${cellIndex}`,
          position: { x: i, y: rowIndex },
          resources: { ETH: 0, TON: 0 },
          mined: false,
        });
      }
      cellIndex++;
    }
    gridCells.push(rowCells);
  }

  const gridWidth = dimensions.hexWidth * (MAX_CELLS_IN_ROW + 1);
  const gridHeight = dimensions.vertDistance * (ROW_STRUCTURE.length + 1);

  return (
    <div className="w-full min-h-screen flex flex-col p-4">
      <h2 className="text-white bg-[#000067] p-4 rounded-md w-full max-w-3xl text-center mb-[130px]">
        Game board #1
      </h2>
      <div
        className="relative mx-auto top-[23%] sm:top-[29%] left-[7%] sm:left-[11%]"
        style={{
          width: `${gridWidth}px`,
          height: `${gridHeight}px`,
        }}
      >
        {gridCells.map((row, rowIndex) => {
          const cellsInRow = ROW_STRUCTURE[rowIndex];
          const rowOffset =
            ((MAX_CELLS_IN_ROW - cellsInRow) * dimensions.hexWidth) / 2;

          return row.map((cell, cellIndex) => {
            if (!cell) return null;

            const xPos = cellIndex * dimensions.horizDistance + rowOffset;
            const yPos = rowIndex * dimensions.vertDistance;

            return (
              <div
                key={cell.id}
                onClick={() => !cell.mined && handleCellClick(cell)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 hover:opacity-90"
                style={{
                  width: `${dimensions.hexWidth}px`,
                  height: `${dimensions.hexHeight}px`,
                  left: `${xPos}px`,
                  top: `${yPos}px`,
                  backgroundColor: getCellColor(cell),
                  clipPath:
                    'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  cursor: cell.mined ? 'default' : 'pointer',
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center text-center justify-center text-[8px] sm:text-xs">
                  {cell.mined && (
                    <>
                      {cell.resources.ETH > 0 && (
                        <span className="text-black font-medium">
                          {cell.resources.ETH} ETH
                        </span>
                      )}
                      {cell.resources.TON > 0 && (
                        <span className="text-black font-medium">
                          {cell.resources.TON} TON
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default HexGame;
