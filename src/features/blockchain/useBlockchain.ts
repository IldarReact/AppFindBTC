import { useState, useCallback } from "react"
import { BlockchainServiceFactory } from "@/entities/blockchain/BlockchainServiceFactory"
import { AbstractBlockchainService } from "@/shared/lib/blockchain/AbstractBlockchainService"

export const useBlockchain = () => {
    const [ethService, setEthService] = useState<AbstractBlockchainService | null>(null)
    const [tonService, setTonService] = useState<AbstractBlockchainService | null>(null)

    const initEthService = useCallback(() => {
        const service = BlockchainServiceFactory.createEthereumService()
        setEthService(service)
    }, [])

    const initTonService = useCallback(() => {
        const service = BlockchainServiceFactory.createTonService()
        setTonService(service)
    }, [])

    return {
        ethService,
        tonService,
        initEthService,
        initTonService,
    }
}