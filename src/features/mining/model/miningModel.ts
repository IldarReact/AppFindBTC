import { create } from "zustand"
import type { Cell, Tool } from "@/shared/types/game.types"
import { mineResources, generateInitialCells } from "../lib/miningUtils"

interface MiningState {
    cells: Cell[]
    selectedCell: Cell | null
    selectedTool: Tool | null
    mineCell: (cellId: string, tool: Tool) => { ETH: number; TON: number } | null
    setSelectedCell: (cell: Cell | null) => void
    setSelectedTool: (tool: Tool | null) => void
    initializeCells: () => void
    resetMining: () => void
}

export const useMiningStore = create<MiningState>((set, get) => ({
    cells: [],
    selectedCell: null,
    selectedTool: null,
    mineCell: (cellId, tool) => {
        const { cells } = get()
        const cellToMine = cells.find((cell) => cell.id === cellId)
        if (cellToMine && !cellToMine.mined) {
            const reward = mineResources(cellToMine, tool.power)
            set((state) => ({
                cells: state.cells.map((cell) => (cell.id === cellId ? { ...cell, mined: true } : cell)),
            }))
            return reward
        }
        return null
    },
    setSelectedCell: (cell) => set({ selectedCell: cell }),
    setSelectedTool: (tool) => set({ selectedTool: tool }),
    initializeCells: () => set({ cells: generateInitialCells() }),
    resetMining: () => set({ cells: generateInitialCells(), selectedCell: null, selectedTool: null }),
}))