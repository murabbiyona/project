import { NavLink, Outlet } from 'react-router-dom';
import { Menu, Bell, Home, QrCode, BarChart2, User } from 'lucide-react';

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-zinc-900 text-white flex items-center justify-between px-4">
        <button className="p-2 -ml-2 rounded-lg active:bg-zinc-700">
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-lg font-semibold">Murabbiyona</span>
        <button className="p-2 -mr-2 rounded-lg active:bg-zinc-700 relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full" />
        </button>
      </header>

      {/* Content Area */}
      <main className="px-4 py-4 pt-16 pb-20">
        <Outlet />
      </main>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-zinc-200 flex items-center justify-around">
        <NavLink
          to="/mobile"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`
          }
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Bosh sahifa</span>
        </NavLink>
        <NavLink
          to="/mobile/scanner"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`
          }
        >
          <QrCode className="w-6 h-6" />
          <span className="text-xs">QR Scanner</span>
        </NavLink>
        <NavLink
          to="/mobile/grades"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`
          }
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-xs">Baholar</span>
        </NavLink>
        <NavLink
          to="/mobile/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 ${isActive ? 'text-emerald-600' : 'text-zinc-400'}`
          }
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Profil</span>
        </NavLink>
      </nav>
    </div>
  );
}
