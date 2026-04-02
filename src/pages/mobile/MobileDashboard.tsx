import { motion } from 'framer-motion';
import { CheckCircle, Bell } from 'lucide-react';
import TeacherQuickActionCard from '../../components/mobile/TeacherQuickActionCard';
import { TeacherSignalCard } from '../../components/mobile/TeacherSignalCard';
import {
  teacherFocusCards,
  teacherNotifications,
  teacherQuickActions,
  teacherSignalCards,
  teacherStats,
  teacherTodayLessons,
} from '../../data/teacherMobile';
import { fadeUpItem, floatingLoop, pageTransition, staggerContainer } from '../../lib/mobileMotion';

export default function MobileDashboard() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Xayrli tong' : currentHour < 17 ? 'Xayrli kun' : 'Xayrli kech';
  const formattedDate = new Date().toLocaleDateString('uz-UZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-5"
    >
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 p-5 text-white shadow-xl shadow-zinc-900/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_30%)]" />
        <motion.div
          animate={floatingLoop}
          className="absolute -right-8 top-8 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl"
        />

        <div className="relative space-y-4">
          <motion.div variants={fadeUpItem}>
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-300/80">Ustoz mobile</p>
            <h1 className="mt-2 text-2xl font-bold">{greeting}, Ustoz!</h1>
            <p className="mt-1 text-sm text-zinc-300">{formattedDate}</p>
          </motion.div>

          <motion.div variants={fadeUpItem} className="grid grid-cols-3 gap-2.5">
            {teacherFocusCards.map((card) => (
              <div key={card.title} className={`rounded-2xl px-3 py-3 ring-1 ${card.tone}`}>
                <p className="text-[11px] font-medium opacity-80">{card.title}</p>
                <p className="mt-2 text-base font-semibold leading-tight">{card.value}</p>
                <p className="mt-1 text-[11px] leading-4 opacity-75">{card.hint}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        {teacherQuickActions.map((action) => (
          <TeacherQuickActionCard key={action.label} action={action} />
        ))}
      </motion.section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 gap-2"
      >
        {teacherStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={fadeUpItem}
              className={`${stat.bg} rounded-3xl p-3 text-center shadow-sm ring-1 ring-white/70`}
            >
              <Icon className={`mx-auto mb-1 h-4 w-4 ${stat.color}`} />
              <p className="text-lg font-bold leading-none text-zinc-900">{stat.value}</p>
              <p className="mt-0.5 text-[9px] text-zinc-500">{stat.unit}</p>
            </motion.div>
          );
        })}
      </motion.section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-3"
      >
        {teacherSignalCards.map((card) => (
          <TeacherSignalCard
            key={card.title}
            title={card.title}
            text={card.text}
            tone={card.tone}
            icon={card.icon}
          />
        ))}
      </motion.section>

      <motion.section
        variants={fadeUpItem}
        initial="hidden"
        animate="show"
        className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-zinc-100"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Bugungi darslar</h2>
          <span className="text-xs text-zinc-400">{teacherTodayLessons.length} ta dars</span>
        </div>
        <div className="space-y-2">
          {teacherTodayLessons.map((lesson, index) => (
            <motion.div
              key={`${lesson.time}-${lesson.className}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`flex items-center gap-3 rounded-2xl p-3 transition-all ${
                lesson.status === 'active'
                  ? 'bg-emerald-50 ring-1 ring-emerald-200'
                  : lesson.status === 'done'
                    ? 'bg-zinc-50 opacity-70'
                    : 'bg-zinc-50'
              }`}
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-bold ${
                  lesson.status === 'active'
                    ? 'bg-emerald-500 text-white'
                    : lesson.status === 'done'
                      ? 'bg-zinc-300 text-white'
                      : 'bg-zinc-200 text-zinc-600'
                }`}
              >
                {lesson.time}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900">
                  {lesson.className} · {lesson.subject}
                </p>
                <p className="text-xs text-zinc-400">
                  {lesson.status === 'active' ? 'Hozir' : lesson.status === 'done' ? 'Tugagan' : 'Kutilmoqda'}
                </p>
              </div>
              {lesson.status === 'active' && <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />}
              {lesson.status === 'done' && <CheckCircle className="h-4 w-4 text-zinc-400" />}
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={fadeUpItem}
        initial="hidden"
        animate="show"
        className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-zinc-100"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-zinc-900">Bildirishnomalar</h2>
          <span className="text-xs text-emerald-600">Jonli ko‘rinish</span>
        </div>
        <div className="space-y-2">
          {teacherNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-3"
            >
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl ${
                  notification.type === 'warning'
                    ? 'bg-yellow-100'
                    : notification.type === 'success'
                      ? 'bg-emerald-100'
                      : 'bg-blue-100'
                }`}
              >
                <Bell
                  className={`h-4 w-4 ${
                    notification.type === 'warning'
                      ? 'text-yellow-600'
                      : notification.type === 'success'
                        ? 'text-emerald-600'
                        : 'text-blue-600'
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-800">{notification.text}</p>
                <p className="mt-0.5 text-xs text-zinc-400">{notification.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
