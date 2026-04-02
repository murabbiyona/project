import { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Check, X, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
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

// Animatsiyali to'lqin
function AudioWaves({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-3">
      {[1, 2, 3, 2, 1].map((h, i) => (
        <div
          key={i}
          className={`w-[2px] rounded-full transition-all duration-300 ${active ? 'bg-indigo-500' : 'bg-indigo-500/40'}`}
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

export default function MobileGrades() {
  const [selectedClass, setSelectedClass] = useState('5-A');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [grades, setGrades] = useState<Record<string, number | null>>({});

  // Voice Hook
  const {
    isListening,
    transcript, detectedGrades, error,
    startListening, stopListening, cancelResult, setError
  } = useVoiceMobileGrading();

  const [listenTime, setListenTime] = useState(0);
  const timerRef = useRef<any>(null);

  // Eng oxirgi qo'shilgan/o'zgargan ovozli baholar
  const [recentlyVoiced, setRecentlyVoiced] = useState<Record<string, boolean>>({});

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

  // Jonli ravishda `detectedGrades` ni asosiy jurnal `grades` array'iga yozish
  useEffect(() => {
    if (Object.keys(detectedGrades).length > 0) {
      setGrades(prev => {
        const next = { ...prev };
        let hasChanges = false;

        for (const [student, score] of Object.entries(detectedGrades)) {
          if (next[student] !== score) {
            next[student] = score;
            hasChanges = true;

            // Animatsiya uchun qayd etamiz
            setRecentlyVoiced(curr => ({ ...curr, [student]: true }));
            // 2 soniyadan so'ng animatsiyani o'chiramiz
            setTimeout(() => {
              setRecentlyVoiced(curr => {
                const updated = { ...curr };
                delete updated[student];
                return updated;
              });
            }, 2000);
          }
        }

        return hasChanges ? next : prev;
      });
    }
  }, [detectedGrades]);

  const handleGrade = (student: string, grade: number) => {
    setGrades((prev) => ({
      ...prev,
      [student]: prev[student] === grade ? null : grade,
    }));
  };

  const gradedCount = Object.values(grades).filter(Boolean).length;

  return (
    <div className="space-y-4 pb-28 relative">
      {/* Header - Endi u ekranda (tepada) doimiy qoladi va chiroyli effektga ega */}
      <div className="sticky -top-4 z-40 -mx-4 px-4 pt-4 pb-3 bg-white/85 backdrop-blur-2xl border-b border-zinc-200/50 shadow-sm mix-blend-multiply transition-all duration-300 flex items-center justify-between">
        <h1 className="text-[22px] font-black text-zinc-900 tracking-tight">Tezkor baholash</h1>

        {/* Yuqoridagi Ovoz tugmasi */}
        {!isListening && (
           <button
             onClick={() => startListening(mockStudents)}
             className="flex items-center gap-2 px-4 py-2 bg-gradient-to-tr from-indigo-50 to-violet-50 text-indigo-700 border border-indigo-100 rounded-xl font-bold text-[13px] shadow-sm active:scale-95 transition-all hover:shadow-md hover:border-indigo-200"
           >
             <Mic className="w-4 h-4 fill-indigo-200" />
             Jonli Ovoz
           </button>
        )}
      </div>

      {/* Xatolik xabari */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 text-[13px] font-medium flex-1">{error}</p>
          <button onClick={() => setError(null)}><X className="w-4 h-4 text-red-400" /></button>
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
      <div className="space-y-2 relative">
        {mockStudents.map((student, i) => {
          const currentGrade = grades[student];
          const isJustVoiced = recentlyVoiced[student];

          return (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10px" }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              key={student}
              className={`bg-white rounded-xl p-3 shadow-sm transition-all duration-500 relative overflow-hidden ${
                isJustVoiced ? 'ring-2 ring-indigo-500 shadow-indigo-200 scale-[1.02] z-10' : ''
              }`}
            >
              {/* Ovoz animatsiyasi */}
              {isJustVoiced && (
                <div className="absolute top-0 right-0 left-0 h-0.5 bg-indigo-500 animate-pulse" />
              )}

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    currentGrade
                      ? `${gradeColor(currentGrade).bg} text-white shadow-sm`
                      : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {currentGrade || (i + 1)}
                  </span>
                  <div className="flex flex-col">
                     <span className={`text-[14px] font-bold transition-colors ${isJustVoiced ? 'text-indigo-700' : 'text-zinc-900'}`}>{student}</span>
                     {isJustVoiced ? (
                        <span className="text-[10px] uppercase font-black text-indigo-500 tracking-wider flex items-center gap-1">
                          🎙 Ovozdan olingan
                        </span>
                     ) : (
                        <span className="text-[11px] font-medium text-zinc-400">Jurnal ID: {2000 + i}</span>
                     )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {gradeValues.map((grade) => {
                  const colors = gradeColor(grade);
                  const isSelected = grades[student] === grade;

                  return (
                    <button
                      key={grade}
                      onClick={() => handleGrade(student, grade)}
                      className={`flex-1 h-11 rounded-lg text-[15px] font-black transition-all duration-300 ${
                        isSelected
                          ? `${colors.bg} text-white shadow-md transform scale-100`
                          : 'bg-zinc-50 text-zinc-400 active:scale-95 border-2 border-transparent'
                      }`}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Ekran ostidagi suzuvchi panel */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md pb-[75px] pt-12 px-4 bg-gradient-to-t from-zinc-100 via-zinc-100/90 to-transparent pointer-events-none z-40">
        <div className="w-full pointer-events-auto">

          {/* KUZATISH PANELI (OVOZ YOZILAYOTGANDA) */}
          {isListening ? (
             <div className="bg-white border-[3px] border-indigo-500 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
               <div className="px-4 py-3 bg-indigo-50 flex items-center justify-between border-b border-indigo-100">
                  <div className="flex items-center gap-2">
                    <AudioWaves active={isListening} />
                    <span className="text-[13px] font-black text-indigo-900 tracking-wide uppercase">
                      Tinglanmoqda
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-indigo-500 font-mono">{listenTime}s</span>
                    <button
                      onClick={() => { stopListening(); cancelResult(); }}
                      className="flex items-center gap-1 text-[12px] font-bold text-white bg-red-500 px-3 py-1.5 rounded-lg active:scale-95"
                    >
                      <MicOff className="w-3.5 h-3.5" /> To'xtatish
                    </button>
                  </div>
               </div>

               <div className="p-4 bg-white relative">
                 <p className={`text-[14px] font-medium leading-relaxed italic ${transcript ? 'text-indigo-800' : 'text-zinc-400'}`}>
                   "{transcript || 'O\'quvchi ismini va bahoni ayting (Masalan: Jasurga besh)...'}"
                 </p>

                 {Object.keys(detectedGrades).length > 0 && (
                   <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-md">
                     <Check className="w-3.5 h-3.5 text-emerald-600" />
                     <span className="text-[11px] font-bold text-emerald-700">
                       Hozirgacha {Object.keys(detectedGrades).length} ta baho kiritildi
                     </span>
                   </div>
                 )}
               </div>
             </div>
          ) : (
             <div className="flex gap-3">
               <button
                 onClick={() => startListening(mockStudents)}
                 className="flex flex-col items-center justify-center w-[72px] h-[60px] bg-white border border-indigo-100 text-indigo-600 rounded-2xl shadow-sm active:bg-indigo-50 transition-colors"
               >
                 <Mic className="w-6 h-6 mb-1" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Ovoz</span>
               </button>

               <button className="flex-1 h-[60px] bg-emerald-500 text-white font-bold text-[16px] rounded-2xl active:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 border border-emerald-400">
                 Jurnalni Saqlash
                 <span className="bg-white text-emerald-600 px-2.5 py-0.5 rounded-lg text-[13px]">
                   {gradedCount}
                 </span>
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
