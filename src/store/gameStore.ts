import { create } from 'zustand';
import { generateInitialGrid } from '@/utils/grid';
import { Cell, Tool } from '@/types/game';

interface GameState {
  cells: Record<string, Cell>;
  balance: {
    BTC: number;
    USDT: number;
    TON: number;
  };
  tools: Tool[];
  mineCell: (cellId: string) => void;
  buyTool: (tool: Tool) => boolean;
}

const initialBalance = {
  BTC: 0,
  USDT: 0.2,
  TON: 0
};

export const useGameStore = create<GameState>((set, get) => ({
  cells: generateInitialGrid(),
  balance: initialBalance,
  tools: [],
  mineCell: (cellId) => {
    const cell = get().cells[cellId];
    if (cell.mined) return;

    Object.entries(cell.resources).forEach(([token, amount]) => {
      if (amount && amount > 0) {
        const tokenKey = token as keyof typeof initialBalance;
        set((state) => ({
          balance: {
            ...state.balance,
            [tokenKey]: state.balance[tokenKey] + amount
          },
          cells: {
            ...state.cells,
            [cellId]: { ...cell, resources: { [token]: 0 }, mined: true }
          }
        }));
      }
    });
  },
  buyTool: (tool) => {
    const state = get();
    const tokenKey = tool.tokenType as keyof typeof initialBalance;
    if (state.balance[tokenKey] >= tool.price) {
      set((state) => ({
        tools: [...state.tools, tool],
        balance: {
          ...state.balance,
          [tokenKey]: state.balance[tokenKey] - tool.price
        }
      }));
      return true;
    }
    return false;
  }
}));