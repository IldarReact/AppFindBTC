import { create } from 'zustand';
import { Cell, Tool, UserStats } from '../types/game';
import { generateInitialGrid } from '@/utils/grid';

interface GameState {
  cells: Record<string, Cell>;
  tools: Tool[];
  balance: {
    BTC: number;
    USDT: number;
    TON: number;
  };
  stats: UserStats;
  selectedTool: Tool | null;
  setCells: (cells: Record<string, Cell>) => void;
  updateCell: (id: string, resources: Cell['resources']) => void;
  updateBalance: (token: keyof typeof initialBalance, amount: number) => void;
  selectTool: (tool: Tool | null) => void;
  buyTool: (tool: Tool) => boolean;
  updateStats: (token: keyof typeof initialStats.totalMined, amount: number) => void;
}

const initialBalance = {
  BTC: 0,
  USDT: 0.2,
  TON: 0
};

const initialStats = {
  totalMined: {
    BTC: 0,
    USDT: 0,
    TON: 0
  },
  toolsUsed: 0
};

export const useGameStore = create<GameState>((set, get) => ({
  cells: generateInitialGrid(),
  tools: [],
  balance: initialBalance,
  stats: initialStats,
  selectedTool: null,
  setCells: (cells) => set({ cells }),
  updateCell: (id, resources) => set((state) => ({
    cells: {
      ...state.cells,
      [id]: { ...state.cells[id], resources, mined: true }
    }
  })),
  updateBalance: (token, amount) => set((state) => ({
    balance: {
      ...state.balance,
      [token]: Number((state.balance[token] + amount).toFixed(8))
    }
  })),
  selectTool: (tool) => set({ selectedTool: tool }),
  buyTool: (tool) => {
    const state = get();
    if (state.balance[tool.tokenType] >= tool.price) {
      set((state) => ({
        tools: [...state.tools, tool],
        balance: {
          ...state.balance,
          [tool.tokenType]: state.balance[tool.tokenType] - tool.price
        }
      }));
      return true;
    }
    return false;
  },
  updateStats: (token, amount) => set((state) => ({
    stats: {
      ...state.stats,
      totalMined: {
        ...state.stats.totalMined,
        [token]: state.stats.totalMined[token] + amount
      },
      toolsUsed: state.stats.toolsUsed + 1
    }
  }))
}));