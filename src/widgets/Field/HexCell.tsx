import React from 'react';
import { Cell } from '@/shared/types/game.types';

interface HexCellProps {
  value: Cell | undefined;
  isRevealed: boolean;
  onClick: () => void;
  style: React.CSSProperties;
}

const HexCell: React.FC<HexCellProps> = ({ value, isRevealed, onClick, style }) => {
  const handleClick = () => {
    if (!isRevealed) {
      onClick();
    }
  };


  return (
    <div
      onClick={handleClick}
      className={`hex-cell ${isRevealed ? (value ? 'revealed' : 'empty') : ''}`}
      style={style}
    >
      {isRevealed && value && (
        <div className="hex-cell-content">
          <div>{Object.keys(value.resources)[0]}</div>
          <div>{Object.values(value.resources)[0].toFixed(4)}</div>
        </div>
      )}
    </div>
  );
};

export default HexCell;