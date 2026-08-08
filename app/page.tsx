'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { Product } from '@/types'
import { initTelegramApp } from '@/lib/telegram'

const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: 'Капучино', description: 'Классический кофе с густой пеной', price: 12.00, category: 'drinks', image_url: 'https://placehold.co/400x300' },
  { id: '2', name: 'Латте', description: 'Мягкий кофейный напиток с молоком', price: 13.50, category: 'drinks', image_url: 'https://placehold.co/400x300' },
  { id: '3', name: 'Бургер Классик', description: 'Говяжья котлета, сыр чеддер, фирменный соус', price: 24.00, category: 'food', image_url: 'https://placehold.co/400x300' },
  { id: '4', name: 'Картофель фри', description: 'Хрустящий картофель с соусом', price: 9.00, category: 'food', image_url: 'https://placehold.co/400x300' },
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'drinks' | 'food'>('all')
  const [loading, setLoading] = useState(false)
  const { items, addItem, getTotalPrice, clearCart } = useCartStore()

 useEffect(() => {
    initTelegramApp()
  }, [])

  const filteredProducts = activeCategory === 'all' ? DEMO_PRODUCTS : DEMO_PRODUCTS.filter(p => p.category === activeCategory)

  const handleCheckout = async () => {
    if (items.length === 0) return
    setLoading(true)
    
    const tgUser = typeof window !== 'undefined' ? window.Telegram?.WebApp?.initDataUnsafe?.user : null
    const userTelegramId = tgUser?.id || 123456789 

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userTelegramId, items, totalAmount: getTotalPrice() }),
      })

      if (response.ok) {
        alert('Заказ успешно оформлен!')
        clearCart()
      } else {
        alert('Ошибка при оформлении заказа.')
      }
    } catch (err) {
      alert('Сбой сети.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Меню заведения</h1>
      </header>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'drinks', 'food'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {cat === 'all' ? 'Всё' : cat === 'drinks' ? 'Напитки' : 'Еда'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-xl p-3 flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{product.description}</p>
              <span className="font-bold text-sm">{product.price.toFixed(2)} zł</span>
            </div>
            <button onClick={() => addItem(product)} className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              + Добавить
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Итого:</p>
            <p className="text-lg font-bold">{getTotalPrice().toFixed(2)} zł</p>
          </div>
          <button onClick={handleCheckout} disabled={loading} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold">
            {loading ? 'Отправка...' : 'Оформить заказ'}
          </button>
        </div>
      )}
    </div>
  )
}