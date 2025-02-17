import { logger } from "@/shared/lib/logger"

export class BalanceSocket {
  private socket: WebSocket | null = null
  private userId: string
  private onBalanceUpdate: (balanceData: Record<string, number>) => void
  private getAuthToken: () => string

  constructor(
    userId: string,
    onBalanceUpdate: (balanceData: Record<string, number>) => void,
    getAuthToken: () => string,
  ) {
    this.userId = userId
    this.onBalanceUpdate = onBalanceUpdate
    this.getAuthToken = getAuthToken
  }

  connect() {
    this.socket = new WebSocket(`ws://localhost:8080/${this.userId}`)

    this.socket.onopen = () => {
      logger.info("WebSocket connection established")
      const token = this.getAuthToken()
      if (token) {
        this.socket?.send(JSON.stringify({ type: "auth", token }))
      } else {
        logger.error("No auth token available")
        this.disconnect()
      }
    }

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "balance_update") {
          this.onBalanceUpdate(data.balance)
        }
      } catch (error) {
        logger.error("Error processing WebSocket message:", error instanceof Error ? error.message : String(error))
      }
    }

    this.socket.onerror = (error) => {
      logger.error("WebSocket error:", error instanceof Error ? error.message : String(error))
    }

    this.socket.onclose = () => {
      logger.info("WebSocket connection closed")
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}