import { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Check, X, AlertTriangle, Loader2,
  Volume2, ChevronRight, RefreshCw, Info
} from 'lucide-react';
import { useVoiceMobileGrading } from '../../hooks/useVoiceMobileGrading';

const classOptions = ['5-A', '5-B', '6-A', '6-B', '7-A'];
const subjectOptions = ['Matematika', 'Algebra', 'Geometriya', 'Fizika'];

const mockStudents = [
  'Karimov Jasur',
  'Abdullayeva Madina',
  'Toshmatov Sardor',
  'Rahimova Zilola',
  'Nazarov Bobur',
  'Islomova Shahlo',
  'Umarov Azizbek',
  'Xolmatova Dilfuza',
  'Ergashev Sherzod',
  'Qodirova Kamola',
];

const gradeValues = [2, 3, 4, 5];

const gradeColor = (grade: number) => {
  if (grade <= 2) return { bg: 'bg-red-500', text: 'text-red-500', soft: 'bg-red-50 border-red-200' };
  if (grade === 3) return { bg: 'bg-amber-500', text: 'text-amber-500', soft: 'bg-amber-50 border-amber-200' };
  if (grade === 4) return { bg: 'bg-blue-500', text: 'text-blue-500', soft: 'bg-blue-50 border-blue-200' };
  return { bg: 'bg-emerald-500', text: 'text-emerald-500', soft: 'bg-emerald-50 border-emerald-200' };
};

