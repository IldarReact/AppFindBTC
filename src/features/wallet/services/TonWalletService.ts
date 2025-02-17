import { TonConnectUI } from "@tonconnect/ui"
import { logger } from "@/shared/lib/logger"

class TonWalletService {
    private static instance: TonWalletService
    private tonConnectUI: TonConnectUI

    private constructor() {
        this.tonConnectUI = new TonConnectUI({
            manifestUrl: "https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json",
        })
    }

    public static getInstance(): TonWalletService {
        if (!TonWalletService.instance) {
            TonWalletService.instance = new TonWalletService()
        }
        return TonWalletService.instance
    }

    public async connect(): Promise<void> {
        try {
            await this.tonConnectUI.connectWallet()
            logger.info("TON wallet connected successfully")
        } catch (error) {
            logger.error("Failed to connect TON wallet:", error as Error)
            throw new Error("Failed to connect TON wallet")
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await this.tonConnectUI.disconnect()
            logger.info("TON wallet disconnected successfully")
        } catch (error) {
            logger.error("Failed to disconnect TON wallet:", error as Error)
            throw new Error("Failed to disconnect TON wallet")
        }
    }

    public getWalletInfo() {
        return this.tonConnectUI.account
    }

    public async sendTransaction(to: string, amount: string): Promise<string> {
        try {
            const result = await this.tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 60,
                messages: [
                    {
                        address: to,
                        amount: amount,
                    },
                ],
            })
            logger.info("TON transaction sent successfully", result)
            return result.boc
        } catch (error) {
            logger.error("Failed to send TON transaction:", error as Error)
            throw new Error("Failed to send TON transaction")
        }
    }
}

export default TonWalletService