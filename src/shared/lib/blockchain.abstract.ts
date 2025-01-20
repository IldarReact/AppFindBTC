import { EthereumService } from '@/entities/blockchain/model/ethereum.service';
import { TonService } from '@/entities/blockchain/model/ton.service';
import { Balance } from '../types/blockchain.types';

export const BlockchainManager = () => {
    const ethService = EthereumService();
    const tonService = TonService();

    // Поддерживаемые сети
    const supportedNetworks = ['ETH', 'TON'];

    // Проверка на корректность сети
    const validateNetwork = (network: string): void => {
        if (!supportedNetworks.includes(network)) {
            throw new Error(`Неподдерживаемая сеть: ${network}. Поддерживаются: ${supportedNetworks.join(', ')}`);
        }
    };

    const getBalance = async (network: 'ETH' | 'TON', address: string): Promise<Balance> => {
        try {
            // Проверяем корректность сети
            validateNetwork(network);

            if (network === 'ETH') {
                return await ethService.getBalance(address);
            } else if (network === 'TON') {
                return await tonService.getBalance(address);
            }

            // Эта строка никогда не выполнится, но TypeScript требует её наличия
            throw new Error('Неподдерживаемая сеть');
        } catch (error) {
            console.error(`Ошибка при получении баланса в сети ${network}:`, error);
            throw new Error(`Не удалось получить баланс: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        }
    };

    const sendTransaction = async (network: 'ETH' | 'TON', to: string, amount: string): Promise<string> => {
        try {
            // Проверяем корректность сети
            validateNetwork(network);

            if (network === 'ETH') {
                return await ethService.sendTransaction(to, amount);
            } else if (network === 'TON') {
                return await tonService.sendTransaction(to, amount);
            }

            // Эта строка никогда не выполнится, но TypeScript требует её наличия
            throw new Error('Неподдерживаемая сеть');
        } catch (error) {
            console.error(`Ошибка при отправке транзакции в сети ${network}:`, error);
            throw new Error(`Не удалось отправить транзакцию: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        }
    };

    const validateAddress = (network: 'ETH' | 'TON', address: string): boolean => {
        try {
            // Проверяем корректность сети
            validateNetwork(network);

            if (network === 'ETH') {
                return ethService.validateAddress(address);
            } else if (network === 'TON') {
                return tonService.validateAddress(address);
            }

            // Эта строка никогда не выполнится, но TypeScript требует её наличия
            throw new Error('Неподдерживаемая сеть');
        } catch (error) {
            console.error(`Ошибка при проверке адреса в сети ${network}:`, error);
            return false;
        }
    };

    return {
        getBalance,
        sendTransaction,
        validateAddress,
    };
};