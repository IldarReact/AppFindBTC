import { EthereumService } from '@/entities/blockchain/model/ethereum.service';
import { TonService } from '@/entities/blockchain/model/ton.service';
import { Balance } from '../types/blockchain.types';

export const BlockchainManager = () => {
    const ethService = EthereumService();
    const tonService = TonService();

    const getBalance = async (network: 'ETH' | 'TON', address: string): Promise<Balance> => {
        if (network === 'ETH') {
            return ethService.getBalance(address);
        } else if (network === 'TON') {
            return tonService.getBalance(address);
        }
        throw new Error('Unsupported network');
    };

    const sendTransaction = async (network: 'ETH' | 'TON', to: string, amount: string): Promise<string> => {
        if (network === 'ETH') {
            return ethService.sendTransaction(to, amount);
        } else if (network === 'TON') {
            return tonService.sendTransaction(to, amount);
        }
        throw new Error('Unsupported network');
    };

    const validateAddress = (network: 'ETH' | 'TON', address: string): boolean => {
        if (network === 'ETH') {
            return ethService.validateAddress(address);
        } else if (network === 'TON') {
            return tonService.validateAddress(address);
        }
        throw new Error('Unsupported network');
    };

    return {
        getBalance,
        sendTransaction,
        validateAddress,
    };
};