import { useState, useRef, useCallback } from 'react'

export interface MockStudent {
  name: string
  grade: number | null
}

export interface VoiceMobileResult {
  transcript: string
  detectedName: string | null
  detectedScore: number | null
  matchedStudentName: string | null
  confidence: number
  status: 'pending' | 'confirmed' | 'ambiguous' | 'rejected'
  candidateNames: string[]
}

// O'zbek tilidagi raqamlar lug'ati
const UZ_NUMBER_WORDS: Record<string, number> = {
  'bir': 1, 'ikki': 2, "ikki'": 2, 'uch': 3, "to'rt": 4, 'tort': 4, 'besh': 5,
  'olti': 6, 'yetti': 7, 'sakkiz': 8, "to'qqiz": 9, 'toqqiz': 9, "o'n": 10,
  'on': 10, 'yigirma': 20, 'qirq': 40, 'ellik': 50, 'oltmish': 60,
  'yetmish': 70, 'sakson': 80, 'to\'qson': 90, 'toquson': 90, 'yuz': 100,
  // Baho uchun maxsus iboralar
  'a\'lo': 5, 'alo': 5, 'yaxshi': 4, 'qoniqarli': 3, 'qoniqarsiz': 2,
  'yomon': 2, 'aʼlo': 5,
}

// O'zbek tilidagi ism o'zgarishlari (kelishiklar)
const UZ_SUFFIXES = [
  'ga', 'ni', 'ning', 'da', 'dan', 'dan', 'gа', 'ни', 'га',
]

function removeSuffixes(word: string): string {
  let result = word.toLowerCase()
  for (const suffix of UZ_SUFFIXES) {
    if (result.endsWith(suffix) && result.length > suffix.length + 2) {
      result = result.slice(0, -suffix.length)
    }
  }
  return result
}

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

function extractScore(text: string): number | null {
  // Raqam so'zlarini tekshirish (2, 3, 4, 5)
  const numMatch = text.match(/\b([2-9]|[1-9]\d)\b/)
  if (numMatch) {
    const n = parseInt(numMatch[1])
    if (n >= 2 && n <= 5) return n
    if (n >= 2 && n <= 100) return n
  }

  // O'zbek so'zlari bilan baho
  const lower = text.toLowerCase()
  for (const [word, score] of Object.entries(UZ_NUMBER_WORDS)) {
    if (lower.includes(word)) {
      if (score >= 2 && score <= 5) return score
    }
  }

  return null
}

function matchStudentName(
  text: string,
  studentNames: string[]
): { name: string; confidence: number; candidates: string[] } | null {
  const lower = text.toLowerCase()
  const words = lower.split(/\s+/).map(w => removeSuffixes(w))

  const scored: { name: string; similarity: number }[] = []

  for (const name of studentNames) {
    const parts = name.toLowerCase().split(' ')
    const firstName = parts[0] || ''
    const lastName = parts[1] || ''

    let best = 0

    // To'liq ism-familiya
    if (lower.includes(firstName) && lower.includes(lastName)) {
      best = 1.0
    }
    // Familiya bilan
    else if (lower.includes(lastName) && lastName.length > 2) {
      best = 0.9
    }
    // Ism bilan
    else if (lower.includes(firstName) && firstName.length > 2) {
      best = 0.75
    }
    // Kelishik bilan o'zgargan
    else {
      for (const word of words) {
        if (word.length < 3) continue

        // Kelishiklardan tozalangan versiyalari bilan solishtirish
        const d1 = levenshteinDistance(word, removeSuffixes(firstName))
        const d2 = levenshteinDistance(word, removeSuffixes(lastName))
        const minD = Math.min(d1, d2)
        const maxLen = Math.max(word.length, firstName.length, lastName.length)
        const sim = Math.max(0, 1 - minD / maxLen)

        // Qisman mos kelish
        if (firstName.startsWith(word) && word.length >= 3) {
          best = Math.max(best, 0.65)
        } else if (lastName.startsWith(word) && word.length >= 3) {
          best = Math.max(best, 0.7)
        } else if (sim > 0.6) {
          best = Math.max(best, sim * 0.55)
        }
      }
    }

    if (best > 0.3) {
      scored.push({ name, similarity: best })
    }
  }

  scored.sort((a, b) => b.similarity - a.similarity)

  if (scored.length === 0) return null

  const top = scored[0]

  // Bir xil ishonchlilikdagi nomzodlar
  const candidates = scored
    .filter(s => Math.abs(s.similarity - top.similarity) < 0.05 && s.name !== top.name)
    .map(s => s.name)

  return {
    name: top.name,
    confidence: top.similarity,
    candidates,
  }
}

export function useVoiceMobileGrading() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<VoiceMobileResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')

  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef('')
  const interimRef = useRef('')

  const isSupported = !!(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  )

  const startListening = useCallback((studentNames: string[]) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Bu brauzer ovoz tanishni qoʻllab-quvvatlamaydi. Chrome yoki Edge ishlating.')
      return
    }

    setError(null)
    setResult(null)
    setTranscript('')
    transcriptRef.current = ''
    interimRef.current = ''

    const recognition = new SpeechRecognition()

    // O'zbek tili birinchi, ingliz tili zaxira sifatida
    recognition.lang = 'uz-UZ'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      let finalText = ''
      let interimText = ''

      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i]
        // Bir nechta alternativalardan eng yaxshisini olish
        const bestAlternative = Array.from({ length: res.length }, (_, j) => res[j].transcript)
          .join(' ')

        if (res.isFinal) {
          finalText += res[0].transcript + ' '
        } else {
          interimText += bestAlternative + ' '
        }
      }

      transcriptRef.current = finalText.trim()
      interimRef.current = interimText.trim()
      setTranscript((finalText || interimText).trim())
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted') return
      if (event.error === 'no-speech') {
        setError('Ovoz eshitilmadi. Mikrofonga gapirib koʻring.')
      } else if (event.error === 'not-allowed') {
        setError('Mikrofonga ruxsat berilmadi. Brauzer sozlamalarini tekshiring.')
      } else if (event.error === 'network') {
        setError('Internet aloqasi yo\'q. Ovoz tanish uchun internet kerak.')
      } else {
        setError('Xato: ' + event.error)
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [])

  const stopListening = useCallback((studentNames: string[]) => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    setIsListening(false)
    setIsProcessing(true)

    // Natijalarni biroz kutish
    setTimeout(() => {
      const text = (transcriptRef.current || interimRef.current).trim()

      if (!text) {
        setError('Ovoz eshitilmadi. Mikrofonga aniqroq gapirib koʻring.')
        setIsProcessing(false)
        return
      }

      const score = extractScore(text)
      const match = matchStudentName(text, studentNames)

      const voiceResult: VoiceMobileResult = {
        transcript: text,
        detectedName: match?.name || null,
        detectedScore: score,
        matchedStudentName: match?.name || null,
        confidence: match?.confidence || 0,
        candidateNames: match?.candidates || [],
        status: !match ? 'rejected' : match.candidates.length > 0 ? 'ambiguous' : 'pending',
      }

      setResult(voiceResult)
      setIsProcessing(false)
    }, 400)
  }, [])

  const cancelResult = useCallback(() => {
    setResult(null)
    setError(null)
    setTranscript('')
    transcriptRef.current = ''
  }, [])

  return {
    isListening,
    isProcessing,
    isSupported,
    transcript,
    result,
    error,
    startListening,
    stopListening,
    cancelResult,
    setResult,
    setError,
  }
}
