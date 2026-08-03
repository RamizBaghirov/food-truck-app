import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'QR Menu Mini App',
  description: 'Заказ блюд через Telegram Mini App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <main className="max-w-md mx-auto min-h-screen bg-white shadow-sm pb-24">
          {children}
        </main>
      </body>
    </html>
  )
}