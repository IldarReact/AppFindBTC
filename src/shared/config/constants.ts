import type { Tool } from "../../shared/types/game.types"

export const INITIAL_BALANCE = {
    ETH: 0,
    TON: 0,
    $: 0,
}

export const AVAILABLE_TOOLS: Tool[] = [
    {
        id: 'basic-pickaxe',
        name: 'Basic-pickaxe',
        power: 1,
        price: 0.2,
        uses: 5,
        tokenType: 'ETH',
        number: 0,
    },
    {
        id: 'advanced-pickaxe',
        name: 'Advanced-pickaxe',
        power: 1,
        price: 0.5,
        uses: 15,
        tokenType: 'ETH',
        number: 0,
    },
    {
        id: 'pro-pickaxe',
        name: 'Pro-pickaxe',
        power: 1,
        price: 1,
        uses: 30,
        tokenType: 'ETH',
        number: 0,
    }
]

export const GRID_SIZE = 10