export function getTelegramWebApp() {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? null
}

export function getTelegramUserId(): number | null {
  const webApp = getTelegramWebApp()
  return webApp?.initDataUnsafe?.user?.id ?? null
}

export function initTelegramApp() {
  const webApp = getTelegramWebApp()
  if (!webApp) return
  webApp.ready()
  webApp.expand()
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            username?: string
          }
        }
        MainButton: {
          text: string
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
        themeParams: Record<string, string>
      }
    }
  }
}