import { renderHook, act } from "@testing-library/react-hooks"
import { useMiningStore } from "./miningModel"
import { Tool } from "@/shared/types/game.types"

describe("useMiningStore", () => {
    it("should initialize with empty cells", () => {
        const { result } = renderHook(() => useMiningStore())
        expect(result.current.cells).toEqual([])
    })

    it("should initialize cells", () => {
        const { result } = renderHook(() => useMiningStore())
        act(() => {
            result.current.initializeCells()
        })
        expect(result.current.cells.length).toBe(25)
    })

    it("should set selected cell", () => {
        const { result } = renderHook(() => useMiningStore())
        const testCell = { id: "0-0", position: { x: 0, y: 0 }, resources: { ETH: 0.5, TON: 0.5 }, mined: false }
        act(() => {
            result.current.setSelectedCell(testCell)
        })
        expect(result.current.selectedCell).toEqual(testCell)
    })

    it("should set selected tool", () => {
        const { result } = renderHook(() => useMiningStore())
        const testTool: Tool = {
            id: "tool1",
            name: "Test Tool",
            power: 1,
            price: 10,
            tokenType: "ETH",
            uses: 1,
            number: 0,
        }
        act(() => {
            result.current.setSelectedTool(testTool)
        })
        expect(result.current.selectedTool).toEqual(testTool)
    })

    it("should mine a cell", () => {
        const { result } = renderHook(() => useMiningStore())
        act(() => {
            result.current.initializeCells()
        })
        const testTool: Tool = {
            id: "tool1",
            name: "Test Tool",
            power: 1,
            price: 10,
            tokenType: "ETH",
            uses: 1,
            number: 0,
        }
        const cellToMine = result.current.cells[0]
        act(() => {
            result.current.mineCell(cellToMine.id, testTool)
        })
        expect(result.current.cells[0].mined).toBe(true)
    })

    it("should reset mining", () => {
        const { result } = renderHook(() => useMiningStore())
        act(() => {
            result.current.initializeCells()
            result.current.setSelectedCell(result.current.cells[0])
            result.current.setSelectedTool({
                id: "tool1",
                name: "Test Tool",
                power: 1,
                price: 10,
                tokenType: "ETH",
                uses: 1,
                number: 0,
            })
        })
        act(() => {
        })
            result.current.resetMining()
            expect(result.current.cells.every((cell) => !cell.mined)).toBe(true)
            expect(result.current.selectedTool).toBeNull()
        expect(result.current.selectedCell).toBeNull()
    })
})