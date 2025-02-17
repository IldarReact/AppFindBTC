import { create } from "zustand"
import { AVAILABLE_TOOLS } from "@/shared/config/constants"
import type { Tool } from "@/shared/types/game.types"
import { useUserStore } from "@/store/userStore"
import { doc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/shared/api/firebase/config"
import { logger } from "@/shared/lib/logger"

interface ToolState {
    tools: Tool[]
    selectedTool: Tool | null
    selectTool: (toolId: string) => void
    buyTool: (toolId: string) => Promise<void>
    incrementToolNumber: (toolId: string) => Promise<void>
}

export const useToolStore = create<ToolState>((set, get) => ({
    tools: AVAILABLE_TOOLS,
    selectedTool: null,

    selectTool: (toolId: string) => {
        const tool = AVAILABLE_TOOLS.find((t) => t.id === toolId)
        set({ selectedTool: tool || null })
    },

    buyTool: async (toolId: string) => {
        const { user, updateBalance } = useUserStore.getState()
        if (!user) throw new Error("User is not authorized")

        const tool = AVAILABLE_TOOLS.find((t) => t.id === toolId)
        if (!tool) throw new Error("Tool not found")

        if (user.balance.ETH < tool.price) {
            throw new Error("Not enough ETH balance")
        }

        try {
            await updateBalance("ETH", -tool.price)
            await get().incrementToolNumber(toolId)
            useUserStore.setState((state) => ({
                user: state.user
                    ? {
                        ...state.user,
                        tools: [...(state.user.tools || []), tool],
                    }
                    : null,
            }))
        } catch (error) {
            logger.error("Mistake when buying a tool:", error instanceof Error ? error.message : String(error))
            throw new Error("Mistake when buying a tool")
        }
    },

    incrementToolNumber: async (toolId: string) => {
        try {
            const toolRef = doc(db, "tools", toolId)
            await updateDoc(toolRef, {
                number: increment(1),
            })
            set((state) => ({
                tools: state.tools.map((tool) => (tool.id === toolId ? { ...tool, number: (tool.number || 0) + 1 } : tool)),
            }))
        } catch (error) {
            logger.error(
                "Error updating tool quantity:",
                error instanceof Error ? error.message : String(error),
            )
            throw new Error("Error updating tool quantity")
        }
    },
}))