import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { ENV } from "@/shared/config/env"
import { logger } from "@/shared/lib/logger"

let app
try {
  logger.info("Initializing Firebase with config", ENV.FIREBASE)
  app = initializeApp(ENV.FIREBASE)
  logger.info("Firebase initialized successfully")
} catch (error) {
  logger.error("Error initializing Firebase", error as Error)
  throw error
}

const db = getFirestore(app)
logger.info("Firestore instance created")

export { db }