import { TonClient, Address, fromNano } from "@ton/ton"
import { AbstractBlockchainService, type Balance } from "@/shared/lib/blockchain/AbstractBlockchainService"
import { ENV } from "@/shared/config/env"
import TonWalletService from "@/features/wallet/services/TonWalletService"
import { logger } from "@/shared/lib/logger"

export class TonService extends AbstractBlockchainService {
  private client: TonClient;
  private walletService: TonWalletService;

  constructor() {
    super();
    this.client = new TonClient({
      endpoint: ENV.TON_ENDPOINT,
      apiKey: ENV.TON_API_KEY,
    });
    this.walletService = TonWalletService.getInstance();
  }

  async getBalance(address: string): Promise<Balance> {
    try {
      const balance = await this.client.getBalance(Address.parse(address));
      return {
        amount: balance.toString(),
        formatted: fromNano(balance),
      };
    } catch (error) {
      logger.error("Error getting TON balance:", error as Error);
      throw new Error("Failed to get TON balance");
    }
  }

  async sendTransaction(to: string, amount: string): Promise<string> {
    try {
      return await this.walletService.sendTransaction(to, amount);
    } catch (error) {
      logger.error("Error sending TON transaction:", error as Error);
      throw new Error("Failed to send TON transaction");
    }
  }

  validateAddress(address: string): boolean {
    try {
      Address.parse(address);
      return true;
    } catch {
      return false;
    }
  }
}