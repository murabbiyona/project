import { useState } from 'react';
import { BarChart2 } from 'lucide-react';

const subjects = [
  { name: 'Matematika', avg: 4.2, count: 12, last5: [4, 5, 3, 5, 4] },
  { name: 'Ona tili', avg: 3.8, count: 10, last5: [3, 4, 4, 3, 5] },
  { name: 'Ingliz tili', avg: 4.5, count: 9, last5: [5, 4, 5, 4, 5] },
  { name: 'Tarix', avg: 3.5, count: 8, last5: [3, 4, 3, 3, 4] },
  { name: 'Fizika', avg: 4.0, count: 11, last5: [4, 4, 5, 3, 4] },
  { name: 'Biologiya', avg: 4.3, count: 10, last5: [5, 4, 4, 5, 4] },
];

const gradesTable = [
  { fan: 'Matematika', sana: '28-mart, 2026', baho: 5, turi: 'Og\'zaki', izoh: "Darsda faol qatnashdi" },
  { fan: 'Ona tili', sana: '27-mart, 2026', baho: 4, turi: 'Yozma', izoh: 'Insho yaxshi yozilgan' },
  { fan: 'Ingliz tili', sana: '26-mart, 2026', baho: 5, turi: 'Test', izoh: "Barcha savollarga to'g'ri javob" },
  { fan: 'Tarix', sana: '25-mart, 2026', baho: 3, turi: 'Og\'zaki', izoh: 'Mavzuni takrorlash kerak' },
  { fan: 'Fizika', sana: '24-mart, 2026', baho: 4, turi: 'Laboratoriya', izoh: 'Tajriba yaxshi bajarildi' },
  { fan: 'Biologiya', sana: '23-mart, 2026', baho: 5, turi: 'Yozma', izoh: "A'lo natija" },
  { fan: 'Matematika', sana: '22-mart, 2026', baho: 4, turi: 'Nazorat ishi', izoh: 'Bir xato bor edi' },
  { fan: 'Ona tili', sana: '21-mart, 2026', baho: 3, turi: 'Diktant', izoh: 'Imlo xatolari mavjud' },
  { fan: 'Ingliz tili', sana: '20-mart, 2026', baho: 4, turi: 'Og\'zaki', izoh: 'Talaffuz yaxshilangan' },
  { fan: 'Fizika', sana: '19-mart, 2026', baho: 5, turi: 'Test', izoh: "To'liq ball" },
];

const avgColor = (avg: number) =>
  avg >= 4.5 ? 'text-emerald-600' : avg >= 4.0 ? 'text-blue-600' : avg >= 3.5 ? 'text-amber-600' : 'text-red-500';

const barColor = (g: number) =>
  g === 5 ? 'bg-emerald-500' : g === 4 ? 'bg-blue-400' : g === 3 ? 'bg-amber-400' : 'bg-red-400';

const badgeColor = (g: number) =>
  g === 5
    ? 'bg-emerald-50 text-emerald-700'
    : g === 4
      ? 'bg-blue-50 text-blue-700'
      : g === 3
        ? 'bg-amber-50 text-amber-700'
        : 'bg-red-50 text-red-700';

export default function ParentGrades() {
  const [filter, setFilter] = useState('Barchasi');

  const filteredTable =
    filter === 'Barchasi' ? gradesTable : gradesTable.filter((r) => r.fan === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-zinc-800">Baholar</h1>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-zinc-300 rounded-lg px-3 py-2 text-sm text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option>Barchasi</option>
          {subjects.map((s) => (
            <option key={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Subject cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((s) => (
          <div key={s.name} className="bg-white rounded-2xl p-5 border border-zinc-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-zinc-700">{s.name}</h3>
              <span className="text-xs text-zinc-400">{s.count} ta baho</span>
            </div>
            <div className="flex items-end justify-between">
              <span className={`text-3xl font-bold ${avgColor(s.avg)}`}>{s.avg}</span>
              {/* Mini bar chart */}
              <div className="flex items-end gap-1 h-10">
                {s.last5.map((g, i) => (
                  <div
                    key={i}
                    className={`w-3 rounded-sm ${barColor(g)}`}
                    style={{ height: `${(g / 5) * 100}%` }}
                    title={`${g}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-2">O'rtacha baho</p>
          </div>
        ))}
      </div>

      {/* Full grades table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h3 className="font-semibold text-zinc-800">Barcha baholar</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 text-left">
                <th className="px-5 py-3 font-medium">Fan</th>
                <th className="px-5 py-3 font-medium">Sana</th>
                <th className="px-5 py-3 font-medium">Baho</th>
                <th className="px-5 py-3 font-medium">Turi</th>
                <th className="px-5 py-3 font-medium">Izoh</th>
              </tr>
            </thead>
            <tbody>
              {filteredTable.map((row, i) => (
                <tr key={i} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                  <td className="px-5 py-3 font-medium text-zinc-700">{row.fan}</td>
                  <td className="px-5 py-3 text-zinc-500">{row.sana}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${badgeColor(row.baho)}`}>
                      {row.baho}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-500">{row.turi}</td>
                  <td className="px-5 py-3 text-zinc-500">{row.izoh}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
