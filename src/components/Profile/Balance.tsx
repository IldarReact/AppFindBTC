import { useBlockchainStore } from '@/store/blockchainStore';
import React, { useEffect } from 'react';

const Balance: React.FC = () => {
  const { balance, fetchBalance } = useBlockchainStore();

  useEffect(() => {
    fetchBalance('USER_ADDRESS');
  }, [fetchBalance]);

  return (
    <div className="balance">
      <div>BTC: {balance.ETH}</div>
      <div>USDT: {balance.USDT}</div>
      <div>TON: {balance.TON}</div>
    </div>
  );
};

export default Balance;
