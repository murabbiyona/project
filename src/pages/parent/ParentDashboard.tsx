import {
  TrendingUp,
  CheckCircle,
  Trophy,
  BookOpen,
  Calendar,
  MessageCircle,
} from 'lucide-react';

const recentGrades = [
  { subject: 'Matematika', grade: 5, label: "A'lo", date: '28-mart, 2026' },
  { subject: 'Ona tili', grade: 4, label: 'Yaxshi', date: '27-mart, 2026' },
  { subject: 'Ingliz tili', grade: 5, label: "A'lo", date: '26-mart, 2026' },
  { subject: 'Tarix', grade: 3, label: "Qoniqarli", date: '25-mart, 2026' },
  { subject: 'Fizika', grade: 4, label: 'Yaxshi', date: '24-mart, 2026' },
];

const upcomingEvents = [
  { title: "Ota-onalar yig'ilishi", date: '5-aprel, 2026', time: '18:00' },
  { title: 'Matematika olimpiadasi', date: '10-aprel, 2026', time: '09:00' },
  { title: "Bahorgi bayram konserti", date: '15-aprel, 2026', time: '14:00' },
];

const gradeColor = (g: number) =>
  g === 5 ? 'text-emerald-600 bg-emerald-50' : g === 4 ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50';

export default function ParentDashboard() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100">
        <h1 className="text-2xl font-bold text-zinc-800">
          Assalomu alaykum, Abdullayev Karim! <span className="inline-block animate-bounce">&#128075;</span>
        </h1>
        <p className="text-zinc-500 mt-1">Farzandingiz haqida umumiy ma'lumot</p>
      </div>

      {/* Child info */}
      <div className="bg-white rounded-2xl p-5 border border-zinc-200 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg flex items-center justify-center flex-shrink-0">
          AJ
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-zinc-800">Abdullayev Jasur</h2>
          <div className="flex gap-4 text-sm text-zinc-500 mt-0.5">
            <span>Sinf: <strong className="text-zinc-700">7-A</strong></span>
            <span>Jurnal raqami: <strong className="text-zinc-700">3</strong></span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">O'rtacha baho</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-zinc-800">4.2</span>
            <span className="text-sm text-emerald-600 font-medium mb-1">+0.3</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Davomat</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-zinc-800">96%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Reyting</span>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold text-zinc-800">5</span>
            <span className="text-sm text-zinc-500 ml-1">-o'rin</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent grades */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-zinc-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-zinc-800">So'nggi baholar</h3>
          </div>
          <div className="space-y-3">
            {recentGrades.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                <div>
                  <span className="font-medium text-zinc-700">{item.subject}</span>
                  <span className="text-zinc-400 mx-2">&mdash;</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${gradeColor(item.grade)}`}>
                    {item.grade} ({item.label})
                  </span>
                </div>
                <span className="text-xs text-zinc-400">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Upcoming events */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-zinc-800">Yaqinlashayotgan tadbirlar</h3>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-zinc-100 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-700">{event.title}</p>
                    <p className="text-xs text-zinc-400">{event.date}, {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher message preview */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-zinc-800">Oxirgi xabar</h3>
            </div>
            <div className="bg-zinc-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                  KN
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-700">Karimova Nilufar</p>
                  <p className="text-[11px] text-zinc-400">Matematika o'qituvchisi</p>
                </div>
              </div>
              <p className="text-sm text-zinc-600">
                Jasur bugun darsda juda yaxshi javob berdi. Olimpiadaga tayyorgarlik ko'rayotgani seziladi.
              </p>
              <p className="text-[11px] text-zinc-400 mt-2">Bugun, 14:30</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
