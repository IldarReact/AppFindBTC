export const ENV = {
    ETHEREUM_PROVIDER_URL: import.meta.env.VITE_ETHEREUM_PROVIDER_URL as string,
    ETHEREUM_PRIVATE_KEY: import.meta.env.VITE_ETHEREUM_PRIVATE_KEY as string,
    TON_ENDPOINT: import.meta.env.VITE_TON_ENDPOINT as string,
    TON_API_KEY: import.meta.env.VITE_TON_API_KEY as string,
    JWT_SECRET: import.meta.env.VITE_JWT_SECRET as string,
    BALANCE_WEBSOCKET_URL: import.meta.env.VITE_BALANCE_WEBSOCKET_URL || "ws://localhost:8080",
    USE_WEBSOCKET: import.meta.env.VITE_USE_WEBSOCKET === "true",
    FIREBASE: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
        appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
    },
} as const

const requiredEnvVars = ["FIREBASE.apiKey", "FIREBASE.authDomain", "FIREBASE.projectId", "JWT_SECRET"] as const

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    let current: unknown = obj;
    const keys = path.split('.');

    for (const key of keys) {
        if (current && typeof current === 'object') {
            current = (current as Record<string, unknown>)[key];
        } else {
            return undefined;
        }
    }

    return current;
}

for (const key of requiredEnvVars) {
    const value = getNestedValue(ENV, key);
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

console.log("Environment Config:", ENV);