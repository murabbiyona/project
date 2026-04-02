import { NavLink, Outlet } from 'react-router-dom';
import { Home, QrCode, Zap, BarChart2, User, GraduationCap } from 'lucide-react';

const tabs = [
  { to: '/mobile', icon: Home, label: 'Asosiy', end: true },
  { to: '/mobile/scanner', icon: QrCode, label: 'QR', end: false },
  { to: '/mobile/remote', icon: Zap, label: 'Pult', end: false },
  { to: '/mobile/grades', icon: BarChart2, label: 'Baho', end: false },
  { to: '/mobile/profile', icon: User, label: 'Profil', end: false },
];

export default function MobileLayout() {
  return (
    <div className="min-h-[100dvh] bg-zinc-100 flex justify-center">
      <div className="w-full max-w-md relative flex flex-col min-h-[100dvh]">
        {/* Top Header — stays inside container */}
        <header className="sticky top-0 z-50 h-14 bg-zinc-900 text-white flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-semibold">Murabbiyona</span>
          </div>
          <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-lg">
            Ustoz App
          </span>
        </header>

        {/* Content Area — scrollable, fills space */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
          <Outlet />
        </main>

        {/* Bottom Tab Bar — stays inside container */}
        <nav className="sticky bottom-0 z-50 bg-white border-t border-zinc-200 shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex items-center justify-around h-14">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center gap-0.5 py-1 min-w-[48px] transition-colors ${
                      isActive ? 'text-emerald-600' : 'text-zinc-400 active:text-zinc-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50' : ''}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-medium leading-none">{tab.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
