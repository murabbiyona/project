import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  Calendar,
  CalendarDays,
  BookOpen,
  Users,
  BarChart2,
  ClipboardCheck,
  Target,
  CheckSquare,
  Wand2,
  HardDrive,
  Zap,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronRight,
  Check,
  Plus,
  LogOut,
  Star
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

const semesters = [
  { id: 1, label: "2025-2026-o'quv yili", date: "Sep 2, 2025 — May 25, 2026" },
  { id: 2, label: "2024-2025-o'quv yili", date: "Sep 2, 2024 — May 25, 2025" },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { profile, signOut } = useAuth();
  const [showSemester, setShowSemester] = useState(false);
  const [activeSemester, setActiveSemester] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});

  const toggleSection = (idx: number) => {
    setCollapsedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const menuSections = [
    {
      title: t('sidebar.classesTitle'),
      items: [
        { name: t('sidebar.myClasses'), href: '/classes', icon: GraduationCap },
        { name: t('sidebar.timetable'), href: '/timetable', icon: Calendar },
        { name: t('sidebar.planner'), href: '/planner', icon: CalendarDays },
      ]
    },
    {
      title: t('sidebar.planningTitle'),
      items: [
        { name: t('sidebar.lessons'), href: '/lessons', icon: BookOpen },
        { name: t('sidebar.students'), href: '/students', icon: Users },
      ]
    },
    {
      title: t('sidebar.assessmentTitle'),
      items: [
        { name: t('sidebar.grades'), href: '/grading', icon: BarChart2 },
        { name: t('sidebar.attendance'), href: '/attendance', icon: ClipboardCheck },
        { name: 'Jonli Baholash', href: '/live-assessment', icon: Zap },
        { name: t('sidebar.standards'), href: '/standards', icon: Target },
      ]
    },
    {
      title: t('sidebar.activitiesTitle'),
      items: [
        { name: t('sidebar.tasks'), href: '/tasks', icon: CheckSquare },
        { name: t('sidebar.rewards', "Rag'batlar"), href: '/rewards', icon: Star },
      ]
    },
    {
      title: 'Analitika',
      items: [
        { name: 'Tahlillar', href: '/analytics', icon: TrendingUp },
        { name: 'Hisobotlar', href: '/reports', icon: FileText },
      ]
    },
  ];

  return (
    <>
      <div className="flex flex-col w-[16rem] bg-[#fbfbfc] border-r border-[#e4e4e7] h-screen sticky top-0 font-sans text-sm pb-4">
        {/* Header Logo */}
        <div className="flex flex-col gap-2 p-2 px-3 pt-5 pb-1">
          <Link to="/" className="flex items-center gap-2 pl-[18px] py-1 transition-opacity hover:opacity-80">
            <div className="h-7 w-7 rounded-lg bg-[#2e3138] flex items-center justify-center shrink-0">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-[18px] text-[#09090b] font-medium">
              <span style={{ letterSpacing: "-0.05em", fontWeight: 600 }}>Murabbiyona</span> LMS
            </span>
          </Link>
        </div>
        
        {/* Semester Switcher Wrapper - like HTML reference */}
        <div className="flex flex-col gap-2 p-2 px-3 pt-4 pb-1">
          <button
            onClick={() => setShowSemester(!showSemester)}
            className="inline-flex items-center whitespace-nowrap text-sm font-medium transition-all duration-150 cursor-pointer outline-none h-9 gap-1.5 bg-white border border-[#e4e4e7] shadow-sm hover:bg-zinc-100 rounded-md w-full justify-start px-3 relative"
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="text-sm font-medium truncate">{semesters[activeSemester].label}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 ml-auto transition-transform ${showSemester ? 'rotate-180' : ''}`} />
          </button>
          
          {showSemester && (
            <div className="absolute left-3 right-3 top-[108px] bg-white rounded-xl shadow-xl border border-zinc-100 z-50 py-2 overflow-hidden">
              {semesters.map((sem, i) => (
                <button
                  key={sem.id}
                  onClick={() => { setActiveSemester(i); setShowSemester(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-50 transition-colors flex items-start justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {activeSemester === i ? (
                         <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0" />
                      ) : (
                         <div className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className={`text-sm font-medium truncate ${activeSemester === i ? 'text-zinc-900' : 'text-zinc-600'}`}>{sem.label}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 pl-[22px] truncate">{sem.date}</div>
                  </div>
                </button>
              ))}
              <div className="border-t border-zinc-100 mt-1 pt-1">
                <button className="w-full text-left px-4 py-2.5 hover:bg-zinc-50 transition-colors flex items-center gap-2 text-zinc-900 text-sm font-medium">
                  <Plus className="w-4 h-4 shrink-0" />
                  {t('sidebar.newSemester')}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation - grouped exactly like the reference */}
        <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
          <div className="flex w-full min-w-0 flex-col gap-0 pb-2">
            {menuSections.map((section, idx) => {
              const isCollapsed = collapsedSections[idx] ?? false;
              return (
                <div key={idx} className="relative flex w-full min-w-0 flex-col py-1 px-3 pt-3">
                  <button
                    onClick={() => toggleSection(idx)}
                    className="flex h-6 w-full shrink-0 items-center rounded-md px-2 outline-none text-[10px] font-medium text-zinc-500/80 uppercase tracking-wider mb-0 cursor-pointer hover:text-zinc-700 transition-colors group"
                  >
                    <ChevronRight className={`w-3 h-3 mr-1 shrink-0 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`} />
                    {section.title}
                  </button>
                  <div className={`w-full text-sm overflow-hidden transition-all duration-200 ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
                    <ul className="flex w-full min-w-0 flex-col gap-1">
                      {section.items.map((item) => (
                        <li key={item.href} className="relative">
                          <NavLink
                            to={item.href}
                            className={({ isActive }) => cn(
                              "flex w-full items-center gap-3 overflow-hidden rounded-lg p-2.5 text-left font-medium outline-none transition-all duration-200 focus-visible:ring-2 h-9 text-sm",
                              isActive
                                ? "bg-zinc-900 font-semibold text-white shadow-sm"
                                : "text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900"
                            )}
                          >
                            <item.icon className="size-4 shrink-0 stroke-[2.1px]" aria-hidden="true" />
                            <span className="font-medium truncate">{item.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info blocks */}
        <div className="flex flex-col gap-2 p-2 border-t border-[#e4e4e7] px-3 pt-3 pb-4 shrink-0 mx-2">
          {/* User profile & sign out */}
          {profile && (
            <div className="flex items-center gap-2.5 px-1.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-800 truncate">{profile.full_name}</p>
                <p className="text-[10px] text-zinc-400 truncate">{profile.email || profile.phone}</p>
              </div>
              <button
                onClick={signOut}
                className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                title={t('auth.logout', 'Chiqish')}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
           <div className="space-y-1.5 px-1.5 mt-1">
            <span className="text-zinc-500 flex items-center gap-1.5 text-xs">
              <Wand2 className="w-3.5 h-3.5" /> {t('sidebar.aiMagic')}
            </span>
            <div className="flex items-center gap-2">
              <div className="relative w-full overflow-hidden rounded-full bg-zinc-200 h-1.5 flex-1">
                 <div className="h-full w-full flex-1 bg-zinc-900 transition-all" style={{ width: '100%' }}></div>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">99,732 / 100,000 credits</p>
          </div>
          
          <div className="space-y-1.5 px-1.5 mt-3">
            <span className="text-zinc-500 flex items-center gap-1.5 text-xs">
              <HardDrive className="w-3.5 h-3.5" /> {t('sidebar.storage')}
            </span>
            <div className="flex items-center gap-2">
              <div className="relative w-full overflow-hidden rounded-full bg-zinc-200 h-1.5 flex-1">
                 <div className="h-full w-full flex-1 bg-zinc-900 transition-all" style={{ width: '0%' }}></div>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">0 Bytes of 100 GB</p>
          </div>
        </div>

      </div>
    </>
  );
}
