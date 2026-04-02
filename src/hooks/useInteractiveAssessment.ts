import { useState, useCallback, useRef, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export type McqChoice = 'A' | 'B' | 'C' | 'D'

export interface McqQuestion {
  id: string
  text: string
  options: [string, string, string, string]
  correct: McqChoice
}

export type ScanParseResult =
  | { ok: true; studentId: string; studentName: string; answer: McqChoice | null }
  | { ok: false; reason: 'unknown_qr' | 'unknown_student'; raw: string }

function parseAnswerFromPayload(text: string): McqChoice | null {
  const u = text.trim().toUpperCase()
  if (u.length === 1 && 'ABCD'.includes(u)) return u as McqChoice
  return null
}

/** QR ichida javob bo'lsa ajratib oladi: URL ?a=A, "id|A", "id:A" */
export function parseMcqScanPayload(text: string): { studentKey: string; answer: McqChoice | null } | null {
  const raw = text.trim()
  if (!raw) return null

  try {
    const url = new URL(raw)
    const s =
      url.searchParams.get('s') ||
      url.searchParams.get('student') ||
      url.searchParams.get('id') ||
      ''
    const a = (url.searchParams.get('a') || url.searchParams.get('answer') || '')?.toUpperCase()
    if (s && a && 'ABCD'.includes(a)) return { studentKey: s, answer: a as McqChoice }
    if (s) return { studentKey: s, answer: a && 'ABCD'.includes(a) ? (a as McqChoice) : null }
  } catch {
    /* not a URL */
  }

  const pipe = raw.split('|').map(p => p.trim())
  if (pipe.length >= 2) {
    const letter = pipe.find(p => p.length === 1 && 'ABCD'.includes(p.toUpperCase()))
    const idPart = pipe.find(p => p !== letter)
    if (idPart) {
      return {
        studentKey: idPart,
        answer: letter ? (letter.toUpperCase() as McqChoice) : null,
      }
    }
  }

  const m = raw.match(/^(.+?)[:;]([ABCD])$/i)
  if (m) return { studentKey: m[1].trim(), answer: m[2].toUpperCase() as McqChoice }

  return { studentKey: raw, answer: null }
}

export function useInteractiveAssessment() {
  const { user } = useAuth()
  const qrStudentMap = useRef<Map<string, { id: string; name: string }>>(new Map())
  const scannedThisQuestion = useRef<Set<string>>(new Set())

  const [classId, setClassId] = useState<string | null>(null)
  const [className, setClassName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [questions, setQuestions] = useState<McqQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  /** Savol bo'yicha to'g'ri javoblar soni */
  const [correctByStudent, setCorrectByStudent] = useState<Record<string, number>>({})
  const [wrongByStudent, setWrongByStudent] = useState<Record<string, number>>({})

  const [lastScan, setLastScan] = useState<ScanParseResult | null>(null)
  const [lastOutcome, setLastOutcome] = useState<'correct' | 'wrong' | 'duplicate' | null>(null)
  const [studentNames, setStudentNames] = useState<Record<string, string>>({})

  const currentQuestion = questions[currentIndex] ?? null
  const totalQuestions = questions.length

  const pointsPerCorrect = useMemo(() => {
    if (totalQuestions <= 0) return 0
    return Math.max(1, Math.round(100 / totalQuestions))
  }, [totalQuestions])

  const loadClassRoster = useCallback(async (cid: string, cname: string) => {
    if (!user) return
    setLoading(true)
    setError(null)
    qrStudentMap.current.clear()
    try {
      const { data: students, error: err } = await supabase
        .from('students')
        .select('id, first_name, last_name, qr_code')
        .eq('class_id', cid)
        .eq('is_active', true)
        .order('last_name')

      if (err) throw new Error(err.message)

      const names: Record<string, string> = {}
      for (const s of students || []) {
        const name = `${s.last_name} ${s.first_name}`
        names[s.id] = name
        const qr = s.qr_code || s.id
        qrStudentMap.current.set(qr, { id: s.id, name })
        if (s.qr_code && s.qr_code !== s.id) {
          qrStudentMap.current.set(s.id, { id: s.id, name })
        }
      }

      setStudentNames(names)
      setClassId(cid)
      setClassName(cname)
      setCorrectByStudent({})
      setWrongByStudent({})
      setCurrentIndex(0)
      setQuestions([])
      scannedThisQuestion.current.clear()
      setLastScan(null)
      setLastOutcome(null)
    } catch (e: any) {
      setError(e?.message || 'Ro\'yxatni yuklashda xatolik')
    } finally {
      setLoading(false)
    }
  }, [user])

  const resolveStudent = useCallback((key: string): { id: string; name: string } | null => {
    const direct = qrStudentMap.current.get(key)
    if (direct) return direct
    for (const [, v] of qrStudentMap.current) {
      if (v.id === key) return v
    }
    return null
  }, [])

  const parseScan = useCallback(
    (decodedText: string): ScanParseResult => {
      const parsed = parseMcqScanPayload(decodedText)
      if (!parsed) return { ok: false, reason: 'unknown_qr', raw: decodedText }

      const student = resolveStudent(parsed.studentKey)
      if (!student) return { ok: false, reason: 'unknown_student', raw: decodedText }

      let answer = parsed.answer
      if (!answer) {
        const tail = parsed.studentKey !== decodedText.trim() ? null : parseAnswerFromPayload(decodedText)
        answer = tail
      }

      return {
        ok: true,
        studentId: student.id,
        studentName: student.name,
        answer,
      }
    },
    [resolveStudent],
  )

  const setQuestionDraft = useCallback((index: number, field: keyof McqQuestion, value: string) => {
    setQuestions(prev => {
      const next = [...prev]
      const q = next[index]
      if (!q) return prev
      if (field === 'correct') {
        const c = value.toUpperCase()
        if ('ABCD'.includes(c)) next[index] = { ...q, correct: c as McqChoice }
      } else if (field === 'text') {
        next[index] = { ...q, text: value }
      }
      return next
    })
  }, [])

  const setOptionDraft = useCallback((qIndex: number, optIndex: number, value: string) => {
    setQuestions(prev => {
      const next = [...prev]
      const q = next[qIndex]
      if (!q) return prev
      const opts = [...q.options] as [string, string, string, string]
      opts[optIndex] = value
      next[qIndex] = { ...q, options: opts }
      return next
    })
  }, [])

  const addEmptyQuestion = useCallback(() => {
    const id = `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    setQuestions(prev => [
      ...prev,
      {
        id,
        text: '',
        options: ['', '', '', ''],
        correct: 'A',
      },
    ])
  }, [])

  const removeQuestion = useCallback((index: number) => {
    setQuestions(prev => {
      const next = prev.filter((_, i) => i !== index)
      setCurrentIndex(i => Math.min(i, Math.max(0, next.length - 1)))
      return next
    })
  }, [])

  const goNextQuestion = useCallback(() => {
    scannedThisQuestion.current.clear()
    setLastScan(null)
    setLastOutcome(null)
    setCurrentIndex(i => Math.min(i + 1, Math.max(0, questions.length - 1)))
  }, [questions.length])

  const goPrevQuestion = useCallback(() => {
    scannedThisQuestion.current.clear()
    setLastScan(null)
    setLastOutcome(null)
    setCurrentIndex(i => Math.max(0, i - 1))
  }, [])

  /**
   * Javobni qayd qilish — to'g'ri bo'lsa onCorrect callback chaqiriladi (ball qo'shish uchun)
   */
  const recordAnswer = useCallback(
    (
      studentId: string,
      studentName: string,
      choice: McqChoice,
      onCorrect: (points: number) => void,
    ): 'correct' | 'wrong' | 'duplicate' | null => {
      const q = questions[currentIndex]
      if (!q) return null

      if (scannedThisQuestion.current.has(studentId)) {
        setLastScan({ ok: true, studentId, studentName, answer: choice })
        setLastOutcome('duplicate')
        return 'duplicate'
      }

      scannedThisQuestion.current.add(studentId)
      const isCorrect = choice === q.correct

      if (isCorrect) {
        setCorrectByStudent(prev => ({ ...prev, [studentId]: (prev[studentId] || 0) + 1 }))
        onCorrect(pointsPerCorrect)
        setLastOutcome('correct')
      } else {
        setWrongByStudent(prev => ({ ...prev, [studentId]: (prev[studentId] || 0) + 1 }))
        setLastOutcome('wrong')
      }

      setLastScan({ ok: true, studentId, studentName, answer: choice })
      return isCorrect ? 'correct' : 'wrong'
    },
    [questions, currentIndex, pointsPerCorrect],
  )

  const resetSession = useCallback(() => {
    setClassId(null)
    setClassName('')
    setQuestions([])
    setCurrentIndex(0)
    setCorrectByStudent({})
    setWrongByStudent({})
    setStudentNames({})
    scannedThisQuestion.current.clear()
    qrStudentMap.current.clear()
    setLastScan(null)
    setLastOutcome(null)
  }, [])

  const leaderboard = useMemo(() => {
    const ids = new Set([
      ...Object.keys(correctByStudent),
      ...Object.keys(wrongByStudent),
    ])
    const list = Array.from(ids).map(id => {
      const c = correctByStudent[id] || 0
      const w = wrongByStudent[id] || 0
      return {
        studentId: id,
        studentName: studentNames[id] || id,
        correct: c,
        wrong: w,
        score: c * pointsPerCorrect,
      }
    })
    list.sort((a, b) => b.score - a.score || b.correct - a.correct)
    return list
  }, [correctByStudent, wrongByStudent, pointsPerCorrect, studentNames])

  return {
    classId,
    className,
    loading,
    error,
    setError,
    questions,
    setQuestions,
    currentIndex,
    currentQuestion,
    totalQuestions,
    pointsPerCorrect,
    loadClassRoster,
    parseScan,
    recordAnswer,
    lastScan,
    lastOutcome,
    setLastScan,
    setLastOutcome,
    addEmptyQuestion,
    removeQuestion,
    setQuestionDraft,
    setOptionDraft,
    goNextQuestion,
    goPrevQuestion,
    resetSession,
    correctByStudent,
    wrongByStudent,
    leaderboard,
    rosterSize: Object.keys(studentNames).length,
  }
}
