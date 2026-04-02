import { useState, useEffect, useRef, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import {
  Camera,
  CameraOff,
  CheckCircle,
  AlertCircle,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  ScanLine,
  PartyPopper,
  XCircle,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useAssessment } from '../../hooks/useAssessment'
import {
  useInteractiveAssessment,
  type McqChoice,
} from '../../hooks/useInteractiveAssessment'

const LETTERS: McqChoice[] = ['A', 'B', 'C', 'D']

export default function MobileInteractiveAssessment() {
  const { user } = useAuth()
  const {
    startSession,
    endSession,
    activeSession,
    addScore,
    stats,
    loading: assessmentLoading,
    error: assessmentError,
  } = useAssessment()

  const ia = useInteractiveAssessment()

  const [phase, setPhase] = useState<'setup' | 'build' | 'live' | 'done'>('setup')
  const [title, setTitle] = useState('Interaktiv test')
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([])
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')

  const [isScanning, setIsScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [pendingStudent, setPendingStudent] = useState<{
    id: string
    name: string
  } | null>(null)

  const scannerRef = useRef<Html5Qrcode | null>(null)
  const processingRef = useRef(false)
  const sessionResultRef = useRef<Awaited<ReturnType<typeof endSession>> | null>(null)

  useEffect(() => {
    if (!user) return
    ;(async () => {
      const { data: assignments } = await supabase
        .from('teacher_assignments')
        .select('class_id, subject_id, classes:class_id(id, name), subjects:subject_id(id, name_uz)')
        .eq('teacher_id', user.id)

      if (assignments && assignments.length > 0) {
        const classMap = new Map<string, string>()
        const subjectMap = new Map<string, string>()
        for (const a of assignments) {
          const cls = a.classes as unknown
          const subj = a.subjects as unknown
          const c = Array.isArray(cls) ? cls[0] : cls
          const s = Array.isArray(subj) ? subj[0] : subj
          if (c && typeof c === 'object' && 'id' in c && 'name' in c) {
            classMap.set(String((c as { id: string; name: string }).id), (c as { id: string; name: string }).name)
          }
          if (s && typeof s === 'object' && 'id' in s && 'name_uz' in s) {
            subjectMap.set(
              String((s as { id: string; name_uz: string }).id),
              (s as { id: string; name_uz: string }).name_uz,
            )
          }
        }
        setClasses(Array.from(classMap, ([id, name]) => ({ id, name })))
        setSubjects(Array.from(subjectMap, ([id, name]) => ({ id, name })))
      } else {
        const { data: allClasses } = await supabase
          .from('classes')
          .select('id, name')
          .eq('is_active', true)
          .order('name')
        setClasses((allClasses || []).map(c => ({ id: c.id, name: c.name })))

        const { data: allSubjects } = await supabase
          .from('subjects')
          .select('id, name_uz')
          .order('name_uz')
        setSubjects((allSubjects || []).map(s => ({ id: s.id, name: s.name_uz })))
      }
    })()
  }, [user])

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch {
        /* */
      }
      scannerRef.current = null
    }
    setIsScanning(false)
  }, [])

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {})
    }
  }, [])

  const playBeep = useCallback((type: 'success' | 'error') => {
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = type === 'success' ? 880 : 320
      gain.gain.value = 0.25
      osc.start()
      osc.stop(ctx.currentTime + (type === 'success' ? 0.12 : 0.25))
    } catch {
      /* */
    }
  }, [])

  const onQRDetected = useCallback(
    async (decodedText: string) => {
      if (processingRef.current || phase !== 'live') return
      processingRef.current = true
      try {
        const parsed = ia.parseScan(decodedText)
        ia.setLastScan(parsed)
        if (!parsed.ok) {
          playBeep('error')
          if (navigator.vibrate) navigator.vibrate([120, 60, 120])
          ia.setLastOutcome(null)
          return
        }

        if (parsed.answer) {
          const out = ia.recordAnswer(parsed.studentId, parsed.studentName, parsed.answer, pts =>
            addScore(parsed.studentId, pts, `MCQ ${ia.currentIndex + 1}: ${parsed.answer}`),
          )
          setPendingStudent(null)
          if (out === 'correct') {
            playBeep('success')
            if (navigator.vibrate) navigator.vibrate(80)
          } else if (out === 'wrong') {
            playBeep('error')
            if (navigator.vibrate) navigator.vibrate([80, 40, 80])
          } else if (out === 'duplicate') {
            playBeep('error')
            if (navigator.vibrate) navigator.vibrate([100, 50, 100])
          }
          return
        }

        setPendingStudent({ id: parsed.studentId, name: parsed.studentName })
        playBeep('success')
        if (navigator.vibrate) navigator.vibrate(50)
      } finally {
        setTimeout(() => {
          processingRef.current = false
        }, 600)
      }
    },
    [phase, ia, playBeep, addScore],
  )

  const startScanner = useCallback(async () => {
    setCameraError(null)
    try {
      const scanner = new Html5Qrcode('ia-qr-reader')
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 8, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
        onQRDetected,
        () => {},
      )
      setIsScanning(true)
    } catch (err: unknown) {
      setCameraError((err as Error)?.message || 'Kamera ochilmadi')
    }
  }, [onQRDetected])

  const handleStartFlow = async () => {
    if (!selectedClass || !selectedSubject || !title.trim()) return
    const cls = classes.find(c => c.id === selectedClass)
    const subj = subjects.find(s => s.id === selectedSubject)
    if (!cls || !subj) return

    try {
      await ia.loadClassRoster(cls.id, cls.name)
      await startSession({
        classId: cls.id,
        subjectId: subj.id,
        title: title.trim(),
        totalPoints: 100,
        method: 'live_kahoot',
        assessmentType: 'quiz',
      })
      ia.addEmptyQuestion()
      setPhase('build')
    } catch {
      /* errors surface via hooks */
    }
  }

  const handleBeginLive = () => {
    const valid = ia.questions.some(
      q => q.text.trim() && q.options.every(o => o.trim()),
    )
    if (!valid) {
      ia.setError('Kamida bitta to\'liq savol kiriting (matn va 4 variant)')
      return
    }
    ia.setError(null)
    setPhase('live')
    setPendingStudent(null)
    ia.setLastScan(null)
    ia.setLastOutcome(null)
  }

  const pickAnswerForPending = (choice: McqChoice) => {
    if (!pendingStudent) return
    const out = ia.recordAnswer(pendingStudent.id, pendingStudent.name, choice, pts =>
      addScore(pendingStudent.id, pts, `MCQ ${ia.currentIndex + 1}: ${choice}`),
    )
    setPendingStudent(null)
    if (out === 'correct') {
      playBeep('success')
      if (navigator.vibrate) navigator.vibrate(80)
    } else if (out === 'wrong') {
      playBeep('error')
      if (navigator.vibrate) navigator.vibrate([80, 40, 80])
    } else if (out === 'duplicate') {
      playBeep('error')
      if (navigator.vibrate) navigator.vibrate([100, 50, 100])
    }
  }

  const handleFinish = async () => {
    await stopScanner()
    try {
      const result = await endSession()
      sessionResultRef.current = result
    } catch {
      sessionResultRef.current = null
    }
    setPhase('done')
  }

  const handleNewSession = () => {
    sessionResultRef.current = null
    ia.resetSession()
    setPhase('setup')
    setTitle('Interaktiv test')
    setPendingStudent(null)
  }

  // ─── Yakunlangan ─────────────────────────────────────────
  if (phase === 'done') {
    const r = sessionResultRef.current
    return (
      <div className="space-y-5 text-center pt-4">
        <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto">
          <PartyPopper className="w-10 h-10 text-violet-600" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900">Test yakunlandi</h1>
        {r && (
          <div className="bg-white rounded-2xl p-4 shadow-sm text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Baholangan</span>
              <span className="font-semibold">{r.assessedCount} / {r.totalStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">O\'rtacha ball</span>
              <span className="font-semibold">{r.averageScore}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Saqlangan yozuvlar</span>
              <span className="font-semibold text-emerald-600">{r.saved}</span>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl p-4 shadow-sm text-left max-h-64 overflow-y-auto">
          <h2 className="text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Reyting
          </h2>
          {ia.leaderboard.length === 0 ? (
            <p className="text-xs text-zinc-400">Javoblar qayd etilmagan</p>
          ) : (
            <ul className="space-y-2">
              {ia.leaderboard.slice(0, 15).map((row, i) => (
                <li
                  key={row.studentId}
                  className="flex items-center justify-between text-sm py-1.5 border-b border-zinc-50 last:border-0"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="truncate font-medium">{row.studentName}</span>
                  </span>
                  <span className="text-violet-600 font-bold flex-shrink-0">{row.score} ball</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleNewSession}
          className="w-full h-12 bg-zinc-900 text-white font-semibold rounded-xl"
        >
          Yangi test
        </button>
      </div>
    )
  }

  // ─── Live skan ───────────────────────────────────────────
  if (phase === 'live' && activeSession) {
    const q = ia.currentQuestion
    const idx = ia.currentIndex
    const total = ia.totalQuestions

    return (
      <div className="space-y-4 pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-base font-bold text-zinc-900 truncate">{activeSession.title}</h1>
            <p className="text-xs text-zinc-500">
              Savol {idx + 1} / {total} · {ia.className}
            </p>
          </div>
          <div className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-lg flex-shrink-0">
            {stats.assessedCount}/{stats.totalStudents} javob
          </div>
        </div>

        {q && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 mb-1">
              Doskada / proyektorda ko\'rsating
            </p>
            <p className="text-sm font-semibold text-zinc-900 leading-snug">{q.text}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {LETTERS.map((L, i) => (
                <div
                  key={L}
                  className="rounded-xl bg-zinc-50 px-3 py-2 text-xs border border-zinc-100"
                >
                  <span className="font-bold text-violet-600">{L}.</span>{' '}
                  <span className="text-zinc-700">{q.options[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              void stopScanner()
              ia.goPrevQuestion()
              setPendingStudent(null)
            }}
            disabled={idx <= 0}
            className="flex-1 h-11 rounded-xl border border-zinc-200 bg-white text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Oldingi
          </button>
          <button
            type="button"
            onClick={() => {
              void stopScanner()
              ia.goNextQuestion()
              setPendingStudent(null)
            }}
            disabled={idx >= total - 1}
            className="flex-1 h-11 rounded-xl border border-zinc-200 bg-white text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-40"
          >
            Keyingi <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {ia.error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{ia.error}</div>
        )}

        <div className="bg-zinc-900 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800">
            <ScanLine className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-zinc-300">QR skan — keyin javob tugmasi</span>
          </div>
          <div id="ia-qr-reader" className={isScanning ? '' : 'hidden'} />
          {!isScanning && (
            <div className="flex flex-col items-center justify-center p-6 gap-3" style={{ minHeight: 200 }}>
              <Camera className="w-10 h-10 text-zinc-500" />
              <p className="text-zinc-400 text-xs text-center px-4">
                O\'quvchi kartasini skanerlang. QR faqat ism bo\'lsa, pastdagi A–D tugmalaridan to\'g\'ri javobni
                bosing.
              </p>
            </div>
          )}
          {cameraError && (
            <div className="p-2 text-xs text-red-300 flex items-center gap-2 px-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {cameraError}
            </div>
          )}
          <div className="p-3">
            <button
              type="button"
              onClick={() => (isScanning ? void stopScanner() : void startScanner())}
              className={`w-full h-11 font-semibold rounded-xl flex items-center justify-center gap-2 ${
                isScanning ? 'bg-red-500 text-white' : 'bg-violet-500 text-white'
              }`}
            >
              {isScanning ? (
                <>
                  <CameraOff className="w-5 h-5" /> To\'xtatish
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5" /> Kamerani yoqish
                </>
              )}
            </button>
          </div>
        </div>

        {pendingStudent && (
          <div className="space-y-2">
            <p className="text-xs text-center text-zinc-600">
              <span className="font-semibold text-zinc-900">{pendingStudent.name}</span> — qaysi tomonda?
            </p>
            <div className="grid grid-cols-4 gap-2">
              {LETTERS.map(L => (
                <button
                  key={L}
                  type="button"
                  onClick={() => pickAnswerForPending(L)}
                  className="h-14 rounded-xl bg-white border-2 border-zinc-200 font-bold text-lg text-violet-600 active:scale-95 shadow-sm"
                >
                  {L}
                </button>
              ))}
            </div>
          </div>
        )}

        {ia.lastScan && ia.lastScan.ok && (
          <div
            className={`p-3 rounded-xl flex items-center gap-3 ${
              ia.lastOutcome === 'correct'
                ? 'bg-emerald-50'
                : ia.lastOutcome === 'wrong'
                  ? 'bg-red-50'
                  : ia.lastOutcome === 'duplicate'
                    ? 'bg-amber-50'
                    : 'bg-zinc-50'
            }`}
          >
            {ia.lastOutcome === 'correct' ? (
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            ) : ia.lastOutcome === 'wrong' ? (
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
            )}
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium text-zinc-900 truncate">{ia.lastScan.studentName}</p>
              <p className="text-xs text-zinc-500">
                {ia.lastOutcome === 'correct' && 'To\'g\'ri ✓'}
                {ia.lastOutcome === 'wrong' &&
                  `Noto'g'ri (to'g'ri: ${ia.currentQuestion?.correct})`}
                {ia.lastOutcome === 'duplicate' && 'Bu savolga allaqachon javob'}
                {ia.lastScan.answer && ` · Tanlangan: ${ia.lastScan.answer}`}
              </p>
            </div>
          </div>
        )}

        {ia.lastScan && !ia.lastScan.ok && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {ia.lastScan.reason === 'unknown_student'
              ? 'Bu QR sinfdagi o\'quvchiga mos kelmaydi'
              : 'QR o\'qilmadi yoki noto\'g\'ri format'}
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleFinish()}
          disabled={assessmentLoading}
          className="w-full h-12 bg-zinc-900 text-white font-semibold rounded-xl disabled:opacity-50"
        >
          {assessmentLoading ? 'Saqlanmoqda...' : 'Testni yakunlash va baholarni saqlash'}
        </button>
        {assessmentError && <p className="text-xs text-red-500 text-center">{assessmentError}</p>}
      </div>
    )
  }

  // ─── Test tuzish ─────────────────────────────────────────
  if (phase === 'build') {
    return (
      <div className="space-y-4 pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Testni tuzish</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {ia.className} · {ia.rosterSize} o\'quvchi
          </p>
        </div>

        <button
          type="button"
          onClick={() => ia.addEmptyQuestion()}
          className="w-full h-11 border-2 border-dashed border-violet-300 rounded-xl text-violet-600 font-medium flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Savol qo\'shish
        </button>

        <div className="space-y-4">
          {ia.questions.map((q, qi) => (
            <div key={q.id} className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-600">Savol {qi + 1}</span>
                {ia.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => ia.removeQuestion(qi)}
                    className="p-1.5 text-red-500 rounded-lg hover:bg-red-50"
                    aria-label="O\'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <textarea
                value={q.text}
                onChange={e => ia.setQuestionDraft(qi, 'text', e.target.value)}
                placeholder="Savol matni..."
                rows={2}
                className="w-full text-sm border border-zinc-200 rounded-xl px-3 py-2 resize-none focus:ring-2 focus:ring-violet-500 outline-none"
              />
              <div className="space-y-2">
                {LETTERS.map((L, oi) => (
                  <div key={L} className="flex items-center gap-2">
                    <span className="w-6 text-xs font-bold text-zinc-400">{L}</span>
                    <input
                      value={q.options[oi]}
                      onChange={e => ia.setOptionDraft(qi, oi, e.target.value)}
                      placeholder={`Variant ${L}`}
                      className="flex-1 text-sm border border-zinc-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-violet-500 outline-none"
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-500">To\'g\'ri javob:</span>
                {LETTERS.map(L => (
                  <button
                    key={L}
                    type="button"
                    onClick={() => ia.setQuestionDraft(qi, 'correct', L)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold ${
                      q.correct === L
                        ? 'bg-violet-500 text-white'
                        : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {L}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {ia.error && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl">{ia.error}</div>
        )}

        <button
          type="button"
          onClick={handleBeginLive}
          className="w-full h-14 bg-violet-500 text-white font-bold rounded-2xl shadow-lg shadow-violet-200"
        >
          Skanerlashni boshlash
        </button>
      </div>
    )
  }

  // ─── Boshlang\'ich sozlash ───────────────────────────────
  return (
    <div className="space-y-5">
      <div className="text-center pt-2">
        <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <ScanLine className="w-8 h-8 text-violet-600" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900">Interaktiv baholash</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Plickers uslubi: QR + A/B/C/D. Doskada savolni ko\'rsating, kamera bilan o\'qing.
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700">Test nomi</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="mt-1 w-full h-11 border border-zinc-200 rounded-xl px-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700">Sinf</label>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mt-2">
          {classes.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedClass(c.id)}
              className={`flex-shrink-0 h-11 px-4 rounded-xl text-sm font-semibold ${
                selectedClass === c.id
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-200'
                  : 'bg-white text-zinc-600 border border-zinc-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-700">Fan</label>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mt-2">
          {subjects.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSubject(s.id)}
              className={`flex-shrink-0 h-11 px-4 rounded-xl text-sm font-semibold ${
                selectedSubject === s.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-zinc-600 border border-zinc-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handleStartFlow()}
        disabled={!selectedClass || !selectedSubject || !title.trim() || ia.loading || assessmentLoading}
        className="w-full h-14 bg-violet-500 text-white font-bold rounded-2xl disabled:opacity-40"
      >
        {ia.loading || assessmentLoading ? 'Yuklanmoqda...' : 'Davom etish'}
      </button>

      <div className="bg-zinc-50 rounded-2xl p-4 space-y-2 text-xs text-zinc-600">
        <p className="font-semibold text-zinc-800">Qanday ishlaydi?</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>O\'quvchilar kartasining turli tomonlari A, B, C, D ni bildiradi.</li>
          <li>QR kod odatda o\'quvchini aniqlaydi; javobni siz A–D tugmalaridan belgilaysiz.</li>
          <li>Agar QR ichida javob bo\'lsa (masalan URL ?a=B), u avtomatik hisoblanadi.</li>
          <li>Yakunda ballar jurnalga (grades) yoziladi.</li>
        </ol>
      </div>
    </div>
  )
}
