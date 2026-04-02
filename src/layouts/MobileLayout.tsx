import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { GraduationCap, Sun, Moon } from 'lucide-react';
import { getTeacherMobileRouteMeta, teacherMobileTabs } from '../data/teacherMobile';
import { floatingLoop, pageTransition } from '../lib/mobileMotion';

export default function MobileLayout() {
  const location = useLocation();
  const routeMeta = getTeacherMobileRouteMeta(location.pathname);
  
  const mainRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll({ container: mainRef });
  
  const [showHeader, setShowHeader] = useState(true);
  const [showNav, setShowNav] = useState(true);
  
  // DARK MODE MANTIQLARI
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;
    
    if (latest <= 60) {
      // Eng tepada bo'lsa, ikkalasini ham ko'rsatamiz
      setShowHeader(true);
      setShowNav(true);
      return;
    }
    
    if (Math.abs(diff) < 5) return; // Kichik o'zgarishlarni e'tiborsiz qoldiramiz
    
    if (diff > 0) {
      // Pastga qarab scroll qilib ketyapmiz
      setShowHeader(false);
      setShowNav(true);
    } else {
      // Tepaga qarab scroll qilyapmiz
      setShowHeader(true);
      setShowNav(false);
    }
  });

  return (
    <div className={`min-h-[100dvh] transition-colors duration-500 overflow-hidden ${
      theme === 'dark' 
        ? 'bg-zinc-950' 
        : 'bg-[radial-gradient(circle_at_top,#e8fff5,transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_45%,#eef2ff_100%)]'
    } flex justify-center`}>
      <div className="w-full max-w-md relative flex h-[100dvh] flex-col overflow-hidden bg-transparent">
        <motion.div
           aria-hidden
           animate={floatingLoop}
           className={`pointer-events-none absolute right-[-60px] top-14 h-44 w-44 rounded-full blur-3xl transition-colors duration-1000 ${
             theme === 'dark' ? 'bg-emerald-900/10' : 'bg-emerald-300/20'
           }`}
        />

        {/* Scrollable Main Area - Absolute positioned */}
        <motion.main
          ref={mainRef}
          key={location.pathname}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          // Ekranning yuqori va pastki qismi absolute panellar ostida yopilib qolmasligi uchun padding beramiz
          className="absolute inset-0 overflow-y-auto overflow-x-hidden pt-[80px] pb-[80px] px-4"
        >
          <Outlet />
        </motion.main>

        <motion.header
          initial={{ y: 0 }}
          animate={{ y: showHeader ? 0 : "-100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="absolute top-0 left-0 right-0 z-50 border-b border-white/10 dark:border-white/5 bg-white/80 dark:bg-zinc-900/80 px-4 pb-4 pt-3 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow-lg shadow-zinc-900/10">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                  {routeMeta.eyebrow}
                </p>
                <span className="text-base font-semibold text-zinc-950 dark:text-white">Murabbiyona</span>
              </div>
            </div>
            
            {/* TEMA ALMASHTIRGICH (Ustoz App o'rniga) */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-white shadow-xl transition-colors duration-300"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-amber-300" />
                  ) : (
                    <Moon className="h-5 w-5 text-indigo-300" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.header>

        <motion.nav
          initial={{ y: 0 }}
          animate={{ y: showNav ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="absolute bottom-0 left-0 right-0 z-50 w-full bg-white/90 dark:bg-zinc-900/90 px-1.5 pt-1.5 backdrop-blur-2xl shadow-[0_-16px_40px_rgba(0,0,0,0.05)] dark:shadow-none rounded-t-[32px] border-t border-white/60 dark:border-white/5"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
        >
          <div className="flex items-center justify-around w-full relative">
            {teacherMobileTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-1.5 relative transition-all duration-300 ${
                      isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        animate={{ 
                          scale: isActive ? 1.05 : 1,
                          y: isActive ? -1 : 0
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={`relative rounded-2xl p-1.5 transition-colors duration-300 ${
                          isActive 
                            ? 'bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-transparent text-zinc-400'
                        }`}
                      >
                        <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
                        
                        {/* Faol bo'lgandagi animatsiyali nuqta */}
                        {isActive && (
                          <motion.div
                            layoutId="mobileNavIndicator"
                            className="absolute -bottom-2.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-emerald-500"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.div>
                      <span className={`text-[9px] uppercase tracking-wide transition-all duration-300 ${isActive ? 'font-bold opacity-100' : 'font-medium opacity-60'}`}>
                        {tab.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </motion.nav>
      </div>
    </div>
  );
}
