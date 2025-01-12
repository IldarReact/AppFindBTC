import React, { useMemo } from 'react';
import { Cell } from './Cell';
import { useGameStore } from '@/store/gameStore';
import { calculateRange } from '@/utils/grid';

export const Grid: React.FC = () => {
  const { cells, selectedTool, updateCell, updateBalance, updateStats } =
    useGameStore();

  const mineCell = (cellId: string) => {
    const cell = cells[cellId];
    if (!selectedTool || cell.mined) return;

    const affectedCells: Record<string, boolean> = calculateRange(
      cellId,
      cells,
      selectedTool.range,
    );

    Object.entries(affectedCells).forEach(([id, inRange]) => {
      if (inRange) {
        const cell = cells[id];
        Object.entries(cell.resources).forEach(([token, amount]) => {
          if (amount && amount > 0) {
            const mined = Math.min(amount, selectedTool.power);
            updateCell(id, { ...cell.resources, [token]: amount - mined });
            updateBalance(token as "BTC" | "USDT" | "TON", mined);
            updateStats(token as "BTC" | "USDT" | "TON", mined);
          }
        });
      }
    });
  };

  const cellsInRange: string[] = useMemo(() => {
    if (!selectedTool) return [];
    return Object.entries(
      calculateRange(Object.keys(cells)[0], cells, selectedTool.range),
    )
      .filter(([_, inRange]) => inRange)
      .map(([id]) => id);
  }, [selectedTool, cells]);

  return (
    <div className="hex-grid">
      {Object.values(cells).map((cell) => (
        <Cell
          key={cell.id}
          cell={cell}
          onMine={() => mineCell(cell.id)}
          isInRange={cellsInRange.includes(cell.id)}
        />
      ))}
    </div>
  );
};