import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Zap, RotateCcw, Send, ChevronLeft, ChevronRight,
  Undo2, Users, Target, BarChart2, Timer
} from 'lucide-react';

interface StudentGrade {
  name: string;
  grade: number | null;
  timestamp?: string;
}

const mockStudents = [
  'Karimov Jasur', 'Abdullayeva Madina', 'Toshmatov Sardor',
  'Rahimova Zilola', 'Nazarov Bobur', 'Islomova Shahlo',
  'Umarov Azizbek', 'Xolmatova Dilfuza', 'Ergashev Sherzod',
  'Qodirova Kamola', 'Aliyev Firdavs', 'Mirzayeva Gulnora',
  'Raximov Otabek', 'Tursunova Mohira', 'Sobirov Ulugbek',
];

const classOptions = ['5-A', '5-B', '6-A', '6-B', '7-A'];
const subjectOptions = ['Matematika', 'Algebra', 'Geometriya', 'Fizika'];

const gradeColors: Record<number, { bg: string; text: string; ring: string; label: string }> = {
  5: { bg: 'bg-emerald-500', text: 'text-white', ring: 'ring-emerald-300', label: "A'lo" },
  4: { bg: 'bg-blue-500', text: 'text-white', ring: 'ring-blue-300', label: 'Yaxshi' },
  3: { bg: 'bg-yellow-500', text: 'text-white', ring: 'ring-yellow-300', label: 'Qoniqarli' },
  2: { bg: 'bg-red-500', text: 'text-white', ring: 'ring-red-300', label: 'Qoniqarsiz' },
};

type ViewMode = 'single' | 'list';

