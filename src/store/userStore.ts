import { create } from "zustand"
import { BalanceSocket } from "@/features/balance/balanceSocket"
import { logger } from "@/shared/lib/logger"
import { AVAILABLE_TOOLS } from "@/shared/config/constants"
import type { Tool, User, UserBalance } from "../shared/types/game.types"
import { authService } from "@/features/auth/authService"
import { updateUserBalance } from "@/shared/api/firebase/db"

interface UserState {
  user: User | null
  balanceSocket: BalanceSocket | null
  setUser: (user: User) => void
  updateBalance: (currency: keyof UserBalance, amount: number) => Promise<void>
  connectBalanceSocket: () => void
  disconnectBalanceSocket: () => void
  buyTool: (toolId: string) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  balanceSocket: null,

  setUser: (user) => set({ user }),

  updateBalance: async (currency, amount) => {
    const { user } = get()
    if (!user) return

    await updateUserBalance(user.id, currency, amount)
    set((state) => ({
      user: state.user
        ? {
          ...state.user,
          balance: {
            ...state.user.balance,
            [currency]: (state.user.balance[currency] || 0) + amount,
          },
        }
        : null,
    }))
  },

  connectBalanceSocket: async () => {
    const { user } = get()
    if (!user) return

    try {
      const token = await authService.getToken()

      const balanceSocket = new BalanceSocket(
        user.id,
        (balanceData) => {
          set((state) => ({
            user: state.user
              ? {
                ...state.user,
                balance: {
                  ...state.user.balance,
                  ...balanceData,
                },
              }
              : null,
          }))
        },
        () => token,
      )

      balanceSocket.connect()
      set({ balanceSocket })
    } catch (error) {
      logger.error("Failed to connect balance socket:", error as Error)
    }
  },

  disconnectBalanceSocket: () => {
    const { balanceSocket } = get()
    if (balanceSocket) {
      balanceSocket.disconnect()
      set({ balanceSocket: null })
    }
  },

  buyTool: async (toolId: string) => {
    const { user, updateBalance } = get()
    if (!user) throw new Error("User not authenticated")

    const tool = AVAILABLE_TOOLS.find((t: Tool) => t.id === toolId)
    if (!tool) throw new Error(`Tool not found: ${toolId}`)

    const tokenType = tool.tokenType as keyof UserBalance

    if (user.balance[tokenType] < tool.price) {
      throw new Error(`Not enough ${tokenType} balance`)
    }

    try {
      await updateBalance(tokenType, -tool.price)
      set((state) => ({
        user: state.user
          ? {
            ...state.user,
            tools: [...state.user.tools, tool],
          }
          : null,
      }))
    } catch (error) {
      logger.error("Failed to purchase the tool:", error instanceof Error ? error.message : String(error))
      throw new Error("The transaction failed")
    }
  },
}))