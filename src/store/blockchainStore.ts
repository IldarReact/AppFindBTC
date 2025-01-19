import { create } from 'zustand';
import { useUserStore } from './userStore';
import { Balance } from '@/shared/types/tools.types';

interface BlockchainState {
    balance: Balance;
    fetchBalance: () => void;
    sendTransaction: (to: string, amount: number, token: 'ETH' | 'TON' | '$') => void;
}

export const useBlockchainStore = create<BlockchainState>((set) => ({
    balance: {
        ETH: 0,
        TON: 0,
        $: 0,
    },
    fetchBalance: () => {
        const { user } = useUserStore.getState();
        if (user) {
            set({
                balance: {
                    ETH: 0,
                    TON: 0,
                    $: user.balance.$,
                },
            });
        }
    },
    sendTransaction: async (to, amount, token) => {
        console.log(`Отправка ${amount} ${token} на адрес ${to}`);

        const { user, updateBalance } = useUserStore.getState();
        if (user) {
            updateBalance(token, -amount); // Обновляем баланс для конкретного токена
        }
    },
}));