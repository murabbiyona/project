import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Home, BarChart2, Calendar, MessageCircle } from 'lucide-react';

export default function ParentMobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isIndex = location.pathname === '/parent-app' || location.pathname === '/parent-app/';

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-emerald-600 text-white flex items-center justify-between px-4">
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
          <span className="text-lg font-semibold">Murabbiyona</span>
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
      <main className="px-4 py-4 pt-16 pb-20">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-zinc-200 flex items-center justify-around">
        <NavLink
          to="/parent-app"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`
          }
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Asosiy</span>
        </NavLink>
        <NavLink
          to="/parent-app/grades"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`
          }
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-xs font-medium">Baholar</span>
        </NavLink>
        <NavLink
          to="/parent-app/attendance"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`
          }
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs font-medium">Davomat</span>
        </NavLink>
        <NavLink
          to="/parent-app/chat"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 relative ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`
          }
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              2
            </span>
          </div>
          <span className="text-xs font-medium">Xabar</span>
        </NavLink>
      </nav>
    </div>
  );
}
