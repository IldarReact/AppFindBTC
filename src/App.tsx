'use client';

import { useState, useEffect } from 'react';
import { Shop } from '@/widgets/Shop/Shop';
import { Balance } from '@/widgets/Balance/Balance';
import { Profile } from '@/widgets/Profile/Profile';
import { useUserStore } from '@/store/userStore';
import WebAppService from '@/shared/api/telegram/WebAppService';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { authService } from '@/features/auth/authService';
import { logger } from '@/shared/lib/logger';
import type { User } from '@/shared/types/game.types';
import { BottomNav } from './widgets/Navigation/BottomNav';
import HexGame from './widgets/HexGrid/HexGame';

export const App = () => {
  const { setUser } = useUserStore();
  const [activeView, setActiveView] = useState('game');
  const [isLoading, setIsLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        logger.info('Starting application initialization');
        const webApp = WebAppService.getInstance();
        webApp.initialize();

        if (webApp.isAvailable()) {
          logger.info('Telegram WebApp is available');
          webApp.expand();
          const telegramUser = webApp.getUserData();

          if (telegramUser) {
            try {
              const user = await authService.signInWithTelegram(telegramUser);
              setUser(user as User);
              setIsLoading(false);
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : 'Unknown error';
              setError(errorMessage);
              webApp.showAlert(`Login error: ${errorMessage}`);
            }
          } else {
            setError('Telegram user data unavailable');
          }
        } else {
          setError('Telegram WebApp недоступен');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        setError(`Initialization error: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderView = () => {
    switch (activeView) {
      case 'game':
        return <HexGame />;
      case 'shop':
        return <Shop />;
      case 'profile':
        return <Profile />;
      case 'balance':
        return <Balance />;
      default:
        return <HexGame />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-container flex flex-col h-screen">
        <div className='flex-1 overflow-auto pb-16'>{renderView()}</div>
        <BottomNav activeView={activeView} onViewChange={handleViewChange} />
      </div>
    </ErrorBoundary>
  );
};
