import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  UserPlus,
  Download,
  Mail,
  Settings,
  Clock,
  School,
} from 'lucide-react';

const summaryCards = [
  { label: "O'qituvchilar soni", value: '24', icon: Users, color: 'bg-blue-500' },
  { label: "O'quvchilar soni", value: '856', icon: GraduationCap, color: 'bg-emerald-500' },
  { label: 'Sinflar', value: '32', icon: BookOpen, color: 'bg-purple-500' },
  { label: "O'rtacha baho", value: '3.8', icon: TrendingUp, color: 'bg-amber-500' },
];

const recentActivity = [
  { text: "Karimova N. 5-A sinfiga yangi baho qo'ydi", time: '10 daqiqa oldin' },
  { text: "Rahimov D. darsga kelmadi — ogohlantirish yuborildi", time: '25 daqiqa oldin' },
  { text: "7-B sinfi uchun imtihon natijalari yuklandi", time: '1 soat oldin' },
  { text: "Yangi o'qituvchi Aliyeva M. tizimga qo'shildi", time: '2 soat oldin' },
  { text: "Ota-onalar yig'ilishi rejasi tasdiqlandi", time: '3 soat oldin' },
];

const quickActions = [
  { label: "Yangi o'qituvchi qo'shish", icon: UserPlus, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { label: 'Hisobot yuklab olish', icon: Download, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
  { label: 'Xabar yuborish', icon: Mail, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
  { label: 'Tizim sozlamalari', icon: Settings, color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Boshqaruv paneli</h1>
        <p className="text-sm text-zinc-500 mt-1">Maktab boshqaruvi umumiy ko'rinishi</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-zinc-200 p-5 flex items-center gap-4">
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-900">{card.value}</p>
              <p className="text-sm text-zinc-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200 p-5">
          <h2 className="text-lg font-semibold text-zinc-900 mb-4">So'nggi faoliyat</h2>
          <ul className="space-y-3">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-start gap-3 pb-3 border-b border-zinc-100 last:border-0 last:pb-0">
                <Clock className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-zinc-700">{item.text}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* School Info */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <School className="w-5 h-5 text-zinc-600" />
            <h2 className="text-lg font-semibold text-zinc-900">Maktab ma'lumotlari</h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-zinc-400">Nomi</dt>
              <dd className="text-zinc-800 font-medium">56-sonli umumta'lim maktabi</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Manzil</dt>
              <dd className="text-zinc-800 font-medium">Toshkent sh., Chilonzor t., 12-kvartal</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Direktor</dt>
              <dd className="text-zinc-800 font-medium">Hasanov Bobur Rashidovich</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Telefon</dt>
              <dd className="text-zinc-800 font-medium">+998 71 234 56 78</dd>
            </div>
            <div>
              <dt className="text-zinc-400">O'quv yili</dt>
              <dd className="text-zinc-800 font-medium">2025–2026</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-3">Tezkor amallar</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className={`${action.color} rounded-xl p-4 flex flex-col items-center gap-2 transition-colors border border-transparent`}
            >
              <action.icon className="w-6 h-6" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
