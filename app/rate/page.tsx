'use client'

import { useState } from 'react'

function generatePromoCode() {
  return 'SWEET' + Math.floor(1000 + Math.random() * 9000)
}

export default function RatePage() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [step, setStep] = useState<'rating' | 'apology' | 'thanks'>('rating')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [promoCode] = useState(generatePromoCode)

  const handleSubmit = async () => {
    if (rating === 0) return
    setIsSubmitting(true)

    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })

      if (rating === 5) {
        const mapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_REVIEW_URL
        if (mapsUrl) {
          window.location.href = mapsUrl
          return
        }
        setStep('thanks')
      } else {
        // Негатив перехвачен: не даём уйти молча, предлагаем компенсацию
        setStep('apology')
      }
    } catch (error) {
      console.error(error)
      alert('Не удалось отправить оценку. Попробуйте ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Экран извинения — показывается вместо обычного "спасибо" при оценке ниже 5
  if (step === 'apology') {
    return (
      <main className="max-w-md mx-auto min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-4xl mb-4">😔</p>
          <h1 className="text-xl font-bold mb-2">Нам очень жаль это слышать</h1>
          <p className="text-gray-500 mb-6">
            Мы обязательно разберёмся с ситуацией. В качестве извинения — угостим вас
            десертом при следующем визите.
          </p>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-400 mb-1">Ваш промокод</p>
            <p className="text-2xl font-bold tracking-wider">{promoCode}</p>
          </div>
          <p className="text-xs text-gray-400">
            Покажите этот код на кассе при следующем заказе
          </p>
        </div>
      </main>
    )
  }

  if (step === 'thanks') {
    return (
      <main className="max-w-md mx-auto min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-4xl mb-4">🙏</p>
          <h1 className="text-xl font-bold mb-2">Спасибо за отзыв!</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto min-h-screen flex items-center justify-center p-6">
      <div className="w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Как вам у нас сегодня?</h1>
        <p className="text-gray-500 mb-8">Оцените, пожалуйста, ваш визит</p>

        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-5xl transition-transform hover:scale-110 active:scale-95"
            >
              {(hoverRating || rating) >= star ? '⭐' : '☆'}
            </button>
          ))}
        </div>

        {rating > 0 && rating < 5 && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">Что можно улучшить?</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Расскажите подробнее..."
              className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none"
              rows={4}
            />
          </div>
        )}

        {rating === 5 && (
          <p className="text-sm text-green-600 mb-6">
            🎉 Отлично! Сейчас откроется Google Maps
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={rating === 0 || isSubmitting}
          className="w-full py-4 rounded-xl bg-black text-white font-semibold text-lg disabled:opacity-40"
        >
          {isSubmitting ? 'Отправка...' : rating === 5 ? 'Оставить отзыв' : 'Отправить'}
        </button>
      </div>
    </main>
  )
}