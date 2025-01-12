import React from 'react';
import { ToolCard } from './ToolCard';
import { AVAILABLE_TOOLS } from '../../utils/constants';

export const ToolList: React.FC = () => {
  return (
    <div className="tool-list">
      {AVAILABLE_TOOLS.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};
