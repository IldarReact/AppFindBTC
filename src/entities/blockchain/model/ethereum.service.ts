import { Balance } from '@/shared/types/blockchain.types';
import { ethers } from 'ethers';

export const EthereumService = () => {
    // Получаем Infura ключ из переменных окружения
    const infuraKey = import.meta.env.VITE_INFURA_KEY;

    if (!infuraKey) {
        throw new Error('Infura key is not defined in environment variables');
    }

    const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraKey}`);

    // Получаем приватный ключ из переменных окружения
    const privateKey = import.meta.env.VITE_WALLET_PRIVATE_KEY;

    if (!privateKey) {
        throw new Error('Private key is not defined in environment variables');
    }

    const getBalance = async (address: string): Promise<Balance> => {
        try {
            const balance = await provider.getBalance(address);
            return {
                amount: balance.toString(),
                formatted: ethers.formatEther(balance),
            };
        } catch (error) {
            console.error('Ошибка при получении баланса:', error);
            throw new Error('Не удалось получить баланс');
        }
    };

    const sendTransaction = async (to: string, amount: string): Promise<string> => {
        try {
            const wallet = new ethers.Wallet(privateKey, provider);

            // Получаем баланс отправителя
            const senderBalance = await provider.getBalance(wallet.address);
            const amountWei = ethers.parseEther(amount);

            // Проверяем, что баланс достаточен для транзакции
            if (senderBalance < amountWei) {
                throw new Error('Недостаточно средств для отправки транзакции');
            }

            // Получаем данные о комиссии (gas)
            const feeData = await provider.getFeeData();
            const gasPrice = feeData.gasPrice;
            if (!gasPrice) {
                throw new Error('Не удалось получить данные о комиссии');
            }

            const gasLimit = 21000; // Стандартный лимит газа для простой транзакции
            const totalCost = amountWei + gasPrice * BigInt(gasLimit);

            // Проверяем, что баланс достаточен для покрытия суммы и комиссии
            if (senderBalance < totalCost) {
                throw new Error('Недостаточно средств для покрытия комиссии');
            }

            // Отправляем транзакцию
            const tx = await wallet.sendTransaction({
                to,
                value: amountWei,
                gasPrice,
                gasLimit,
            });

            // Ждём подтверждения транзакции
            await tx.wait();
            return tx.hash;
        } catch (error) {
            console.error('Ошибка при отправке транзакции:', error);
            throw new Error('Не удалось отправить транзакцию');
        }
    };

    const validateAddress = (address: string): boolean => {
        return ethers.isAddress(address);
    };

    return {
        getBalance,
        sendTransaction,
        validateAddress,
    };
};