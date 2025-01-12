import { create } from 'zustand';
import { BlockchainService } from '../services/blockchain/BlockchainService';

interface BlockchainState {
    balance: {
        ETH: number;
        USDT: number;
        TON: number;
    };
    fetchBalance: (address: string) => Promise<void>;
    sendTransaction: (to: string, amount: number, token: 'ETH' | 'USDT' | 'TON') => Promise<void>;
}

export const useBlockchainStore = create<BlockchainState>((set) => ({
    balance: {
        ETH: 0,
        USDT: 0,
        TON: 0,
    },
    fetchBalance: async (address) => {
        const blockchainService = BlockchainService.getInstance();
        const ethBalance = await blockchainService.getEthBalance(address);
        const usdtBalance = await blockchainService.getUsdtBalance(address);
        const tonBalance = await blockchainService.getTonBalance(address);
        set({ balance: { ETH: ethBalance, USDT: usdtBalance, TON: tonBalance } });
    },
    sendTransaction: async (to, amount, token) => {
        const blockchainService = BlockchainService.getInstance();
        let txHash: string;
        switch (token) {
            case 'ETH':
                txHash = await blockchainService.sendEth(to, amount);
                break;
            case 'USDT':
                txHash = await blockchainService.sendUsdt(to, amount);
                break;
            case 'TON':
                txHash = await blockchainService.sendTon(to, amount);
                break;
            default:
                throw new Error('Unsupported token');
        }
        console.log('Transaction Hash:', txHash);
    },
}));