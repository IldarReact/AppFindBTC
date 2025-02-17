import { create } from "zustand"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { db } from "@/shared/api/firebase/config"
import { logger } from "@/shared/lib/logger"
import type { Cell, Tool } from "@/shared/types/game.types"
import { mineResources } from "@/features/mining/lib/miningUtils"
import { loadOrCreateUserCells } from "@/widgets/HexGrid/cellsService"

interface GameState {
  cells: Cell[]
  selectedCellId: string | null
  selectedTool: Tool | null
  isLoading: boolean
  error: string | null
  initializeCells: (userId: string) => Promise<void>
  loadUserCells: (userId: string) => Promise<void>
  mineCell: (cellId: string, userId: string) => Promise<void>
  setCells: (cells: Cell[]) => void
  setSelectedCell: (cellId: string | null) => void
  selectTool: (tool: Tool | null) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  cells: [],
  selectedCellId: null,
  selectedTool: null,
  isLoading: false,
  error: null,

  setCells: (cells) => set({ cells }),
  setSelectedCell: (cellId) => set({ selectedCellId: cellId }),
  selectTool: (tool) => set({ selectedTool: tool }),

  initializeCells: async (userId) => {
    try {
      set({ isLoading: true, error: null })
      
      const cells = await loadOrCreateUserCells(userId)
      set({ cells })
      
      logger.info("Cells initialized successfully", { userId, cellCount: cells.length })
    } catch (error) {
      logger.error("Error initializing cells:", error instanceof Error ? error.message : String(error))
      set({ error: "Error initializing cells" })
    } finally {
      set({ isLoading: false })
    }
  },

  loadUserCells: async (userId) => {
    try {
      set({ isLoading: true, error: null })
      
      const cells = await loadOrCreateUserCells(userId)
      set({ cells })
      
      logger.info("Cells loaded successfully", { userId, cellCount: cells.length })
    } catch (error) {
      logger.error("Error loading cells:", error instanceof Error ? error.message : String(error))
      set({ error: "Error initializing cells" })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  mineCell: async (cellId, userId) => {
    try {
      set({ isLoading: true, error: null })

      const { cells, selectedTool } = get()
      const cell = cells.find((c) => c.id === cellId)

      if (!cell || cell.mined) {
        throw new Error("Invalid cell or already mined")
      }

      if (!selectedTool) {
        throw new Error("No tool selected")
      }

      const reward = mineResources(cell, selectedTool.power)

      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        "balance.ETH": arrayUnion(reward.ETH),
        "balance.TON": arrayUnion(reward.TON),
        miningCount: arrayUnion(1),
        [`cells.${cells.indexOf(cell)}.mined`]: true,
      })

      set({
        cells: cells.map((c) => (c.id === cellId ? { ...c, mined: true } : c)),
      })

      logger.info("Cell mined successfully", { cellId, userId, reward })
    } catch (error) {
      logger.error("Error mining cell:", error instanceof Error ? error.message : String(error))
      set({ error: "Error initializing cells" })
    } finally {
      set({ isLoading: false })
    }
  },
}))