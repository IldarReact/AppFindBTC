import { create } from "zustand"
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"
import { db } from "@/shared/api/firebase/config"
import { logger } from "@/shared/lib/logger"
import type { Cell, Tool } from "@/shared/types/game.types"
import { generateInitialCells, calculateMiningReward } from "@/features/mining/lib/miningUtils"

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
            const initialCells = generateInitialCells()

            const userRef = doc(db, "users", userId)
            await updateDoc(userRef, {
                cells: initialCells,
            })

            set({ cells: initialCells })
            logger.info("Cells initialized successfully", { userId })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            logger.error("Error initializing cells:", errorMessage)
            set({ error: "Error initializing cells" })
        } finally {
            set({ isLoading: false })
        }
    },

    loadUserCells: async (userId) => {
        try {
            set({ isLoading: true, error: null })
            const userRef = doc(db, "users", userId)
            const userDoc = await getDoc(userRef)

            if (userDoc.exists()) {
                const userData = userDoc.data()
                if (userData?.cells) {
                    set({ cells: userData.cells as Cell[] })
                    logger.info("Cells loaded successfully", { userId })
                } else {
                    throw new Error("No cells found")
                }
            } else {
                throw new Error("User not found")
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            logger.error("Error loading cells:", errorMessage)
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

            const reward = calculateMiningReward(cell, selectedTool.power)

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
            const errorMessage = error instanceof Error ? error.message : "Unknown error"
            logger.error("Error mining cell:", errorMessage)
            set({ error: "Error initializing cells" })
        } finally {
            set({ isLoading: false })
        }
    },
}))