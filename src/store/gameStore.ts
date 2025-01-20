import { create } from 'zustand';
import { generateInitialGrid } from '@/shared/utils/grid';
import { Cell, Tool } from '@/shared/types/game.types';
import { updateUserBalance } from '@/shared/api/firebase/user';
import { initialBalance } from '@/shared/config/balance';

interface GameState {
  cells: Record<string, Cell>;
  balance: {
    ETH: number;
    TON: number;
    $: number;
  };
  tools: Tool[];
  mineCell: (cellId: string, userId: string) => void;
  buyTool: (tool: Tool) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  cells: generateInitialGrid(),
  balance: initialBalance,
  tools: [],
  mineCell: (cellId, userId) => {
    const cell = get().cells[cellId];
    if (!cell) {
      console.error(`Ячейка с ID ${cellId} не найдена.`);
      return;
    }

    if (cell.mined) {
      console.log(`Ячейка ${cellId} уже добыта.`);
      return;
    }

    console.log(`Добываем ресурсы из ячейки ${cellId}:`, cell.resources);

    Object.entries(cell.resources).forEach(([token, amount]) => {
      if (amount && amount > 0) {
        const tokenKey = token as keyof typeof initialBalance;
        console.log(`Добавляем ${amount} ${token} к балансу.`);

        set((state) => ({
          balance: {
            ...state.balance,
            [tokenKey]: state.balance[tokenKey] + amount,
          },
          cells: {
            ...state.cells,
            [cellId]: { ...cell, mined: true },
          },
        }));

        console.log(`Новый баланс:`, get().balance);

        // Обновляем баланс в Firebase
        updateUserBalance(userId, amount).then(() => {
          console.log(`Баланс пользователя ${userId} обновлен в Firebase.`);
        });
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
          [tokenKey]: state.balance[tokenKey] - tool.price,
        },
      }));
      return true;
    }
    return false;
  },
}));