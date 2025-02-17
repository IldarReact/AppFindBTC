import { createCell, mineResources } from "./miningUtils"
import type { Cell, Tool } from "../../../shared/types/game.types"

describe("miningUtils", () => {
    describe("createCell", () => {
        it("should create a cell with the correct properties", () => {
            const cell = createCell(1, 2)
            expect(cell).toHaveProperty("id", "1-2")
            expect(cell).toHaveProperty("position", { x: 1, y: 2 })
            expect(cell).toHaveProperty("resources")
            expect(cell).toHaveProperty("mined", false)
        })
    })

    describe("mineResources", () => {
        it("should mine resources correctly", () => {
            const cell: Cell = {
                id: "1-2",
                position: { x: 1, y: 2 },
                resources: { ETH: 0.5, TON: 0.3 },
                mined: false,
            }

            const tool: Tool = {
                id: "1",
                name: "Basic Pickaxe",
                power: 0.5,
                price: 100,
                tokenType: "ETH",
                uses: 10,
                number: 0,
            }

            const minedResources = mineResources(cell, tool.power)
            expect(minedResources).toEqual({ ETH: 0.25, TON: 0.15 })
        })
    })
})