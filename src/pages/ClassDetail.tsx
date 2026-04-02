import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  GraduationCap, ChevronLeft, ChevronRight, Users, BookOpen,
  LayoutDashboard, Calendar, ClipboardCheck, Target, BarChart3,
  Plus, X, Search, ArrowUpDown, FileText, Settings, Share2, MoreHorizontal
} from 'lucide-react';
import { StudentsTab } from '../components/students/StudentsTab';
import { CreateStudentModal } from '../components/students/CreateStudentModal';
import { GradesTab } from '../components/students/GradesTab';
import { CreateAssignmentModal } from '../components/students/CreateAssignmentModal';
import { AttendanceTab } from '../components/students/AttendanceTab';
import { StandardsTab } from '../components/students/StandardsTab';
import { CreateTopicModal } from '../components/students/CreateTopicModal';
import { ManageTopicsModal } from '../components/students/ManageTopicsModal';
import { AddStandardsModal } from '../components/students/AddStandardsModal';
const classColors: Record<string, { bg: string; icon: string; card: string; border: string }> = {
  '5-A': { bg: 'bg-rose-50', icon: 'text-rose-400', card: 'border-rose-200', border: 'border-rose-100' },
  '5-B': { bg: 'bg-orange-50', icon: 'text-orange-400', card: 'border-orange-200', border: 'border-orange-100' },
  '5-D': { bg: 'bg-yellow-50', icon: 'text-yellow-500', card: 'border-yellow-200', border: 'border-yellow-100' },
  '6-A': { bg: 'bg-emerald-50', icon: 'text-emerald-500', card: 'border-emerald-200', border: 'border-emerald-100' },
  '6-B': { bg: 'bg-cyan-50', icon: 'text-cyan-500', card: 'border-cyan-200', border: 'border-cyan-100' },
  '6-D': { bg: 'bg-sky-50', icon: 'text-sky-400', card: 'border-sky-200', border: 'border-sky-100' },
};

const classData: Record<string, {
  schedule: string; students: number; lessons: number; units: number; remaining: number;
}> = {
  '5-A': { schedule: 'Fri · 10:35 AM', students: 13, lessons: 16, units: 8, remaining: 0 },
  '5-B': { schedule: 'Fri · 9:40 AM', students: 14, lessons: 16, units: 8, remaining: 0 },
  '5-D': { schedule: 'Fri · 8:00 AM', students: 18, lessons: 16, units: 8, remaining: 0 },
  '6-A': { schedule: '16:20 — 17:05', students: 13, lessons: 16, units: 8, remaining: 0 },
  '6-B': { schedule: '14:40 — 15:25', students: 10, lessons: 16, units: 8, remaining: 0 },
  '6-D': { schedule: '16:30 — 16:15', students: 14, lessons: 16, units: 8, remaining: 0 },
};

type Tab = 'overview' | 'planner' | 'lessons' | 'students' | 'grades' | 'attendance' | 'standards';

