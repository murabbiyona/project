import { NavLink, Outlet } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Users,
  GraduationCap,
  BarChart2,
  Settings,
} from 'lucide-react';

const menuItems = [
  { to: '/admin', label: 'Boshqaruv paneli', icon: LayoutDashboard, end: true },
  { to: '/admin/teachers', label: "O'qituvchilar", icon: Users },
  { to: '/admin/classes', label: 'Sinflar', icon: GraduationCap },
  { to: '/admin/stats', label: 'Statistika', icon: BarChart2 },
  { to: '/admin/settings', label: 'Sozlamalar', icon: Settings },
];

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-60 bg-zinc-900 text-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
          <Shield className="w-8 h-8 text-emerald-400" />
          <span className="text-lg font-bold tracking-tight">Bosh Murabbiy</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-xs text-zinc-500">Murabbiyona LMS</p>
          <p className="text-xs text-zinc-600">v1.0.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
