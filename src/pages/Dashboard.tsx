import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, Moon, Sun, CheckSquare, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [timeOfDayKey, setTimeOfDayKey] = useState<'goodMorning' | 'goodAfternoon' | 'goodEvening'>('goodMorning');
  const [isDay, setIsDay] = useState(true);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDayKey('goodMorning');
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDayKey('goodAfternoon');
    } else {
      setTimeOfDayKey('goodEvening');
    }
    setIsDay(hour >= 6 && hour < 18);
  }, []);

  // Calendar helpers
  const monthNames = [
    t('common.january', 'Yanvar'), t('common.february', 'Fevral'), t('common.march', 'Mart'),
    t('common.april', 'Aprel'), t('common.may', 'May'), t('common.june', 'Iyun'),
    t('common.july', 'Iyul'), t('common.august', 'Avgust'), t('common.september', 'Sentabr'),
    t('common.october', 'Oktabr'), t('common.november', 'Noyabr'), t('common.december', 'Dekabr'),
  ];
  const dayNames = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Get user's first name
  const firstName = profile?.full_name?.split(' ')[0] || t('dashboard.defaultUser', 'Foydalanuvchi');

  // Greeting text
  const greetingText = t(`dashboard.${timeOfDayKey}`, 'Xayrli kun');

  return (
    <div className="flex-1 min-h-0 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-4 w-full p-6 lg:p-8">
        
        {/* Left column (Col span 2) - Banner + Weekly Lessons */}
        <div className="lg:col-span-2 flex flex-col gap-4 h-full min-h-0">
          
          {/* Top Banner */}
          <div className="relative overflow-hidden rounded-xl px-10 py-12 text-white min-h-[224px] flex items-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-lg border border-zinc-700/30">
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  {isDay ? (
                    <Sun className="size-8 text-yellow-300 drop-shadow-md" />
                  ) : (
                    <Moon className="size-8 text-blue-200 drop-shadow-md" />
                  )}
                </div>
                <h2 className="text-[28px] font-bold tracking-tight leading-tight">
                  {greetingText}, {firstName}
                </h2>
              </div>
              <p className="text-[15px] text-zinc-400 font-medium mt-1 pl-1">
                {t('dashboard.taskSubtitle', { taskCount: 1 })}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -mr-40 -mt-40"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-zinc-400/5 rounded-full blur-[60px] -ml-20 -mb-20"></div>
          </div>

          {/* Haftalik darslar */}
          <div className="flex-1 min-h-0">
            <div className="bg-card text-card-foreground rounded-xl card-elevation border border-border h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pt-6 px-6 pb-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-muted">
                    <BookOpen className="size-5 text-foreground" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <h2 className="text-[18px] font-bold tracking-tight">
                      {t('dashboard.weeklyLessons', 'Haftalik darslar')}
                    </h2>
                  </div>
                </div>
                <RouterLink
                  to="/lessons"
                  className="text-[11px] hover:text-foreground text-muted-foreground font-bold transition-all cursor-pointer tracking-wider uppercase"
                >
                  {t('common.viewAll', 'Barchasini ko\'rish')}
                </RouterLink>
              </div>
              <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="size-16 rounded-xl bg-muted/60 flex items-center justify-center mb-4">
                  <BookOpen className="size-8 text-muted-foreground/30" />
                </div>
                <p className="text-[15px] font-semibold text-muted-foreground/80">
                  {t('dashboard.noLessonsThisWeek', 'Bu hafta rejalashtirilgan dars yo\'q')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle column - Bugungi darslar */}
        <div className="h-full min-h-0">
          <div className="bg-card text-card-foreground rounded-xl card-elevation border border-border flex flex-col overflow-hidden h-full">
            <div className="flex items-center px-6 shrink-0 h-[68px] border-b border-border/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-muted">
                  <CalendarDays className="size-5 text-foreground" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <h2 className="text-[18px] font-bold tracking-tight">
                    {t('dashboard.todayLessons', 'Bugungi darslar')}
                  </h2>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-12 text-center p-6">
              <div className="size-16 rounded-xl bg-muted/60 flex items-center justify-center mb-4">
                <CalendarDays className="size-8 text-muted-foreground/30" />
              </div>
              <p className="text-[15px] font-semibold text-muted-foreground/80">
                {t('dashboard.noClassesToday', 'Bugun rejalashtirilgan dars yo\'q')}
              </p>
            </div>
          </div>
        </div>

        {/* Right column - Calendar & Tasks */}
        <div className="h-full min-h-0 flex flex-col gap-4">
          <div className="bg-card text-card-foreground rounded-xl card-elevation border border-border p-6 flex flex-col flex-1 min-h-0">
            <div className="shrink-0">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-muted">
                    <CalendarDays className="size-5 text-foreground" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[18px] font-bold tracking-tight">{monthNames[month]}</span>
                    <span className="text-[16px] text-muted-foreground font-medium">{year}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer active:scale-95"
                    aria-label="Oldingi oy"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer active:scale-95"
                    aria-label="Keyingi oy"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1 mt-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-sm font-bold text-foreground py-2">{day}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7">
                {/* Empty cells for first day offset (Sunday=0) */}
                {Array.from({ length: firstDay }, (_, i) => (
                  <div key={`empty-${i}`} className="relative flex justify-center py-0.5">
                    <button disabled className="relative z-10 h-9 w-9 inline-flex flex-col items-center justify-center text-sm rounded-full opacity-20 pointer-events-none">
                    </button>
                  </div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const date = i + 1;
                  const isToday =
                    date === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();
                  return (
                    <div key={date} className="relative flex justify-center py-0.5">
                      <button
                        className={`relative z-10 h-9 w-9 inline-flex flex-col items-center justify-center text-sm transition-colors rounded-full
                          ${isToday
                            ? 'font-semibold border-2 border-foreground hover:bg-accent'
                            : 'hover:bg-accent'
                          }`}
                      >
                        <span className="leading-none">{date}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="my-5 border-t border-border/60 shrink-0"></div>

            {/* Tasks */}
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-muted">
                    <CheckSquare className="size-5 text-foreground" />
                  </div>
                  <h3 className="text-[18px] font-bold tracking-tight">
                    {t('dashboard.tasks', 'Vazifalar')}
                  </h3>
                </div>
                <button className="inline-flex items-center justify-center hover:bg-muted rounded-md size-8 transition-colors border border-border active:scale-95">
                  <Plus className="size-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="px-3 pr-5 py-4 rounded-lg transition-colors bg-neutral-50/50 hover:bg-neutral-100 border border-border/30 cursor-pointer flex items-center gap-3 group active:scale-[0.98]">
                  <div className="size-4 rounded border-2 border-neutral-300 bg-white group-hover:border-zinc-900 transition-colors shrink-0"></div>
                  <h4 className="font-medium flex-1 text-sm truncate text-foreground">
                    {t('dashboard.taskItem', "O'quvchilarning 3 choraklik davomatlarini qo'yib chiqish")}
                  </h4>
                  <span className="text-xs shrink-0 text-rose-500 font-medium">Mar 29</span>
                </div>
              </div>

              <RouterLink
                to="/tasks"
                className="block w-full text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors mt-4 font-bold tracking-wider uppercase"
              >
                {t('common.viewAll', 'Barchasini ko\'rish')}
              </RouterLink>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
