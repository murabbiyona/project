import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface AICredits {
  balance: number
  total_purchased: number
  total_used: number
}

const EMPTY_CREDITS: AICredits = {
  balance: 0,
  total_purchased: 0,
  total_used: 0,
}

export function useAICredits() {
  const { user } = useAuth()
  const [credits, setCredits] = useState<AICredits>(EMPTY_CREDITS)
  const [loading, setLoading] = useState(true)

  const refreshCredits = useCallback(async () => {
    if (!user) {
      setCredits(EMPTY_CREDITS)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('ai_credits')
        .select('balance, total_purchased, total_used')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        console.error('AI kreditlarni yuklashda xatolik:', error.message)
        setCredits(EMPTY_CREDITS)
      } else if (data) {
        setCredits({
          balance: data.balance ?? 0,
          total_purchased: data.total_purchased ?? 0,
          total_used: data.total_used ?? 0,
        })
      } else {
        // No row exists for this user yet
        setCredits(EMPTY_CREDITS)
      }
    } catch (e: any) {
      console.error('AI kreditlar xatolik:', e.message)
      setCredits(EMPTY_CREDITS)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    refreshCredits()
  }, [refreshCredits])

  return { credits, loading, refreshCredits }
}
