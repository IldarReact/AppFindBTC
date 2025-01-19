import { create } from 'zustand';
import type { User, Balance } from '../shared/types/tools.types';
import { createUser } from '@/shared/api/firebase/db';

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    updateBalance: (currency: keyof Balance, amount: number) => void;
    addTool: (toolId: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => {
        if (user) {
            console.log('Устанавливаем пользователя:', user);
            set({ user });
        } else {
            console.warn('Пользователь не передан или равен null.');
        }
    },
    updateBalance: (currency, amount) => set((state) => {
        if (!state.user) {
            console.warn('Пользователь не инициализирован.');
            return state;
        }

        return {
            user: {
                ...state.user,
                balance: {
                    ...state.user.balance,
                    [currency]: state.user.balance[currency] + amount,
                },
            },
        };
    }),
    addTool: (toolId) => set((state) => ({
        user: state.user ? {
            ...state.user,
            tools: [...state.user.tools, toolId],
        } : null,
    })),
}));

export const initializeUser = async (telegramId: number, username: string, balance: Balance) => {
    try {
        await createUser(telegramId, username, balance);
        console.log('Пользователь успешно создан в Firestore.');
    } catch (error) {
        console.error('Ошибка при создании пользователя в Firestore:', error);
    }
};