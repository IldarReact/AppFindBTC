import { useEffect } from 'react';
import { useUserStore, initializeUser } from './store/userStore';
import HexGrid from './widgets/Field/HexGrid';
import Balance from './widgets/Profile/Balance';
import { ToolList } from './widgets/Shop/ToolList';

function App() {
  const { setUser, user } = useUserStore();

  useEffect(() => {
    const init = async () => {
      let user;

      if (window.Telegram?.WebApp) {
        console.log('Telegram WebApp доступен:', window.Telegram.WebApp);
        const userData = window.Telegram.WebApp.initDataUnsafe?.user;
        user = userData || {
          id: 0,
          username: 'Guest',
        };
      } else {
        console.warn(
          'Telegram WebApp недоступен. Используем временного пользователя.',
        );
        user = {
          id: 0, // Используем число вместо строки
          username: 'Guest',
        };
      }

      const initialBalance = {
        ETH: 0,
        TON: 0,
        $: 10,
      };

      console.log('Используемый пользователь:', user);

      // Инициализация пользователя
      setUser({
        telegramId: Number(user.id), // Теперь это будет 0, а не NaN
        username: user.username,
        balance: initialBalance,
        tools: [],
        miningCount: 0,
      });

      // Инициализация пользователя в Firestore
      try {
        await initializeUser(Number(user.id), user.username, initialBalance);
        console.log('Пользователь инициализирован в Firestore.');
      } catch (error) {
        console.error(
          'Ошибка при инициализации пользователя в Firestore:',
          error,
        );
      }
    };

    init();
  }, [setUser]);

  console.log('Текущий пользователь:', user);

  return (
    <div className="app">
      <h2>1.9</h2>
      <Balance />
      <HexGrid />
      <ToolList />
    </div>
  );
}

export default App;
