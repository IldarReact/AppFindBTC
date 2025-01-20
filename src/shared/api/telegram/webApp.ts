interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    showPopup: (options: { message: string; buttons: Array<{ type: string }> }) => void;
    close: () => void;
    initDataUnsafe?: { user?: { id: string; username: string } };
}

declare global {
    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }
}

export class WebAppService {
    // Делаем instance приватным статическим свойством
    private static _instance: WebAppService | null = null;
    public webApp: TelegramWebApp | null = null;
    private initializationPromise: Promise<boolean>;
    private readonly TIMEOUT = 2000;
    private readonly INTERVAL = 200;

    private constructor() {
        this.initializationPromise = new Promise<boolean>((resolve) => {
            if (window.Telegram?.WebApp) {
                this.webApp = window.Telegram.WebApp;
                resolve(true);
                return;
            }

            const startTime = Date.now();
            
            const checkWebApp = () => {
                if (window.Telegram?.WebApp) {
                    this.webApp = window.Telegram.WebApp;
                    console.log('WebApp найден:', this.webApp);
                    resolve(true);
                } else if (Date.now() - startTime >= this.TIMEOUT) {
                    console.log('WebApp не доступен после таймаута');
                    resolve(false);
                } else {
                    setTimeout(checkWebApp, this.INTERVAL);
                }
            };

            checkWebApp();
        });
    }

    // Правильно определяем статический метод getInstance
    public static getInstance(): WebAppService {
        if (!WebAppService._instance) {
            WebAppService._instance = new WebAppService();
        }
        return WebAppService._instance;
    }

    async initialize(): Promise<boolean> {
        const isAvailable = await this.initializationPromise;
        if (!isAvailable || !this.webApp) {
            return false;
        }
        
        try {
            this.webApp.ready();
            this.webApp.expand();
            return true;
        } catch (error) {
            console.error('Ошибка инициализации WebApp:', error);
            return false;
        }
    }

    getUserData() {
        console.log('Проверка initDataUnsafe:', this.webApp?.initDataUnsafe);
        console.log('Проверка user:', this.webApp?.initDataUnsafe?.user);
        
        if (!this.webApp?.initDataUnsafe?.user) {
            console.log('Данные пользователя недоступны');
            return null;
        }

        const user = this.webApp.initDataUnsafe.user;
        return {
            telegramId: Number(user.id),
            username: user.username || `user${user.id}`
        };
    }

    async showAlert(message: string): Promise<void> {
        if (!this.webApp) {
            console.warn('WebApp не доступен для показа сообщения');
            return;
        }
        
        try {
            this.webApp.showPopup({
                message,
                buttons: [{ type: 'ok' }]
            });
        } catch (error) {
            console.error('Ошибка показа алерта:', error);
        }
    }

    closeApp(): void {
        if (!this.webApp) return;
        this.webApp.close();
    }

    isWebAppAvailable(): boolean {
        return !!this.webApp;
    }
}