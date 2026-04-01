import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { StudentReward, RewardCategory } from '../types/database'

export interface RewardWithDetails extends StudentReward {
  category?: RewardCategory
  student?: {
    first_name: string
    last_name: string
    journal_number: number | null
  }
}

export function useRewards(classId?: string) {
  const { user } = useAuth()
  const [categories, setCategories] = useState<RewardCategory[]>([])
  const [rewards, setRewards] = useState<RewardWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('reward_categories')
      .select('*')
      .order('is_positive', { ascending: false })
      .order('name_uz')

    if (data) setCategories(data as RewardCategory[])
  }, [])

  const fetchRewards = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)

    let query = supabase
      .from('student_rewards')
      .select(`
        *,
        category:reward_categories(*),
        student:students(first_name, last_name, journal_number)
      `)
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (classId) query = query.eq('class_id', classId)

    const { data, error: err } = await query

    if (err) {
      setError(err.message)
    } else {
      setRewards((data || []) as RewardWithDetails[])
    }
    setLoading(false)
  }, [user, classId])

  useEffect(() => {
    fetchCategories()
    fetchRewards()
  }, [fetchCategories, fetchRewards])

  async function giveReward(input: {
    student_id: string
    class_id: string
    category_id: string
    points: number
    note?: string
  }) {
    if (!user) return { error: 'Foydalanuvchi topilmadi' }

    const { data, error: err } = await supabase
      .from('student_rewards')
      .insert({
        student_id: input.student_id,
        teacher_id: user.id,
        class_id: input.class_id,
        category_id: input.category_id,
        points: input.points,
        note: input.note,
      })
      .select(`
        *,
        category:reward_categories(*),
        student:students(first_name, last_name, journal_number)
      `)
      .single()

    if (!err) await fetchRewards()
    return { data, error: err?.message || null }
  }

  function getStudentPoints(studentId: string): number {
    return rewards
      .filter(r => r.student_id === studentId)
      .reduce((sum, r) => sum + r.points, 0)
  }

  return { categories, rewards, loading, error, fetchRewards, giveReward, getStudentPoints }
}
