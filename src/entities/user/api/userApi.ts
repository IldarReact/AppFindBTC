import { doc, setDoc, updateDoc, increment, getDoc } from "firebase/firestore"
import type { User, UserBalance } from "../../../shared/types/game.types"
import { logger } from "@/shared/lib/logger"
import { db } from "@/shared/api/firebase/config"

export const createUser = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, "users", user.id)
    await setDoc(userRef, user)
    logger.info("User created successfully", { userId: user.id })
  } catch (error) {
    logger.error("Failed to create user", error as Error)
    throw new Error("Failed to create user")
  }
}

export const updateUserBalance = async (
  userId: string,
  tokenType: keyof UserBalance,
  amount: number,
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      [`balance.${tokenType}`]: increment(amount),
      miningCount: increment(1),
    })
    logger.info("User balance updated", { userId, tokenType, amount })
  } catch (error) {
    logger.error("Failed to update user balance", error as Error)
    throw new Error("Failed to update user balance")
  }
}

export const getUser = async (userId: string): Promise<User> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId))
    if (!userDoc.exists()) {
      throw new Error("User not found")
    }
    return userDoc.data() as User
  } catch (error) {
    logger.error("Failed to fetch user", error as Error)
    throw new Error("Failed to fetch user")
  }
}