import { useState, useRef } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { GraduationCap, Sparkles } from 'lucide-react';
import { getTeacherMobileRouteMeta, teacherMobileTabs } from '../data/teacherMobile';
import { fadeUpItem, floatingLoop, pageTransition } from '../lib/mobileMotion';

export default function MobileLayout() {
  const location = useLocation();
  const routeMeta = getTeacherMobileRouteMeta(location.pathname);
  
  const mainRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll({ container: mainRef });
  
  const [showHeader, setShowHeader] = useState(true);
  const [showNav, setShowNav] = useState(true);

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
    <div className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,#e8fff5,transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_45%,#eef2ff_100%)] flex justify-center">
      <div className="w-full max-w-md relative flex h-[100dvh] flex-col overflow-hidden bg-transparent">
        <motion.div
          aria-hidden
          animate={floatingLoop}
          className="pointer-events-none absolute right-[-60px] top-14 h-44 w-44 rounded-full bg-emerald-300/20 blur-3xl"
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
          className="absolute inset-0 overflow-y-auto overflow-x-hidden pt-[170px] pb-[100px] px-4"
        >
          <Outlet />
        </motion.main>

        <motion.header
          initial={{ y: 0 }}
          animate={{ y: showHeader ? 0 : "-100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="absolute top-0 left-0 right-0 z-50 border-b border-white/60 bg-white/80 px-4 pb-4 pt-3 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/10">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                  {routeMeta.eyebrow}
                </p>
                <span className="text-base font-semibold text-zinc-950">Murabbiyona</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1 text-[10px] font-semibold text-zinc-100 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              Ustoz App
            </span>
          </div>

          <motion.div
            key={routeMeta.path}
            variants={fadeUpItem}
            initial="hidden"
            animate="show"
            className="mt-4 rounded-[24px] bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-800 px-4 py-3 text-white shadow-xl shadow-zinc-900/10"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">{routeMeta.eyebrow}</p>
            <div className="mt-1 flex items-end justify-between gap-3">
              <div>
                <h1 className="text-lg font-semibold">{routeMeta.title}</h1>
                <p className="text-xs text-zinc-400">Yangi xususiyatlar qo‘shishga tayyor mobil shell</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-2.5 py-1.5 text-right">
                <p className="text-[10px] text-zinc-400">Holat</p>
                <p className="text-xs font-semibold text-emerald-300">Live UI</p>
              </div>
            </div>
          </motion.div>
        </motion.header>

        <motion.nav
          initial={{ y: 0 }}
          animate={{ y: showNav ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="absolute bottom-0 left-0 right-0 z-50 w-full border-t border-zinc-200/50 bg-white/85 px-2 pt-2 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.04)]"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}
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
                    `flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl py-2 relative transition-all duration-300 ${
                      isActive ? 'text-emerald-600' : 'text-zinc-400'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <motion.div
                        whileTap={{ scale: 0.85 }}
                        animate={{ 
                          scale: isActive ? 1.05 : 1,
                          y: isActive ? -2 : 0
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className={`relative rounded-xl p-2 transition-colors duration-300 ${
                          isActive 
                            ? 'bg-emerald-50 text-emerald-600 shadow-sm ring-1 ring-emerald-100' 
                            : 'bg-transparent text-zinc-400'
                        }`}
                      >
                        <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                        
                        {/* Faol bo'lgandagi animatsiyali nuqta */}
                        {isActive && (
                          <motion.div
                            layoutId="mobileNavIndicator"
                            className="absolute -bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-emerald-500"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.div>
                      <span className={`text-[10px] uppercase tracking-wide transition-all duration-300 ${isActive ? 'font-bold opacity-100' : 'font-medium opacity-70'}`}>
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
