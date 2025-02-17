import type { Cell, Tool } from "../../shared/types/game.types"
import { updateUserBalance } from "../../shared/api/firebase/db"
import { logger } from "../../shared/lib/logger"

export const mineResources = async (
    userId: string,
    cellId: string,
    cells: Record<string, Cell>,
    tool: Tool,
): Promise<{ minedResources: Record<keyof Cell["resources"], number>; affectedCells: string[] }> => {
    const cell = cells[cellId]
    if (!cell || cell.mined) {
        throw new Error("Invalid cell or already mined")
    }

    const affectedCells = [cellId]
    const minedResources: Record<keyof Cell["resources"], number> = {
        ETH: 0,
        TON: 0,
    }

    if (!cell.mined) {
        Object.entries(cell.resources).forEach(([resource, amount]) => {
            const typedResource = resource as keyof Cell["resources"]
            const minedAmount = Number(amount) * tool.power
            minedResources[typedResource] += minedAmount
        })
        cell.mined = true
    }

    try {
        await Promise.all(
            Object.entries(minedResources).map(([resource, amount]) =>
                updateUserBalance(userId, resource as keyof Cell["resources"], amount),
            ),
        )
    } catch (error) {
        logger.error("Error updating user balance:", error as Error)
        throw new Error("Failed to update user balance")
    }

    return { minedResources, affectedCells }
}