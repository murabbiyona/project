import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Grade, GradeType } from '../types/database'

export interface GradeWithStudent extends Grade {
  student?: {
    first_name: string
    last_name: string
    journal_number: number | null
  }
}

export function useGrades(classId?: string, subjectId?: string) {
  const { user } = useAuth()
  const [grades, setGrades] = useState<GradeWithStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGrades = useCallback(async () => {
    if (!user) { setLoading(false); return }
    setLoading(true)
    setError(null)

    let query = supabase
      .from('grades')
      .select(`
        *,
        student:students(first_name, last_name, journal_number)
      `)
      .eq('teacher_id', user.id)
      .order('date', { ascending: false })

    if (classId) query = query.eq('class_id', classId)
    if (subjectId) query = query.eq('subject_id', subjectId)

    const { data, error: err } = await query

    if (err) {
      setError(err.message)
    } else {
      setGrades((data || []) as GradeWithStudent[])
    }
    setLoading(false)
  }, [user, classId, subjectId])

  useEffect(() => {
    fetchGrades()
  }, [fetchGrades])

  async function addGrade(input: {
    student_id: string
    class_id: string
    subject_id: string
    score: number
    max_score?: number
    grade_type: GradeType
    quarter?: number
    comment?: string
    assessment_id?: string
  }) {
    if (!user) return { error: 'Foydalanuvchi topilmadi' }

    const percentage = input.max_score ? (input.score / input.max_score) * 100 : null

    const { data, error: err } = await supabase
      .from('grades')
      .insert({
        teacher_id: user.id,
        student_id: input.student_id,
        class_id: input.class_id,
        subject_id: input.subject_id,
        score: input.score,
        max_score: input.max_score || 100,
        percentage,
        grade_type: input.grade_type,
        quarter: input.quarter,
        comment: input.comment,
        assessment_id: input.assessment_id,
        academic_year: '2025-2026',
      })
      .select(`*, student:students(first_name, last_name, journal_number)`)
      .single()

    if (!err) await fetchGrades()
    return { data, error: err?.message || null }
  }

  async function updateGrade(id: string, updates: Partial<Grade>) {
    const { error: err } = await supabase
      .from('grades')
      .update(updates)
      .eq('id', id)

    if (!err) await fetchGrades()
    return { error: err?.message || null }
  }

  async function deleteGrade(id: string) {
    const { error: err } = await supabase
      .from('grades')
      .delete()
      .eq('id', id)

    if (!err) await fetchGrades()
    return { error: err?.message || null }
  }

  return { grades, loading, error, fetchGrades, addGrade, updateGrade, deleteGrade }
}
