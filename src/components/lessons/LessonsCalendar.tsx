import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, FileText } from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────
interface CalLesson {
  id: string;
  title: string;
  classId: string;
  className: string;
  colorClass: string;    // Tailwind bg class
  pillClass: string;     // For pill bg/text color pair
  date: string;          // 'YYYY-MM-DD'
  status: 'Rejalashtirilmagan' | 'Rejalashtirilgan' | 'O\'tildi';
}

interface Props {
  activeClass: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const UZ_MONTHS = [
  'Yanvar','Fevral','Mart','Aprel','May','Iyun',
  'Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'
];

const UZ_DAYS = ['Dush','Sesh','Chor','Pay','Juma','Shan','Yak'];

// Pill classes per class name
function getPillClasses(className: string): string {
  const map: Record<string, string> = {
    '5-A': 'bg-rose-100 text-rose-700 border-rose-200',
    '5-B': 'bg-orange-100 text-orange-700 border-orange-200',
    '5-D': 'bg-amber-100 text-amber-700 border-amber-200',
    '6-A': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    '6-B': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    '6-D': 'bg-sky-100 text-sky-700 border-sky-200',
    '7-A': 'bg-blue-100 text-blue-700 border-blue-200',
    '7-B': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    '7-D': 'bg-purple-100 text-purple-700 border-purple-200',
    '8-A': 'bg-rose-100 text-rose-600 border-rose-200',
    '8-B': 'bg-orange-100 text-orange-600 border-orange-200',
    '9-A': 'bg-amber-100 text-amber-700 border-amber-200',
    '9-B': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return map[className] ?? 'bg-slate-100 text-slate-600 border-slate-200';
}

function getDotClass(className: string): string {
  const map: Record<string, string> = {
    '5-A': 'bg-rose-500', '5-B': 'bg-orange-500', '5-D': 'bg-amber-500',
    '6-A': 'bg-emerald-500', '6-B': 'bg-cyan-500', '6-D': 'bg-sky-500',
    '7-A': 'bg-blue-500', '7-B': 'bg-indigo-500', '7-D': 'bg-purple-500',
    '8-A': 'bg-rose-400', '8-B': 'bg-orange-400',
    '9-A': 'bg-amber-400', '9-B': 'bg-emerald-400',
  };
  return map[className] ?? 'bg-slate-400';
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const TODAY = new Date();
const Y = TODAY.getFullYear();
const M = TODAY.getMonth(); // 0-indexed

function d(day: number) {
  return `${Y}-${String(M + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

const INITIAL_LESSONS: CalLesson[] = [
  { id: 'l1', title: '01. Kompyuterda ma\'lumotlarni tartiblash', classId: '12', className: '9-A', colorClass: 'bg-amber-400', pillClass: '', date: d(TODAY.getDate()), status: 'Rejalashtirilgan' },
  { id: 'l2', title: '2-dars: Shaxsiy xavfsizlik va parollar',   classId: '12', className: '9-A', colorClass: 'bg-amber-400', pillClass: '', date: d(TODAY.getDate()), status: 'Rejalashtirilgan' },
  { id: 'l3', title: 'Grafika va multimedia asoslari',            classId: '13', className: '9-B', colorClass: 'bg-emerald-400', pillClass: '', date: d(Math.max(TODAY.getDate() - 2, 1)), status: 'O\'tildi' },
  { id: 'l4', title: 'Veb-sahifalar va HTML asoslari',           classId: '7',  className: '7-A', colorClass: 'bg-blue-500', pillClass: '', date: d(Math.min(TODAY.getDate() + 3, 28)), status: 'Rejalashtirilmagan' },
  { id: 'l5', title: 'Ma\'lumotlar bazasiga kirish',              classId: '12', className: '9-A', colorClass: 'bg-amber-400', pillClass: '', date: d(Math.min(TODAY.getDate() + 1, 28)), status: 'Rejalashtirilgan' },
  { id: 'l6', title: 'Elektron jadvallar bilan ishlash',         classId: '4',  className: '6-A', colorClass: 'bg-emerald-500', pillClass: '', date: d(Math.min(TODAY.getDate() + 5, 28)), status: 'Rejalashtirilmagan' },
  { id: 'l7', title: 'Onlayn xavfsizlik qoidalari',              classId: '1',  className: '5-A', colorClass: 'bg-rose-500', pillClass: '', date: d(Math.min(TODAY.getDate() + 2, 28)), status: 'Rejalashtirilmagan' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function pad(n: number) { return String(n).padStart(2, '0'); }
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function LessonsCalendar({ activeClass: _activeClass }: Props) {
  const [year, setYear] = useState(TODAY.getFullYear());
  const [month, setMonth] = useState(TODAY.getMonth());
  const [lessons, setLessons] = useState<CalLesson[]>(INITIAL_LESSONS);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [dragLesson, setDragLesson] = useState<CalLesson | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  // Calendar grid computation
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Shift so Monday=0
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const todayStr = toDateStr(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const getLessonsForDate = (dateStr: string) =>
    lessons.filter(l => l.date === dateStr);

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const handleDragStart = (lesson: CalLesson) => setDragLesson(lesson);
  const handleDragOver  = (dateStr: string, e: React.DragEvent) => {
    e.preventDefault(); setDragOverDate(dateStr);
  };
  const handleDrop = (dateStr: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!dragLesson) return;
    setLessons(prev => prev.map(l => l.id === dragLesson.id ? { ...l, date: dateStr } : l));
    setDragLesson(null); setDragOverDate(null);
  };
  const handleDragEnd = () => { setDragLesson(null); setDragOverDate(null); };

  // ── Selected day panel data ────────────────────────────────────────────────
  const selectedLessons   = selectedDay ? getLessonsForDate(selectedDay) : [];
  const selectedDateObj   = selectedDay ? new Date(selectedDay + 'T00:00:00') : null;

  // ─── Render Grid ─────────────────────────────────────────────────────────
  const cells: Array<{ dateStr: string; day: number } | null> = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push({ dateStr: toDateStr(year, month, d), day: d });
  // fill remaining to complete last week row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex h-full gap-6">

      {/* ── Calendar Panel ── */}
      <div className="flex-1 bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight min-w-[200px] text-center">
              {UZ_MONTHS[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => { setYear(TODAY.getFullYear()); setMonth(TODAY.getMonth()); }}
            className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[13px] font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Bugun
          </button>
        </div>

        {/* Day Names Row */}
        <div className="grid grid-cols-7 border-b border-slate-50 shrink-0">
          {UZ_DAYS.map(day => (
            <div key={day} className="py-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Grid Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-7 auto-rows-[minmax(100px,1fr)] h-full">
            {cells.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="border-b border-r border-slate-50 bg-slate-50/30" />;
              }
              const { dateStr, day } = cell;
              const isToday        = dateStr === todayStr;
              const isSelected     = dateStr === selectedDay;
              const isDragOver     = dateStr === dragOverDate;
              const dayLessons     = getLessonsForDate(dateStr);
              const isWeekend      = (idx % 7) >= 5; // Shan, Yak
              const isLastCol      = (idx % 7) === 6;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDay(selectedDay === dateStr ? null : dateStr)}
                  onDragOver={e => handleDragOver(dateStr, e)}
                  onDrop={e => handleDrop(dateStr, e)}
                  className={`
                    relative border-b border-r border-slate-100/80 p-2 cursor-pointer transition-colors group
                    ${isLastCol ? 'border-r-0' : ''}
                    ${isWeekend ? 'bg-slate-50/40' : 'bg-white'}
                    ${isSelected ? 'bg-blue-50/50 ring-1 ring-inset ring-blue-200' : ''}
                    ${isDragOver ? 'bg-amber-50 ring-1 ring-inset ring-amber-300' : ''}
                    hover:bg-slate-50/80
                  `}
                >
                  {/* Day Number */}
                  <div className="flex items-start justify-between mb-1.5">
                    <div className={`
                      w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-bold transition-colors
                      ${isToday ? 'bg-slate-900 text-white' : 'text-slate-600 group-hover:bg-slate-100'}
                    `}>
                      {day}
                    </div>

                    {/* Hover '+' button */}
                    <button
                      onClick={e => { e.stopPropagation(); /* Create lesson for this date */ }}
                      className="w-6 h-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-slate-100 text-slate-500 hover:bg-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Lesson Pills */}
                  <div className="space-y-1">
                    {dayLessons.slice(0, 3).map(lesson => (
                      <div
                        key={lesson.id}
                        draggable
                        onDragStart={() => handleDragStart(lesson)}
                        onDragEnd={handleDragEnd}
                        onClick={e => e.stopPropagation()}
                        className={`
                          flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] font-bold truncate cursor-grab active:cursor-grabbing
                          transition-all hover:shadow-sm hover:scale-[1.01]
                          ${getPillClasses(lesson.className)}
                        `}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotClass(lesson.className)}`} />
                        <span className="truncate">{lesson.title}</span>
                      </div>
                    ))}
                    {dayLessons.length > 3 && (
                      <div className="text-[11px] font-bold text-slate-400 pl-2">
                        +{dayLessons.length - 3} ta ko'proq
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Day Sidebar Panel ── */}
      {selectedDay && (
        <div className="w-[320px] shrink-0 bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
          
          {/* Header */}
          <div className="px-5 py-5 border-b border-slate-50 flex items-start justify-between shrink-0">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {selectedDateObj ? UZ_DAYS[(selectedDateObj.getDay() === 0 ? 6 : selectedDateObj.getDay() - 1)] : ''}
              </p>
              <h3 className="text-[22px] font-extrabold text-slate-900 tracking-tight leading-none">
                {selectedDateObj?.getDate()} {selectedDateObj ? UZ_MONTHS[selectedDateObj.getMonth()] : ''}
              </h3>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* New Lesson Button */}
          <div className="px-4 pt-4 pb-3 shrink-0">
            <button className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-slate-900 text-white text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-md">
              <Plus className="w-4 h-4" /> Yangi dars qo'shish
            </button>
          </div>

          {/* Lessons List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 scrollbar-hide">
            {selectedLessons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
                  <FileText className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-[13px] font-bold text-slate-500 mb-1">Darslar yo'q</p>
                <p className="text-[12px] font-medium text-slate-400 leading-relaxed">
                  Shu kunga dars<br/>rejalashtirilmagan
                </p>
              </div>
            ) : (
              selectedLessons.map(lesson => (
                <div
                  key={lesson.id}
                  className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${getPillClasses(lesson.className).split(' ').slice(0,1).join(' ')} border-opacity-50`}>
                    <FileText className="w-5 h-5 text-current opacity-60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-extrabold text-slate-900 leading-tight mb-1.5 line-clamp-2">
                      {lesson.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-bold ${getPillClasses(lesson.className)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${getDotClass(lesson.className)}`} />
                        {lesson.className}
                      </div>
                      <div className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        lesson.status === 'O\'tildi'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : lesson.status === 'Rejalashtirilgan'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'bg-orange-50 text-orange-600 border border-orange-200'
                      }`}>
                        {lesson.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
