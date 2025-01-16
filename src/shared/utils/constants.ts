export const AVAILABLE_TOOLS = [
    {
        id: 'basic-pickaxe',
        name: 'Basic Pickaxe',
        price: 0.1,
        type: 'pickaxe' as const,
        range: 1,
        uses: 1 as const,
        tokenType: '$' as const,
        power: 1
    },
    {
        id: 'basic-bomb',
        name: 'Basic Bomb',
        price: 0.2,
        type: 'bomb' as const,
        range: 2,
        uses: 1 as const,
        tokenType: '$' as const,
        power: 0.5
    }
];