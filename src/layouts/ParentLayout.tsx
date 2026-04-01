import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  Heart,
  Home,
  BarChart2,
  CalendarCheck,
  MessageCircle,
} from 'lucide-react';

const navItems = [
  { to: '/parent', label: 'Bosh sahifa', icon: Home, end: true },
  { to: '/parent/grades', label: 'Baholar', icon: BarChart2 },
  { to: '/parent/attendance', label: 'Davomat', icon: CalendarCheck },
  { to: '/parent/messages', label: 'Xabarlar', icon: MessageCircle, badge: '3' },
];

export default function ParentLayout() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6">
        {/* Left: Logo */}
        <Link to="/parent" className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-emerald-600 fill-emerald-600" />
          <div>
            <span className="text-lg font-bold text-emerald-700">Murabbiyona</span>
            <span className="block text-[11px] text-zinc-400 -mt-1">Ota-ona portali</span>
          </div>
        </Link>

        {/* Center: Nav links */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'text-emerald-600 border-emerald-600'
                    : 'text-zinc-500 border-transparent hover:text-zinc-700'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right: Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center">
            AK
          </div>
          <span className="text-sm font-medium text-zinc-700">Abdullayev K.</span>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
