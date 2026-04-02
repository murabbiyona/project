import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles } from 'lucide-react';
import { getTeacherMobileRouteMeta, teacherMobileTabs } from '../data/teacherMobile';
import { fadeUpItem, floatingLoop, pageTransition } from '../lib/mobileMotion';

export default function MobileLayout() {
  const location = useLocation();
  const routeMeta = getTeacherMobileRouteMeta(location.pathname);

  return (
    <div className="min-h-[100dvh] bg-[radial-gradient(circle_at_top,#e8fff5,transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_45%,#eef2ff_100%)] flex justify-center">
      <div className="w-full max-w-md relative flex min-h-[100dvh] flex-col overflow-hidden">
        <motion.div
          aria-hidden
          animate={floatingLoop}
          className="pointer-events-none absolute right-[-60px] top-14 h-44 w-44 rounded-full bg-emerald-300/20 blur-3xl"
        />

        <header className="sticky top-0 z-50 shrink-0 border-b border-white/60 bg-white/80 px-4 pb-4 pt-3 backdrop-blur-xl">
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
        </header>

        <motion.main
          key={location.pathname}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 overflow-y-auto px-4 py-4 pb-24"
        >
          <Outlet />
        </motion.main>

        <nav
          className="sticky bottom-0 z-50 shrink-0 border-t border-white/70 bg-white/85 px-2 pt-2 backdrop-blur-xl"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center justify-around rounded-t-3xl">
            {teacherMobileTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `flex min-w-[58px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 transition-all ${
                      isActive ? 'text-emerald-600' : 'text-zinc-400 active:text-zinc-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`rounded-2xl p-2 transition-all ${
                          isActive ? 'bg-emerald-50 shadow-inner shadow-emerald-100' : ''
                        }`}
                      >
                        <Icon className="h-5 w-5" />
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
