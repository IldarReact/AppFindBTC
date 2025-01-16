import { create } from 'zustand';
import type { User } from '../shared/types/tools.types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/shared/api/firebase/config';

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    updateBalance: (amount: number) => void;
    addTool: (toolId: string) => void;
}

export const createUser = async (telegramId: number, username: string) => {
    await setDoc(doc(db, 'users', telegramId.toString()), {
        telegramId,
        username,
        balance: 10, // Начальный баланс $10
        tools: [],
        miningCount: 0,
        createdAt: new Date(),
    });
};

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => {
        console.log('Устанавливаем пользователя:', user);
        set({ user });
    },
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