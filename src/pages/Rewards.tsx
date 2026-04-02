import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Search, Users, TrendingUp, TrendingDown,
  Award, Plus, X, Loader2, ChevronDown
} from 'lucide-react'
import { useClasses } from '../hooks/useClasses'
import { useStudents } from '../hooks/useStudents'
import { useRewards } from '../hooks/useRewards'

const avatarColors = [
  'bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400',
  'bg-teal-400', 'bg-sky-400', 'bg-indigo-400', 'bg-violet-400',
]

export default function Rewards() {
  const { t } = useTranslation()
  const { classes } = useClasses()
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const { students, loading: studentsLoading } = useStudents(selectedClassId || undefined)
  const { categories, rewards, giveReward, getStudentPoints } = useRewards(selectedClassId || undefined)
  const [showGiveModal, setShowGiveModal] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
  const [note, setNote] = useState('')
  const [giving, setGiving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const positiveCategories = categories.filter(c => c.is_positive)
  const negativeCategories = categories.filter(c => !c.is_positive)

  const filteredStudents = students
    .filter(s => `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => getStudentPoints(b.id) - getStudentPoints(a.id))

  async function handleGiveReward() {
    if (!selectedStudentId || !selectedCategoryId || !selectedClassId) return
    setGiving(true)
    const category = categories.find(c => c.id === selectedCategoryId)
    await giveReward({
      student_id: selectedStudentId,
      class_id: selectedClassId,
      category_id: selectedCategoryId,
      points: category?.points || 1,
      note: note || undefined,
    })
    setGiving(false)
    setShowGiveModal(false)
    setSelectedStudentId('')
    setSelectedCategoryId('')
    setNote('')
  }

  return (
    <div className="flex gap-6 h-full animate-in fade-in slide-in-from-bottom-2 duration-300 px-6 py-4">
      {/* Main Content */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3 flex-1">
            <Star className="w-5 h-5 text-amber-500" strokeWidth={1.5} />
            <h1 className="text-xl font-bold text-slate-900">{t('rewards.title', "Rag'batlar")}</h1>
          </div>

          {/* Class selector */}
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="appearance-none border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">{t('rewards.allClasses', 'Barcha sinflar')}</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-48">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('rewards.search', 'Qidirish...')}
              className="bg-transparent border-none outline-none flex-1 text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={() => setShowGiveModal(true)}
            disabled={!selectedClassId}
            className="flex items-center gap-2 bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {t('rewards.give', "Rag'bat berish")}
          </button>
        </div>

        {/* Students List with Points */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedClassId ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Users className="w-12 h-12 mb-3 text-slate-300" />
              <p className="text-lg font-medium">{t('rewards.selectClass', 'Sinf tanlang')}</p>
            </div>
          ) : studentsLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student, idx) => {
                const points = getStudentPoints(student.id)
                const studentRewards = rewards.filter(r => r.student_id === student.id)
                const initials = `${student.first_name[0]}${student.last_name[0]}`

                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    {/* Rank */}
                    <span className="w-6 text-center text-sm font-bold text-slate-400">
                      {idx + 1}
                    </span>

                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                      {initials}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{student.first_name} {student.last_name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {studentRewards.slice(0, 5).map(r => (
                          <span key={r.id} className="text-xs" title={r.category?.name_uz}>
                            {r.category?.icon}
                          </span>
                        ))}
                        {studentRewards.length > 5 && (
                          <span className="text-xs text-slate-400">+{studentRewards.length - 5}</span>
                        )}
                      </div>
                    </div>

                    {/* Points */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm ${
                      points > 0
                        ? 'bg-emerald-50 text-emerald-600'
                        : points < 0
                          ? 'bg-red-50 text-red-500'
                          : 'bg-slate-50 text-slate-400'
                    }`}>
                      {points > 0 ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : points < 0 ? (
                        <TrendingDown className="w-3.5 h-3.5" />
                      ) : null}
                      {points > 0 ? '+' : ''}{points}
                    </div>

                    {/* Quick give buttons (visible on hover) */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {positiveCategories.slice(0, 3).map(cat => (
                        <button
                          key={cat.id}
                          onClick={async () => {
                            await giveReward({
                              student_id: student.id,
                              class_id: selectedClassId,
                              category_id: cat.id,
                              points: cat.points,
                            })
                          }}
                          title={cat.name_uz}
                          className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition-colors text-sm"
                        >
                          {cat.icon}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Categories */}
      <div className="w-[280px] flex-shrink-0 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-emerald-500" />
            {t('rewards.positive', 'Ijobiy')}
          </h2>
          <div className="space-y-2">
            {positiveCategories.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-50/50">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-medium text-slate-700 flex-1">{cat.name_uz}</span>
                <span className="text-xs font-bold text-emerald-600">+{cat.points}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-red-500" />
            {t('rewards.negative', 'Salbiy')}
          </h2>
          <div className="space-y-2">
            {negativeCategories.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-50/50">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-medium text-slate-700 flex-1">{cat.name_uz}</span>
                <span className="text-xs font-bold text-red-500">{cat.points}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Give Reward Modal */}
      <AnimatePresence>
        {showGiveModal && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900 text-lg">{t('rewards.give', "Rag'bat berish")}</h2>
                <button onClick={() => setShowGiveModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-5">
                {/* Student select */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">{t('rewards.student', "O'quvchi")}</label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Tanlang...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                    ))}
                  </select>
                </div>

                {/* Category select */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">{t('rewards.category', 'Kategoriya')}</label>
                  <div className="grid grid-cols-5 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                          selectedCategoryId === cat.id
                            ? cat.is_positive
                              ? 'bg-emerald-100 ring-2 ring-emerald-400'
                              : 'bg-red-100 ring-2 ring-red-400'
                            : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                        title={cat.name_uz}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className={`text-[10px] font-bold ${cat.is_positive ? 'text-emerald-600' : 'text-red-500'}`}>
                          {cat.is_positive ? '+' : ''}{cat.points}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">{t('rewards.note', 'Izoh (ixtiyoriy)')}</label>
                  <input
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Masalan: Juda yaxshi javob berdi"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
                <button
                  onClick={() => setShowGiveModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                >
                  {t('common.cancel', 'Bekor qilish')}
                </button>
                <button
                  onClick={handleGiveReward}
                  disabled={giving || !selectedStudentId || !selectedCategoryId}
                  className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {giving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('rewards.confirm', 'Tasdiqlash')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
