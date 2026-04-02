import { useState, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { AssessmentMethod } from '../types/database'

// ─── Interfaces ──────────────────────────────────────────────

export interface AssessmentSession {
  id: string
  classId: string
  subjectId: string
  lessonPlanId?: string
  title: string
  method: 'manual' | 'qr_code' | 'rf_remote' | 'live_kahoot'
  totalPoints: number
  status: 'active' | 'completed'
  startedAt: string
}

export interface ScoreEntry {
  points: number
  category: string
  timestamp: string
}

export interface StudentScore {
  studentId: string
  studentName: string
  journalNumber: number | null
  scores: ScoreEntry[]
  totalScore: number
  finalGrade: number // 1-5 scale
}

export interface AssessmentStats {
  totalStudents: number
  assessedCount: number
  averageScore: number
  gradeDistribution: Record<number, number> // { 2: n, 3: n, 4: n, 5: n }
}

export interface SessionResult {
  assessmentId: string
  totalStudents: number
  assessedCount: number
  averageScore: number
  averageGrade: number
  gradeDistribution: Record<number, number>
  saved: number
  errors: string[]
}

interface StartSessionParams {
  classId: string
  subjectId: string
  lessonPlanId?: string
  title: string
  method?: 'manual' | 'qr_code' | 'rf_remote' | 'live_kahoot'
  totalPoints?: number
  assessmentType?: 'formative' | 'summative' | 'diagnostic' | 'quiz' | 'homework' | 'project'
}

// ─── Grade Calculation (Uzbekistan 5-ball system) ────────────

export function calculateFinalGrade(totalScore: number, maxScore: number): number {
  if (maxScore <= 0) return 2
  const percentage = (totalScore / maxScore) * 100
  if (percentage >= 86) return 5 // A'lo
  if (percentage >= 71) return 4 // Yaxshi
  if (percentage >= 56) return 3 // Qoniqarli
  return 2 // Qoniqarsiz
}

// ─── Hook ────────────────────────────────────────────────────

export function useAssessment() {
  const { user } = useAuth()

  const [activeSession, setActiveSession] = useState<AssessmentSession | null>(null)
  const [studentScores, setStudentScores] = useState<StudentScore[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Statistics (derived) ─────────────────────────────────

  const stats: AssessmentStats = useMemo(() => {
    const totalStudents = studentScores.length
    const assessed = studentScores.filter(s => s.scores.length > 0)
    const assessedCount = assessed.length

    const averageScore =
      assessedCount > 0
        ? assessed.reduce((sum, s) => sum + s.totalScore, 0) / assessedCount
        : 0

    const gradeDistribution: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0 }
    for (const s of assessed) {
      const grade = s.finalGrade
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1
    }

    return { totalStudents, assessedCount, averageScore, gradeDistribution }
  }, [studentScores])

  // ── Start a new assessment session ───────────────────────

  const startSession = useCallback(
    async (params: StartSessionParams): Promise<AssessmentSession> => {
      if (!user) throw new Error('Foydalanuvchi topilmadi')

      setLoading(true)
      setError(null)

      try {
        // 1. Create assessment record in Supabase
        const { data: assessment, error: insertErr } = await supabase
          .from('assessments')
          .insert({
            teacher_id: user.id,
            class_id: params.classId,
            subject_id: params.subjectId,
            lesson_plan_id: params.lessonPlanId || null,
            title: params.title,
            assessment_type: params.assessmentType || 'formative',
            method: (params.method || 'manual') as AssessmentMethod,
            total_points: params.totalPoints || 100,
            passing_score: 56,
            status: 'active',
          })
          .select()
          .single()

        if (insertErr) throw new Error(insertErr.message)

        // 2. Fetch students for this class
        const { data: students, error: studentsErr } = await supabase
          .from('students')
          .select('id, first_name, last_name, journal_number')
          .eq('class_id', params.classId)
          .eq('is_active', true)
          .order('last_name')

        if (studentsErr) throw new Error(studentsErr.message)

        // 3. Initialize student scores (all start at zero)
        const maxScore = params.totalPoints || 100
        const initialScores: StudentScore[] = (students || []).map(s => ({
          studentId: s.id,
          studentName: `${s.last_name} ${s.first_name}`,
          journalNumber: s.journal_number,
          scores: [],
          totalScore: 0,
          finalGrade: calculateFinalGrade(0, maxScore),
        }))
        setStudentScores(initialScores)

        // 4. Build session object
        const session: AssessmentSession = {
          id: assessment.id,
          classId: params.classId,
          subjectId: params.subjectId,
          lessonPlanId: params.lessonPlanId,
          title: params.title,
          method: params.method || 'manual',
          totalPoints: params.totalPoints || 100,
          status: 'active',
          startedAt: assessment.created_at || new Date().toISOString(),
        }

        setActiveSession(session)
        return session
      } catch (err: any) {
        const msg = err?.message || 'Baholash sessiyasini boshlashda xatolik'
        setError(msg)
        throw new Error(msg)
      } finally {
        setLoading(false)
      }
    },
    [user],
  )

  // ── Add a score to a student ─────────────────────────────

  const addScore = useCallback(
    (studentId: string, points: number, category: string = 'umumiy') => {
      if (!activeSession) return

      const maxScore = activeSession.totalPoints

      setStudentScores(prev =>
        prev.map(s => {
          if (s.studentId !== studentId) return s

          const newEntry: ScoreEntry = {
            points,
            category,
            timestamp: new Date().toISOString(),
          }
          const updatedScores = [...s.scores, newEntry]
          const totalScore = updatedScores.reduce((sum, e) => sum + e.points, 0)

          return {
            ...s,
            scores: updatedScores,
            totalScore,
            finalGrade: calculateFinalGrade(totalScore, maxScore),
          }
        }),
      )
    },
    [activeSession],
  )

  // ── Remove last score from a student ─────────────────────

  const removeLastScore = useCallback(
    (studentId: string) => {
      if (!activeSession) return

      const maxScore = activeSession.totalPoints

      setStudentScores(prev =>
        prev.map(s => {
          if (s.studentId !== studentId || s.scores.length === 0) return s

          const updatedScores = s.scores.slice(0, -1)
          const totalScore = updatedScores.reduce((sum, e) => sum + e.points, 0)

          return {
            ...s,
            scores: updatedScores,
            totalScore,
            finalGrade: calculateFinalGrade(totalScore, maxScore),
          }
        }),
      )
    },
    [activeSession],
  )

  // ── Save all grades to Supabase ──────────────────────────

  const saveAllGrades = useCallback(async (): Promise<{
    success: boolean
    saved: number
    errors: string[]
  }> => {
    if (!user || !activeSession) {
      return { success: false, saved: 0, errors: ['Aktiv sessiya topilmadi'] }
    }

    const errors: string[] = []
    let saved = 0

    const assessed = studentScores.filter(s => s.scores.length > 0)

    if (assessed.length === 0) {
      return { success: true, saved: 0, errors: [] }
    }

    const today = new Date().toISOString().split('T')[0]

    const rows = assessed.map(s => ({
      student_id: s.studentId,
      class_id: activeSession.classId,
      subject_id: activeSession.subjectId,
      teacher_id: user.id,
      assessment_id: activeSession.id,
      score: s.totalScore,
      max_score: activeSession.totalPoints,
      percentage: Math.round((s.totalScore / activeSession.totalPoints) * 100),
      grade_type: 'formative' as const,
      date: today,
      academic_year: '2025-2026',
      comment: s.scores.map(e => `${e.category}: +${e.points}`).join(', '),
    }))

    // Insert in batches of 50 to avoid payload limits
    const batchSize = 50
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      const { data, error: batchErr } = await supabase
        .from('grades')
        .insert(batch)
        .select('id')

      if (batchErr) {
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${batchErr.message}`)
      } else {
        saved += data?.length || 0
      }
    }

    return { success: errors.length === 0, saved, errors }
  }, [user, activeSession, studentScores])

  // ── End the session ──────────────────────────────────────

  const endSession = useCallback(async (): Promise<SessionResult> => {
    if (!user || !activeSession) {
      throw new Error('Aktiv sessiya topilmadi')
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Recalculate final grades for all students
      const maxScore = activeSession.totalPoints
      setStudentScores(prev =>
        prev.map(s => ({
          ...s,
          finalGrade: calculateFinalGrade(s.totalScore, maxScore),
        })),
      )

      // 2. Save all grades to the database
      const saveResult = await saveAllGrades()

      // 3. Update assessment status to 'completed'
      const { error: updateErr } = await supabase
        .from('assessments')
        .update({ status: 'completed' })
        .eq('id', activeSession.id)

      if (updateErr) {
        saveResult.errors.push(`Status yangilashda xatolik: ${updateErr.message}`)
      }

      // 4. Build summary
      const assessed = studentScores.filter(s => s.scores.length > 0)
      const gradeDistribution: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0 }
      for (const s of assessed) {
        const grade = calculateFinalGrade(s.totalScore, maxScore)
        gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1
      }

      const averageScore =
        assessed.length > 0
          ? assessed.reduce((sum, s) => sum + s.totalScore, 0) / assessed.length
          : 0

      const averageGrade =
        assessed.length > 0
          ? assessed.reduce((sum, s) => sum + calculateFinalGrade(s.totalScore, maxScore), 0) /
            assessed.length
          : 0

      const result: SessionResult = {
        assessmentId: activeSession.id,
        totalStudents: studentScores.length,
        assessedCount: assessed.length,
        averageScore: Math.round(averageScore * 100) / 100,
        averageGrade: Math.round(averageGrade * 100) / 100,
        gradeDistribution,
        saved: saveResult.saved,
        errors: saveResult.errors,
      }

      // 5. Clear session state
      setActiveSession(prev => (prev ? { ...prev, status: 'completed' } : null))

      return result
    } catch (err: any) {
      const msg = err?.message || 'Sessiyani tugatishda xatolik'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }, [user, activeSession, studentScores, saveAllGrades])

  // ── Public API ───────────────────────────────────────────

  return {
    // Session management
    startSession,
    endSession,
    activeSession,

    // Student scoring during session
    addScore,
    removeLastScore,

    // Real-time data
    studentScores,

    // Statistics
    stats,

    // Grade calculation utility
    calculateFinalGrade,

    // Bulk save
    saveAllGrades,

    // State
    loading,
    error,
  }
}
