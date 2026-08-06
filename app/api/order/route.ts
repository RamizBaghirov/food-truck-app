import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface CartItemPayload {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderPayload {
  userTelegramId: number
  items: CartItemPayload[]
  totalAmount: number
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderPayload = await request.json()

    if (!body.userTelegramId || !Array.isArray(body.items) || body.items.length === 0 || !body.totalAmount) {
      return NextResponse.json({ error: 'Некорректные данные заказа' }, { status: 400 })
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        user_telegram_id: body.userTelegramId,
        total_amount: body.totalAmount,
        items: body.items,
        status: 'pending',
      })
      .select()
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Не удалось сохранить заказ' }, { status: 500 })
    }

    const itemsList = body.items.map((item) => ` - ${item.name} ✖ ${item.quantity} - ${item.price * item.quantity} zł`).join('\n')
    const message = `🔔 <b>Новый заказ #${order.id.slice(0, 8)}</b>\n\n${itemsList}\n\n💰 Итого: <b>${body.totalAmount} zł</b>\n👤 Telegram ID: ${body.userTelegramId}`

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHANNEL_ID, text: message, parse_mode: 'HTML' }),
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (err) {
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}