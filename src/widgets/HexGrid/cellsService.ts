import { doc, getDoc, updateDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import { db } from "@/shared/api/firebase/config"
import type { Cell, User, UserBalance } from "@/shared/types/game.types"
import { logger } from "@/shared/lib/logger"

const MIN_ETH_AMOUNT = 0.01
const MAX_ETH_AMOUNT = 1.5
const MIN_TON_AMOUNT = 1
const MAX_TON_AMOUNT = 10

export const ROW_STRUCTURE = [5, 6, 7, 8, 9, 8, 7, 6, 5]

const generateRandomEth = (): number => {
    const randomEth = Math.random() * (MAX_ETH_AMOUNT - MIN_ETH_AMOUNT) + MIN_ETH_AMOUNT
    return Number(randomEth.toFixed(4))
}

const generateRandomTon = (): number => {
    return Math.floor(Math.random() * (MAX_TON_AMOUNT - MIN_TON_AMOUNT + 1)) + MIN_TON_AMOUNT
}

export const generateInitialCells = (totalCells: number): Cell[] => {
    const cells: Cell[] = []
    let currentCellCount = 0

    for (let rowIndex = 0; rowIndex < ROW_STRUCTURE.length; rowIndex++) {
        const cellsInRow = ROW_STRUCTURE[rowIndex]

        for (let colIndex = 0; colIndex < cellsInRow; colIndex++) {
            if (currentCellCount >= totalCells) break;
            const isEth = Math.random() < 0.5
            const resources = {
                ETH: isEth ? generateRandomEth() : 0,
                TON: isEth ? 0 : generateRandomTon(),
            }

            const cell: Cell = {
                id: uuidv4(),
                position: { x: colIndex, y: rowIndex },
                resources,
                mined: false,
            }

            cells.push(cell)
            currentCellCount++
        }
        if (currentCellCount >= totalCells) break
    }

    console.log("Total cells generated:", currentCellCount)
    return cells
}


export const loadOrCreateUserCells = async (userId: string): Promise<Cell[]> => {
    try {
        const userRef = doc(db, "users", userId)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
            const userData = userDoc.data() as User
            console.log("User data:", userData);

            if (userData.cells && userData.cells.length === 61) {
                console.log("User already has 61 cells.");
                return userData.cells
            }
        }

        const newCells = generateInitialCells(61) 
        console.log("Generated new cells, now saving:", newCells.length) 
        await updateDoc(userRef, { cells: newCells })
        console.log("Cells saved successfully.")
        return newCells
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        logger.error("Error in loadOrCreateUserCells:", errorMessage)
        throw new Error("Failed to load or create user cells")
    }
}


export const mineResources = (cell: Cell, toolPower: number): { ETH: number; TON: number } => {
    const powerMultiplier = 1 + toolPower / 100
    return {
        ETH: Number((cell.resources.ETH * powerMultiplier).toFixed(4)),
        TON: Math.floor(cell.resources.TON * powerMultiplier),
    }
}

export const updateUserCells = async (userId: string, cells: Cell[]): Promise<void> => {
    try {
        const userRef = doc(db, "users", userId)
        console.log("Updating user cells, total:", cells.length)
        await updateDoc(userRef, { cells })
        console.log("User cells updated successfully.")
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        logger.error("Error in updateUserCells:", errorMessage)
        throw new Error("Failed to update user cells")
    }
}

export const updateUserBalance = async (userId: string, balance: UserBalance): Promise<void> => {
    try {
        const userRef = doc(db, "users", userId)
        await updateDoc(userRef, { balance })
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        logger.error("Error in updateUserBalance:", errorMessage)
        throw new Error("Failed to update user balance")
    }
}