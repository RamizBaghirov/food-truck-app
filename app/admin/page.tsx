'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [showPush, setShowPush] = useState(false)

  const handleSendPush = () => {
    setShowPush(true)
  }

  const handlePushClick = () => {
    setShowPush(false)
    router.push('/rate')
  }

  return (
    <main className="max-w-md mx-auto min-h-screen p-6 relative overflow-hidden">
      <h1 className="text-2xl font-bold mb-2">Админ-панель (демо)</h1>
      <p className="text-gray-500 mb-8 text-sm">
        Симуляция push-уведомления клиенту после визита
      </p>

      <button
        onClick={handleSendPush}
        className="w-full py-4 rounded-xl bg-black text-white font-semibold"
      >
        📲 Отправить Push-уведомление сейчас
      </button>

      <p className="text-xs text-gray-400 mt-4">
        В реальной системе push отправляется автоматически через N минут после закрытия чека,
        через Telegram Bot API или Web Push.
      </p>

      {/* Симуляция push-уведомления в стиле нативного OS-баннера */}
      {showPush && (
        <div
          onClick={handlePushClick}
          className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex items-start gap-3 cursor-pointer animate-slideDown z-50"
        >
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white text-lg flex-shrink-0">
            ☕
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Ваше заведение</p>
            <p className="text-sm text-gray-600">Как вам наш кофе? Оцените ваш визит ⭐</p>
          </div>
          <span className="text-xs text-gray-400">сейчас</span>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </main>
  )
}