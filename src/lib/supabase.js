import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.error('[CONFIG ERROR] Supabase URL is missing. Google Login will fail. Set VITE_SUPABASE_URL in your environment.')
}

// Ensure we don't pass undefined to createClient which throws
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

