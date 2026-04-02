import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Home, BarChart2, Calendar, MessageCircle } from 'lucide-react';

const tabs = [
  { to: '/parent-app', icon: Home, label: 'Asosiy', end: true, badge: 0 },
  { to: '/parent-app/grades', icon: BarChart2, label: 'Baholar', end: false, badge: 0 },
  { to: '/parent-app/attendance', icon: Calendar, label: 'Davomat', end: false, badge: 0 },
  { to: '/parent-app/chat', icon: MessageCircle, label: 'Xabar', end: false, badge: 2 },
];

export default function ParentMobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isIndex = location.pathname === '/parent-app' || location.pathname === '/parent-app/';

  return (
    <div className="min-h-[100dvh] bg-zinc-50 flex justify-center">
      <div className="w-full max-w-md relative flex flex-col min-h-[100dvh]">
        {/* Top Header */}
        <header className="sticky top-0 z-50 h-14 bg-emerald-600 text-white flex items-center justify-between px-4 shrink-0">
          {!isIndex ? (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-lg active:bg-emerald-700"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold">Murabbiyona</span>
            <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-medium">
              Ota-ona
            </span>
          </div>
          <button className="p-2 -mr-2 rounded-lg active:bg-emerald-700 relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-600" />
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
          <Outlet />
        </main>

        {/* Bottom Tab Bar */}
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
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {tab.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium leading-none">{tab.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
