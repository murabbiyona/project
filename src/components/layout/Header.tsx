import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Bell, X, Circle, Globe, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  return (
    <>
      <header className="group/header-left flex items-center border-b border-border bg-card shrink-0 z-20 sticky top-0 h-[var(--top-header-height)]">
        {/* Left side spacer - matches sidebar width when expanded */}
        <div className="hidden md:flex items-center shrink-0 w-[var(--sidebar-width)] pl-[18px]">
          {/* Logo is handled by Sidebar in this layout version, but we keep the spacing */}
        </div>

        <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center min-w-0 pr-8 lg:pr-12">
          <div className="flex items-center"></div>

          {/* Center Nav - 1x1 match with active styles */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors
                ${location.pathname === '/' || location.pathname === '/dashboard' ? 'text-background bg-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              {t('header.home')}
            </Link>
            <Link 
              to="/feedback" 
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors
                ${location.pathname === '/feedback' ? 'text-background bg-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              Feedback
            </Link>
          </nav>

          {/* Right Icons - 1x1 size match */}
          <div className="flex items-center justify-end gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowSearch(true)} 
                className="relative h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer"
              >
                <Search className="size-5 text-muted-foreground dark:text-[#a3b18a]" strokeWidth={2} />
              </button>
              
              <button className="relative h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer">
                <div className="relative">
                  <Bell className="size-5 text-muted-foreground dark:text-[#a3b18a]" strokeWidth={2} />
                  <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-card">
                    !
                  </span>
                </div>
              </button>

              <button
                onClick={toggleTheme}
                className="relative h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer"
                title={theme === 'light' ? 'Dark mode' : 'Light mode'}
              >
                {theme === 'light' ? (
                  <Moon className="size-5 text-muted-foreground" strokeWidth={2} />
                ) : (
                  <Sun className="size-5 text-[#a3b18a]" strokeWidth={2} />
                )}
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="relative h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors cursor-pointer"
                >
                  <Globe className="size-5 text-muted-foreground dark:text-[#a3b18a]" strokeWidth={2} />
                  <span className="absolute -bottom-0.5 -right-0.5 text-[10px] ring-1 ring-card rounded-full bg-card p-0">🇺🇸</span>
                </button>
                
                {showLangMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-xl border border-border py-2 z-50">
                    <button onClick={() => changeLanguage("uz")} className="w-full text-left px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted flex items-center gap-3 transition-colors">
                      {"🇺🇿 O’zbekcha"}
                    </button>
                    <button onClick={() => changeLanguage("en")} className="w-full text-left px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted flex items-center gap-3 transition-colors">
                      {"🇺🇸 English"}
                    </button>
                    <button onClick={() => changeLanguage("ru")} className="w-full text-left px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted flex items-center gap-3 transition-colors">
                      {"🇷🇺 Русский"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button className="rounded-full p-0.5 hover:bg-accent transition-colors size-auto outline-none">
              <div className="relative flex shrink-0 overflow-hidden rounded-full size-8">
                <div className="flex size-full items-center justify-center rounded-full bg-zinc-900 text-white text-sm font-semibold">
                  {profile ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh]">
          <div className="bg-card rounded-2xl shadow-xl border border-border w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center p-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Search students, classes, lessons..."
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground text-[15px]"
              />
              <button onClick={() => setShowSearch(false)} className="text-muted-foreground hover:text-foreground p-1 cursor-pointer transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 py-4 max-h-[60vh] overflow-y-auto">
              <div className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Classes</div>
              {[
                { name: '5-A', color: 'fill-rose-400 text-rose-400' },
                { name: '5-B', color: 'fill-amber-400 text-amber-400' },
                { name: '5-D', color: 'fill-yellow-400 text-yellow-400' },
                { name: '6-A', color: 'fill-emerald-400 text-emerald-400' },
                { name: '6-B', color: 'fill-cyan-400 text-cyan-400' },
                { name: '6-D', color: 'fill-blue-400 text-blue-400' },
              ].map(cls => (
                <div key={cls.name} className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer rounded-lg mx-2 transition-colors">
                  <Circle className={`w-3 h-3 ${cls.color}`} />
                  <span className="text-foreground font-medium text-[15px]">{cls.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
