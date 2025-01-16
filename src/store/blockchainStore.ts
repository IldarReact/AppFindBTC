import { create } from 'zustand';
import { useUserStore } from './userStore';

interface BlockchainState {
    balance: {
        ETH: number;
        TON: number;
        $: number;
    };
    fetchBalance: () => void;
}

export const useBlockchainStore = create<BlockchainState>((set) => ({
    balance: {
        ETH: 0,
        TON: 0,
        $: 0,
    },
    fetchBalance: () => {
        const { user } = useUserStore.getState(); // Получаем данные пользователя
        if (user) {
            set({
                balance: {
                    ETH: 0,
                    TON: 0, // Замените на реальные значения, если они есть
                    $: user.balance, // Синхронизируем баланс из useUserStore
                },
            });
        }
    },
}));