export interface Balance {
    ETH: number;
    TON: number;
    $: number;
}

export interface User {
    telegramId: number;
    username: string;
    balance: Balance;
    tools: string[];
    miningCount: number;
}