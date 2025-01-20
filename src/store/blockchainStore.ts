import { create } from 'zustand';
import { useUserStore } from './userStore';
import { Balance } from '@/shared/types/tools.types';

interface BlockchainState {
    balance: Balance;
    fetchBalance: () => Promise<void>;
    sendTransaction: (to: string, amount: number, token: 'ETH' | 'TON' | '$') => Promise<void>;
}

export const useBlockchainStore = create<BlockchainState>((set) => ({
    balance: {
        ETH: 0,
        TON: 0,
        $: 0,
    },
    fetchBalance: async () => {
        try {
            const { user } = useUserStore.getState();
            if (user) {
                set({
                    balance: {
                        ETH: 0, // Здесь можно добавить вызов getBalance для ETH и TON
                        TON: 0,
                        $: user.balance.$,
                    },
                });
            }
        } catch (error) {
            console.error('Ошибка при получении баланса:', error);
        }
    },
    sendTransaction: async (to, amount, token) => {
        try {
            console.log(`Отправка ${amount} ${token} на адрес ${to}`);

            const { user, updateBalance } = useUserStore.getState();
            if (user) {
                // Проверяем, что баланс достаточен
                if (user.balance[token] < amount) {
                    throw new Error('Недостаточно средств');
                }

                // Обновляем баланс
                updateBalance(token, -amount);

                // Здесь можно добавить вызов sendTransaction для ETH или TON
            }
        } catch (error) {
            console.error('Ошибка при отправке транзакции:', error);
            throw new Error('Не удалось отправить транзакцию');
        }
    },
}));