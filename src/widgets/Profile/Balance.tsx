import { useUserStore } from '@/store/userStore';
import React, { useEffect } from 'react';

const Balance: React.FC = () => {
  const { user } = useUserStore(); // Получаем данные пользователя

  useEffect(() => {
    console.log('Компонент Balance смонтирован. Запрашиваем баланс...');
  }, []);

  console.log('Текущий баланс:', user?.balance);

  return (
    <div className="balance">
      {user?.username && <div>Ник: {user.username.toUpperCase()}</div>}
      <div>ETH: {user?.balance.ETH?.toFixed(4) || 0}</div>
      <div>TON: {user?.balance.TON?.toFixed(4) || 0}</div>
      <div>$: {user?.balance.$?.toFixed(2) || 0}</div>
    </div>
  );
};

export default Balance;