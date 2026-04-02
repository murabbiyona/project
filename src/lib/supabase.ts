import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fwxuotufcwszntqupqzn.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3eHVvdHVmY3dzem50cXVwcXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5ODIwOTEsImV4cCI6MjA5MDU1ODA5MX0.NC7ncpgjCLyZ7MBmmM9Ise1i-89SqwXVJ0yNwyZx_LE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

