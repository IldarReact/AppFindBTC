import { Timestamp } from 'firebase/firestore';

export interface UserBalance {
    $: number
    ETH: number
    TON: number
}

export interface UpdateUserToolsParams {
    userId: string;
    tools: Tool[];
}

export interface User {
    id: string
    balance: UserBalance
    cells: Cell[]
    createdAt: Timestamp
    miningCount: number
    telegramId: number
    tools: Tool[]
    username: string
}

export interface Cell {
    id: string
    position: { x: number; y: number }
    resources: { ETH: number; TON: number }
    mined: boolean
}

export interface Tool {
    id: string
    name: string
    power: number
    price: number
    tokenType: keyof UserBalance
    uses: number
    number: number
}