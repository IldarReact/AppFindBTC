import { Balance } from '@/shared/types/blockchain.types';
import { ethers } from 'ethers';

export const EthereumService = () => {
    const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_INFURA_KEY');

    const getBalance = async (address: string): Promise<Balance> => {
        const balance = await provider.getBalance(address);
        return {
            amount: balance.toString(),
            formatted: ethers.formatEther(balance),
        };
    };

    const sendTransaction = async (to: string, amount: string): Promise<string> => {
        const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
        const tx = await wallet.sendTransaction({
            to,
            value: ethers.parseEther(amount),
        });
        return tx.hash;
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