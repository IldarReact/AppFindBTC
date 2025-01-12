import React from 'react';
import HexCell from './HexCell';

interface HexRowProps {
  row: (string | null)[];
  rowIndex: number;
  revealedCells: Set<string>;
  onCellClick: (rowIndex: number, cellIndex: number) => void;
  hexWidth: number;
  hexHeight: number;
  vertDistance: number;
  horizDistance: number;
  rowOffset: number;
}

const HexRow: React.FC<HexRowProps> = ({
  row,
  rowIndex,
  revealedCells,
  onCellClick,
  hexWidth,
  hexHeight,
  vertDistance,
  horizDistance,
  rowOffset,
}) => {
  return (
    <>
      {row.map((cell, cellIndex) => {
        const cellId = `${rowIndex}-${cellIndex}`;
        const xPos = cellIndex * horizDistance + rowOffset + hexWidth;
        const yPos = rowIndex * vertDistance + hexHeight;

        return (
          <HexCell
            key={cellId}
            value={cell}
            isRevealed={revealedCells.has(cellId)}
            onClick={() => onCellClick(rowIndex, cellIndex)}
            style={{
              left: `${xPos}px`,
              top: `${yPos}px`,
            }}
          />
        );
      })}
    </>
  );
};

export default HexRow;
