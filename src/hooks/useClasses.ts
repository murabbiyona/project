import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Class } from '../types/database'

export interface ClassWithCounts extends Class {
  student_count: number
  lesson_count: number
  assignment_count: number
}

export function useClasses() {
  const { profile } = useAuth()
  const [classes, setClasses] = useState<ClassWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClasses = useCallback(async () => {
    if (!profile?.school_id) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)

    try {
      const { data, error: err } = await supabase
        .from('classes')
        .select(`
          *,
          students(count),
          lesson_plans(count),
          assessments(count)
        `)
        .eq('school_id', profile.school_id)
        .eq('is_active', true)
        .order('name')

      if (err) {
        setError(err.message)
      } else {
        const mapped = (data || []).map((c: any) => ({
          ...c,
          student_count: c.students?.[0]?.count || 0,
          lesson_count: c.lesson_plans?.[0]?.count || 0,
          assignment_count: c.assessments?.[0]?.count || 0,
        }))
        setClasses(mapped)
      }
    } catch (e: any) {
      setError(e.message || 'Xatolik yuz berdi')
    }
    setLoading(false)
  }, [profile?.school_id])

  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  async function createClass(input: {
    name: string
    grade_level: number
    section?: string
    color?: string
  }) {
    if (!profile?.school_id) return { error: 'Maktab topilmadi' }

    const { data, error: err } = await supabase
      .from('classes')
      .insert({
        school_id: profile.school_id,
        name: input.name,
        grade_level: input.grade_level,
        section: input.section,
        color: input.color || '#10b981',
        academic_year: '2025-2026',
      })
      .select()
      .single()

    if (!err && data) {
      await fetchClasses()
    }
    return { data, error: err?.message || null }
  }

  async function updateClass(id: string, updates: Partial<Class>) {
    const { error: err } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)

    if (!err) await fetchClasses()
    return { error: err?.message || null }
  }

  async function deleteClass(id: string) {
    const { error: err } = await supabase
      .from('classes')
      .update({ is_active: false })
      .eq('id', id)

    if (!err) await fetchClasses()
    return { error: err?.message || null }
  }

  return { classes, loading, error, fetchClasses, createClass, updateClass, deleteClass }
}
