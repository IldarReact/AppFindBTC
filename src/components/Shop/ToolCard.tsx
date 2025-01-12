import React from 'react';
import { Tool } from '../../types/game';
import { useGameStore } from '../../store/gameStore';
import { WebAppService } from '@/services/telegram/webApp';

interface ToolCardProps {
  tool: Tool;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { buyTool, balance } = useGameStore();
  const canBuy = balance[tool.tokenType] >= tool.price;

  const handleBuy = () => {
    if (buyTool(tool)) {
      WebAppService.getInstance().showAlert('Tool purchased successfully!');
    }
  };

  return (
    <div className="tool-card">
      <h3>{tool.name}</h3>
      <p>Type: {tool.type}</p>
      <p>Range: {tool.range}</p>
      <p>Power: {tool.power}</p>
      <p>
        Price: {tool.price} {tool.tokenType}
      </p>
      <button
        onClick={handleBuy}
        disabled={!canBuy}
        className={`buy-button ${!canBuy ? 'disabled' : ''}`}
      >
        Buy Tool
      </button>
    </div>
  );
};