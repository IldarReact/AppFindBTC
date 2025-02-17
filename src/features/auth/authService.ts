import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/shared/api/firebase/config";
import { logger } from "@/shared/lib/logger";
import type { User } from "@/shared/types/game.types";
import { generateInitialCells } from "@/features/mining/lib/miningUtils";

interface TelegramUser {
    id: number;
    username?: string;
    first_name?: string;
}

const createInitialUser = (telegramId: number, username: string): User => ({
    id: telegramId.toString(),
    telegramId,
    username,
    balance: { ETH: 0, TON: 0, $: 10 },
    cells: generateInitialCells(),
    miningCount: 0,
    tools: [],
    createdAt: Timestamp.now(),
});

export const authService = {
    async signInWithTelegram(telegramUser: TelegramUser): Promise<User> {
        try {
            logger.info("Starting signInWithTelegram", { telegramUser });

            if (!db) {
                throw new Error("Firebase is not initialized");
            }

            if (!telegramUser || typeof telegramUser.id !== "number") {
                throw new Error("Invalid Telegram user data");
            }

            const userRef = doc(db, "users", telegramUser.id.toString());

            try {
                const userDoc = await getDoc(userRef);

                let userData: User;

                if (userDoc.exists()) {
                    logger.info("Existing user found", { userId: telegramUser.id });
                    userData = userDoc.data() as User;
                } else {
                    logger.info("Creating new user", { userId: telegramUser.id });
                    userData = createInitialUser(
                        telegramUser.id,
                        telegramUser.username || telegramUser.first_name || `user${telegramUser.id}`
                    );

                    try {
                        await setDoc(userRef, userData);
                        logger.info("New user created successfully");
                    } catch (writeError: unknown) {
                        const typedError = writeError instanceof Error ? writeError : new Error("Unknown error");
                        logger.error("Error creating new user:", typedError.message);
                        throw typedError;
                    }
                }

                return userData;
            } catch (firestoreError: unknown) {
                const typedError = firestoreError instanceof Error ? firestoreError : new Error("Unknown Firestore operation error");
                logger.error("Firestore operation error:", typedError.message);
                throw typedError;
            }

        // Type assertion to ensure error is an Error
        } catch (error: unknown) {
            const typedError = error instanceof Error ? error : new Error("Unknown error");
            logger.error("Error in signInWithTelegram:", typedError.message);
            throw new Error(`Ошибка при входе через Telegram: ${typedError.message}`);
        }
    },

    async getCurrentUser(telegramId: number): Promise<User | null> {
        try {
            if (!db) {
                throw new Error("Firebase не инициализирован");
            }

            const userDoc = await getDoc(doc(db, "users", telegramId.toString()));
            return userDoc.exists() ? (userDoc.data() as User) : null;
        } catch (error: unknown) {
            const typedError = error instanceof Error ? error : new Error("Unknown error");
            logger.error("Error getting current user:", typedError.message);
            return null;
        }
    },

    getToken: async (): Promise<string> => {
        return "dummy_token";
    },
};