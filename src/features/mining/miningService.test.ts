import { mineResources } from "./miningService"
import type { Cell, Tool } from "@/shared/types/game.types"
import * as db from "@/shared/api/firebase/db"
import { logger } from "@/shared/lib/logger"
import { randomInt } from "@/shared/lib/math"
import { ENV } from "@/shared/config/env"
import { jest, describe, it, beforeEach, expect } from "@jest/globals"

jest.mock("@/shared/api/firebase/db")
jest.mock("@/shared/lib/logger")
jest.mock("@/shared/lib/math")

describe("miningService", () => {
    const mockUpdateUserBalance = db.updateUserBalance as jest.MockedFunction<typeof db.updateUserBalance>
    const mockLogger = logger as jest.Mocked<typeof logger>
    const mockRandomInt = randomInt as jest.MockedFunction<typeof randomInt>

    beforeEach(() => {
        jest.clearAllMocks()

        mockRandomInt.mockImplementation((min, _max) => min)

        const requiredEnvVars = ["FIREBASE.apiKey", "FIREBASE.authDomain", "FIREBASE.projectId", "JWT_SECRET"] as const

        for (const key of requiredEnvVars) {
            const value = getNestedValue(ENV, key)
            if (!value) {
                throw new Error(`Missing required environment variable for tests: ${key}`)
            }
        }
    })

    it("should mine resources correctly", async () => {
        const userId = "user1"
        const cellId = "cell1"
        const cells: Record<string, Cell> = {
            cell1: {
                id: "cell1",
                position: { x: 0, y: 0 },
                resources: { ETH: 1, TON: 0.5 },
                mined: false,
            },
        }
        const tool: Tool = {
            id: "tool1",
            name: "Basic Pickaxe",
            power: 0.5,
            price: 100,
            tokenType: "ETH",
            uses: 10,
            number: 0,
        }

        mockUpdateUserBalance.mockResolvedValue()

        const result = await mineResources(userId, cellId, cells, tool)

        expect(result).toEqual({
            minedResources: { ETH: 0.5, TON: 0.25 },
            affectedCells: ["cell1"],
        })
        expect(mockUpdateUserBalance).toHaveBeenCalledTimes(2)
        expect(mockUpdateUserBalance).toHaveBeenCalledWith(userId, "ETH", 0.5)
        expect(mockUpdateUserBalance).toHaveBeenCalledWith(userId, "TON", 0.25)
    })

    it("should handle errors during mining", async () => {
        const userId = "user1"
        const cellId = "cell1"
        const cells: Record<string, Cell> = {
            cell1: {
                id: "cell1",
                position: { x: 0, y: 0 },
                resources: { ETH: 1, TON: 0.5 },
                mined: false,
            },
        }
        const tool: Tool = {
            id: "tool1",
            name: "Basic Pickaxe",
            power: 0.5,
            price: 100,
            tokenType: "ETH",
            uses: 10,
            number: 0,
        }

        const error = new Error("Database error")
        mockUpdateUserBalance.mockRejectedValue(error)

        await expect(mineResources(userId, cellId, cells, tool)).rejects.toThrow("Failed to update user balance")
        expect(mockLogger.error).toHaveBeenCalledWith("Error updating user balance:", error)
    })

    function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
        return path.split('.').reduce<unknown>((current, key) => {
            if (current && typeof current === 'object') {
                return (current as Record<string, unknown>)[key];
            }
            return undefined;
        }, obj);
    }
})