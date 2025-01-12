import Web3 from 'web3';

export const getTestnetConfig = (network: 'TON' | 'ETH' | 'BTC') => {
    switch (network) {
        case 'TON':
            return new Web3('https://testnet.toncenter.com/api/v2/jsonRPC');
        case 'ETH':
            return new Web3('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID');
        case 'BTC':
            return new Web3('https://api.blockcypher.com/v1/btc/test3'); // BlockCypher для BTC 
        default:
            throw new Error('Unsupported network');
    }
};