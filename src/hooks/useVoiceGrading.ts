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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setResult(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      setError('Mikrofonga ruxsat berilmadi')
    }
  }, [])

  const stopRecording = useCallback(async (students: Student[]) => {
    if (!mediaRecorderRef.current) return

    return new Promise<VoiceGradeResult | null>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        setIsRecording(false)
        setIsProcessing(true)

        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const result = await processAudio(audioBlob, students)

        // Stop all tracks
        mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop())

        setIsProcessing(false)
        setResult(result)
        resolve(result)
      }
      mediaRecorderRef.current!.stop()
    })
  }, [])

  async function processAudio(audioBlob: Blob, students: Student[]): Promise<VoiceGradeResult> {
    try {
      // Whisper API orqali transkripsiya
      const formData = new FormData()
      formData.append('file', audioBlob, 'voice.webm')
      formData.append('model', 'whisper-1')
      formData.append('language', 'uz')

      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: formData,
      })

      if (!whisperResponse.ok) {
        throw new Error('Whisper API xatosi')
      }

      const { text: transcript } = await whisperResponse.json()

      // Transkripsiyadan ism va baho ajratib olish
      const parsed = parseTranscript(transcript, students)

      return parsed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi')
      return {
        transcript: '',
        detectedName: null,
        detectedScore: null,
        matchedStudent: null,
        candidateStudents: [],
        confidence: 0,
        status: 'rejected',
      }
    }
  }

  function parseTranscript(transcript: string, students: Student[]): VoiceGradeResult {
    const text = transcript.toLowerCase().trim()

    // Raqamlarni topish (baho)
    const numberMatch = text.match(/(\d+)/g)
    const detectedScore = numberMatch ? parseInt(numberMatch[numberMatch.length - 1]) : null

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
