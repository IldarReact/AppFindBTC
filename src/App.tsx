import { useEffect, useState } from 'react';
import { useUserStore, initializeUser } from './store/userStore';
import { WebAppService } from './shared/api/telegram/webApp';
import { getUser } from './shared/api/firebase/db';
import HexGrid from './widgets/Field/HexGrid';
import Balance from './widgets/Profile/Balance';
import { ToolList } from './widgets/Shop/ToolList';
// import DebugStatus from './components/DebugStatus';
import { initialBalance } from '@/shared/config/balance';


function App() {
  const { setUser, user } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initUser = async () => {
      const webApp = WebAppService.getInstance();

      try {
        // Увеличим время ожидания инициализации WebApp
        setTimeout(async () => {
          // Проверяем доступность WebApp и получаем пользовательские данные
          const isWebAppAvailable = await webApp.initialize();
          const userData = webApp.getUserData();

          // Если WebApp доступен И есть данные пользователя
          if (isWebAppAvailable && userData) {
            console.log('WebApp доступен, получены данные:', userData);

            // Проверяем существующего пользователя
            const existingUser = await getUser(userData.telegramId.toString());

            if (existingUser) {
              console.log('Найден существующий пользователь:', existingUser);
              setUser(existingUser);
            } else {
              console.log('Создаем нового пользователя');

              await initializeUser(
                userData.telegramId,
                userData.username,
                initialBalance,
              );

              const newUser = await getUser(userData.telegramId.toString());
              if (newUser) {
                setUser(newUser);
              }
            }
          } else {
            console.log('WebApp недоступен или нет данных пользователя');

            // Создаем тестового пользователя только если действительно нет данных
            if (!isWebAppAvailable || !userData) {
              const testUser = {
                telegramId: 0,
                username: 'WebTest',
                balance: {
                  ETH: 0,
                  TON: 0,
                  $: 10,
                },
                tools: [],
                miningCount: 0,
              };

              setUser(testUser);
            }
          }
        }, 1000); // Даем время на инициализацию WebApp
      } catch (err) {
        console.error('Ошибка инициализации:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(errorMessage);

        if (webApp.isWebAppAvailable()) {
          await webApp.showAlert(errorMessage);
        }
      }
    };

    initUser();
  }, [setUser]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div className="error-message">Пользователь не авторизован</div>;
  }

  return (
    <div className="app">
      <h2>2.3</h2>
      <Balance />
      <HexGrid />
      <ToolList />
      {/* <DebugStatus /> */}
    </div>
  );
}

export default App;
