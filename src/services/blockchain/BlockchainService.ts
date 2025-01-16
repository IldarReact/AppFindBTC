import Web3 from 'web3';

// Конфигурация для сетей
const ETH_NETWORK_URL = 'https://rinkeby.infura.io/v3/7eb7a472cf344fc286210e6283caa85b';
const BTC_NETWORK_URL = 'https://api.blockcypher.com/v1/btc/test3';
const TON_NETWORK_URL = 'https://testnet.toncenter.com/api/v2/jsonRPC';

export class BlockchainService {
    private static instance: BlockchainService;
    private web3ETH: Web3;
    private web3BTC: Web3;
    private web3TON: Web3;

    private constructor() {
        this.web3ETH = new Web3(ETH_NETWORK_URL);
        this.web3BTC = new Web3(BTC_NETWORK_URL);
        this.web3TON = new Web3(TON_NETWORK_URL);
    }

    static getInstance(): BlockchainService {
        if (!this.instance) {
            this.instance = new BlockchainService();
        }
        return this.instance;
    }

    // Получение
    async getEthBalance(address: string): Promise<number> {
        const balance = await this.web3ETH.eth.getBalance(address);
        return Number(this.web3ETH.utils.fromWei(balance, 'ether'));
    }

    async getBTCBalance(address: string): Promise<number> {
        const balance = await this.web3BTC.eth.getBalance(address);
        return Number(this.web3BTC.utils.fromWei(balance, 'ether'));
    }

    async getTonBalance(address: string): Promise<number> {
        const balance = await this.web3TON.eth.getBalance(address);
        return Number(this.web3TON.utils.fromWei(balance, 'ether'));
    }

    // Отправка 
    async sendEth(to: string, amount: number): Promise<string> {
        console.log(`[TEST] Отправка ${amount} ETH на адрес ${to}`);
        return '0xtest_eth_transaction_hash';
    }

    async sendBTC(to: string, amount: number): Promise<string> {
        console.log(`[TEST] Отправка ${amount} BTC на адрес ${to}`);
        return '0xtest_btc_transaction_hash';
    }

    async sendTon(to: string, amount: number): Promise<string> {
        console.log(`[TEST] Отправка ${amount} TON на адрес ${to}`);
        return '0xtest_ton_transaction_hash';
    }
}