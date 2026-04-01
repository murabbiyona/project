import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Class } from '../types/database'

export interface ClassWithCounts extends Class {
  student_count: number
  lesson_count: number
  assignment_count: number
}

// Demo data shown when user has no school_id or DB returns empty
const MOCK_CLASSES: ClassWithCounts[] = [
  {
    id: 'mock-1', school_id: '', name: '5-A', grade_level: 5, section: 'A',
    academic_year: '2025-2026', color: '#f43f5e', is_active: true,
    created_at: '', updated_at: '',
    student_count: 32, lesson_count: 18, assignment_count: 5,
  },
  {
    id: 'mock-2', school_id: '', name: '5-B', grade_level: 5, section: 'B',
    academic_year: '2025-2026', color: '#f97316', is_active: true,
    created_at: '', updated_at: '',
    student_count: 28, lesson_count: 16, assignment_count: 4,
  },
  {
    id: 'mock-3', school_id: '', name: '6-A', grade_level: 6, section: 'A',
    academic_year: '2025-2026', color: '#10b981', is_active: true,
    created_at: '', updated_at: '',
    student_count: 30, lesson_count: 22, assignment_count: 7,
  },
  {
    id: 'mock-4', school_id: '', name: '6-B', grade_level: 6, section: 'B',
    academic_year: '2025-2026', color: '#06b6d4', is_active: true,
    created_at: '', updated_at: '',
    student_count: 27, lesson_count: 20, assignment_count: 6,
  },
  {
    id: 'mock-5', school_id: '', name: '7-A', grade_level: 7, section: 'A',
    academic_year: '2025-2026', color: '#3b82f6', is_active: true,
    created_at: '', updated_at: '',
    student_count: 31, lesson_count: 24, assignment_count: 8,
  },
  {
    id: 'mock-6', school_id: '', name: '7-B', grade_level: 7, section: 'B',
    academic_year: '2025-2026', color: '#8b5cf6', is_active: true,
    created_at: '', updated_at: '',
    student_count: 29, lesson_count: 19, assignment_count: 5,
  },
]

export function useClasses() {
  const { profile } = useAuth()
  const [classes, setClasses] = useState<ClassWithCounts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClasses = useCallback(async () => {
    if (!profile?.school_id) {
      // No school — show demo classes
      setClasses(MOCK_CLASSES)
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
        setClasses(MOCK_CLASSES)
      } else {
        const mapped = (data || []).map((c: any) => ({
          ...c,
          student_count: c.students?.[0]?.count || 0,
          lesson_count: c.lesson_plans?.[0]?.count || 0,
          assignment_count: c.assessments?.[0]?.count || 0,
        }))
        setClasses(mapped.length > 0 ? mapped : MOCK_CLASSES)
      }
    } catch (e: any) {
      setError(e.message || 'Xatolik yuz berdi')
      setClasses(MOCK_CLASSES)
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
    if (!profile?.school_id) {
      // Mock mode — add locally
      const newClass: ClassWithCounts = {
        id: `mock-${Date.now()}`,
        school_id: '',
        name: input.name,
        grade_level: input.grade_level,
        section: input.section ?? null,
        color: input.color || '#10b981',
        academic_year: '2025-2026',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        student_count: 0,
        lesson_count: 0,
        assignment_count: 0,
      }
      setClasses(prev => [...prev, newClass])
      return { data: newClass, error: null }
    }

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
