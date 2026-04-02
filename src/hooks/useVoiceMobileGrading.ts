import { useState, useRef, useCallback } from 'react'

export interface VoiceMobileMultipleResult {
  transcript: string
  detectedGrades: Record<string, number>
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
  'ga', 'ni', 'ning', 'da', 'dan', 'gа', 'ни', 'га',
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
  if (!a) return b.length;
  if (!b) return a.length;
  
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

function extractScore(word: string): number | null {
  // Raqamlarni matndan ajratish
  const numMatch = word.match(/\b([2-9]|[1-9]\d)\b/)
  if (numMatch) {
    const n = parseInt(numMatch[1])
    if (n >= 2 && n <= 5) return n
    if (n >= 2 && n <= 100) return n
  }

  const lower = word.toLowerCase()
  const val = UZ_NUMBER_WORDS[lower]
  if (val && val >= 2 && val <= 5) return val

  return null
}

function matchStudentName(
  text: string,
  studentNames: string[]
): { name: string; confidence: number; candidates: string[] } | null {
  const lower = text.toLowerCase()
  const words = lower.split(/\s+/).map(w => removeSuffixes(w)).filter(Boolean)

  if (words.length === 0) return null

  const scored: { name: string; similarity: number }[] = []

  for (const name of studentNames) {
    const parts = name.toLowerCase().split(' ')
    const firstName = parts[0] || ''
    const lastName = parts[1] || ''

    let best = 0

    if (lower.includes(firstName) && lower.includes(lastName)) {
      best = 1.0
    }
    else if (lower.includes(lastName) && lastName.length > 2) {
      best = 0.95
    }
    else if (lower.includes(firstName) && firstName.length > 2) {
      best = 0.85
    }
    else {
      for (const word of words) {
        if (word.length < 3) continue

        const d1 = levenshteinDistance(word, removeSuffixes(firstName))
        const d2 = levenshteinDistance(word, removeSuffixes(lastName))
        const minD = Math.min(d1, d2)
        const maxLen = Math.max(word.length, firstName.length, lastName.length)
        const sim = Math.max(0, 1 - minD / maxLen)

        if (firstName.startsWith(word) && word.length >= 3) {
          best = Math.max(best, 0.75)
        } else if (lastName.startsWith(word) && word.length >= 3) {
          best = Math.max(best, 0.8)
        } else if (sim > 0.6) {
          best = Math.max(best, sim * 0.6)
        }
      }
    }

    if (best > 0.4) {
      scored.push({ name, similarity: best })
    }
  }

  scored.sort((a, b) => b.similarity - a.similarity)

  if (scored.length === 0) return null
  const top = scored[0]

  const candidates = scored
    .filter(s => Math.abs(s.similarity - top.similarity) < 0.05 && s.name !== top.name)
    .map(s => s.name)

  return { name: top.name, confidence: top.similarity, candidates }
}

function parseMultipleGrades(text: string, studentNames: string[]): Record<string, number> {
  const results: Record<string, number> = {}
  
  const cleanStr = text.replace(/[,.!?;:]/g, ' ')
  const words = cleanStr.split(/\s+/).filter(Boolean)

  let lastScoreIdx = -1;

  // Matnni o'qib, har bir topilgan BAXO uchun avvalgi so'zlardan o'quvchini izlaymiz
  for (let i = 0; i < words.length; i++) {
    const score = extractScore(words[i])
    if (score !== null) {
      // Baho topildi! Undan oldingi so'zlarni olamiz, lekin oldingi baho so'zidan o'tib ketmaymiz
      const startIdx = Math.max(lastScoreIdx + 1, i - 4)
      if (startIdx < i) {
        const precedingContext = words.slice(startIdx, i).join(' ')
        const match = matchStudentName(precedingContext, studentNames)
        
        if (match && match.confidence >= 0.5) {
          results[match.name] = score
        }
      }
      lastScoreIdx = i;
    }
  }

  // Yana bir marta teskari qidiruv: "Besh Karimov Jasurga" variantini ham tutib olish uchun:
  let nextScoreIdx = words.length;
  for (let i = words.length - 1; i >= 0; i--) {
    const score = extractScore(words[i])
    if (score !== null) {
      // Undan keyingi so'zlarni olamiz, lekin keyingi baho so'zidan o'tib ketmaymiz
      const endIdx = Math.min(nextScoreIdx, i + 5)
      if (endIdx > i + 1) {
        const succeedingContext = words.slice(i + 1, endIdx).join(' ')
        const match = matchStudentName(succeedingContext, studentNames)
        
        if (match && match.confidence >= 0.5 && !results[match.name]) {
          results[match.name] = score
        }
      }
      nextScoreIdx = i;
    }
  }

  return results
}

export function useVoiceMobileGrading() {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [detectedGrades, setDetectedGrades] = useState<Record<string, number>>({})

  const recognitionRef = useRef<any>(null)
  const transcriptRef = useRef('')
  const interimRef = useRef('')

  const isSupported = !!(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  )

  const startListening = useCallback((_studentNames: string[]) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Bu brauzer ovoz tanishni qoʻllab-quvvatlamaydi. Chrome yoki Edge ishlating.')
      return
    }

    setError(null)
    setTranscript('')
    setDetectedGrades({})
    
    transcriptRef.current = ''
    interimRef.current = ''

    const recognition = new SpeechRecognition()
    recognition.lang = 'uz-UZ'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      let finalText = ''
      let interimText = ''

      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i]
        if (res.isFinal) {
          finalText += res[0].transcript + ' '
        } else {
          interimText += res[0].transcript + ' '
        }
      }

      transcriptRef.current = finalText.trim()
      interimRef.current = interimText.trim()
      
      const combinedText = (finalText + ' ' + interimText).trim()
      setTranscript(combinedText)

      // Har safar matn kelganda (hatto interim bo'lsa ham), darhol massiv tuzamiz
      const parsedGrades = parseMultipleGrades(combinedText, studentNames)
      
      // Yangi baholarni eski "detectedGrades" state bilan birlashtiramiz (eng so'nggi baho ustun bo'ladi)
      setDetectedGrades(prev => {
        const next = { ...prev }
        let hasChanges = false;
        
        for (const [name, score] of Object.entries(parsedGrades)) {
          if (next[name] !== score) {
            next[name] = score
            hasChanges = true
          }
        }
        
        return hasChanges ? next : prev
      })
    }

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted') return
      if (event.error === 'no-speech') {
        setError('Ovoz eshitilmadi. Mikrofonga gapirib koʻring.')
      } else if (event.error === 'not-allowed') {
        setError('Mikrofonga ruxsat berilmadi. Brauzer sozlamalarini tekshiring.')
      } else if (event.error === 'network') {
        setError('Internet aloqasi yo\'q.')
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

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
  }, [])

  const cancelResult = useCallback(() => {
    setError(null)
    setTranscript('')
    setDetectedGrades({})
    transcriptRef.current = ''
  }, [])

  const removeGrade = useCallback((studentName: string) => {
    setDetectedGrades(prev => {
      const next = { ...prev }
      delete next[studentName]
      return next
    })
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    detectedGrades,
    error,
    startListening,
    stopListening,
    cancelResult,
    removeGrade,
    setError,
  }
}
