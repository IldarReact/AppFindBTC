import { useEffect, useState } from 'react';

interface DebugState {
  isTelegramAvailable: boolean;
  webAppData: {
    platform?: string;
    version?: string;
  } | null;
  error: string | null;
}

const DebugStatus = () => {
  const [status, setStatus] = useState<DebugState>({
    isTelegramAvailable: false,
    webAppData: null,
    error: null,
  });

  useEffect(() => {
    const checkTelegram = () => {
      console.log('Checking Telegram WebApp...');
      const isTelegramAvailable = Boolean(window.Telegram?.WebApp);
      console.log('Telegram WebApp available:', isTelegramAvailable);

      const webAppData = window.Telegram?.WebApp
        ? {
            platform: window.Telegram.WebApp.platform,
            version: window.Telegram.WebApp.version,
          }
        : null;

      setStatus({
        isTelegramAvailable,
        webAppData,
        error: !isTelegramAvailable ? 'Telegram WebApp не доступен' : null,
      });
    };

    // Первая проверка через 1 секунду
    setTimeout(checkTelegram, 1000);

    // Повторная проверка каждые 2 секунды
    const interval = setInterval(checkTelegram, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 p-4 bg-black/80 text-white text-sm max-w-full">
      <div>Telegram доступен: {status.isTelegramAvailable ? '✅' : '❌'}</div>
      {status.error && (
        <div className="text-red-400">Ошибка: {status.error}</div>
      )}
      {status.webAppData && (
        <div className="text-green-400">
          {status.webAppData.version && (
            <>
              Версия: {status.webAppData.version}
              <br />
            </>
          )}
          {status.webAppData.platform && (
            <>Платформа: {status.webAppData.platform}</>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugStatus;
