export interface Tool {
    id: string;
    name: string;
    price: number;
    type: 'pickaxe' | 'bomb';
    range: number;
    uses: number;
    tokenType: 'BTC' | 'USDT' | 'TON';
    power: number;
}

export interface Cell {
    id: string;
    position: { x: number; y: number };
    resources: {
        BTC?: number;
        USDT?: number;
        TON?: number;
    };
    mined: boolean;
}

export interface UserStats {
    totalMined: {
        BTC: number;
        USDT: number;
        TON: number;
    };
    toolsUsed: number;
}