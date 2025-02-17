import { Card } from '@/shared/ui/Card/Card';
import { Button } from '@/shared/ui/Button/Button';
import { useUserStore } from '@/store/userStore';
import { useState } from 'react';
import { useToolStore } from '@/features/shop/model/model/toolStore';

export const Shop = () => {
  const { tools, selectedTool, selectTool, buyTool } = useToolStore();
  const { user } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  const handleBuyTool = async (toolId: string) => {
    try {
      setError(null);
      await buyTool(toolId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while purchasing',
      );
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-lg flex flex-col h-auto">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl text-blue-500">🛠️</span>
        <h2 className="text-2xl font-bold text-gray-800">Shop</h2>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="overflow-y-auto flex-1 pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${selectedTool?.id === tool.id ? 'border-[#00008b] bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
              `}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <span className="text-xl">⛏️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {tool.name}
                </h3>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Price:</span>
                  <span className="font-medium text-[#00008b]">
                    {tool.price} {tool.tokenType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Power:</span>
                  <span className="font-medium">{tool.power}x</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Uses:</span>
                  <span className="font-medium">{tool.uses}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Number:</span>
                  <span className="font-medium">{tool.number}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => selectTool(tool.id)}
                  variant={
                    selectedTool?.id === tool.id ? 'primary' : 'secondary'
                  }
                  className="flex-1 py-2"
                >
                  {selectedTool?.id === tool.id ? 'Selected' : 'Select'}
                </Button>
                <Button
                  onClick={() => handleBuyTool(tool.id)}
                  variant="primary"
                  className="flex-1 py-2 bg-[#000067] hover:bg-[#00008b]"
                  disabled={!user || user.balance.ETH < tool.price}
                >
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Shop;