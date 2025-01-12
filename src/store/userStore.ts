import { create } from 'zustand';
import type { User } from '../types/tools';

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    updateBalance: (amount: number) => void;
    addTool: (toolId: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    updateBalance: (amount) => set((state) => ({
        user: state.user ? {
            ...state.user,
            balance: state.user.balance + amount
        } : null
    })),
    addTool: (toolId) => set((state) => ({
        user: state.user ? {
            ...state.user,
            tools: [...state.user.tools, toolId]
        } : null
    }))
}));