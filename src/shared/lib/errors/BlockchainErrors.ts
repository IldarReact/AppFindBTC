export class BlockchainError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, BlockchainError.prototype);
        this.name = "BlockchainError";
    }
}


export class EthereumError extends BlockchainError {
    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, EthereumError.prototype);
        this.name = "EthereumError"
    }
}

export class TonError extends BlockchainError {
    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, TonError.prototype);
        this.name = "TonError"
    }
}  