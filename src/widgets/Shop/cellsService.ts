import { db } from "@/shared/api/firebase/config";
import { AVAILABLE_TOOLS } from "@/shared/config/constants";
import { logger } from "@/shared/lib/logger";
import { User } from "@/shared/types/game.types";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const initializeUserWithBasicTool = async (userId: string) => {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data() as User;

            if (!userData.tools || userData.tools.length === 0) {
                const basicPickaxe = AVAILABLE_TOOLS.find(tool => tool.id === 'basic-pickaxe');
                if (basicPickaxe) {
                    await updateDoc(userRef, {
                        tools: [basicPickaxe]
                    });
                    return [basicPickaxe];
                }
            }
            return userData.tools;
        }
    } catch (error) {
        logger.error("Error initializing user tools:", error as Error);
        throw new Error("Failed to initialize user tools");
    }
};