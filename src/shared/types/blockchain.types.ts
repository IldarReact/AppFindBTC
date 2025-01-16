import { EthereumService } from '@/entities/blockchain/model/ethereum.service';
import { TonService } from '@/entities/blockchain/model/ton.service';

export interface Balance {
    amount: string;
    formatted: string;
}

export type Network = 'ETH' | 'TON';

export interface BlockchainState {
    services: {
        ETH?: typeof EthereumService;
        TON?: typeof TonService;
    };
    balances: {
        ETH: string;
        TON: string;
    };
    connectWallet: (network: Network, credentials: string | string[]) => Promise<string>;
    getBalance: (network: Network, address: string) => Promise<void>;
    sendTransaction: (network: Network, to: string, amount: string) => Promise<string>;
}