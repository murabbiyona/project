import { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Check, X, AlertTriangle,
  Volume2, ChevronRight, Trash2
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
  onGradeMultiple,
  onClose,
}: {
  studentNames: string[];
  onGradeMultiple: (grades: Record<string, number>) => void;
  onClose: () => void;
}) {
  const {
    isListening, isSupported,
    transcript, detectedGrades, error,
    startListening, stopListening, cancelResult, removeGrade,
  } = useVoiceMobileGrading();

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

  function handleToggle() {
    if (isListening) {
      stopListening();
    } else {
      startListening(studentNames);
    }
  }

  function handleConfirm() {
    if (Object.keys(detectedGrades).length === 0) return;
    onGradeMultiple(detectedGrades);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      cancelResult();
      onClose(); // tasdiqlangach panelni yopish
    }, 1500);
  }

  function handleCancel() {
    cancelResult();
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

  const detectedCount = Object.keys(detectedGrades).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Overlay */}
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-5 pb-6 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-[15px]">Ovozli ommaviy baho</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Yo'riqnoma */}
          {!isListening && !transcript && detectedCount === 0 && (
            <div className="bg-white/15 rounded-2xl p-3 mb-4">
              <p className="text-white/90 text-[13px] font-medium leading-relaxed">
                💡 <strong>Birinchidan, tinglash tugmasini bosing:</strong><br />
                <span className="text-white/80">
                  "Jasurga besh, Madinani to'rt qilib qo'y"<br />
                  Siz gapirganingiz sari hamma o'quvchilar ushlanadi.
                </span>
              </p>
            </div>
          )}

          {/* Uzluksiz Transkripsiya */}
          {(isListening || transcript) && (
            <div className="bg-white/15 rounded-2xl px-4 py-3 mb-4 min-h-[48px] flex items-start gap-2 max-h-24 overflow-y-auto">
              <div className="mt-1"><AudioWaves active={isListening} /></div>
              <p className="text-white/90 text-[13px] flex-1 font-medium italic">
                "{transcript || (isListening ? 'Gapirishingizni kutyapman...' : '')}"
              </p>
              {isListening && (
                <span className="text-white/70 text-[12px] font-mono tabular-nums shrink-0">
                  {listenTime}s
                </span>
              )}
            </div>
          )}

          {/* Mikrofon tugmasi */}
          <button
            onClick={handleToggle}
            className={`w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-3 transition-all duration-300 ${
              isListening
                ? 'bg-red-500 shadow-lg shadow-red-500/40'
                : 'bg-white shadow-lg'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 text-white" />
                <span className="text-white">To'xtatish</span>
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-indigo-600" />
                <span className="text-indigo-700">Tinglashni boshlash</span>
              </>
            )}
          </button>
        </div>

        {/* Natijalar ro'yxati (List) */}
        <div className="p-5 flex-1 overflow-y-auto min-h-[200px]">

          {/* Xato */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 text-[14px] font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Muvaffaqiyat */}
          {confirmed && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="font-bold text-emerald-800">Saqlandi</p>
                <p className="text-emerald-600 text-[13px]">{detectedCount} o'quvchiga baho qo'yildi!</p>
              </div>
            </div>
          )}

          {!confirmed && detectedCount > 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[13px] font-bold text-zinc-500 uppercase tracking-wide">
                  Topilgan baholar ({detectedCount})
                </h4>
              </div>
              
              <div className="space-y-2 mb-6">
                {Object.entries(detectedGrades).map(([name, score]) => {
                  const colors = gradeColor(score);
                  return (
                    <div key={name} className="flex items-center gap-3 bg-white border border-zinc-200 rounded-2xl p-3 shadow-sm animate-in slide-in-from-bottom-2">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg ${colors.bg}`}>
                        {score}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-zinc-900 truncate">{name}</p>
                      </div>
                      <button 
                        onClick={() => removeGrade(name)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Harakatlar */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-600 font-semibold rounded-2xl text-[14px]"
                >
                  Tozalash
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl text-[14px] flex items-center justify-center gap-2 shadow-lg"
                >
                  Tasdiqlash <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Hali natija yo'q — ko'rsatma */}
          {detectedCount === 0 && !error && !isListening && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Volume2 className="w-8 h-8 text-zinc-300" />
              </div>
              <p className="text-zinc-500 text-[14px] font-medium leading-relaxed">
                Tinglashni boshlang va xohlagancha qo'ying. <br/>
                Topilgan baholar shu yerda paydo bo'ladi.
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
  const [lastVoiceGradeMessage, setLastVoiceGradeMessage] = useState<string | null>(null);

  const handleGrade = (student: string, grade: number) => {
    setGrades((prev) => ({
      ...prev,
      [student]: prev[student] === grade ? null : grade,
    }));
  };

  const handleVoiceGradeMultiple = (multipleGrades: Record<string, number>) => {
    const changesCount = Object.keys(multipleGrades).length;
    if (changesCount === 0) return;

    setGrades(prev => ({ ...prev, ...multipleGrades }));
    setLastVoiceGradeMessage(`Ovoz orqali ${changesCount} ta baho saqlandi`);
    
    setTimeout(() => setLastVoiceGradeMessage(null), 3000);
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
      {lastVoiceGradeMessage && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm bg-emerald-500`}>
             <Check className="w-4 h-4" />
          </div>
          <p className="text-emerald-800 text-[13px] font-semibold flex-1">
            {lastVoiceGradeMessage}
          </p>
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
          return (
            <div
              key={student}
              className={`bg-white rounded-xl p-3 flex items-center justify-between shadow-sm transition-all duration-300`}
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
          onGradeMultiple={handleVoiceGradeMultiple}
          onClose={() => setShowVoicePanel(false)}
        />
      )}
    </div>
  );
}