export default function ClassDetail() {
  const { t, i18n } = useTranslation();
  const { className } = useParams<{ className: string }>();
  const name = className || '5-A';
  const color = classColors[name] || classColors['5-A'];
  const data = classData[name] || classData['5-A'];

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showCreateUnit, setShowCreateUnit] = useState(false);
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [showManageTopics, setShowManageTopics] = useState(false);
  const [showAddStandards, setShowAddStandards] = useState(false);
  const [calView, setCalView] = useState<'week' | 'month'>('month');
  const [notes, setNotes] = useState('');

  const calDays = i18n.language === 'uz' ? ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'] : (i18n.language === 'ru' ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);

  const sideNav: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: t('classDetail.overview'), icon: LayoutDashboard },
    { key: 'planner', label: t('classDetail.planner'), icon: Calendar },
    { key: 'lessons', label: t('sidebar.lessons'), icon: BookOpen },
    { key: 'students', label: t('sidebar.students'), icon: Users },
    { key: 'grades', label: t('sidebar.grades'), icon: BarChart3 },
    { key: 'attendance', label: t('sidebar.attendance'), icon: ClipboardCheck },
    { key: 'standards', label: t('sidebar.standards'), icon: Target },
  ];

  return (
    <div className="flex gap-6 h-full font-sans animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Left Column: Class Card & Nav */}
      <div className="w-[220px] flex-shrink-0 flex flex-col gap-5">
        <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-4">
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-11 h-11 rounded-[14px] ${color.bg} flex items-center justify-center shadow-sm`}>
              <GraduationCap className={`w-6 h-6 ${color.icon}`} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-[17px] leading-tight">{name}</h2>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">{data.schedule}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100">
              <div className="text-[17px] font-bold text-slate-900">{activeTab === 'planner' ? data.lessons : data.units}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{activeTab === 'planner' ? t('sidebar.classesTitle') : t('classDetail.units')}</div>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-slate-100">
              <div className="text-[17px] font-bold text-slate-900">{activeTab === 'planner' ? 0 : data.lessons}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{activeTab === 'planner' ? t('classDetail.scheduled') : t('sidebar.lessons')}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-400 uppercase tracking-wider">{activeTab === 'lessons' ? t('classDetail.progress') : t('classDetail.scheduled')}</span>
              <span className="text-slate-800">0%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${color.icon.replace('text-', 'bg-')} rounded-full opacity-60`} style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>

        {/* Vertical Nav */}
        <div className="bg-white rounded-[24px] border border-slate-200/60 shadow-sm p-2 flex flex-col">
          {sideNav.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-[14px] font-semibold text-left
                ${activeTab === item.key 
                  ? `bg-white border ${color.card} ${color.icon} shadow-sm shadow-slate-100` 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeTab === item.key ? color.icon.replace('text-', 'bg-') : 'bg-rose-400 opacity-80'}`}></div>
              {item.label}
              {item.key === 'students' && <span className="ml-auto text-xs text-slate-300 font-bold">{data.students}</span>}
              {activeTab === item.key && item.key === 'lessons' && <BookOpen className="ml-auto w-4 h-4 opacity-40" strokeWidth={1.5} />}
              {activeTab === item.key && item.key === 'planner' && <Calendar className="ml-auto w-4 h-4 opacity-40" strokeWidth={1.5} />}
            </button>
          ))}
        </div>
      </div>

      {/* Middle Column: Main Content Area */}
      <div className="flex-1 bg-white rounded-[28px] border border-slate-200/60 shadow-sm flex flex-col overflow-hidden">
        
        {/* TAB: UNITS */}
        {activeTab === 'lessons' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-7 py-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{t('classDetail.units')}</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 transition-colors"><Search className="w-5 h-5" /></button>
                <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 transition-colors"><ArrowUpDown className="w-5 h-5" /></button>
                <button 
                  onClick={() => setShowCreateUnit(true)}
                  className="flex items-center gap-2 bg-slate-900 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" /> {t('classDetail.createUnit')}
                </button>
              </div>
            </div>
            
            <div className="px-7 space-y-4 flex-1 overflow-y-auto pb-8">
              {/* Unit Card Placeholder */}
              <div className="bg-slate-50/50 rounded-[22px] border border-slate-100 p-4 flex items-center gap-5 group hover:bg-white hover:shadow-md hover:border-slate-200 transition-all cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 border border-slate-50 shadow-sm group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">No unit</h3>
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> 0 {t('sidebar.lessons')}</span>
                      <span className="text-slate-200">0%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-200/50 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 font-medium italic">Lessons not assigned to any unit</p>
                </div>
              </div>

              {/* Empty state big */}
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mb-6 border border-slate-100">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">{t('classDetail.noUnitsYet')}</h3>
                <p className="text-slate-400 text-sm max-w-[200px] mb-8 font-medium">{t('classDetail.createUnitDesc')}</p>
                <button 
                  onClick={() => setShowCreateUnit(true)}
                  className="flex items-center gap-2 bg-white border border-slate-200 text-slate-900 text-[13px] font-bold px-6 py-3 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  <Plus className="w-4 h-4" /> {t('classDetail.createUnit')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PLANNER */}
        {activeTab === 'planner' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                  <Calendar className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 leading-tight">{t('dashboard.calMonth')}</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-slate-100/80 rounded-[14px] p-1 border border-slate-200/50">
                  <button onClick={() => setCalView('week')} className={`px-4 py-1.5 text-[12px] font-bold rounded-xl transition-all ${calView === 'week' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>{t('classDetail.week')}</button>
                  <button onClick={() => setCalView('month')} className={`px-4 py-1.5 text-[12px] font-bold rounded-xl transition-all ${calView === 'month' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{t('classDetail.month')}</button>
                </div>
                <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all"><Settings className="w-5 h-5" /></button>
                <div className="flex items-center gap-1.5">
                  <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"><ChevronLeft className="w-4 h-4 text-slate-400" /></button>
                  <button className="px-5 py-2 text-[12px] font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-all uppercase tracking-wider text-slate-600">{t('classDetail.today')}</button>
                  <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <div className="grid grid-cols-7 gap-px rounded-3xl overflow-hidden border border-slate-100/60 bg-slate-100/40">
                {calDays.map(d => (
                  <div key={d} className="bg-white py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-center border-b border-slate-50">{d}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 5;
                  const isValid = day >= 1 && day <= 31;
                  const isToday = day === 29;
                  const isHoliday = day >= 22 && day <= 29;
                  const hasClass = day === 6 || day === 13 || day === 20 || day === 27;

                  return (
                    <div key={i} className={`bg-white min-h-[100px] p-2 relative group hover:bg-slate-50/50 transition-colors
                      ${!isValid ? 'bg-slate-50/30' : ''}`}>
                      <div className="flex justify-between items-start">
                        <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                          ${isToday ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-110' : 'text-slate-400 group-hover:text-slate-600'}
                          ${!isValid ? 'opacity-20' : ''}`}>
                          {isValid ? day : ''}
                        </span>
                        {isValid && <MoreHorizontal className="w-4 h-4 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-slate-500" />}
                      </div>

                      {isHoliday && isValid && (
                        <div className="mt-2 text-center">
                          <div className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all
                            ${day === 29 ? 'bg-rose-100/50 text-rose-500' : 'bg-rose-50/50 text-rose-400'}`}>
                            {day === 22 || day === 29 ? t('classDetail.springBreak') : ' '}
                          </div>
                        </div>
                      )}

                      {!isHoliday && hasClass && isValid && (
                        <div className="mt-2">
                          <div className={`p-2 rounded-xl text-[11px] font-bold border ${color.border} ${color.bg} ${color.icon} flex items-center gap-2 shadow-sm`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${color.icon.replace('text-', 'bg-')}`}></div>
                            {name}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="flex flex-col h-full bg-slate-50/30">
            <div className="flex items-center justify-between px-7 py-5 bg-white border-b border-slate-100/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{t('sidebar.lessons')} <span className="text-slate-400 font-normal ml-1">{t('classDetail.upcoming')}</span></h1>
              </div>
              <button className="text-[12px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">{t('classDetail.viewAll')}</button>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
              <div className="w-24 h-24 bg-white rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-center text-slate-200 mb-6 group-hover:scale-105 transition-all">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <h3 className="text-[17px] font-extrabold text-slate-800 mb-2">{t('classDetail.noLessonsScheduled')}</h3>
              <p className="text-slate-400 text-[13px] font-medium">Relax, you're all caught up for now!</p>
            </div>
          </div>
        )}

        {/* TAB: STUDENTS */}
        {activeTab === 'students' && <StudentsTab onNewStudent={() => setShowCreateStudent(true)} />}
        
        {/* TAB: GRADES */}
        {activeTab === 'grades' && (
          <GradesTab 
             onNewAssignment={() => setShowCreateAssignment(true)} 
             onCreateTopic={() => setShowCreateTopic(true)} 
             onManageTopics={() => setShowManageTopics(true)} 
          />
        )}

        {/* TAB: ATTENDANCE */}
        {activeTab === 'attendance' && <AttendanceTab />}

        {/* TAB: STANDARDS */}
        {activeTab === 'standards' && <StandardsTab onAddStandards={() => setShowAddStandards(true)} />}

        {/* DEFAULT TAB VIEW */}
        {!['overview', 'planner', 'lessons', 'students', 'grades', 'attendance', 'standards'].includes(activeTab) && (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-slate-300">
            <div className={`w-28 h-28 bg-white border border-slate-100 rounded-[40px] shadow-sm flex items-center justify-center mb-8`}>
              {activeTab === 'attendance' && <ClipboardCheck className="w-10 h-10" />}
              {activeTab === 'standards' && <Target className="w-10 h-10" />}
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight capitalize">{sideNav.find(s => s.key === activeTab)?.label}</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest opacity-60">Building this experience for you</p>
          </div>
        )}
      </div>

      {/* Right Column: Mini Widgets */}
      <div className="w-[260px] flex-shrink-0 flex flex-col gap-6">
        {/* Simple Month Calendar */}
        <div className="bg-white rounded-[28px] border border-slate-200/60 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
              <h2 className="font-extrabold text-slate-900 text-sm tracking-tight">{t('dashboard.calMonth')}</h2>
            </div>
            <div className="flex gap-1">
              <button className="p-1 text-slate-300 hover:text-slate-800 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1 text-slate-300 hover:text-slate-800 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-[10px] font-black uppercase tracking-[0.1em] text-slate-300 mb-2">
            {calDays.map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-y-1.5 text-center">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(date => {
              const isToday = date === 29;
              return (
                <div key={date} className={`w-7 h-7 flex items-center justify-center rounded-xl mx-auto text-[12px] font-bold transition-all cursor-pointer group
                  ${isToday ? 'bg-slate-900 text-white shadow-md shadow-slate-200 ring-4 ring-slate-100/50' : 'text-slate-500 hover:text-slate-900 hover:scale-110'}`}>
                  {date}
                  {date === 30 && <div className="absolute mt-5 w-1 h-1 bg-emerald-500 rounded-full"></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Notes */}
        <div className="bg-white rounded-[28px] border border-slate-200/60 shadow-sm p-6 flex-1 flex flex-col relative group">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">
                <FileText className="w-4 h-4" strokeWidth={2} />
              </div>
              <h2 className="font-extrabold text-slate-900 text-[15px] tracking-tight">{t('classDetail.notes')}</h2>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
               <button className="p-1.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg border border-slate-100 transition-all"><Share2 className="w-3.5 h-3.5" /></button>
               <button className="p-1.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-lg border border-slate-100 transition-all"><Plus className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Jot down quick notes about this class..."
            className="flex-1 w-full bg-transparent border-none outline-none resize-none text-[14px] font-medium text-slate-600 placeholder:text-slate-300 placeholder:italic leading-relaxed animate-in fade-in"
          />
          <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{t('classDetail.lastEdited', { time: 'now' })}</span>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================================================ */}
      {/* CREATE UNIT MODAL */}
      {/* ============================================================================================ */}
      {showCreateUnit && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg border border-white/20 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
              <div>
                <h2 className="font-black text-slate-900 text-2xl tracking-tight">{t('classDetail.createUnit')}</h2>
                <p className="text-[13px] text-slate-400 font-bold mt-1 uppercase tracking-wider opacity-80">{t('classDetail.unitLeadDesc')}</p>
              </div>
              <button 
                onClick={() => setShowCreateUnit(false)} 
                className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all shadow-sm active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-8 py-7 space-y-7">
              {/* Name field */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] block mb-2.5">{t('classDetail.unitName')} <span className="text-rose-500 font-bold">*</span></label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <BookOpen className="w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
                  </div>
                  <input
                    autoFocus
                    placeholder={t('classDetail.unitPlaceholder')}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300 placeholder:italic"
                  />
                </div>
              </div>

              {/* Classes Dropdown */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2 mb-2.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  {t('classDetail.linkToClasses')}
                </label>
                <button className="w-full group bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-white hover:border-slate-900 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-lg ${color.bg} shadow-sm border border-white flex items-center justify-center`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${color.icon.replace('text-', 'bg-')}`}></div>
                    </div>
                    <span className="text-sm font-black text-slate-800">{name}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                </button>
                <p className="text-[11px] text-slate-400 mt-2.5 font-bold italic">{t('classDetail.linkDesc')}</p>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] block mb-2.5">{t('classDetail.descLabel')}</label>
                <textarea
                  rows={3}
                  placeholder={t('classDetail.descPlaceholder')}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300 placeholder:italic resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 px-8 py-6 bg-slate-50/50 border-t border-slate-50">
              <button 
                onClick={() => setShowCreateUnit(false)}
                className="px-7 py-3 text-[13px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest"
              >
                {t('common.cancel')}
              </button>
              <button className="px-9 py-3 bg-slate-900 text-white text-[13px] font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95">
                {t('classDetail.createUnit')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateStudent && <CreateStudentModal onClose={() => setShowCreateStudent(false)} />}
      {showCreateAssignment && <CreateAssignmentModal onClose={() => setShowCreateAssignment(false)} />}
      {showCreateTopic && <CreateTopicModal onClose={() => setShowCreateTopic(false)} />}
      {showManageTopics && <ManageTopicsModal onClose={() => setShowManageTopics(false)} />}
      {showAddStandards && <AddStandardsModal onClose={() => setShowAddStandards(false)} />}
    </div>
  );
}

function ChevronDown(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
