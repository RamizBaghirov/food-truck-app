import { createClient } from '@supabase/supabase-js'

/**
 * Публичный клиент — для браузера ('use client').
 * Работает через anon key и подчиняется правилам RLS.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Административный клиент — ТОЛЬКО для серверных API (route.ts).
 * service_role ключ обходит RLS полностью.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)