import { useState } from 'react';
import { CalendarCheck } from 'lucide-react';

type DayStatus = 'keldi' | 'kelmadi' | 'kechikdi' | 'sababli' | 'dam' | null;

const weekdays = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya'];

const months = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
];

// March 2026 mock data (March 1 = Sunday, so offset = 6 for Monday-start)
const marchDays: (DayStatus)[] = [
  // March 2026: Sun Mar 1 => in Mon-start grid, offset 6
  null, null, null, null, null, null, 'dam', // row 1: Mon-Sun, only day 1 = Sunday = dam
  'keldi', 'keldi', 'keldi', 'keldi', 'keldi', 'dam', 'dam', // 2-8
  'keldi', 'keldi', 'kechikdi', 'keldi', 'keldi', 'dam', 'dam', // 9-15
  'keldi', 'keldi', 'keldi', 'kelmadi', 'keldi', 'dam', 'dam', // 16-22
  'keldi', 'keldi', 'keldi', 'keldi', 'sababli', 'dam', 'dam', // 23-29
  'keldi', 'keldi', null, null, null, null, null, // 30-31
];

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  keldi: { color: 'bg-emerald-500', bg: 'bg-emerald-50', label: 'Keldi' },
  kelmadi: { color: 'bg-red-500', bg: 'bg-red-50', label: 'Kelmadi' },
  kechikdi: { color: 'bg-amber-500', bg: 'bg-amber-50', label: 'Kechikdi' },
  sababli: { color: 'bg-purple-500', bg: 'bg-purple-50', label: 'Sababli' },
  dam: { color: 'bg-zinc-300', bg: 'bg-zinc-50', label: 'Dam olish' },
};

export default function ParentAttendance() {
  const [selectedMonth] = useState('Mart');

  const totalSchool = 22;
  const attended = 20;
  const late = 1;
  const excused = 1;
  const rate = Math.round((attended / totalSchool) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-zinc-800">Davomat</h1>
        </div>
        <select
          value={selectedMonth}
          onChange={() => {}}
          className="border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {months.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200">
        <h3 className="font-semibold text-zinc-700 mb-2">Bu oyda:</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <strong>{attended}/{totalSchool}</strong> kun keldi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <strong>{late}</strong> kechikdi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <strong>{excused}</strong> sababli
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-zinc-200">
          <h3 className="font-semibold text-zinc-700 mb-4">{selectedMonth} 2026</h3>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekdays.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-zinc-400">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2">
            {marchDays.map((status, i) => {
              if (status === null) {
                return <div key={i} className="h-10" />;
              }

              // Calculate day number
              const day = (() => {
                let count = 0;
                for (let j = 0; j <= i; j++) {
                  if (marchDays[j] !== null) count++;
                }
                return count;
              })();

              const cfg = statusConfig[status];

              return (
                <div
                  key={i}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center ${cfg.bg} relative`}
                  title={cfg.label}
                >
                  <span className="text-xs font-medium text-zinc-600">{day}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.color} mt-0.5`} />
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-zinc-100">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
                {cfg.label}
              </div>
            ))}
          </div>
        </div>

        {/* Donut chart */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 flex flex-col items-center justify-center">
          <h3 className="font-semibold text-zinc-700 mb-4">Davomat darajasi</h3>
          <div
            className="w-36 h-36 rounded-full flex items-center justify-center relative"
            style={{
              background: `conic-gradient(
                #10b981 0% ${rate}%,
                #e5e7eb ${rate}% 100%
              )`,
            }}
          >
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-600">{rate}%</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-zinc-500 text-center space-y-1">
            <p>Keldi: <strong className="text-emerald-600">{attended} kun</strong></p>
            <p>Kelmadi: <strong className="text-red-500">1 kun</strong></p>
            <p>Kechikdi: <strong className="text-amber-500">{late} kun</strong></p>
            <p>Sababli: <strong className="text-purple-500">{excused} kun</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
