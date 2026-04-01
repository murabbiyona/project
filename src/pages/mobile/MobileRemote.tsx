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
        const next = students.findIndex((s, i) => i > prev && s.grade === null);
        if (next !== -1) return next;
        // Check from beginning
        const fromStart = students.findIndex((s, i) => i !== prev && s.grade === null);
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
      <div className="space-y-5">
        <div className="text-center pt-6">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Pult rejimi</h1>
          <p className="text-sm text-zinc-500 mt-1">Tezkor baholash — bir tugma bosish bilan</p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-700">Sinf</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {classOptions.map(c => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`flex-shrink-0 h-12 px-5 rounded-xl text-sm font-semibold transition-all ${
                  selectedClass === c ? 'bg-purple-500 text-white shadow-lg shadow-purple-200' : 'bg-white text-zinc-600 border border-zinc-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="text-sm font-medium text-zinc-700 mt-2">Fan</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {subjectOptions.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={`flex-shrink-0 h-12 px-5 rounded-xl text-sm font-semibold transition-all ${
                  selectedSubject === s ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-white text-zinc-600 border border-zinc-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startSession}
          className="w-full h-14 bg-purple-600 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 active:bg-purple-700 shadow-lg shadow-purple-200 mt-4"
        >
          <Zap className="w-6 h-6" />
          Boshlash
        </button>

        {/* How it works */}
        <div className="bg-zinc-50 rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700">Qanday ishlaydi?</h3>
          <div className="space-y-2 text-xs text-zinc-500">
            <div className="flex gap-2"><span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span> O'quvchi nomini ko'rasiz</div>
            <div className="flex gap-2"><span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span> 2-3-4-5 tugmalaridan birini bosasiz</div>
            <div className="flex gap-2"><span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span> Avtomatik keyingi o'quvchiga o'tadi</div>
            <div className="flex gap-2"><span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">4</span> Yakunlash — natijalar saqlanadi</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-4">
      {/* Session header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-zinc-900">{selectedClass} · {selectedSubject}</h1>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><Timer className="w-3 h-3" />{formatTime(sessionTime)}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{gradedCount}/{students.length}</span>
            <span className="flex items-center gap-1"><Target className="w-3 h-3" />Ø {avgGrade}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'list' : 'single')}
            className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center"
          >
            <BarChart2 className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Mini progress */}
      <div className="flex gap-0.5">
        {students.map((s, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`flex-1 h-1.5 rounded-full cursor-pointer transition-all ${
              s.grade === 5 ? 'bg-emerald-500' :
              s.grade === 4 ? 'bg-blue-500' :
              s.grade === 3 ? 'bg-yellow-500' :
              s.grade === 2 ? 'bg-red-500' :
              i === currentIndex ? 'bg-zinc-400' : 'bg-zinc-200'
            }`}
          />
        ))}
      </div>

      {viewMode === 'single' ? (
        <>
          {/* Student card - PULT MODE */}
          <div className="bg-white rounded-3xl shadow-sm p-6 text-center relative overflow-hidden">
            {/* Background grade indicator */}
            {currentStudent.grade && (
              <div className={`absolute inset-0 opacity-5 ${gradeColors[currentStudent.grade].bg}`} />
            )}

            <div className="relative z-10">
              {/* Navigation arrows */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5 text-zinc-600" />
                </button>
                <span className="text-xs text-zinc-400 font-mono">{currentIndex + 1} / {students.length}</span>
                <button
                  onClick={goNext}
                  disabled={currentIndex === students.length - 1}
                  className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5 text-zinc-600" />
                </button>
              </div>

              {/* Student avatar */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold ${
                currentStudent.grade
                  ? `${gradeColors[currentStudent.grade].bg} ${gradeColors[currentStudent.grade].text}`
                  : 'bg-zinc-100 text-zinc-400'
              }`}>
                {currentStudent.grade || currentStudent.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Student name */}
              <h2 className="text-xl font-bold text-zinc-900">{currentStudent.name}</h2>
              {currentStudent.grade && (
                <p className="text-sm text-zinc-500 mt-1">
                  {gradeColors[currentStudent.grade].label} · {currentStudent.timestamp}
                </p>
              )}

              {/* GRADE BUTTONS - the main "pult" */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                {[5, 4, 3, 2].map(grade => (
                  <button
                    key={grade}
                    onClick={() => handleGrade(grade)}
                    className={`h-16 rounded-2xl flex flex-col items-center justify-center gap-0.5 font-bold text-xl transition-all active:scale-95 ${
                      currentStudent.grade === grade
                        ? `${gradeColors[grade].bg} ${gradeColors[grade].text} ring-4 ${gradeColors[grade].ring} shadow-lg`
                        : `bg-zinc-50 text-zinc-700 border-2 border-zinc-200`
                    }`}
                  >
                    {grade}
                    <span className="text-[9px] font-medium opacity-70">{gradeColors[grade].label}</span>
                  </button>
                ))}
              </div>

              {/* Undo button */}
              {currentStudent.grade && (
                <button
                  onClick={undoGrade}
                  className="mt-3 h-10 px-4 rounded-xl bg-zinc-100 text-zinc-600 text-sm font-medium flex items-center gap-1.5 mx-auto"
                >
                  <Undo2 className="w-4 h-4" /> Bekor qilish
                </button>
              )}
            </div>
          </div>

          {/* Quick grade distribution */}
          <div className="flex gap-2">
            {[5, 4, 3, 2].map(grade => (
              <div key={grade} className={`flex-1 rounded-xl p-2 text-center ${
                gradeDistribution[grade as keyof typeof gradeDistribution] > 0
                  ? `${gradeColors[grade].bg} ${gradeColors[grade].text}`
                  : 'bg-white text-zinc-400 border border-zinc-200'
              }`}>
                <div className="text-lg font-bold">{gradeDistribution[grade as keyof typeof gradeDistribution]}</div>
                <div className="text-[10px] font-medium opacity-80">{gradeColors[grade].label}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* LIST MODE - see all students at once */
        <div className="space-y-1.5 max-h-[55vh] overflow-y-auto">
          {students.map((student, i) => (
            <div
              key={i}
              onClick={() => { setCurrentIndex(i); setViewMode('single'); }}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                i === currentIndex ? 'bg-purple-50 ring-2 ring-purple-200' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center text-[10px] font-medium text-zinc-500 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-zinc-900 truncate">{student.name}</span>
              </div>
              {student.grade ? (
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${gradeColors[student.grade].bg} ${gradeColors[student.grade].text}`}>
                  {student.grade}
                </span>
              ) : (
                <span className="w-9 h-9 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-200 text-zinc-300 text-sm">
                  —
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Session control buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setStudents(mockStudents.map(name => ({ name, grade: null })));
            setCurrentIndex(0);
          }}
          className="flex-1 h-12 bg-zinc-100 text-zinc-700 font-semibold rounded-xl flex items-center justify-center gap-2 active:bg-zinc-200"
        >
          <RotateCcw className="w-5 h-5" /> Tozalash
        </button>
        <button
          onClick={endSession}
          disabled={gradedCount === 0}
          className="flex-1 h-12 bg-purple-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:bg-purple-700 disabled:opacity-40"
        >
          <Send className="w-5 h-5" /> Yakunlash
        </button>
      </div>
    </div>
  );
}
