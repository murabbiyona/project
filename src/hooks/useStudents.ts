import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Student } from '../types/database'

export function useStudents(classId?: string, options?: { enabled?: boolean }) {
  const { profile } = useAuth()
  const enabled = options?.enabled !== false
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = useCallback(async () => {
    if (!profile?.school_id || !enabled) {
      setStudents([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)

    let query = supabase
      .from('students')
      .select('*')
      .eq('school_id', profile.school_id)
      .eq('is_active', true)
      .order('last_name')

    if (classId) {
      query = query.eq('class_id', classId)
    }

    const { data, error: err } = await query

    if (err) {
      setError(err.message)
    } else {
      setStudents(data || [])
    }
    setLoading(false)
  }, [profile?.school_id, classId, enabled])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  async function createStudent(input: {
    first_name: string
    last_name: string
    class_id: string
    journal_number?: number
    birth_date?: string
    gender?: 'male' | 'female'
  }) {
    if (!profile?.school_id) return { error: 'Maktab topilmadi' }

    const qrCode = `MRB-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    const { data, error: err } = await supabase
      .from('students')
      .insert({
        school_id: profile.school_id,
        class_id: input.class_id,
        first_name: input.first_name,
        last_name: input.last_name,
        journal_number: input.journal_number,
        birth_date: input.birth_date,
        gender: input.gender,
        qr_code: qrCode,
      } as any)
      .select()
      .single()

    if (!err) await fetchStudents()
    return { data, error: err?.message || null }
  }

  async function updateStudent(id: string, updates: Partial<Student>) {
    const { error: err } = await supabase
      .from('students')
      .update(updates as any)
      .eq('id', id)

    if (!err) await fetchStudents()
    return { error: err?.message || null }
  }

  async function deleteStudent(id: string) {
    const { error: err } = await supabase
      .from('students')
      .update({ is_active: false } as any)
      .eq('id', id)

    if (!err) await fetchStudents()
    return { error: err?.message || null }
  }

  return { students, loading, error, fetchStudents, createStudent, updateStudent, deleteStudent }
}
