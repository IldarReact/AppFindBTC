import { ethers } from "ethers"
import { AbstractBlockchainService, type Balance } from "@/shared/lib/blockchain/AbstractBlockchainService"
import { ENV } from "@/shared/config/env"
import { logger } from "@/shared/lib/logger"

export class EthereumService extends AbstractBlockchainService {
    private provider: ethers.JsonRpcProvider;
    private signer: ethers.Wallet;

    constructor() {
        console.log(AbstractBlockchainService);
        super();
        this.provider = new ethers.JsonRpcProvider(ENV.ETHEREUM_PROVIDER_URL);
        this.signer = new ethers.Wallet(ENV.ETHEREUM_PRIVATE_KEY, this.provider);
    }

    async getBalance(address: string): Promise<Balance> {
        try {
            const balance = await this.provider.getBalance(address);
            return {
                amount: balance.toString(),
                formatted: ethers.formatEther(balance),
            };
        } catch (error) {
            logger.error("Error getting ETH balance:", error as Error);
            throw new Error("Failed to get ETH balance");
        }
    }

    async sendTransaction(to: string, amount: string): Promise<string> {
        try {
            const tx = await this.signer.sendTransaction({
                to,
                value: ethers.parseEther(amount),
            });
            return tx.hash;
        } catch (error) {
            logger.error("Error sending ETH transaction:", error as Error);
            throw new Error("Failed to send ETH transaction");
        }
    }

    validateAddress(address: string): boolean {
        return ethers.isAddress(address);
    }
}