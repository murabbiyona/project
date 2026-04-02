import { Mail, Phone, Building2, Send, Edit, Globe, LogOut } from 'lucide-react';

const infoItems = [
  { icon: Mail, label: 'Email', value: 'n.karimova@murabbiyona.uz' },
  { icon: Phone, label: 'Telefon', value: '+998 90 123 45 67' },
  { icon: Building2, label: 'Maktab', value: '25-umumta\'lim maktabi' },
  { icon: Send, label: 'Telegram', value: 'Ulangan', connected: true },
];

const actions = [
  { label: 'Profilni tahrirlash', icon: Edit, color: 'text-zinc-900', bg: 'bg-white' },
  { label: "Tilni o'zgartirish", icon: Globe, color: 'text-zinc-900', bg: 'bg-white' },
  { label: 'Chiqish', icon: LogOut, color: 'text-red-600', bg: 'bg-white' },
];

export default function MobileProfile() {
  return (
    <div className="space-y-5">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center text-center pt-4">
        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-3">
          KN
        </div>
        <h1 className="text-xl font-bold text-zinc-900">Karimova Nilufar</h1>
        <p className="text-sm text-zinc-500">Matematika o'qituvchisi</p>
      </div>

      {/* Info Cards */}
      <div className="bg-white rounded-2xl shadow-sm divide-y divide-zinc-100">
        {infoItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-zinc-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-400">{item.label}</p>
                <p className="text-sm font-medium text-zinc-900 truncate">{item.value}</p>
              </div>
              {item.connected && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Ulangan
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={`w-full min-h-12 ${action.bg} rounded-xl px-4 flex items-center gap-3 shadow-sm active:bg-zinc-50`}
            >
              <Icon className={`w-5 h-5 ${action.color}`} />
              <span className={`text-sm font-medium ${action.color}`}>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* App Version */}
      <p className="text-center text-xs text-zinc-400 pb-4">
        Murabbiyona v1.0.0
      </p>
    </div>
  );
}
