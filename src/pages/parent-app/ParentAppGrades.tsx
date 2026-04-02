import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';

const subjects = [
  {
    name: 'Matematika',
    average: 4.2,
    trend: 'up' as const,
    lastFive: [4, 5, 4, 3, 5],
    grades: [
      { date: '28-mart', grade: 5, type: 'Nazorat ishi' },
      { date: '25-mart', grade: 3, type: 'Javob' },
      { date: '20-mart', grade: 4, type: 'Uy vazifa' },
      { date: '15-mart', grade: 5, type: 'Javob' },
      { date: '10-mart', grade: 4, type: 'Nazorat ishi' },
    ],
  },
  {
    name: 'Ona tili',
    average: 4.6,
    trend: 'up' as const,
    lastFive: [5, 4, 5, 5, 4],
    grades: [
      { date: '27-mart', grade: 4, type: 'Diktant' },
      { date: '22-mart', grade: 5, type: 'Insho' },
      { date: '18-mart', grade: 5, type: 'Javob' },
    ],
  },
  {
    name: 'Ingliz tili',
    average: 3.8,
    trend: 'down' as const,
    lastFive: [4, 3, 4, 3, 5],
    grades: [
      { date: '26-mart', grade: 5, type: 'Test' },
      { date: '21-mart', grade: 3, type: 'Javob' },
      { date: '16-mart', grade: 3, type: 'Uy vazifa' },
    ],
  },
  {
    name: 'Tarix',
    average: 4.4,
    trend: 'up' as const,
    lastFive: [5, 4, 4, 5, 4],
    grades: [
      { date: '27-mart', grade: 4, type: 'Javob' },
      { date: '20-mart', grade: 5, type: 'Referat' },
    ],
  },
  {
    name: 'Fizika',
    average: 3.6,
    trend: 'down' as const,
    lastFive: [3, 4, 3, 4, 4],
    grades: [
      { date: '25-mart', grade: 4, type: 'Laboratoriya' },
      { date: '18-mart', grade: 3, type: 'Nazorat ishi' },
    ],
  },
  {
    name: 'Biologiya',
    average: 4.8,
    trend: 'up' as const,
    lastFive: [5, 5, 4, 5, 5],
    grades: [
      { date: '26-mart', grade: 5, type: 'Javob' },
      { date: '19-mart', grade: 5, type: 'Referat' },
    ],
  },
];

const filters = ['Barchasi', 'Matematika', 'Ona tili', 'Ingliz tili', 'Tarix', 'Fizika', 'Biologiya'];

function gradeColor(g: number) {
  if (g >= 5) return 'bg-emerald-500';
  if (g >= 4) return 'bg-blue-500';
  if (g >= 3) return 'bg-amber-500';
  return 'bg-red-500';
}

function dotColor(g: number) {
  if (g >= 5) return 'bg-emerald-400';
  if (g >= 4) return 'bg-blue-400';
  if (g >= 3) return 'bg-amber-400';
  return 'bg-red-400';
}

export default function ParentAppGrades() {
  const [activeFilter, setActiveFilter] = useState('Barchasi');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const filtered =
    activeFilter === 'Barchasi'
      ? subjects
      : subjects.filter((s) => s.name === activeFilter);

  const overallAverage = (subjects.reduce((a, s) => a + s.average, 0) / subjects.length).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 h-12 px-4 rounded-full text-sm font-medium transition-colors ${
              activeFilter === f
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-zinc-600 border border-zinc-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Subject Cards */}
      <div className="space-y-3">
        {filtered.map((subject) => {
          const isExpanded = expandedSubject === subject.name;
          return (
            <div key={subject.name} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-zinc-800">{subject.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-zinc-900">{subject.average}</span>
                    {subject.trend === 'up' ? (
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 mr-1">Oxirgi 5:</span>
                  {subject.lastFive.map((g, i) => (
                    <span
                      key={i}
                      className={`w-7 h-7 rounded-full ${dotColor(g)} text-white text-xs font-bold flex items-center justify-center`}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Expand Toggle */}
              <button
                onClick={() => setExpandedSubject(isExpanded ? null : subject.name)}
                className="w-full h-12 flex items-center justify-center gap-1 text-sm text-emerald-600 font-medium border-t border-zinc-100 active:bg-zinc-50"
              >
                Batafsil
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Expanded Grades */}
              {isExpanded && (
                <div className="border-t border-zinc-100 px-4 pb-4">
                  <div className="space-y-2 pt-3">
                    {subject.grades.map((g, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-zinc-700">{g.type}</p>
                          <p className="text-xs text-zinc-400">{g.date}</p>
                        </div>
                        <span
                          className={`${gradeColor(g.grade)} text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold`}
                        >
                          {g.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Stats */}
      <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
        <h3 className="text-base font-semibold text-emerald-800 mb-2">Umumiy ko'rsatkichlar</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-700">{overallAverage}</p>
            <p className="text-xs text-emerald-600">O'rtacha baho</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-700">6</p>
            <p className="text-xs text-emerald-600">Fanlar soni</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-700">22</p>
            <p className="text-xs text-emerald-600">Jami baholar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
