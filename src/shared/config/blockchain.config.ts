export const TESTNET_CONFIG = {
    ETH: {
        rpc: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
        chainId: 11155111,
    },
    TON: {
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
        // apiKey: 'YOUR_TONCENTER_API_KEY'
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY
    }
} as const;