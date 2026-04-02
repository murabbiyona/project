import { Link } from 'react-router-dom';
import { QrCode, Zap, BarChart2, Brain, Users, CheckCircle, Bell, TrendingUp, Calendar } from 'lucide-react';

const todayLessons = [
  { time: '08:00', class: '5-A', subject: 'Matematika', status: 'done' },
  { time: '09:00', class: '6-B', subject: 'Matematika', status: 'active' },
  { time: '10:00', class: '7-A', subject: 'Algebra', status: 'upcoming' },
  { time: '11:00', class: '5-B', subject: 'Geometriya', status: 'upcoming' },
];

const quickActions = [
  { label: 'QR Davomat', desc: 'Kamera bilan', icon: QrCode, bg: 'bg-emerald-500', shadow: 'shadow-emerald-200', link: '/mobile/scanner' },
  { label: 'Pult rejimi', desc: 'Tezkor baho', icon: Zap, bg: 'bg-purple-500', shadow: 'shadow-purple-200', link: '/mobile/remote' },
  { label: "Baho qo'yish", desc: "Ro'yxat bo'yicha", icon: BarChart2, bg: 'bg-blue-500', shadow: 'shadow-blue-200', link: '/mobile/grades' },
  { label: 'AI Yordam', desc: 'Maslahat', icon: Brain, bg: 'bg-orange-500', shadow: 'shadow-orange-200', link: '#' },
];

const stats = [
  { label: 'Bugun', value: '4', unit: 'dars', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: "O'quvchilar", value: '156', unit: 'ta', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: "O'rtacha", value: '4.2', unit: 'ball', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Davomat', value: '94', unit: '%', icon: CheckCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const notifications = [
  { id: 1, text: "5-A sinfida nazorat ishi rejada", time: '10 daq oldin', type: 'warning' },
  { id: 2, text: "6-B sinfi baholar saqlandi", time: '1 soat oldin', type: 'success' },
  { id: 3, text: "Ota-onalar yig'ilishi eslatmasi", time: '3 soat oldin', type: 'info' },
];

export default function MobileDashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Xayrli tong' : currentHour < 17 ? 'Xayrli kun' : 'Xayrli kech';

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-zinc-900">{greeting}, Ustoz!</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Quick Actions - 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.link}
              className={`${action.bg} text-white rounded-2xl p-4 flex flex-col gap-2 active:opacity-90 active:scale-[0.98] transition-all shadow-lg ${action.shadow}`}
            >
              <Icon className="w-7 h-7" />
              <div>
                <p className="text-sm font-semibold">{action.label}</p>
                <p className="text-[10px] opacity-80">{action.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-3 text-center`}>
              <Icon className={`w-4 h-4 mx-auto ${stat.color} mb-1`} />
              <p className="text-lg font-bold text-zinc-900 leading-none">{stat.value}</p>
              <p className="text-[9px] text-zinc-500 mt-0.5">{stat.unit}</p>
            </div>
          );
        })}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-zinc-900">Bugungi darslar</h2>
          <span className="text-xs text-zinc-400">{todayLessons.length} ta dars</span>
        </div>
        <div className="space-y-2">
          {todayLessons.map((lesson, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                lesson.status === 'active' ? 'bg-emerald-50 ring-1 ring-emerald-200' :
                lesson.status === 'done' ? 'bg-zinc-50 opacity-60' : 'bg-zinc-50'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold ${
                lesson.status === 'active' ? 'bg-emerald-500 text-white' :
                lesson.status === 'done' ? 'bg-zinc-300 text-white' : 'bg-zinc-200 text-zinc-600'
              }`}>
                {lesson.time}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900">{lesson.class} · {lesson.subject}</p>
                <p className="text-xs text-zinc-400">
                  {lesson.status === 'active' ? 'Hozir' : lesson.status === 'done' ? 'Tugagan' : 'Kutilmoqda'}
                </p>
              </div>
              {lesson.status === 'active' && (
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              )}
              {lesson.status === 'done' && (
                <CheckCircle className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-base font-semibold text-zinc-900 mb-3">Bildirishnomalar</h2>
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                n.type === 'warning' ? 'bg-yellow-100' : n.type === 'success' ? 'bg-emerald-100' : 'bg-blue-100'
              }`}>
                <Bell className={`w-4 h-4 ${
                  n.type === 'warning' ? 'text-yellow-600' : n.type === 'success' ? 'text-emerald-600' : 'text-blue-600'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-800">{n.text}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
