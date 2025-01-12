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
    private static instance: WebAppService;
    private webApp = window.Telegram?.WebApp;

    private constructor() {
        if (!this.webApp) {
            throw new Error('Telegram WebApp is not available');
        }
    }

    static getInstance(): WebAppService {
        if (!this.instance) {
            this.instance = new WebAppService();
        }
        return this.instance;
    }

    initialize() {
        this.webApp.ready();
        this.webApp.expand();
    }

    showAlert(message: string) {
        this.webApp.showPopup({
            message,
            buttons: [{ type: 'ok' }]
        });
    }

    closeApp() {
        this.webApp.close();
    }
}