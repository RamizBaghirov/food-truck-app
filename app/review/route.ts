import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ReviewPayload {
  orderId?: string
  rating: number
  comment?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ReviewPayload = await request.json()

    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: 'Некорректная оценка' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('reviews').insert({
      order_id: body.orderId ?? null,
      rating: body.rating,
      comment: body.comment ?? null,
    })

    if (error) {
      console.error('Ошибка сохранения отзыва:', error)
      return NextResponse.json({ error: 'Не удалось сохранить отзыв' }, { status: 500 })
    }

    // Только оценки НИЖЕ 5 отправляем владельцу как жалобу/фидбек
    if (body.rating < 5) {
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: process.env.OWNER_EMAIL!,
          subject: `⚠️ Оценка визита: ${body.rating}/5`,
          html: `
            <h2>Получена оценка ниже максимальной</h2>
            <p><b>Оценка:</b> ${body.rating} из 5</p>
            <p><b>Комментарий:</b> ${body.comment || 'без комментария'}</p>
          `,
        })
      } catch (emailError) {
        console.error('Ошибка отправки письма:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Необработанная ошибка при сохранении отзыва:', err)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}