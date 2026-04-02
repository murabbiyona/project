import { Trophy, UserCheck, CalendarCheck, TrendingUp, AlertTriangle, Brain, FileText } from 'lucide-react';

const statCards = [
  { label: 'Eng yaxshi sinf', value: '7-A (4.2)', icon: Trophy, color: 'bg-amber-500' },
  { label: "Eng faol o'qituvchi", value: 'Karimova N.', icon: UserCheck, color: 'bg-blue-500' },
  { label: 'Davomat foizi', value: '94%', icon: CalendarCheck, color: 'bg-emerald-500' },
  { label: "O'rtacha baho", value: '3.8', icon: TrendingUp, color: 'bg-purple-500' },
  { label: "Muammoli o'quvchilar", value: '12', icon: AlertTriangle, color: 'bg-red-500' },
  { label: 'AI tahlillar', value: '156', icon: Brain, color: 'bg-cyan-500' },
];

const classData = [
  { name: '5-A', score: 3.6 },
  { name: '5-B', score: 3.4 },
  { name: '6-A', score: 3.9 },
  { name: '6-B', score: 3.5 },
  { name: '7-A', score: 4.2 },
  { name: '7-B', score: 3.7 },
  { name: '8-A', score: 3.8 },
  { name: '8-B', score: 3.3 },
  { name: '9-A', score: 3.6 },
  { name: '9-B', score: 3.9 },
];

const recentReports = [
  { title: 'Oylik davomat hisoboti', date: '28-mart, 2026', status: 'Tayyor' },
  { title: "Choraklik baho tahlili", date: '25-mart, 2026', status: 'Tayyor' },
  { title: "O'qituvchilar faoliyati", date: '20-mart, 2026', status: 'Tayyor' },
  { title: "Ota-onalar so'rovnomasi natijalari", date: '15-mart, 2026', status: 'Jarayonda' },
  { title: "Yillik statistika (yarim yillik)", date: '10-mart, 2026', status: 'Tayyor' },
];

const maxScore = 5;

export default function AdminStats() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Umumiy statistika</h1>
        <p className="text-sm text-zinc-500 mt-1">Maktab ko'rsatkichlari va tahlillar</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-zinc-200 p-5 flex items-center gap-4">
            <div className={`${card.color} w-11 h-11 rounded-lg flex items-center justify-center`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-900">{card.value}</p>
              <p className="text-sm text-zinc-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200 p-5">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">Sinflar bo'yicha o'rtacha baho</h2>
          <div className="space-y-3">
            {classData.map((cls) => (
              <div key={cls.name} className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-600 w-10 shrink-0">{cls.name}</span>
                <div className="flex-1 bg-zinc-100 rounded-full h-7 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      cls.score >= 4.0
                        ? 'bg-emerald-500'
                        : cls.score >= 3.5
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${(cls.score / maxScore) * 100}%` }}
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center text-xs font-semibold text-zinc-600">
                    {cls.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">So'nggi hisobotlar</h2>
          <ul className="space-y-3">
            {recentReports.map((report, i) => (
              <li key={i} className="flex items-start gap-3 pb-3 border-b border-zinc-100 last:border-0 last:pb-0">
                <FileText className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-700 truncate">{report.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-zinc-400">{report.date}</span>
                    <span
                      className={`text-xs font-medium ${
                        report.status === 'Tayyor' ? 'text-green-600' : 'text-amber-600'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
