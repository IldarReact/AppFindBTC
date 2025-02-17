import { randomInt } from "@/shared/lib/math"
import type { Cell } from "@/shared/types/game.types"

const GRID_SIZE = 5
const MIN_RESOURCE = 0
const MAX_RESOURCE = 100
const RESOURCE_DECIMALS = 1000

export const createCell = (x: number, y: number): Cell => ({
    id: `${x}-${y}`,
    position: { x, y },
    resources: {
        ETH: randomInt(MIN_RESOURCE, MAX_RESOURCE) / RESOURCE_DECIMALS,
        TON: randomInt(MIN_RESOURCE, MAX_RESOURCE) / RESOURCE_DECIMALS,
    },
    mined: false,
})

export const generateInitialCells = (): Cell[] => {
    const cells: Cell[] = []

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            cells.push(createCell(x, y))
        }
    }

    return cells
}

export const mineResources = (cell: Cell, power = 1): { ETH: number; TON: number } => {
    return {
        ETH: cell.resources.ETH * power,
        TON: cell.resources.TON * power,
    }
}

export const calculateMiningReward = mineResources