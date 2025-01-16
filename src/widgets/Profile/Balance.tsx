import { useBlockchainStore } from '@/store/blockchainStore';
import React, { useEffect } from 'react';

const Balance: React.FC = () => {
  const { balance, fetchBalance } = useBlockchainStore();

  useEffect(() => {
    console.log('Компонент Balance смонтирован. Запрашиваем баланс...');
    fetchBalance();
  }, [fetchBalance]);

  console.log('Текущий баланс:', balance);

  return (
    <div className="balance">
      <div>ETH: {balance.ETH.toFixed(4)}</div>
      <div>TON: {balance.TON.toFixed(4)}</div>
      <div>$: {balance.$.toFixed(2)}</div>
    </div>
  );
};

export default Balance;
