export type TokenType = "ETH" | "BTC" | "TON" | "$";

export interface Tool {
    id: string;
    name: string;
    price: number;
    type: 'pickaxe' | 'bomb';
    range: number;
    uses: number;
    tokenType: TokenType;
    power: number;
}

export interface Cell {
    id: string;
    position: { x: number; y: number };
    resources: {
        BTC?: number;
        ETH?: number;
        TON?: number;
    };
    mined: boolean;
}

export interface UserStats {
    totalMined: {
        BTC: number;
        ETH: number;
        TON: number;
    };
    toolsUsed: number;
}