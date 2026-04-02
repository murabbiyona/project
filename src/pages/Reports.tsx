import { useState } from 'react'
import { FileText, Send, Calendar, Users, BarChart2, TrendingUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useClasses } from '../hooks/useClasses'
import { useReports, type ReportData } from '../hooks/useReports'

const PERIODS = [
  { value: 'daily' as const, label: 'Kunlik', icon: '📅' },
  { value: 'weekly' as const, label: 'Haftalik', icon: '📆' },
  { value: 'monthly' as const, label: 'Oylik', icon: '🗓' },
  { value: 'quarterly' as const, label: 'Choraklik', icon: '📊' },
]

function gradeColor(g: number) {
  if (g === 5) return 'bg-emerald-100 text-emerald-700'
  if (g === 4) return 'bg-blue-100 text-blue-700'
  if (g === 3) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
}

export default function Reports() {
  const { classes } = useClasses()
  const { generateReport, sendReportToTelegram, loading, error } = useReports()

  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('weekly')
  const [report, setReport] = useState<ReportData | null>(null)
  const [sendingTg, setSendingTg] = useState(false)
  const [tgSent, setTgSent] = useState(false)

  const handleGenerate = async () => {
    if (!selectedClassId) return
    const data = await generateReport(selectedClassId, selectedPeriod)
    if (data) setReport(data)
    setTgSent(false)
  }

  const handleSendTelegram = async () => {
    if (!report) return
    setSendingTg(true)
    const sent = await sendReportToTelegram(report)
    setTgSent(sent)
    setSendingTg(false)
  }

  return (
    <div className="px-6 pt-4 pb-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-zinc-900 rounded-xl">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Hisobotlar</h1>
          <p className="text-sm text-zinc-500">Sinf bo'yicha avtomatik hisobot yaratish va yuborish</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Class selector */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Sinf</label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full h-10 rounded-lg border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            >
              <option value="">Sinfni tanlang...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Period selector */}
          <div className="flex gap-1.5">
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setSelectedPeriod(p.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  selectedPeriod === p.value
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !selectedClassId}
            className="h-10 px-5 bg-zinc-900 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-zinc-800 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
            Hisobot yaratish
          </button>
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Report Result */}
      {report && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header with actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                {report.className} — {PERIODS.find(p => p.value === report.period)?.label} hisobot
              </h2>
              <p className="text-xs text-zinc-400">
                {new Date(report.generatedAt).toLocaleString('uz-UZ')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSendTelegram}
                disabled={sendingTg || tgSent}
                className={`h-9 px-4 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${
                  tgSent
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {sendingTg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                 tgSent ? <CheckCircle className="w-3.5 h-3.5" /> :
                 <Send className="w-3.5 h-3.5" />}
                {tgSent ? 'Yuborildi' : 'Telegramga yuborish'}
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SummaryCard icon={Users} label="Jami o'quvchilar" value={report.totalStudents} />
            <SummaryCard icon={BarChart2} label="Baholangan" value={`${report.assessedStudents}/${report.totalStudents}`} />
            <SummaryCard icon={TrendingUp} label="O'rtacha ball" value={`${report.averageScore}%`} />
            <SummaryCard icon={Calendar} label="Davomat" value={`${report.attendanceRate}%`} />
          </div>

          {/* Grade Distribution & Subject Breakdown */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Grade Distribution */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <h3 className="text-sm font-semibold text-zinc-800 mb-4">Baholar taqsimoti</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2].map(g => {
                  const count = report.gradeDistribution[g] || 0
                  const total = Object.values(report.gradeDistribution).reduce((a, b) => a + b, 0)
                  const pct = total > 0 ? (count / total) * 100 : 0
                  return (
                    <div key={g} className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${gradeColor(g)}`}>
                        {g}
                      </span>
                      <div className="flex-1">
                        <div className="h-6 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              g === 5 ? 'bg-emerald-500' : g === 4 ? 'bg-blue-500' : g === 3 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(pct, 2)}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-zinc-700 w-12 text-right">{count} ta</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Subject Breakdown */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <h3 className="text-sm font-semibold text-zinc-800 mb-4">Fan bo'yicha natijalar</h3>
              {report.subjectBreakdown.length > 0 ? (
                <div className="space-y-2.5">
                  {report.subjectBreakdown.map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-zinc-700">{s.subject}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              s.average >= 86 ? 'bg-emerald-500' : s.average >= 71 ? 'bg-blue-500' : s.average >= 56 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${s.average}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-zinc-700 w-10 text-right">{s.average}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">Fan ma'lumotlari yo'q</p>
              )}
            </div>
          </div>

          {/* Top & Bottom Students */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Top students */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-1.5">
                🏆 Eng yaxshi o'quvchilar
              </h3>
              {report.topStudents.length > 0 ? (
                <div className="space-y-2">
                  {report.topStudents.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-zinc-200 text-zinc-600' :
                        i === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-zinc-100 text-zinc-500'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="text-sm text-zinc-800 flex-1">{s.name}</span>
                      <span className="text-sm font-bold text-emerald-600">{s.score}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">Ma'lumot yo'q</p>
              )}
            </div>

            {/* Bottom students */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5">
              <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-1.5">
                ⚠️ E'tibor kerak bo'lgan o'quvchilar
              </h3>
              {report.bottomStudents.length > 0 ? (
                <div className="space-y-2">
                  {report.bottomStudents.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-red-100 text-red-600">
                        !
                      </span>
                      <span className="text-sm text-zinc-800 flex-1">{s.name}</span>
                      <span className="text-sm font-bold text-red-600">{s.score}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-400">Ma'lumot yo'q</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!report && !loading && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">Sinf va davrni tanlang va hisobot yarating</p>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-zinc-400" />
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
    </div>
  )
}
