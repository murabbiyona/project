import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useTelegramLink() {
  const { user } = useAuth()
  const [linkCode, setLinkCode] = useState<string | null>(null)
  const [isLinked, setIsLinked] = useState(false)
  const [loading, setLoading] = useState(true)

  // Tekshirish: telegram_id allaqachon bormi?
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const check = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('telegram_id')
        .eq('id', user.id)
        .single()

      if (data?.telegram_id) {
        setIsLinked(true)
      }

      // Mavjud ishlatilmagan kodni tekshirish
      const { data: existingLink } = await supabase
        .from('telegram_links')
        .select('code, used')
        .eq('user_id', user.id)
        .eq('used', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existingLink) {
        setLinkCode(existingLink.code)
      }

      setLoading(false)
    }

    check()
  }, [user])

  // Yangi kod generatsiya qilish
  const generateCode = useCallback(async () => {
    if (!user) return null

    const code = `MRB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const { error } = await supabase
      .from('telegram_links')
      .insert({ user_id: user.id, code })

    if (error) {
      console.error('Kod yaratishda xatolik:', error)
      return null
    }

    setLinkCode(code)
    return code
  }, [user])

  // Ulashni bekor qilish
  const unlinkTelegram = useCallback(async () => {
    if (!user) return

    await supabase
      .from('profiles')
      .update({ telegram_id: null })
      .eq('id', user.id)

    setIsLinked(false)
  }, [user])

  return {
    linkCode,
    isLinked,
    loading,
    generateCode,
    unlinkTelegram,
  }
}
