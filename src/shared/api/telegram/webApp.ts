interface TelegramWebApp {
    ready: () => void;
    expand: () => void;
    showPopup: (options: { message: string; buttons: Array<{ type: string }> }) => void;
    close: () => void;
    initDataUnsafe: {
        user?: {
            id: string;
            username: string;
            first_name?: string;
            last_name?: string;
        };
        auth_date?: string;
        hash?: string;
        query_id?: string;
        platform?: string;
        version?: string;
    };
    platform?: string;
    version?: string;
    MainButton?: {
        show: () => void;
        hide: () => void;
        setText: (text: string) => void;
    };
}

declare global {
    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }
}

export class WebAppService {
    private static _instance: WebAppService | null = null;
    public webApp: TelegramWebApp | null = null;

    private constructor() {
        if (window.Telegram?.WebApp) {
            this.webApp = window.Telegram.WebApp;
            this.webApp.ready();
            this.webApp.expand();
        }
    }

    public static getInstance(): WebAppService {
        if (!WebAppService._instance) {
            WebAppService._instance = new WebAppService();
        }
        return WebAppService._instance;
    }

    public async initialize(): Promise<boolean> {
        return Boolean(this.webApp);
    }

    public isWebAppAvailable(): boolean {
        return Boolean(this.webApp);
    }

    public getUserData() {
        if (!this.webApp?.initDataUnsafe?.user) {
            console.log('User data not available');
            return null;
        }

        const user = this.webApp.initDataUnsafe.user;
        return {
            telegramId: Number(user.id),
            username: user.username || `user${user.id}`
        };
    }

    public async showAlert(message: string): Promise<void> {
        if (!this.webApp) {
            console.warn('WebApp not available');
            return;
        }

        try {
            this.webApp.showPopup({
                message,
                buttons: [{ type: 'ok' }]
            });
        } catch (error) {
            console.error('Error showing alert:', error);
        }
    }
}