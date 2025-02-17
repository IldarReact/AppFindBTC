import { create } from "zustand"
import TonWalletService from "@/features/wallet/services/TonWalletService"
import { logger } from "@/shared/lib/logger"

interface WalletState {
    isConnected: boolean
    address: string | null
    connect: () => Promise<void>
    disconnect: () => Promise<void>
}

export const useWalletStore = create<WalletState>((set) => ({
    isConnected: false,
    address: null,
    connect: async () => {
        try {
            logger.info("Connecting wallet...");
            const walletService = TonWalletService.getInstance()
            await walletService.connect()
            const walletInfo = walletService.getWalletInfo()
            set({ isConnected: true, address: walletInfo?.address || null })
            logger.info("Wallet connected successfully");
        } catch (error) {
            logger.error("Failed to connect wallet:", error as Error)
            console.trace(error);
            throw error;
        }
    },
    disconnect: async () => {
        try {
            logger.info("Disconnecting wallet...");
            const walletService = TonWalletService.getInstance()
            await walletService.disconnect()
            set({ isConnected: false, address: null })
            logger.info("Wallet disconnected successfully");
        } catch (error) {
            logger.error("Failed to disconnect wallet:", error as Error)
            console.trace(error);
            throw error;
        }
    },
}))