import { useState } from 'react';
import HexRow from './HexRow';

const HexGrid = () => {
  // Базовые размеры для правильного шестиугольника
  const HEX_WIDTH = 58; // ширина шестиугольника
  const HEX_HEIGHT = HEX_WIDTH * 1; // высота шестиугольника
  const VERT_DISTANCE = HEX_HEIGHT * 0.8; // вертикальное расстояние между рядами
  const HORIZ_DISTANCE = HEX_WIDTH; // горизонтальное расстояние между центрами

  const rowStructure = [5, 6, 7, 8, 9, 8, 7, 6, 5];

  const createInitialGrid = () => {
    const values = [
      '0.33',
      '0.2',
      '0.15',
      '0.33',
      '0.2',
      '0.33',
      '0.2',
      '0.15',
      '0.33',
      '0.2',
      '0.33',
      '0.2',
      '0.15',
      '0.33',
      '0.2',
      '0.33',
      '0.2',
      '0.15',
      '0.33',
      '0.2',
    ];
    const grid = rowStructure.map((count) => new Array(count).fill(null));

    // Распределяем значения случайно
    values.forEach((value) => {
      let placed = false;
      while (!placed) {
        const rowIndex = Math.floor(Math.random() * grid.length);
        const cellIndex = Math.floor(Math.random() * grid[rowIndex].length);
        if (grid[rowIndex][cellIndex] === null) {
          grid[rowIndex][cellIndex] = value;
          placed = true;
        }
      }
    });

    return grid;
  };

  const [grid] = useState(createInitialGrid());
  const [revealedCells, setRevealedCells] = useState(new Set<string>());

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    const cellId = `${rowIndex}-${cellIndex}`;
    if (!revealedCells.has(cellId)) {
      setRevealedCells((prev) => new Set([...prev, cellId]));
    }
  };

  return (
    <div className="hex-grid">
      {grid.map((row, rowIndex) => {
        // Вычисляем смещение для каждого ряда
        const rowOffset = (HEX_WIDTH / 2) * Math.abs(4 - rowIndex);

        return (
          <HexRow
            key={rowIndex}
            row={row}
            rowIndex={rowIndex}
            revealedCells={revealedCells}
            onCellClick={handleCellClick}
            hexWidth={HEX_WIDTH}
            hexHeight={HEX_HEIGHT}
            vertDistance={VERT_DISTANCE}
            horizDistance={HORIZ_DISTANCE}
            rowOffset={rowOffset}
          />
        );
      })}
    </div>
  );
};

export default HexGrid;