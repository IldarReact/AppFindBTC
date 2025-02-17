export const isValidAmount = (amount: string): boolean => {
    const num = Number.parseFloat(amount)
    return !isNaN(num) && num > 0 && /^\d+(\.\d+)?$/.test(amount)
}

export const isValidUsername = (username: string): boolean => {
    return /^[a-zA-Z0-9_]{3,16}$/.test(username)
}  