// Animatsiyali to'lqin (mikrofon yonida)
function AudioWaves({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-5">
      {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-300 ${active ? 'bg-white' : 'bg-white/40'}`}
          style={{
            height: active ? `${h * 4 + 4}px` : '4px',
            animation: active ? `wave ${0.6 + i * 0.1}s ease-in-out infinite alternate` : 'none',
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes wave {
          from { transform: scaleY(0.5); }
          to { transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  );
}

// Ovozli baho paneli
function VoiceGradingPanel({
  studentNames,
  onGrade,
  onClose,
}: {
  studentNames: string[];
  onGrade: (name: string, grade: number) => void;
  onClose: () => void;
}) {
  const {
    isListening, isProcessing, isSupported,
    transcript, result, error,
    startListening, stopListening, cancelResult, setError,
  } = useVoiceMobileGrading();

  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [listenTime, setListenTime] = useState(0);
  const timerRef = useRef<any>(null);

  // Vaqt hisoblagich
  useEffect(() => {
    if (isListening) {
      setListenTime(0);
      timerRef.current = setInterval(() => setListenTime(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isListening]);

  // Natija kelganda avtomatik to'ldirish
  useEffect(() => {
    if (result) {
      setSelectedName(result.matchedStudentName);
      setSelectedGrade(result.detectedScore);
    }
  }, [result]);

  function handleToggle() {
    if (isListening) {
      stopListening(studentNames);
    } else {
      startListening(studentNames);
    }
  }

  function handleConfirm() {
    if (!selectedName || !selectedGrade) return;
    onGrade(selectedName, selectedGrade);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      cancelResult();
      setSelectedName(null);
      setSelectedGrade(null);
    }, 1500);
  }

  function handleCancel() {
    cancelResult();
    setSelectedName(null);
    setSelectedGrade(null);
  }

  if (!isSupported) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm">
        <div className="mt-auto bg-white rounded-t-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Qo'llab-quvvatlanmaydi</h3>
              <p className="text-sm text-zinc-500">Chrome yoki Edge brauzeridan foydalaning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-zinc-100 text-zinc-700 font-semibold rounded-2xl"
          >
            Yopish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Overlay */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-5 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-[15px]">Ovozli baho qo'yish</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Yo'riqnoma */}
          {!result && !isListening && !isProcessing && (
            <div className="bg-white/15 rounded-2xl p-3 mb-4">
              <p className="text-white/90 text-[13px] font-medium leading-relaxed">
                💡 <strong>Qanday gapirish kerak:</strong><br />
                <span className="text-white/80">
                  "Karimov Jasur besh" yoki "Abdullayeva to'rt"<br />
                  "Nazarov 5" yoki "Islomova yaxshi"
                </span>
              </p>
            </div>
          )}

          {/* Transkripsiya */}
          {(isListening || transcript) && (
            <div className="bg-white/15 rounded-2xl px-4 py-3 mb-4 min-h-[48px] flex items-center gap-2">
              <AudioWaves active={isListening} />
              <p className="text-white text-[14px] flex-1 font-medium min-h-[20px]">
                {transcript || (isListening ? 'Gapirayapsiz...' : '')}
              </p>
              {isListening && (
                <span className="text-white/70 text-[12px] font-mono tabular-nums">
                  {listenTime}s
                </span>
              )}
            </div>
          )}

          {/* Mikrofon tugmasi */}
          <button
            onClick={handleToggle}
            disabled={isProcessing}
            className={`w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-3 transition-all duration-300 ${
              isListening
                ? 'bg-red-500 shadow-lg shadow-red-500/40'
                : isProcessing
                ? 'bg-white/20 cursor-wait'
                : 'bg-white shadow-lg'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 text-white animate-spin" />
                <span className="text-white">Tahlil qilinmoqda...</span>
              </>
            ) : isListening ? (
              <>
                <MicOff className="w-5 h-5 text-white" />
                <span className="text-white">To'xtatish</span>
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-indigo-600" />
                <span className="text-indigo-700">Bosing va gapiring</span>
              </>
            )}
          </button>
        </div>

        {/* Natijalar */}
        <div className="p-5 space-y-4 max-h-[55vh] overflow-y-auto">

          {/* Xato */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 text-[14px] font-medium">{error}</p>
                <button
                  onClick={() => { setError(null); cancelResult(); }}
                  className="text-red-500 text-[12px] font-semibold mt-1 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Qaytadan urinish
                </button>
              </div>
            </div>
          )}

          {/* Muvaffaqiyat */}
          {confirmed && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="font-bold text-emerald-800">{selectedName}</p>
                <p className="text-emerald-600 text-[13px]">{selectedGrade}-baho muvaffaqiyatli qo'yildi!</p>
              </div>
            </div>
          )}

          {/* Natija ko'rsatish */}
          {result && !confirmed && (
            <>
              {/* O'quvchi topilmadi */}
              {result.status === 'rejected' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <p className="text-amber-700 font-semibold text-[14px]">O'quvchi topilmadi</p>
                  </div>
                  <p className="text-amber-600 text-[13px]">
                    "{result.transcript}" — ism tanilmadi. Quyida qo'lda tanlang:
                  </p>
                </div>
              )}

              {/* Noaniq — bir nechta nomzod */}
              {result.status === 'ambiguous' && result.candidateNames.length > 0 && (
                <div className="space-y-2">
                  <p className="text-amber-600 text-[12px] font-semibold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    Bir xil isimli o'quvchilar — birini tanlang:
                  </p>
                  {[result.matchedStudentName!, ...result.candidateNames].map(name => (
                    <button
                      key={name}
                      onClick={() => setSelectedName(name)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all ${
                        selectedName === name
                          ? 'border-indigo-400 bg-indigo-50'
                          : 'border-zinc-100 bg-white'
                      }`}
                    >
                      <span className="font-semibold text-[14px] text-zinc-800">{name}</span>
                      {selectedName === name && <Check className="w-4 h-4 text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Topilgan o'quvchi */}
              {result.matchedStudentName && result.status !== 'rejected' && result.status !== 'ambiguous' && (
                <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-700 font-black text-[12px]">
                      {result.matchedStudentName.split(' ').map(p => p[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-zinc-900">{result.matchedStudentName}</p>
                    <p className="text-indigo-500 text-[12px]">
                      {Math.round(result.confidence * 100)}% aniqlik · "{result.transcript}"
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-indigo-500" />
                </div>
              )}

              {/* O'quvchini qo'lda tanlash */}
              {(result.status === 'rejected' || !selectedName) && (
                <div>
                  <p className="text-[12px] font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                    O'quvchini tanlang
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto">
                    {studentNames.map(name => (
                      <button
                        key={name}
                        onClick={() => setSelectedName(name)}
                        className={`px-3 py-2 rounded-xl border-2 text-[12px] font-semibold text-left transition-all ${
                          selectedName === name
                            ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                            : 'border-zinc-100 bg-zinc-50 text-zinc-700'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Baho tanlash */}
              <div>
                <p className="text-[12px] font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                  Baho
                </p>
                <div className="flex gap-2">
                  {gradeValues.map(g => {
                    const colors = gradeColor(g);
                    const isSelected = selectedGrade === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setSelectedGrade(g)}
                        className={`flex-1 h-12 rounded-xl font-black text-lg transition-all ${
                          isSelected
                            ? `${colors.bg} text-white shadow-lg scale-105`
                            : 'bg-zinc-100 text-zinc-600'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Harakatlar */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-600 font-semibold rounded-2xl text-[14px]"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedName || !selectedGrade}
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl text-[14px] flex items-center justify-center gap-2 disabled:opacity-40 shadow-lg"
                >
                  Tasdiqlash <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Hali natija yo'q — ko'rsatma */}
          {!result && !error && !isListening && !isProcessing && (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Mic className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-zinc-500 text-[13px]">
                Yuqoridagi tugmani bosing va o'quvchi ism-familiyasini<br />
                hamda bahoni aytib bering
              </p>
              <p className="text-zinc-400 text-[12px] mt-2 font-medium">
                Misol: "Karimov Jasur to'rt" yoki "Madina besh"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MobileGrades() {
  const [selectedClass, setSelectedClass] = useState('5-A');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [grades, setGrades] = useState<Record<string, number | null>>({});
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [lastVoiceGrade, setLastVoiceGrade] = useState<{ name: string; grade: number } | null>(null);

  const handleGrade = (student: string, grade: number) => {
    setGrades((prev) => ({
      ...prev,
      [student]: prev[student] === grade ? null : grade,
    }));
  };

  const handleVoiceGrade = (name: string, grade: number) => {
    setGrades(prev => ({ ...prev, [name]: grade }));
    setLastVoiceGrade({ name, grade });
    setTimeout(() => setLastVoiceGrade(null), 3000);
  };

  const gradedCount = Object.values(grades).filter(Boolean).length;

  return (
    <div className="space-y-5 pb-24 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Tezkor baholash</h1>
        {/* Ovozli baho tugmasi */}
        <button
          onClick={() => setShowVoicePanel(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-[13px] shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform"
        >
          <Mic className="w-4 h-4" />
          Ovoz bilan
        </button>
      </div>

      {/* So'nggi ovozli baho bildirishi */}
      {lastVoiceGrade && (
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl px-4 py-3 animate-in slide-in-from-top-2 duration-300">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm ${gradeColor(lastVoiceGrade.grade).bg}`}>
            {lastVoiceGrade.grade}
          </div>
          <p className="text-indigo-800 text-[13px] font-semibold flex-1">
            <span className="font-bold">{lastVoiceGrade.name}</span>ga ovoz bilan baho qo'yildi
          </p>
          <Check className="w-4 h-4 text-indigo-500" />
        </div>
      )}

      {/* Sinf filtrlari */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {classOptions.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedClass(c)}
              className={`flex-shrink-0 min-h-10 px-4 rounded-full text-sm font-medium transition-colors ${
                selectedClass === c
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-zinc-700 border border-zinc-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {subjectOptions.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`flex-shrink-0 min-h-10 px-4 rounded-full text-sm font-medium transition-colors ${
                selectedSubject === s
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-zinc-700 border border-zinc-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* O'quvchilar ro'yxati */}
      <div className="space-y-2">
        {mockStudents.map((student, i) => {
          const currentGrade = grades[student];
          const isJustVoiced = lastVoiceGrade?.name === student;
          return (
            <div
              key={student}
              className={`bg-white rounded-xl p-3 flex items-center justify-between shadow-sm transition-all duration-300 ${
                isJustVoiced ? 'ring-2 ring-indigo-400 ring-offset-1' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentGrade
                    ? `${gradeColor(currentGrade).bg} text-white`
                    : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {currentGrade || (i + 1)}
                </span>
                <span className="text-sm font-medium text-zinc-900">{student}</span>
              </div>
              <div className="flex gap-1.5">
                {gradeValues.map((grade) => {
                  const colors = gradeColor(grade);
                  return (
                    <button
                      key={grade}
                      onClick={() => handleGrade(student, grade)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                        grades[student] === grade
                          ? `${colors.bg} text-white scale-105 shadow-sm`
                          : 'bg-zinc-100 text-zinc-600 active:scale-95'
                      }`}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Saqlash tugmasi */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-100 via-zinc-100/95 to-transparent">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button
            onClick={() => setShowVoicePanel(true)}
            className="flex items-center justify-center gap-2 px-4 h-12 bg-white border border-zinc-200 text-zinc-700 font-semibold rounded-xl shadow-sm"
          >
            <Mic className="w-4 h-4 text-violet-500" />
          </button>
          <button className="flex-1 h-12 bg-emerald-500 text-white font-semibold rounded-xl active:bg-emerald-600 shadow-lg transition-colors">
            Saqlash ({gradedCount} ta baho)
          </button>
        </div>
      </div>

      {/* Ovozli baho paneli */}
      {showVoicePanel && (
        <VoiceGradingPanel
          studentNames={mockStudents}
          onGrade={handleVoiceGrade}
          onClose={() => setShowVoicePanel(false)}
        />
      )}
    </div>
  );
}
