import { Cell } from "@/types/game";

export const generateInitialGrid = () => {
    const cells: Record<string, Cell> = {};
    const size = 5;
    const tokens = ['BTC', 'USDT', 'TON'];

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const id = `${x}-${y}`;
            const resources = {
                [tokens[Math.floor(Math.random() * tokens.length)]]:
                    Number((Math.random() * 0.1).toFixed(8))
            };

            cells[id] = {
                id,
                position: { x, y },
                resources,
                mined: false
            };
        }
    }

    return cells;
};

export const calculateRange = (
    cellId: string,
    cells: Record<string, Cell>,
    range: number
) => {
    const [x, y] = cellId.split('-').map(Number);
    const inRange: Record<string, boolean> = {};

    for (let dx = -range; dx <= range; dx++) {
        for (let dy = -range; dy <= range; dy++) {
            if (Math.abs(dx) + Math.abs(dy) <= range) {
                const newX = x + dx;
                const newY = y + dy;
                const targetId = `${newX}-${newY}`;
                if (cells[targetId]) {
                    inRange[targetId] = true;
                }
            }
        }
    }

    return inRange;
};