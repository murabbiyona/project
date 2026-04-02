import { useState, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Student } from '../types/database'

interface VoiceGradeResult {
  transcript: string
  detectedName: string | null
  detectedScore: number | null
  matchedStudent: Student | null
  candidateStudents: Student[]
  confidence: number
  status: 'pending' | 'confirmed' | 'ambiguous' | 'rejected'
}

export function useVoiceGrading(classId: string, subjectId: string) {
  const { user } = useAuth()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<VoiceGradeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const speechRecognitionRef = useRef<any>(null)
  const speechTranscriptRef = useRef<string>('')

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setResult(null)
      speechTranscriptRef.current = ''

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (!SpeechRecognition) {
        setError('Brauzer ovoz tanishni qo\'llab-quvvatlamaydi. Chrome yoki Edge brauzerdan foydalaning.')
        return
      }

      const recognition = new SpeechRecognition()
      recognition.lang = 'uz-UZ'
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onresult = (event: any) => {
        let fullTranscript = ''
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' '
        }
        speechTranscriptRef.current = fullTranscript.trim()
      }

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setError('Mikrofonga ruxsat berilmadi. Brauzer sozlamalaridan mikrofonga ruxsat bering.')
          setIsRecording(false)
        } else if (event.error === 'no-speech') {
          // Ovoz eshitilmasa davom etamiz, foydalanuvchi to'xtatganda xabar beramiz
        } else if (event.error !== 'aborted') {
          setError('Ovoz tanish xatosi: ' + event.error)
          setIsRecording(false)
        }
      }

      recognition.onend = () => {
        // Agar foydalanuvchi to'xtatmagan bo'lsa, qayta ishga tushiramiz
        if (speechRecognitionRef.current && isRecording) {
          try {
            recognition.start()
          } catch (_) {
            // Ignore — already stopped
          }
        }
      }

      speechRecognitionRef.current = recognition
      recognition.start()
      setIsRecording(true)
    } catch (err) {
      setError('Mikrofonga ruxsat berilmadi')
    }
  }, [isRecording])

  const stopRecording = useCallback(async (students: Student[]) => {
    // Web Speech API to'xtatish
    const recognition = speechRecognitionRef.current
    speechRecognitionRef.current = null

    if (recognition) {
      try {
        recognition.stop()
      } catch (_) {
        // Ignore
      }
    }

    setIsRecording(false)
    setIsProcessing(true)

    // Kichik kutish — oxirgi natija kelishi uchun
    await new Promise(r => setTimeout(r, 500))

    const transcript = speechTranscriptRef.current
    if (!transcript) {
      setError('Ovoz eshitilmadi. Aniqroq gapiring va qaytadan urinib ko\'ring.')
      setIsProcessing(false)
      return null
    }

    const voiceResult = parseTranscript(transcript, students)
    setIsProcessing(false)
    setResult(voiceResult)
    return voiceResult
  }, [])

  function parseTranscript(transcript: string, students: Student[]): VoiceGradeResult {
    const text = transcript.toLowerCase().trim()

    // Raqamlarni topish (baho) — o'zbekcha so'zlar ham tekshiriladi
    const uzbekNumbers: Record<string, number> = {
      'bir': 1, 'ikki': 2, 'uch': 3, 'to\'rt': 4, 'tort': 4, 'besh': 5,
      'olti': 6, 'yetti': 7, 'sakkiz': 8, 'to\'qqiz': 9, 'toqqiz': 9, 'o\'n': 10, 'on': 10,
      'yigirma': 20, 'o\'ttiz': 30, 'ottiz': 30, 'qirq': 40, 'ellik': 50,
      'oltmish': 60, 'yetmish': 70, 'sakson': 80, 'to\'qson': 90, 'toqson': 90, 'yuz': 100,
    }

    let detectedScore: number | null = null

    // Raqamlarni tekshirish
    const numberMatch = text.match(/(\d+)/g)
    if (numberMatch) {
      detectedScore = parseInt(numberMatch[numberMatch.length - 1])
    }

    // O'zbekcha raqamlarni tekshirish
    if (!detectedScore) {
      for (const [word, num] of Object.entries(uzbekNumbers)) {
        if (text.includes(word)) {
          detectedScore = num
          break
        }
      }
    }

    // Ismni topish — har bir talaba ismini tekshirish
    const candidates: { student: Student; similarity: number }[] = []

    for (const student of students) {
      const firstName = student.first_name.toLowerCase()
      const lastName = student.last_name.toLowerCase()
      const fullName = `${firstName} ${lastName}`

      let similarity = 0

      // To'liq ism-familiya
      if (text.includes(fullName)) {
        similarity = 1.0
      }
      // Familiya
      else if (text.includes(lastName)) {
        similarity = 0.9
      }
      // Ism
      else if (text.includes(firstName)) {
        similarity = 0.7
      }
      // Fuzzy matching — Levenshtein distance based
      else {
        const words = text.replace(/\d+/g, '').trim().split(/\s+/)
        for (const word of words) {
          if (word.length < 3) continue
          const dist1 = levenshteinDistance(word, firstName)
          const dist2 = levenshteinDistance(word, lastName)
          const minDist = Math.min(dist1, dist2)
          const maxLen = Math.max(word.length, firstName.length, lastName.length)
          const sim = 1 - minDist / maxLen
          if (sim > 0.6 && sim > similarity) {
            similarity = sim * 0.6 // Lower confidence for fuzzy matches
          }
        }
      }

      if (similarity > 0.3) {
        candidates.push({ student, similarity })
      }
    }

    candidates.sort((a, b) => b.similarity - a.similarity)

    const detectedName = candidates.length > 0
      ? `${candidates[0].student.first_name} ${candidates[0].student.last_name}`
      : null

    // Bir xil ismlilarni tekshirish
    const topMatch = candidates[0]
    const ambiguous = candidates.filter(c =>
      c.student.first_name.toLowerCase() === topMatch?.student.first_name.toLowerCase()
      && c.student.id !== topMatch?.student.id
    )

    const status = !topMatch
      ? 'rejected' as const
      : ambiguous.length > 0
        ? 'ambiguous' as const
        : topMatch.similarity >= 0.8
          ? 'pending' as const
          : 'pending' as const

    return {
      transcript,
      detectedName,
      detectedScore,
      matchedStudent: topMatch?.student || null,
      candidateStudents: ambiguous.length > 0
        ? [topMatch.student, ...ambiguous.map(a => a.student)]
        : [],
      confidence: topMatch?.similarity || 0,
      status,
    }
  }

  async function confirmVoiceGrade(
    student: Student,
    score: number,
    gradeType: 'formative' | 'summative' | 'daily' = 'formative'
  ) {
    if (!user) return { error: 'Foydalanuvchi topilmadi' }

    // Bazaga baho qo'shish
    const { data: gradeData, error: gradeErr } = await supabase
      .from('grades')
      .insert({
        student_id: student.id,
        class_id: classId,
        subject_id: subjectId,
        teacher_id: user.id,
        score,
        max_score: 100,
        percentage: score,
        grade_type: gradeType,
        academic_year: '2025-2026',
      } as any)
      .select()
      .single()

    if (gradeErr) return { error: gradeErr.message }

    // Ovozli baho yozuvini saqlash
    if (result) {
      await supabase.from('voice_grades').insert({
        teacher_id: user.id,
        class_id: classId,
        subject_id: subjectId,
        transcript: result.transcript,
        detected_student_name: result.detectedName,
        detected_score: result.detectedScore,
        student_id: student.id,
        grade_id: (gradeData as any)?.id,
        confidence: result.confidence,
        status: 'confirmed',
      } as any)
    }

    setResult(null)
    return { data: gradeData, error: null }
  }

  function cancelVoiceGrade() {
    setResult(null)
    setError(null)
  }

  return {
    isRecording,
    isProcessing,
    result,
    error,
    startRecording,
    stopRecording,
    confirmVoiceGrade,
    cancelVoiceGrade,
  }
}

// Levenshtein distance
function levenshteinDistance(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}
