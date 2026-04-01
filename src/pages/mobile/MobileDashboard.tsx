import { Link } from 'react-router-dom';
import { QrCode, BarChart2, Brain, MessageCircle, Clock, Users, CheckCircle, Bell } from 'lucide-react';

const todayLessons = [
  { time: '08:00', class: '5-A', subject: 'Matematika' },
  { time: '09:00', class: '6-B', subject: 'Matematika' },
  { time: '10:00', class: '7-A', subject: 'Algebra' },
];

const quickActions = [
  { label: 'QR Davomat', icon: QrCode, bg: 'bg-emerald-500', link: '/mobile/scanner' },
  { label: "Baho qo'yish", icon: BarChart2, bg: 'bg-blue-500', link: '/mobile/grades' },
  { label: 'AI Yordam', icon: Brain, bg: 'bg-purple-500', link: '#' },
  { label: 'Xabarlar', icon: MessageCircle, bg: 'bg-orange-500', link: '#' },
];

const stats = [
  { label: 'Bugun', value: '4 dars', icon: Clock },
  { label: "O'quvchilar", value: '156', icon: Users },
  { label: 'Davomat', value: '94%', icon: CheckCircle },
];

const notifications = [
  { id: 1, text: "5-A sinfida nazorat ishi rejada", time: '10 daqiqa oldin' },
  { id: 2, text: "Yangi o'quv dasturi yuklandi", time: '1 soat oldin' },
  { id: 3, text: "Ota-onalar yig'ilishi eslatmasi", time: '3 soat oldin' },
];

export default function MobileDashboard() {
  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          Assalomu alaykum, Ustoz! <span role="img" aria-label="wave">👋</span>
        </h1>
        <p className="text-zinc-500 mt-1">Bugungi kuningiz barakali bo'lsin</p>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 mb-3">Bugungi darslar</h2>
        <div className="space-y-3">
          {todayLessons.map((lesson, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-sm font-bold">
                {lesson.time}
              </div>
              <div>
                <p className="font-medium text-zinc-900">
                  {lesson.time} — {lesson.class} | {lesson.subject}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.link}
              className={`${action.bg} text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 active:opacity-80`}
              style={{ height: 80 }}
            >
              <Icon className="w-7 h-7" />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-3 text-center shadow-sm"
            >
              <Icon className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
              <p className="text-lg font-bold text-zinc-900">{stat.value}</p>
              <p className="text-xs text-zinc-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 mb-3">Bildirishnomalar</h2>
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-900">{n.text}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
