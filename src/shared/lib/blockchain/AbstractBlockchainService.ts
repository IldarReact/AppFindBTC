export interface Balance {
    amount: string;
    formatted: string;
}

export abstract class AbstractBlockchainService {
    abstract getBalance(address: string): Promise<Balance>;
    abstract sendTransaction(to: string, amount: string): Promise<string>;
    abstract validateAddress(address: string): boolean;

    protected formatBalance(balance: string, decimals: number): string {
        const formatted = Number.parseFloat(balance) / Math.pow(10, decimals);
        return formatted.toFixed(decimals);
    }
}