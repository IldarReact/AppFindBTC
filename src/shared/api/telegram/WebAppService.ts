import { logger } from "@/shared/lib/logger"
import type { WebAppUser } from "./telegram"

class WebAppService {
  private static instance: WebAppService | null = null
  private isInitialized = false

  private constructor() {
    logger.info("WebAppService constructor called")
  }

  public static getInstance(): WebAppService {
    if (!WebAppService.instance) {
      WebAppService.instance = new WebAppService()
    }
    return WebAppService.instance
  }

  public initialize(): void {
    if (this.isAvailable()) {
      this.isInitialized = true
      logger.info("WebAppService initialized")
    } else {
      logger.warn("Telegram WebApp is not available, cannot initialize")
    }
  }

  public isAvailable(): boolean {
    const isAvailable = Boolean(window.Telegram?.WebApp)
    logger.info("Telegram WebApp availability:", isAvailable)
    return isAvailable
  }

  public getUserData(): WebAppUser | null {
    if (!this.isAvailable()) {
      logger.warn("Telegram WebApp is not available, cannot get user data")
      return null
    }

    try {
      const user = window.Telegram?.WebApp?.initDataUnsafe?.user
      if (!user) {
        throw new Error("User data is not available")
      }
      logger.info("Telegram user data:", user)
      return user
    } catch (error) {
      logger.error("Error getting user data:", { error: JSON.stringify(error) })
      return null
    }
  }

  public expand(): void {
    if (this.isAvailable() && window.Telegram?.WebApp?.expand) {
      window.Telegram.WebApp.expand()
      logger.info("Telegram WebApp expanded")
    } else {
      logger.warn("Telegram WebApp is not available, cannot expand")
    }
  }

  public showAlert(message: string): void {
    if (!this.isInitialized) {
      logger.warn("WebAppService not initialized, using default alert")
      alert(message)
      return
    }

    if (this.isAvailable() && window.Telegram?.WebApp?.showAlert) {
      try {
        window.Telegram.WebApp.showAlert(message)
        logger.info("Alert shown via Telegram WebApp:", message)
      } catch (error) {
        if (error instanceof Error && error.message.includes("WebAppPopupOpened")) {
          logger.warn("Telegram WebApp popup is already open. Message:", message)
          setTimeout(() => this.showAlert(message), 1000)
        } else {
          logger.error("Failed to show alert via Telegram WebApp:", { error: JSON.stringify(error) })
          alert(message)
        }
      }
    } else {
      logger.warn("Telegram WebApp showAlert not available, using default alert")
      alert(message)
    }
  }

  public ready(): void {
    if (this.isAvailable() && window.Telegram?.WebApp?.ready) {
      window.Telegram.WebApp.ready()
      logger.info("Telegram WebApp ready() called")
    } else {
      logger.warn("Telegram WebApp ready() not available")
    }
  }
}

export default WebAppService