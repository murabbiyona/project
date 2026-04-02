import {
  BarChart2,
  Bell,
  BookOpenCheck,
  Brain,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Home,
  Mic2,
  QrCode,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export interface TeacherMobileTab {
  to: string;
  label: string;
  icon: LucideIcon;
  end: boolean;
}

export interface TeacherMobileRouteMeta {
  path: string;
  title: string;
  eyebrow: string;
  exact?: boolean;
}

export interface TeacherQuickAction {
  label: string;
  desc: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
  link: string;
  badge?: string;
}

export interface TeacherStat {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export interface TeacherFocusCard {
  title: string;
  value: string;
  hint: string;
  tone: string;
}

export interface TeacherLesson {
  time: string;
  className: string;
  subject: string;
  status: 'done' | 'active' | 'upcoming';
}

export interface TeacherNotification {
  id: number;
  text: string;
  time: string;
  type: 'warning' | 'success' | 'info';
}

export interface TeacherAssistantPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

export interface TeacherWorkflowCard {
  title: string;
  summary: string;
  status: 'Tayyor' | 'UI tayyor' | 'API ulash kerak';
  accent: string;
  icon: LucideIcon;
}

export interface TeacherIntegrationReadiness {
  title: string;
  detail: string;
  progress: string;
}

export const teacherMobileTabs: TeacherMobileTab[] = [
  { to: '/mobile', icon: Home, label: 'Asosiy', end: true },
  { to: '/mobile/scanner', icon: QrCode, label: 'QR', end: false },
  { to: '/mobile/remote', icon: Zap, label: 'Pult', end: false },
  { to: '/mobile/grades', icon: BarChart2, label: 'Baho', end: false },
  { to: '/mobile/profile', icon: User, label: 'Profil', end: false },
];

export const teacherMobileRouteMeta: TeacherMobileRouteMeta[] = [
  { path: '/mobile', title: 'Bugungi oqim', eyebrow: 'Ustoz mobile', exact: true },
  { path: '/mobile/scanner', title: 'QR Vision', eyebrow: 'Test tekshiruvi' },
  { path: '/mobile/remote', title: 'Pult rejimi', eyebrow: 'Tezkor baholash' },
  { path: '/mobile/grades', title: "Ro'yxat baholari", eyebrow: 'Sinf jurnali' },
  { path: '/mobile/profile', title: 'Profil va sozlamalar', eyebrow: 'Shaxsiy kabinet' },
  { path: '/mobile/assistant', title: 'AI yordam', eyebrow: 'Yangi xususiyat' },
];

export function getTeacherMobileRouteMeta(pathname: string) {
  return (
    teacherMobileRouteMeta.find((item) =>
      item.exact ? pathname === item.path : pathname.startsWith(item.path)
    ) ?? teacherMobileRouteMeta[0]
  );
}

export const teacherQuickActions: TeacherQuickAction[] = [
  {
    label: 'QR Vision',
    desc: 'Test tekshiruvi',
    icon: QrCode,
    gradient: 'from-indigo-500 to-violet-500',
    glow: 'shadow-indigo-200/80',
    link: '/mobile/scanner',
  },
  {
    label: 'Pult rejimi',
    desc: 'Tezkor baho',
    icon: Zap,
    gradient: 'from-violet-500 to-fuchsia-500',
    glow: 'shadow-fuchsia-200/80',
    link: '/mobile/remote',
  },
  {
    label: "Baho qo'yish",
    desc: "Ro'yxat bo'yicha",
    icon: BarChart2,
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-200/80',
    link: '/mobile/grades',
  },
  {
    label: 'AI Yordam',
    desc: 'Prompt va workflow',
    icon: Brain,
    gradient: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-200/80',
    link: '/mobile/assistant',
    badge: 'Yangi',
  },
];

export const teacherStats: TeacherStat[] = [
  { label: 'Bugun', value: '4', unit: 'dars', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: "O'quvchilar", value: '156', unit: 'ta', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: "O'rtacha", value: '4.2', unit: 'ball', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Davomat', value: '94', unit: '%', icon: CheckCircle2, color: 'text-orange-600', bg: 'bg-orange-50' },
];

export const teacherFocusCards: TeacherFocusCard[] = [
  {
    title: 'Navbatdagi dars',
    value: '09:00 · 6-B',
    hint: 'Matematika darsi hozir',
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  {
    title: 'Baholash oqimi',
    value: '18 / 24',
    hint: "6 ta javob kutilmoqda",
    tone: 'bg-violet-50 text-violet-700 ring-violet-100',
  },
  {
    title: 'AI tayyor',
    value: '4 prompt',
    hint: 'Dars va feedback uchun',
    tone: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
];

export const teacherTodayLessons: TeacherLesson[] = [
  { time: '08:00', className: '5-A', subject: 'Matematika', status: 'done' },
  { time: '09:00', className: '6-B', subject: 'Matematika', status: 'active' },
  { time: '10:00', className: '7-A', subject: 'Algebra', status: 'upcoming' },
  { time: '11:00', className: '5-B', subject: 'Geometriya', status: 'upcoming' },
];

export const teacherNotifications: TeacherNotification[] = [
  { id: 1, text: "5-A sinfida nazorat ishi rejada", time: '10 daq oldin', type: 'warning' },
  { id: 2, text: '6-B sinfi baholari saqlandi', time: '1 soat oldin', type: 'success' },
  { id: 3, text: "Ota-onalar yig'ilishi eslatmasi", time: '3 soat oldin', type: 'info' },
];

export const teacherAssistantPrompts: TeacherAssistantPrompt[] = [
  {
    id: 'lesson-plan',
    title: '5 daqiqalik dars reja',
    description: 'Bugungi dars uchun tez reja',
    prompt:
      "6-B sinfi uchun 35 daqiqalik matematika darsi rejasini tuz. Kirish, asosiy mashq, differensial topshiriq va yakuniy refleksiyani qisqa formatda ber.",
  },
  {
    id: 'feedback',
    title: 'Ota-onaga feedback',
    description: 'Ijobiy va aniq izoh',
    prompt:
      "Ota-onaga yuborish uchun 4 gapdan iborat muloyim feedback yoz. O'quvchining kuchli tomoni, bugungi natija va keyingi tavsiyani qo'sh.",
  },
  {
    id: 'assessment',
    title: 'Baholash mezoni',
    description: "Og'zaki javob uchun rubrika",
    prompt:
      "7-A algebra darsi uchun 2, 3, 4, 5 baholariga mos og'zaki javob mezonini jadval ko'rinishida tayyorla. Til sodda va aniq bo'lsin.",
  },
  {
    id: 'engagement',
    title: 'Faollashtiruvchi savollar',
    description: 'Sinfni jonlantirish uchun',
    prompt:
      "Mavzu: kasrlar. 3 ta tezkor savol, 1 ta juftlikda ishlash mashqi va 1 ta exit-ticket namunasi yoz.",
  },
];

export const teacherWorkflowCards: TeacherWorkflowCard[] = [
  {
    title: 'Prompt kutubxonasi',
    summary: 'Dars, feedback va baholash promptlari bir joyda jamlandi.',
    status: 'Tayyor',
    accent: 'bg-emerald-100 text-emerald-700',
    icon: Sparkles,
  },
  {
    title: 'AI sahifa shelli',
    summary: "Yangi ekran qo'shish uchun animatsiyali mobil page tayyorlandi.",
    status: 'UI tayyor',
    accent: 'bg-violet-100 text-violet-700',
    icon: Brain,
  },
  {
    title: 'Ovozli yordamchi',
    summary: 'Keyingi iteratsiyada mikrofon va speech-to-text ulashga joy tayyor.',
    status: 'API ulash kerak',
    accent: 'bg-amber-100 text-amber-700',
    icon: Mic2,
  },
  {
    title: 'Baholash checklisti',
    summary: 'Rubrika va tezkor nazorat generatorini shu pagega ulash mumkin.',
    status: 'UI tayyor',
    accent: 'bg-blue-100 text-blue-700',
    icon: ClipboardCheck,
  },
];

export const teacherIntegrationReadiness: TeacherIntegrationReadiness[] = [
  {
    title: 'Feature config markazi',
    detail: 'Tablar, quick actionlar va route metasi bitta data fayldan boshqariladi.',
    progress: '100%',
  },
  {
    title: 'AI workflow paneli',
    detail: 'Prompt preview, workflow kartalar va foydali holatlar uchun skeleton tayyor.',
    progress: '85%',
  },
  {
    title: 'Realtime signal qatlamlari',
    detail: 'Davomat, baholash va bildirishnoma bloklari jonli ko‘rinishga moslashtirildi.',
    progress: '80%',
  },
];

export const teacherSignalCards = [
  {
    title: 'Bugungi fokus',
    text: 'Skaner, pult va AI yordam endi bitta mobil oqimga birlashtirildi.',
    icon: Sparkles,
    tone: 'from-zinc-950 via-zinc-900 to-zinc-800',
  },
  {
    title: 'Bildirishnomalar',
    text: 'Muhim dars, baho va eslatmalar bir qarashda ko‘rinadi.',
    icon: Bell,
    tone: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Keyingi qadam',
    text: 'Voice, push va analytics modulini shu tuzilma ustiga tez qo‘shsa bo‘ladi.',
    icon: BookOpenCheck,
    tone: 'from-violet-500 to-fuchsia-500',
  },
];
