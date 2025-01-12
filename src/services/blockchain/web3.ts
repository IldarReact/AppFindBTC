import Web3 from 'web3';

export class Web3Service {
    private static instance: Web3Service;
    private web3: Web3;

    private constructor() {
        // Используем тестовую сеть TON
        this.web3 = new Web3('https://testnet.toncenter.com/api/v2/jsonRPC');
    }

    static getInstance(): Web3Service {
        if (!this.instance) {
            this.instance = new Web3Service();
        }
        return this.instance;
    }

    async getBalance(address: string): Promise<{
        BTC: number;
        USDT: number;
        TON: number;
    }> {
        try {
            const balance = await this.web3.eth.getBalance(address);
            return {
                BTC: 0,
                USDT: 0.2,
                TON: Number(balance) // Пример конвертации баланса
            };
        } catch (error) {
            console.error('Failed to get balance:', error);
            throw error;
        }
    }

    async sendTransaction(
        to: string,
        amount: number,
        token: 'BTC' | 'USDT' | 'TON'
    ): Promise<string> {
        try {
            console.log(`Sending ${amount} ${token} to ${to}`);
            // Здесь должна быть реальная логика отправки транзакции
            return 'transaction_hash';
        } catch (error) {
            console.error('Failed to send transaction:', error);
            throw error;
        }
    }
}