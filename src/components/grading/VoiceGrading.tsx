import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Mic, MicOff, Check, X, AlertTriangle,
  Loader2, Volume2, User, ChevronRight
} from 'lucide-react'
import { useVoiceGrading } from '../../hooks/useVoiceGrading'
import type { Student } from '../../types/database'

interface VoiceGradingProps {
  classId: string
  subjectId: string
  students: Student[]
  gradeType?: 'formative' | 'summative' | 'daily'
  onGradeAdded?: () => void
}

export default function VoiceGrading({
  classId,
  subjectId,
  students,
  gradeType = 'formative',
  onGradeAdded,
}: VoiceGradingProps) {
  const { t } = useTranslation()
  const {
    isRecording,
    isProcessing,
    result,
    error,
    startRecording,
    stopRecording,
    confirmVoiceGrade,
    cancelVoiceGrade,
  } = useVoiceGrading(classId, subjectId)

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editedScore, setEditedScore] = useState<number>(0)
  const [confirming, setConfirming] = useState(false)

  async function handleStop() {
    const res = await stopRecording(students)
    if (res?.matchedStudent) {
      setSelectedStudent(res.matchedStudent)
      setEditedScore(res.detectedScore || 0)
    }
  }

  async function handleConfirm() {
    if (!selectedStudent) return
    setConfirming(true)
    const { error: err } = await confirmVoiceGrade(selectedStudent, editedScore, gradeType)
    setConfirming(false)
    if (!err) {
      setSelectedStudent(null)
      setEditedScore(0)
      onGradeAdded?.()
    }
  }

  function handleCancel() {
    cancelVoiceGrade()
    setSelectedStudent(null)
    setEditedScore(0)
  }

  function handleSelectCandidate(student: Student) {
    setSelectedStudent(student)
  }

  return (
    <div className="relative">
      {/* Mic Button */}
      <motion.button
        onClick={isRecording ? handleStop : startRecording}
        disabled={isProcessing}
        className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
          isRecording
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
            : isProcessing
              ? 'bg-slate-200 text-slate-400 cursor-wait'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30'
        }`}
        whileHover={!isProcessing ? { scale: 1.02 } : {}}
        whileTap={!isProcessing ? { scale: 0.98 } : {}}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4.5 h-4.5 animate-spin" />
            {t('grading.processing', 'Tahlil qilinmoqda...')}
          </>
        ) : isRecording ? (
          <>
            <div className="relative">
              <MicOff className="w-4.5 h-4.5" />
              <motion.div
                className="absolute -inset-1.5 rounded-full border-2 border-white/50"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </div>
            {t('grading.stopRecording', "To'xtatish")}
            <motion.div
              className="w-2 h-2 rounded-full bg-white"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </>
        ) : (
          <>
            <Mic className="w-4.5 h-4.5" />
            {t('grading.voiceGrade', 'Ovozli baho')}
          </>
        )}
      </motion.button>

      {/* Results Popup */}
      <AnimatePresence>
        {(result || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-3 w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">
                  {t('grading.voiceResult', 'Ovozli baho natijasi')}
                </h3>
                {result?.transcript && (
                  <p className="text-xs text-slate-400 mt-0.5 italic">"{result.transcript}"</p>
                )}
              </div>
              <button onClick={handleCancel} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error State */}
            {error && (
              <div className="p-5">
                <div className="flex items-center gap-3 bg-red-50 rounded-xl p-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Result Content */}
            {result && !error && (
              <div className="p-5 space-y-4">
                {/* Ambiguous — bir xil ismlilar */}
                {result.status === 'ambiguous' && result.candidateStudents.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-amber-600 flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {t('grading.ambiguous', "Bir xil ismli o'quvchilar topildi. Birini tanlang:")}
                    </p>
                    <div className="space-y-1.5">
                      {result.candidateStudents.map(s => (
                        <button
                          key={s.id}
                          onClick={() => handleSelectCandidate(s)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                            selectedStudent?.id === s.id
                              ? 'bg-emerald-50 border-2 border-emerald-400'
                              : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-slate-900">
                              {s.first_name} {s.last_name}
                            </span>
                            {s.journal_number && (
                              <span className="text-xs text-slate-400 ml-2">#{s.journal_number}</span>
                            )}
                          </div>
                          {selectedStudent?.id === s.id && (
                            <Check className="w-4 h-4 text-emerald-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Student */}
                {result.status !== 'ambiguous' && result.matchedStudent && (
                  <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">
                        {result.matchedStudent.first_name} {result.matchedStudent.last_name}
                      </p>
                      <p className="text-xs text-emerald-600">
                        {Math.round(result.confidence * 100)}% {t('grading.confidence', 'aniqlik')}
                      </p>
                    </div>
                    <Check className="w-5 h-5 text-emerald-500" />
                  </div>
                )}

                {/* No match */}
                {result.status === 'rejected' && (
                  <div className="flex items-center gap-3 bg-red-50 rounded-xl p-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-700">
                      {t('grading.noMatch', "O'quvchi topilmadi. Qaytadan urinib ko'ring.")}
                    </p>
                  </div>
                )}

                {/* Score editor */}
                {(selectedStudent || result.matchedStudent) && (
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {t('grading.score', 'Baho')}
                    </label>
                    <div className="flex items-center gap-3 mt-1.5">
                      {[2, 3, 4, 5].map(score => (
                        <button
                          key={score}
                          onClick={() => setEditedScore(score)}
                          className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                            editedScore === score
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                      <div className="flex-1">
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={editedScore || ''}
                          onChange={e => setEditedScore(parseInt(e.target.value) || 0)}
                          placeholder="1-100"
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-center font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {(selectedStudent || result.matchedStudent) && editedScore > 0 && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      {t('common.cancel', 'Bekor qilish')}
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={confirming}
                      className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {confirming ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {t('grading.confirm', 'Tasdiqlash')}
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
