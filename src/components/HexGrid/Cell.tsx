import React from 'react';
import { motion } from 'framer-motion';
import { Cell as CellType } from '../../types/game';

interface CellProps {
  cell: CellType;
  onMine: () => void;
  isInRange: boolean;
}

export const Cell: React.FC<CellProps> = ({ cell, onMine, isInRange }) => {
  const hasResources = Object.values(cell.resources).some((r) => r > 0);

  return (
    <motion.div
      className={`hex-cell ${!hasResources ? 'mined' : ''} ${isInRange ? 'in-range' : ''}`}
      whileTap={{ scale: 0.95 }}
      onClick={hasResources && isInRange ? onMine : undefined}
    >
      {Object.entries(cell.resources).map(
        ([token, amount]) =>
          amount > 0 && (
            <div key={token} className="resource-indicator">
              {token}: {amount}
            </div>
          ),
      )}
    </motion.div>
  );
};