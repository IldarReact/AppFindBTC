import { User } from "../../../shared/types/game.types"

export const calculateTotalBalance = (user: User): number => {
    const exchangeRates = {
        ETH: 2000,
        TON: 2,
    }

    return user.balance.ETH * exchangeRates.ETH + user.balance.TON * exchangeRates.TON + user.balance.$
}