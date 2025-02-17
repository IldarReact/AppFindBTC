import type React from "react"
import { useWalletStore } from "@/store/walletStore"
import { Button } from "@/shared/ui/Button/Button"

export const ConnectWalletButton: React.FC = () => {
  const { isConnected, connect, disconnect } = useWalletStore()

  const handleClick = async () => {
    if (isConnected) {
      await disconnect()
    } else {
      await connect()
    }
  }

  return <Button onClick={handleClick}>{isConnected ? "Disable wallet" : "Connect wallet"}</Button>
}