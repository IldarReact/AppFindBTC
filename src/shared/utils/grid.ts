import type { Cell } from "../../shared/types/game.types"

const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const generateInitialGrid = (size = 10): Record<string, Cell> => {
    const cells: Record<string, Cell> = {}

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            cells[`${x}-${y}`] = {
                id: `${x}-${y}`,
                position: { x, y },
                resources: {
                    ETH: randomInt(0, 100) / 1000,
                    TON: randomInt(0, 100) / 1000,
                },
                mined: false,
            }
        }
    }

    return cells
}

export const calculateRange = (cellId: string, cells: Record<string, Cell>, range: number): string[] => {
    const [x, y] = cellId.split("-").map(Number)
    const inRange: string[] = []

    for (let dx = -range; dx <= range; dx++) {
        for (let dy = -range; dy <= range; dy++) {
            if (Math.abs(dx) + Math.abs(dy) <= range) {
                const newX = x + dx
                const newY = y + dy
                const targetId = `${newX}-${newY}`
                if (cells[targetId]) {
                    inRange.push(targetId)
                }
            }
        }
    }

    return inRange
}