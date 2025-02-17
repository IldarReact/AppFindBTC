import { collection, doc, getDoc, setDoc, getDocs, updateDoc, writeBatch } from "firebase/firestore"
import { db } from "./config"
import type { Cell, Tool, User, UserBalance } from "../../../shared/types/game.types"
import { logger } from "@/shared/lib/logger"

export const updateUserBalance = async (userId: string, currency: keyof UserBalance, amount: number): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      throw new Error("User not found")
    }

    const userData = userDoc.data() as User
    const newBalance = {
      ...userData.balance,
      [currency]: (userData.balance[currency] || 0) + amount,
    }

    await updateDoc(userRef, { balance: newBalance })
  } catch (error) {
    logger.error("Error updating user balance:", error as Error)
    throw error
  }
}

export const getUserCells = async (userId: string): Promise<Record<string, Cell>> => {
  try {
    const cellsRef = collection(db, `users/${userId}/cells`)
    const snapshot = await getDocs(cellsRef)

    const cells: Record<string, Cell> = {}
    snapshot.forEach((doc) => {
      cells[doc.id] = doc.data() as Cell
    })

    return cells
  } catch (error) {
    logger.error("Error fetching user cells:", error as Error)
    throw error
  }
}

export const getUserTools = async (userId: string): Promise<Tool[]> => {
  try {
    const toolsRef = collection(db, `users/${userId}/tools`)
    const snapshot = await getDocs(toolsRef)

    const tools: Tool[] = []
    snapshot.forEach((doc) => {
      tools.push({ ...(doc.data() as Tool), id: doc.id })
    })

    return tools
  } catch (error) {
    logger.error("Error fetching user tools:", error as Error)
    throw error
  }
}

export const updateUserCell = async (userId: string, cellId: string, cellData: Cell): Promise<void> => {
  try {
    const cellRef = doc(db, `users/${userId}/cells`, cellId)
    await setDoc(cellRef, cellData)
  } catch (error) {
    logger.error("Error updating user cell:", error as Error)
    throw error
  }
}

export const addUserTool = async (userId: string, tool: Tool): Promise<void> => {
  try {
    const toolRef = doc(db, `users/${userId}/tools`, tool.id)
    await setDoc(toolRef, tool)
  } catch (error) {
    logger.error("Error adding user tool:", error as Error)
    throw error
  }
}

export const initializeUserCells = async (userId: string, cells: Record<string, Cell>): Promise<void> => {
  try {
    const batch = writeBatch(db)

    Object.entries(cells).forEach(([cellId, cellData]) => {
      const cellRef = doc(db, `users/${userId}/cells`, cellId)
      batch.set(cellRef, cellData)
    })

    await batch.commit()
    logger.info("User cells initialized successfully")
  } catch (error) {
    logger.error("Error initializing user cells:", error as Error)
    throw error
  }
}

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return null
    }

    const userData = userDoc.data() as User
    return { ...userData, id: userDoc.id }
  } catch (error) {
    logger.error("Error getting user:", error as Error)
    throw error
  }
}