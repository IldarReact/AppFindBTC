export interface WebAppUser {
    id: number
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
}

export interface WebApp {
    initDataUnsafe: {
        user: WebAppUser
    }
    expand: () => void
    showAlert: (message: string) => void
    ready: () => void 
}

declare global {
    interface Window {
        Telegram?: {
            WebApp?: WebApp
        }
    }
}