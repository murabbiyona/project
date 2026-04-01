import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const dayNames = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'];

type DayStatus = 'keldi' | 'kelmadi' | 'kechikdi' | 'dam' | null;

// March 2026: starts on Sunday (index 6 in Du-Ya week)
// 31 days
const marchData: Record<number, DayStatus> = {
  1: 'dam', // Ya
  2: 'keldi', 3: 'keldi', 4: 'keldi', 5: 'keldi', 6: 'keldi', 7: 'dam', 8: 'dam',
  9: 'keldi', 10: 'keldi', 11: 'kechikdi', 12: 'keldi', 13: 'keldi', 14: 'dam', 15: 'dam',
  16: 'keldi', 17: 'keldi', 18: 'keldi', 19: 'keldi', 20: 'keldi', 21: 'dam', 22: 'dam',
  23: 'keldi', 24: 'keldi', 25: 'keldi', 26: 'kelmadi', 27: 'keldi', 28: 'dam', 29: 'dam',
  30: 'keldi', 31: 'keldi',
};

const statusColors: Record<string, string> = {
  keldi: 'bg-emerald-500',
  kelmadi: 'bg-red-500',
  kechikdi: 'bg-amber-500',
  dam: 'bg-zinc-300',
};

const statusLabels = [
  { key: 'keldi', label: 'Keldi', color: 'bg-emerald-500' },
  { key: 'kelmadi', label: 'Kelmadi', color: 'bg-red-500' },
  { key: 'kechikdi', label: 'Kechikdi', color: 'bg-amber-500' },
  { key: 'dam', label: 'Dam olish', color: 'bg-zinc-300' },
];

function buildCalendarGrid(): (number | null)[] {
  // March 2026: March 1 is a Sunday
  // Du=0 Se=1 Cho=2 Pa=3 Ju=4 Sha=5 Ya=6
  const startDayOfWeek = 6; // Sunday = Ya (index 6)
  const daysInMonth = 31;
  const grid: (number | null)[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    grid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(d);
  }
  while (grid.length % 7 !== 0) {
    grid.push(null);
  }
  return grid;
}

export default function ParentAppAttendance() {
  const [month] = useState('Mart 2026');
  const grid = buildCalendarGrid();

  const present = Object.values(marchData).filter((s) => s === 'keldi').length;
  const late = Object.values(marchData).filter((s) => s === 'kechikdi').length;
  const absent = Object.values(marchData).filter((s) => s === 'kelmadi').length;
  const totalSchoolDays = present + late + absent;
  const percentage = Math.round(((present + late) / totalSchoolDays) * 100);

  return (
    <div className="space-y-5">
      {/* Month Selector */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-3">
        <button className="w-12 h-12 rounded-xl flex items-center justify-center active:bg-zinc-100">
          <ChevronLeft className="w-5 h-5 text-zinc-600" />
        </button>
        <span className="text-base font-semibold text-zinc-800">{month}</span>
        <button className="w-12 h-12 rounded-xl flex items-center justify-center active:bg-zinc-100">
          <ChevronRight className="w-5 h-5 text-zinc-600" />
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
          <span className="text-emerald-600 font-semibold">{present} kun keldi</span>
          <span className="text-zinc-300">/</span>
          <span className="text-amber-600 font-semibold">{late} kechikdi</span>
          <span className="text-zinc-300">/</span>
          <span className="text-red-600 font-semibold">{absent} sababli</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-zinc-400 py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {grid.map((day, i) => {
            if (day === null) {
              return <div key={i} className="aspect-square" />;
            }
            const status = marchData[day];
            return (
              <div
                key={i}
                className="aspect-square flex flex-col items-center justify-center rounded-lg"
              >
                <span className="text-xs text-zinc-600 mb-0.5">{day}</span>
                {status && (
                  <span
                    className={`w-3 h-3 rounded-full ${statusColors[status]}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
          {statusLabels.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${s.color}`} />
              <span className="text-xs text-zinc-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Percentage Circle */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center relative"
          style={{
            background: `conic-gradient(#059669 ${percentage * 3.6}deg, #e4e4e7 ${percentage * 3.6}deg)`,
          }}
        >
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
            <span className="text-3xl font-bold text-emerald-600">{percentage}%</span>
          </div>
        </div>
        <p className="text-sm text-zinc-500 mt-3">Umumiy davomat ko'rsatkichi</p>
      </div>
    </div>
  );
}
