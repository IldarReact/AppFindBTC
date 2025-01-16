import React from 'react';
import { Tool } from '../../shared/types/game.types';
import { useGameStore } from '../../store/gameStore';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { buyTool, balance } = useGameStore();
  const canBuy = balance[tool.tokenType] >= tool.price;

  const handleBuy = () => {
    if (canBuy) {
      buyTool(tool);
    }
  };

  return (
    <div className="tool-card">
      <h3>{tool.name}</h3>
      <p>
        Price: {tool.price} {tool.tokenType}
      </p>
      <button onClick={handleBuy} disabled={!canBuy}>
        Buy Tool
      </button>
    </div>
  );
};
