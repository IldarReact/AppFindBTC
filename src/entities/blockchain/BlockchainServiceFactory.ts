import { EthereumService } from "./ethereum/ethereum.service"
import { TonService } from "./ton/ton.service"
import type { AbstractBlockchainService } from "@/shared/lib/blockchain/AbstractBlockchainService"

export class BlockchainServiceFactory {
    static createEthereumService(): AbstractBlockchainService {
        return new EthereumService()
    }

    static createTonService(): AbstractBlockchainService {
        return new TonService()
    }
}