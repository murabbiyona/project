import { useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface QRVisionScanResult {
  studentId: string
  studentName: string
  time: string
  status: 'success' | 'duplicate' | 'unknown'
  correctCount?: number
  totalQuestions?: number
  score?: number
  grade?: number
  answers?: string
}

export interface QRVisionSession {
  classId: string
  className: string
  subjectId: string
  subjectName: string
  totalStudents: number
  totalQuestions: number
  correctAnswers: string // "ABCDABCD..." — to'g'ri javoblar
  startedAt: string
}

/**
 * QR Vision — QR kodli test tekshiruvi
 *
 * QR kod formati: QRV:{student_id}:{javoblar}
 * Masalan: QRV:abc-123-def:ABCDABCD
 *
 * Yoki oddiy format: {student_id}:{javoblar}
 * Yoki faqat javoblar (o'quvchi tanlangan bo'lsa)
 */
export function useQRVision() {
  const { user } = useAuth()
  const [session, setSession] = useState<QRVisionSession | null>(null)
  const [results, setResults] = useState<QRVisionScanResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannedIds = useRef<Set<string>>(new Set())
  const studentMap = useRef<Map<string, { id: string; name: string }>>(new Map())

  const startSession = useCallback(async (params: {
    classId: string
    className: string
    subjectId: string
    subjectName: string
    totalQuestions: number
    correctAnswers: string
  }) => {
    if (!user) return
    setLoading(true)
    setError(null)
    scannedIds.current.clear()
    studentMap.current.clear()
    setResults([])

    try {
      const { data: students, error: err } = await supabase
        .from('students')
        .select('id, first_name, last_name, qr_code')
        .eq('class_id', params.classId)
        .eq('is_active', true)
        .order('last_name')

      if (err) throw new Error(err.message)

      for (const s of (students || [])) {
        const key = s.qr_code || s.id
        studentMap.current.set(key, {
          id: s.id,
          name: `${s.last_name} ${s.first_name}`,
        })
        if (s.qr_code && s.qr_code !== s.id) {
          studentMap.current.set(s.id, {
            id: s.id,
            name: `${s.last_name} ${s.first_name}`,
          })
        }
      }

      setSession({
        classId: params.classId,
        className: params.className,
        subjectId: params.subjectId,
        subjectName: params.subjectName,
        totalStudents: students?.length || 0,
        totalQuestions: params.totalQuestions,
        correctAnswers: params.correctAnswers.toUpperCase(),
        startedAt: new Date().toISOString(),
      })
    } catch (e: any) {
      setError(e.message || 'Sessiyani boshlashda xatolik')
    } finally {
      setLoading(false)
    }
  }, [user])

  /**
   * QR kod skanerlanganda — test javoblarini tekshiradi
   *
   * QR formatlar:
   * 1. QRV:{student_id}:{answers}  — to'liq format
   * 2. {student_id}:{answers}       — qisqa format
   * 3. Faqat student QR kodi        — javoblarni keyinroq kiritish uchun
   */
  const handleScan = useCallback(async (qrCode: string): Promise<QRVisionScanResult> => {
    if (!user || !session) {
      return { studentId: '', studentName: qrCode, time: now(), status: 'unknown' }
    }

    const code = qrCode.trim()
    let studentId = ''
    let studentName = ''
    let studentAnswers = ''

    // QR formatni aniqlash
    if (code.startsWith('QRV:')) {
      // Format: QRV:{student_id}:{answers}
      const parts = code.substring(4).split(':')
      if (parts.length >= 2) {
        studentId = parts[0]
        studentAnswers = parts.slice(1).join('').toUpperCase()
      }
    } else if (code.includes(':')) {
      // Format: {student_id}:{answers}
      const colonIndex = code.indexOf(':')
      studentId = code.substring(0, colonIndex)
      studentAnswers = code.substring(colonIndex + 1).toUpperCase()
    } else {
      // Faqat student ID yoki QR code — javoblarsiz
      studentId = code
    }

    // O'quvchini topish
    let info = studentMap.current.get(studentId)
    if (!info) {
      // DB dan qidirish
      const { data } = await supabase
        .from('students')
        .select('id, first_name, last_name')
        .or(`qr_code.eq.${studentId},id.eq.${studentId}`)
        .eq('class_id', session.classId)
        .eq('is_active', true)
        .maybeSingle()

      if (!data) {
        return { studentId: '', studentName: code, time: now(), status: 'unknown' }
      }

      info = { id: data.id, name: `${data.last_name} ${data.first_name}` }
      studentMap.current.set(studentId, info)
    }

    studentId = info.id
    studentName = info.name

    // Duplikat tekshiruvi
    if (scannedIds.current.has(studentId)) {
      return {
        studentId,
        studentName,
        time: now(),
        status: 'duplicate',
      }
    }

    // Javoblarni tekshirish
    const correctAnswers = session.correctAnswers
    const totalQuestions = session.totalQuestions
    let correctCount = 0

    if (studentAnswers.length > 0) {
      for (let i = 0; i < totalQuestions; i++) {
        if (i < studentAnswers.length && studentAnswers[i] === correctAnswers[i]) {
          correctCount++
        }
      }
    }

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
    const grade = percentage >= 86 ? 5 : percentage >= 71 ? 4 : percentage >= 56 ? 3 : 2

    // Bahoni DB ga yozish
    try {
      const today = new Date().toISOString().split('T')[0]

      await supabase
        .from('grades')
        .insert({
          student_id: studentId,
          class_id: session.classId,
          subject_id: session.subjectId,
          teacher_id: user.id,
          score: correctCount,
          max_score: totalQuestions,
          percentage,
          grade_type: 'quiz' as any,
          date: today,
          comment: studentAnswers.length > 0
            ? `QR Vision: ${correctCount}/${totalQuestions} (${studentAnswers})`
            : `QR Vision: tekshirilmagan`,
        })
    } catch (e: any) {
      setError(e.message)
      return { studentId, studentName, time: now(), status: 'unknown' }
    }

    scannedIds.current.add(studentId)

    const result: QRVisionScanResult = {
      studentId,
      studentName,
      time: now(),
      status: 'success',
      correctCount,
      totalQuestions,
      score: percentage,
      grade,
      answers: studentAnswers,
    }
    setResults(prev => [result, ...prev])
    return result
  }, [user, session])

  const finishSession = useCallback(async () => {
    if (!user || !session) return null
    setLoading(true)

    try {
      const checkedCount = results.length
      const totalStudents = session.totalStudents
      const avgScore = checkedCount > 0
        ? Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / checkedCount)
        : 0

      const gradeDistribution = { 5: 0, 4: 0, 3: 0, 2: 0 }
      for (const r of results) {
        if (r.grade) {
          gradeDistribution[r.grade as keyof typeof gradeDistribution]++
        }
      }

      // Telegram xabarnoma
      try {
        const { data: { session: authSession } } = await supabase.auth.getSession()
        if (authSession?.access_token) {
          await supabase.functions.invoke('telegram-notify', {
            body: {
              className: session.className,
              subjectName: session.subjectName,
              lessonTitle: `QR Vision — Test tekshiruvi (${session.totalQuestions} savol)`,
              totalStudents,
              assessedCount: checkedCount,
              averageScore: avgScore,
              gradeDistribution,
              duration: Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000),
            },
          })
        }
      } catch {
        // Telegram yuborilmasa ham davom etamiz
      }

      const result = {
        className: session.className,
        subjectName: session.subjectName,
        checked: checkedCount,
        total: totalStudents,
        avgScore,
        gradeDistribution,
        totalQuestions: session.totalQuestions,
      }

      setSession(null)
      setResults([])
      scannedIds.current.clear()
      studentMap.current.clear()

      return result
    } catch (e: any) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, session, results])

  return {
    session,
    results,
    loading,
    error,
    startSession,
    handleScan,
    finishSession,
    checkedCount: results.length,
  }
}

function now() {
  return new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
