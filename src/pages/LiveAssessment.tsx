import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timer, Users, Trophy, Undo2, Play, Square, X } from 'lucide-react'
import { useAssessment, type StudentScore } from '../hooks/useAssessment'
import { useClasses } from '../hooks/useClasses'

// ─── Uzbekistan 5-ball grade colors ────────────────────────
function gradeColor(grade: number, hasScores: boolean) {
  if (!hasScores) return 'border-slate-200 bg-white'
  if (grade === 5) return 'border-emerald-400 bg-emerald-50/50'
  if (grade === 4) return 'border-blue-400 bg-blue-50/50'
  if (grade === 3) return 'border-yellow-400 bg-yellow-50/50'
  return 'border-red-400 bg-red-50/50'
}

function gradeBadgeColor(grade: number) {
  if (grade === 5) return 'bg-emerald-500'
  if (grade === 4) return 'bg-blue-500'
  if (grade === 3) return 'bg-yellow-500'
  return 'bg-red-500'
}

// ─── Score categories ──────────────────────────────────────
const CATEGORIES = [
  { label: "Og'zaki javob", points: 10, color: 'bg-violet-500' },
  { label: 'Guruh ishi', points: 15, color: 'bg-blue-500' },
  { label: 'Mustaqil ish', points: 20, color: 'bg-emerald-500' },
  { label: 'Faollik', points: 5, color: 'bg-amber-500' },
  { label: 'Uy vazifasi', points: 10, color: 'bg-rose-500' },
]

