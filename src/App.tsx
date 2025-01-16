import { useEffect } from 'react';
import { ToolList } from './widgets/Shop/ToolList';
import { useUserStore } from './store/userStore';
// import { WebAppService } from './shared/api/telegram/webApp';
import HexGrid from './widgets/Field/HexGrid';
import Balance from './widgets/Profile/Balance';
import { createUser } from './shared/api/firebase/db';

function App() {
  const { setUser } = useUserStore();

  useEffect(() => {
    const init = async () => {
      const initializeWebApp = () => {
        if (window.Telegram?.WebApp) {
          try {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
            console.log('WebApp инициализирован.');
            return true;
          } catch (error) {
            console.error('Ошибка инициализации WebApp:', error);
            return false;
          }
        } else {
          console.warn(
            'WebApp недоступен. Запустите приложение внутри Telegram.',
          );
          return false;
        }
      };

      initializeWebApp();

      const getUserData = () => {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
          // Данные пользователя доступны (мобильное приложение Telegram)
          return window.Telegram.WebApp.initDataUnsafe.user;
        } else {
          // Данные пользователя недоступны (например, Web Telegram без авторизации)
          console.warn(
            'Данные пользователя недоступны. Используем временного пользователя.',
          );
          return {
            id: 'temp_user_id',
            username: 'Guest',
          };
        }
      };

      const userData = getUserData();

      // Установка данных пользователя в хранилище
      setUser({
        telegramId: Number(userData.id),
        username: userData.username,
        balance: 10, // Начальный баланс $10
        tools: [],
        miningCount: 0,
      });

      // Создание пользователя в Firestore с начальным балансом $10
      await createUser(Number(userData.id), userData.username);

      console.log('Пользователь:', userData);
    };

    init();
  }, [setUser]);

  return (
    <div className="app">
      <Balance />
      <HexGrid />
      <ToolList />
    </div>
  );
}

export default App;