export default function MobileRemote() {
  const [selectedClass, setSelectedClass] = useState('5-A');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [students, setStudents] = useState<StudentGrade[]>(
    mockStudents.map(name => ({ name, grade: null }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Session timer
  useEffect(() => {
    if (isSessionActive) {
      timerRef.current = setInterval(() => setSessionTime(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const playHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleGrade = useCallback((grade: number) => {
    playHaptic();
    const now = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    setStudents(prev => prev.map((s, i) =>
      i === currentIndex ? { ...s, grade, timestamp: now } : s
    ));
    // Auto-advance to next ungraded student
    setTimeout(() => {
      setCurrentIndex(prev => {
        const next = students.findIndex((st, i) => i > prev && st.grade === null);
        if (next !== -1) return next;
        // Check from beginning
        const fromStart = students.findIndex((st, i) => i !== prev && st.grade === null);
        return fromStart !== -1 ? fromStart : prev;
      });
    }, 300);
  }, [currentIndex, students]);

  const undoGrade = useCallback(() => {
    setStudents(prev => prev.map((s, i) =>
      i === currentIndex ? { ...s, grade: null, timestamp: undefined } : s
    ));
  }, [currentIndex]);

  const goNext = () => setCurrentIndex(prev => Math.min(prev + 1, students.length - 1));
  const goPrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  const gradedCount = students.filter(s => s.grade !== null).length;
  const avgGrade = gradedCount > 0
    ? (students.filter(s => s.grade !== null).reduce((sum, s) => sum + (s.grade || 0), 0) / gradedCount).toFixed(1)
    : '—';

  const gradeDistribution = { 5: 0, 4: 0, 3: 0, 2: 0 };
  students.forEach(s => { if (s.grade) gradeDistribution[s.grade as keyof typeof gradeDistribution]++; });

  const currentStudent = students[currentIndex];

  const startSession = () => {
    setIsSessionActive(true);
    setSessionTime(0);
    setStudents(mockStudents.map(name => ({ name, grade: null })));
    setCurrentIndex(0);
  };

  const endSession = () => {
    setIsSessionActive(false);
    alert(`Baholash yakunlandi!\n\n${selectedClass} — ${selectedSubject}\nBaholandi: ${gradedCount}/${students.length}\nO'rtacha: ${avgGrade}\nVaqt: ${formatTime(sessionTime)}`);
  };

  // Pre-session screen
  if (!isSessionActive) {
    return (
      <div className="space-y-5 px-4 pb-20">
        <div className="text-center pt-6">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Pult rejimi</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Tezkor baholash — bir tugma bosish bilan</p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Sinf</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {classOptions.map(c => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`flex-shrink-0 h-12 px-5 rounded-xl text-sm font-semibold transition-all ${
                  selectedClass === c ? 'bg-purple-500 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/20' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-2">Fan</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {subjectOptions.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={`flex-shrink-0 h-12 px-5 rounded-xl text-sm font-semibold transition-all ${
                  selectedSubject === s ? 'bg-blue-500 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startSession}
          className="w-full h-14 bg-purple-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 active:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/20 mt-4 transition-all"
        >
          <Zap className="w-6 h-6" />
          Boshlash
        </button>

        {/* How it works */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 space-y-3 border border-zinc-100 dark:border-zinc-800 transition-colors">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">Qanday ishlaydi?</h3>
          <div className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex gap-3 items-center"><span className="w-5 h-5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span> O'quvchi nomini ko'rasiz</div>
            <div className="flex gap-3 items-center"><span className="w-5 h-5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span> 2-3-4-5 tugmalaridan birini bosasiz</div>
            <div className="flex gap-3 items-center"><span className="w-5 h-5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span> Avtomatik keyingi o'quvchiga o'tadi</div>
            <div className="flex gap-3 items-center"><span className="w-5 h-5 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">4</span> Yakunlash — natijalar saqlanadi</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-20 px-4 max-w-lg mx-auto">
      {/* Session header */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-white">{selectedClass} · {selectedSubject}</h1>
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1 font-mono"><Timer className="w-3 h-3 text-purple-500" />{formatTime(sessionTime)}</span>
            <span className="flex items-center gap-1 font-mono"><Users className="w-3 h-3 text-blue-500" />{gradedCount}/{students.length}</span>
            <span className="flex items-center gap-1 font-mono"><Target className="w-3 h-3 text-emerald-500" />Ø {avgGrade}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'list' : 'single')}
            className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-all active:scale-95"
          >
            <BarChart2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Mini progress */}
      <div className="flex gap-1 py-1">
        {students.map((st, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`flex-1 h-2 rounded-full cursor-pointer transition-all ${
              st.grade === 5 ? 'bg-emerald-500' :
              st.grade === 4 ? 'bg-blue-500' :
              st.grade === 3 ? 'bg-yellow-500' :
              st.grade === 2 ? 'bg-red-500' :
              i === currentIndex ? 'bg-zinc-400 dark:bg-zinc-500' : 'bg-zinc-200 dark:bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {viewMode === 'single' ? (
        <>
          {/* Student card - PULT MODE */}
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-zinc-100 dark:border-zinc-800 p-8 text-center relative overflow-hidden transition-all">
            {/* Background grade indicator */}
            {currentStudent.grade && (
              <div className={`absolute inset-0 opacity-[0.03] dark:opacity-[0.08] ${gradeColors[currentStudent.grade].bg}`} />
            )}

            <div className="relative z-10">
              {/* Navigation arrows */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="w-11 h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center disabled:opacity-20 transition-all active:scale-90"
                >
                  <ChevronLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                </button>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest">{currentIndex + 1} / {students.length}</span>
                <button
                  onClick={goNext}
                  disabled={currentIndex === students.length - 1}
                  className="w-11 h-11 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center disabled:opacity-20 transition-all active:scale-90"
                >
                  <ChevronRight className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                </button>
              </div>

              {/* Student avatar */}
              <div className={`w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-5 text-3xl font-black transition-all shadow-xl ${
                currentStudent.grade
                  ? `${gradeColors[currentStudent.grade].bg} ${gradeColors[currentStudent.grade].text} scale-105`
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600'
              }`}>
                {currentStudent.grade || currentStudent.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Student name */}
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white capitalize tracking-tight leading-tight">{currentStudent.name}</h2>
              {currentStudent.grade && (
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mt-2 uppercase tracking-wide">
                  {gradeColors[currentStudent.grade].label} · {currentStudent.timestamp}
                </p>
              )}

              {/* GRADE BUTTONS - the main "pult" */}
              <div className="grid grid-cols-4 gap-3 mt-8">
                {[5, 4, 3, 2].map(grade => (
                  <button
                    key={grade}
                    onClick={() => handleGrade(grade)}
                    className={`h-20 rounded-2xl flex flex-col items-center justify-center gap-1 font-black text-2xl transition-all active:scale-90 ${
                      currentStudent.grade === grade
                        ? `${gradeColors[grade].bg} ${gradeColors[grade].text} ring-4 ${gradeColors[grade].ring} shadow-xl shadow-current/20`
                        : `bg-zinc-50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 border-2 border-zinc-100 dark:border-zinc-800`
                    }`}
                  >
                    {grade}
                    <span className="text-[9px] font-black opacity-60 uppercase tracking-tighter">{gradeColors[grade].label}</span>
                  </button>
                ))}
              </div>

              {/* Undo button */}
              {currentStudent.grade && (
                <button
                  onClick={undoGrade}
                  className="mt-6 h-12 px-6 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-bold flex items-center gap-2 mx-auto active:bg-zinc-200 dark:active:bg-zinc-700 transition-all"
                >
                  <Undo2 className="w-4 h-4" /> Bekor qilish
                </button>
              )}
            </div>
          </div>

          {/* Quick grade distribution */}
          <div className="flex gap-2">
            {[5, 4, 3, 2].map(grade => (
              <div key={grade} className={`flex-1 rounded-2xl p-3 text-center transition-all ${
                gradeDistribution[grade as keyof typeof gradeDistribution] > 0
                  ? `${gradeColors[grade].bg} ${gradeColors[grade].text} shadow-md`
                  : 'bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-700 border border-zinc-100 dark:border-zinc-800'
              }`}>
                <div className="text-xl font-black">{gradeDistribution[grade as keyof typeof gradeDistribution]}</div>
                <div className="text-[9px] font-black opacity-80 uppercase tracking-tighter">{gradeColors[grade].label}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* LIST MODE - see all students at once */
        <div className="space-y-2 max-h-[50vh] overflow-y-auto scrollbar-hide">
          {students.map((student, i) => (
            <div
              key={i}
              onClick={() => { setCurrentIndex(i); setViewMode('single'); }}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${
                i === currentIndex 
                  ? 'bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-200 dark:ring-purple-900/40' 
                  : 'bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-7 h-7 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-[10px] font-black text-zinc-500 dark:text-zinc-400 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{student.name}</span>
              </div>
              {student.grade ? (
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-black ${gradeColors[student.grade].bg} ${gradeColors[student.grade].text} shadow-sm`}>
                  {student.grade}
                </span>
              ) : (
                <span className="w-10 h-10 rounded-xl flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 text-base font-black">
                  —
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Session control buttons */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={() => {
            if (confirm("Barcha baholarni tozalashni xohlaysizmi?")) {
              setStudents(mockStudents.map(name => ({ name, grade: null })));
              setCurrentIndex(0);
            }
          }}
          className="flex-1 h-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <RotateCcw className="w-5 h-5" /> Tozalash
        </button>
        <button
          onClick={endSession}
          disabled={gradedCount === 0}
          className="flex-1 h-16 bg-purple-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-purple-500/20"
        >
          <Send className="w-5 h-5" /> Yakunlash
        </button>
      </div>
    </div>
  );
}
