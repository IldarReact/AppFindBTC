import { useState, useEffect } from 'react';
import HexRow from './HexRow';
import { useGameStore } from '../../store/gameStore';
import { useUserStore } from '../../store/userStore';

const HexGrid = () => {
  const { mineCell, cells } = useGameStore();
  const { user } = useUserStore(); // Получаем текущего пользователя
  const [revealedCells, setRevealedCells] = useState(new Set<string>());

  const [dimensions, setDimensions] = useState({
    hexWidth: 58,
    hexHeight: 58,
    vertDistance: 46.4,
    horizDistance: 58,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const baseSize = Math.min(58, window.innerWidth / 12);
      setDimensions({
        hexWidth: baseSize,
        hexHeight: baseSize,
        vertDistance: baseSize * 0.8,
        horizDistance: baseSize,
      });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const rowStructure = [5, 6, 7, 8, 9, 8, 7, 6, 5];

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    const cellId = `${rowIndex}-${cellIndex}`;
    if (!revealedCells.has(cellId)) {
      setRevealedCells((prev) => new Set([...prev, cellId]));

      const cell = cells[cellId];
      if (cell) {
        console.log(
          `Открыта ячейка с ${Object.keys(cell.resources)[0]}: ${Object.values(cell.resources)[0]}`,
        );

        if (!user?.telegramId) {
          console.error('Пользователь не авторизован. Невозможно добыть ресурсы.');
          return;
        }

        console.log(`Добываем ресурсы для пользователя:`, user.telegramId);
        mineCell(cellId, user.telegramId.toString());
      }
    }
  };

  return (
    <div className="hex-grid">
      {rowStructure.map((count, rowIndex) => {
        const rowOffset = (dimensions.hexWidth / 2) * Math.abs(4 - rowIndex);

        return (
          <HexRow
            key={rowIndex}
            row={Array.from(
              { length: count },
              (_, cellIndex) => cells[`${rowIndex}-${cellIndex}`],
            )}
            rowIndex={rowIndex}
            revealedCells={revealedCells}
            onCellClick={handleCellClick}
            hexWidth={dimensions.hexWidth}
            hexHeight={dimensions.hexHeight}
            vertDistance={dimensions.vertDistance}
            horizDistance={dimensions.horizDistance}
            rowOffset={rowOffset}
          />
        );
      })}
    </div>
  );
};

export default HexGrid;