// ─── Timer formatter ───────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function LiveAssessment() {
  const navigate = useNavigate()
  const { classes, loading: classesLoading } = useClasses()
  const {
    startSession, endSession, activeSession,
    addScore, removeLastScore, studentScores, stats, loading,
  } = useAssessment()

  // ── Setup form state ──────────────────────────────────────
  const [classId, setClassId] = useState('')
  const [subject, setSubject] = useState('')
  const [title, setTitle] = useState('')
  const [maxPoints, setMaxPoints] = useState(100)
  const [setupError, setSetupError] = useState('')

  // ── Session state ─────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])
  const [elapsed, setElapsed] = useState(0)
  const [showEndModal, setShowEndModal] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [sessionResult, setSessionResult] = useState<any>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Timer ─────────────────────────────────────────────────
  useEffect(() => {
    if (activeSession?.status === 'active') {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [activeSession?.status])

  // ── Start session handler ─────────────────────────────────
  const handleStart = async () => {
    if (!classId) { setSetupError('Sinfni tanlang'); return }
    if (!title.trim()) { setSetupError('Dars mavzusini kiriting'); return }
    setSetupError('')
    try {
      await startSession({
        classId,
        subjectId: subject || classId,
        title: title.trim(),
        totalPoints: maxPoints,
        method: 'manual',
        assessmentType: 'formative',
      })
      setElapsed(0)
    } catch (e: any) {
      setSetupError(e.message || 'Xatolik yuz berdi')
    }
  }

  // ── End session handler ───────────────────────────────────
  const handleEnd = async () => {
    try {
      const result = await endSession()
      setSessionResult(result)
      setShowEndModal(false)
      setShowResults(true)
      if (timerRef.current) clearInterval(timerRef.current)
    } catch (e: any) {
      setSetupError(e.message || 'Xatolik')
    }
  }

  // ════════════════════════════════════════════════════════════
  // STATE 1: Setup Form
  // ════════════════════════════════════════════════════════════
  if (!activeSession) {
    return (
      <div className="px-6 pt-4 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Jonli Baholash</h1>
        <p className="text-sm text-slate-500 mb-8">Dars davomida o'quvchilarni real vaqtda baholang</p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          {/* Class selector */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Sinf</label>
            <select
              value={classId}
              onChange={e => setClassId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            >
              <option value="">Sinfni tanlang...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Fan</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Masalan: Matematika"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Dars mavzusi</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Masalan: Kasrlar ustida amallar"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
            />
          </div>

          {/* Max points */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Maksimal ball</label>
            <div className="flex gap-2">
              {[50, 75, 100].map(p => (
                <button
                  key={p}
                  onClick={() => setMaxPoints(p)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    maxPoints === p
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {p} ball
                </button>
              ))}
            </div>
          </div>

          {setupError && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
              {setupError}
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={loading || classesLoading}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {loading ? 'Boshlanmoqda...' : 'Darsni boshlash'}
          </button>
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════
  // STATE 2: Live Assessment
  // ════════════════════════════════════════════════════════════
  const className = classes.find(c => c.id === activeSession.classId)?.name || ''

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] animate-in fade-in duration-200">
      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-slate-900 truncate">{activeSession.title}</h1>
          <p className="text-xs text-slate-500">{className}</p>
        </div>

        <div className="flex items-center gap-4 text-sm shrink-0">
          {/* Timer */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Timer className="w-4 h-4" />
            <span className="font-mono font-semibold">{formatTime(elapsed)}</span>
          </div>

          {/* Student count */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Users className="w-4 h-4" />
            <span className="font-semibold">{stats.assessedCount}/{stats.totalStudents}</span>
            <span className="text-xs text-slate-400">baholangan</span>
          </div>

          {/* Average */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <Trophy className="w-4 h-4" />
            <span className="font-semibold">{stats.averageScore.toFixed(1)}</span>
            <span className="text-xs text-slate-400">o'rtacha</span>
          </div>

          {/* Grade mini-distribution */}
          <div className="flex items-center gap-1 text-xs">
            {[5, 4, 3, 2].map(g => (
              <span key={g} className={`${gradeBadgeColor(g)} text-white px-1.5 py-0.5 rounded font-semibold`}>
                {g}: {stats.gradeDistribution[g] || 0}
              </span>
            ))}
          </div>

          {/* End button */}
          <button
            onClick={() => setShowEndModal(true)}
            className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            <Square className="w-3.5 h-3.5" />
            Yakunlash
          </button>
        </div>
      </div>

      {/* ── STUDENT GRID ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {studentScores.map((student) => (
            <StudentCard
              key={student.studentId}
              student={student}
              maxPoints={activeSession.totalPoints}
              category={selectedCategory}
              onAddScore={(pts, cat) => addScore(student.studentId, pts, cat)}
              onUndo={() => removeLastScore(student.studentId)}
            />
          ))}
        </div>

        {studentScores.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">O'quvchilar topilmadi</p>
            <p className="text-sm">Bu sinfda aktiv o'quvchilar yo'q</p>
          </div>
        )}
      </div>

      {/* ── BOTTOM PANEL — Category selector ────────────────── */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Kategoriya:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory.label === cat.label
                  ? `${cat.color} text-white shadow-sm`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
              <span className="opacity-75">+{cat.points}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── END SESSION MODAL ───────────────────────────────── */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowEndModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Darsni yakunlash?</h2>
              <button onClick={() => setShowEndModal(false)} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Jami o'quvchilar</span><span className="font-semibold">{stats.totalStudents}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Baholangan</span><span className="font-semibold">{stats.assessedCount}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">O'rtacha ball</span><span className="font-semibold">{stats.averageScore.toFixed(1)}</span></div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Baholar taqsimoti</span>
                <div className="flex gap-1">
                  {[5, 4, 3, 2].map(g => (
                    <span key={g} className={`${gradeBadgeColor(g)} text-white px-1.5 py-0.5 rounded text-xs font-semibold`}>
                      {g}: {stats.gradeDistribution[g] || 0}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-4">Barcha baholar saqlandi va Telegramga xabarnoma yuboriladi.</p>

            <div className="flex gap-3">
              <button onClick={() => setShowEndModal(false)} className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Bekor qilish</button>
              <button onClick={handleEnd} disabled={loading} className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-600 disabled:opacity-50">
                {loading ? 'Saqlanmoqda...' : 'Yakunlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS MODAL ───────────────────────────────────── */}
      {showResults && sessionResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Dars yakunlandi!</h2>
              <p className="text-sm text-slate-500 mt-1">{sessionResult.saved} ta baho saqlandi</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm mb-6">
              <div className="flex justify-between"><span className="text-slate-500">Baholangan</span><span className="font-bold">{sessionResult.assessedCount} / {sessionResult.totalStudents}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">O'rtacha ball</span><span className="font-bold">{sessionResult.averageScore}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">O'rtacha baho</span><span className="font-bold">{sessionResult.averageGrade.toFixed(1)}</span></div>

              {/* Grade distribution bar */}
              <div className="pt-2">
                <p className="text-xs text-slate-400 mb-2 font-medium">Baholar taqsimoti</p>
                <div className="flex gap-2">
                  {[5, 4, 3, 2].map(g => {
                    const count = sessionResult.gradeDistribution[g] || 0
                    const pct = sessionResult.assessedCount > 0 ? (count / sessionResult.assessedCount) * 100 : 0
                    return (
                      <div key={g} className="flex-1 text-center">
                        <div className="h-20 bg-slate-100 rounded-lg relative overflow-hidden flex items-end">
                          <div className={`${gradeBadgeColor(g)} w-full rounded-lg transition-all`} style={{ height: `${Math.max(pct, 5)}%` }} />
                        </div>
                        <p className="text-xs font-bold mt-1">{g}</p>
                        <p className="text-[10px] text-slate-400">{count} ta</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {sessionResult.errors.length > 0 && (
              <div className="text-xs text-red-500 bg-red-50 rounded-lg p-3 mb-4">
                {sessionResult.errors.map((e: string, i: number) => <p key={i}>{e}</p>)}
              </div>
            )}

            <button
              onClick={() => { setShowResults(false); navigate('/grading') }}
              className="w-full bg-slate-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-slate-800"
            >
              Baholar sahifasiga o'tish
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════
// Student Card Component
// ════════════════════════════════════════════════════════════

function StudentCard({
  student, maxPoints, category, onAddScore, onUndo,
}: {
  student: StudentScore
  maxPoints: number
  category: typeof CATEGORIES[0]
  onAddScore: (pts: number, cat: string) => void
  onUndo: () => void
}) {
  const hasScores = student.scores.length > 0
  const percentage = maxPoints > 0 ? (student.totalScore / maxPoints) * 100 : 0

  return (
    <div className={`group relative rounded-xl border-2 p-3 transition-all hover:shadow-md ${gradeColor(student.finalGrade, hasScores)}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {student.journalNumber && (
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 w-5 h-5 rounded flex items-center justify-center shrink-0">
              {student.journalNumber}
            </span>
          )}
          <span className="text-sm font-semibold text-slate-800 truncate">{student.studentName}</span>
        </div>
        {hasScores && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded text-white ${gradeBadgeColor(student.finalGrade)}`}>
            {student.finalGrade}
          </span>
        )}
      </div>

      {/* Score display */}
      <div className="flex items-end gap-2 mb-2">
        <span className={`text-2xl font-bold ${hasScores ? 'text-slate-900' : 'text-slate-300'}`}>
          {student.totalScore}
        </span>
        <span className="text-xs text-slate-400 mb-1">/ {maxPoints}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            student.finalGrade === 5 ? 'bg-emerald-500' :
            student.finalGrade === 4 ? 'bg-blue-500' :
            student.finalGrade === 3 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Score chips */}
      {hasScores && (
        <div className="flex flex-wrap gap-1 mb-2">
          {student.scores.slice(-4).map((s, i) => (
            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
              +{s.points} {s.category}
            </span>
          ))}
          {student.scores.length > 4 && (
            <span className="text-[10px] text-slate-400">+{student.scores.length - 4} ta</span>
          )}
        </div>
      )}

      {/* Quick action buttons — always visible on mobile, hover on desktop */}
      <div className="flex items-center gap-1 mt-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {[5, 10, 15, 20].map(pts => (
          <button
            key={pts}
            onClick={() => onAddScore(pts, category.label)}
            className={`flex-1 py-1 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95 ${category.color}`}
          >
            +{pts}
          </button>
        ))}
        {hasScores && (
          <button
            onClick={onUndo}
            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Oxirgini bekor qilish"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
