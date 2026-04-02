import { useState } from 'react';
import { ChevronLeft, ChevronRight, EyeOff, CalendarDays, ExternalLink, Plus, FileText, X, Settings2, PenLine, ArrowLeftRight, RotateCcw, Ban, ArrowRightLeft, ShieldBan, Check } from 'lucide-react';
import { LessonEditorModal } from '../components/planner/LessonEditorModal';
import { LinkLessonModal } from '../components/planner/LinkLessonModal';
import { RemoveLessonModal } from '../components/planner/RemoveLessonModal';

const classStyles: Record<string, { bg: string, text: string, solid: string, border: string }> = {
  '5-A': { bg: 'bg-rose-50', text: 'text-rose-500', solid: 'bg-rose-400', border: 'border-rose-100' },
  '5-B': { bg: 'bg-orange-50', text: 'text-orange-500', solid: 'bg-orange-400', border: 'border-orange-100' },
  '5-D': { bg: 'bg-amber-50', text: 'text-amber-500', solid: 'bg-amber-400', border: 'border-amber-100' },
  '6-A': { bg: 'bg-emerald-50', text: 'text-emerald-500', solid: 'bg-emerald-400', border: 'border-emerald-100' },
  '6-B': { bg: 'bg-cyan-50', text: 'text-cyan-500', solid: 'bg-cyan-400', border: 'border-cyan-100' },
  '6-D': { bg: 'bg-sky-50', text: 'text-sky-500', solid: 'bg-sky-400', border: 'border-sky-100' },
  '7-B': { bg: 'bg-purple-50', text: 'text-purple-500', solid: 'bg-purple-400', border: 'border-purple-100' },
  '7-D': { bg: 'bg-fuchsia-50', text: 'text-fuchsia-500', solid: 'bg-fuchsia-400', border: 'border-fuchsia-100' },
  '8-A': { bg: 'bg-rose-50', text: 'text-rose-500', solid: 'bg-rose-400', border: 'border-rose-100' },
  '8-B': { bg: 'bg-orange-50', text: 'text-orange-500', solid: 'bg-orange-400', border: 'border-orange-100' },
  '8-D': { bg: 'bg-sky-50', text: 'text-sky-500', solid: 'bg-sky-400', border: 'border-sky-100' },
  '9-A': { bg: 'bg-amber-50', text: 'text-amber-600', solid: 'bg-amber-400', border: 'border-amber-100' },
  '9-B': { bg: 'bg-emerald-50', text: 'text-emerald-600', solid: 'bg-emerald-400', border: 'border-emerald-100' },
};

// Mock data based on the screenshots
const mockMonthEvents: Record<number, { code: string, daysActive: string[] }> = {
  4: { code: 'D3', daysActive: ['9-B', '9-A', '8-A'] },
  6: { code: 'D5', daysActive: ['5-D', '5-B', '5-A'] },
  7: { code: 'D6', daysActive: ['7-B', '6-B', '8-D'] },
  11: { code: 'D3', daysActive: ['9-B', '9-A', '8-A'] },
  13: { code: 'D5', daysActive: ['5-D', '5-B', '5-A'] },
  14: { code: 'D6', daysActive: ['7-B', '6-B', '8-D'] },
  18: { code: 'D3', daysActive: ['9-B', '9-A', '8-A'] },
};

export default function Planner() {
  const [view, setView] = useState<'week' | 'month'>('week'); // Defaulting to week to showcase feature
  const [hoveredWeekEvent, setHoveredWeekEvent] = useState<number | null>(null);
  const [openDaySettings, setOpenDaySettings] = useState<{ idx: number, menu: 'main' | 'move' | 'rotation' | 'block' } | null>(null);
  const [editingDay, setEditingDay] = useState<number | null>(null);

  // Modals state
  const [showEditor, setShowEditor] = useState(false);
  const [linkModalData, setLinkModalData] = useState<{ id: number, className: string } | null>(null);
  const [removeModalData, setRemoveModalData] = useState<{ id: number, lessonTitle: string } | null>(null);

  const [weekEvents, setWeekEvents] = useState<{ id: number, day: number, top: string, height: string, class: string, time: string, lessonTitle: string | null }[]>([
    { id: 1, day: 3, top: '0', height: '45px', class: '9-B', time: '08:00-08:45', lessonTitle: null },
    { id: 2, day: 5, top: '0', height: '45px', class: '5-D', time: '08:00-08:45', lessonTitle: null },
    { id: 3, day: 5, top: '100px', height: '45px', class: '5-B', time: '09:40-10:25', lessonTitle: null },
    { id: 4, day: 5, top: '155px', height: '45px', class: '5-A', time: '10:35-11:20', lessonTitle: null },
    { id: 5, day: 3, top: '205px', height: '45px', class: '9-A', time: '11:25-12:10', lessonTitle: null },
    { id: 6, day: 5, top: '205px', height: '45px', class: '9-B', time: '11:25-12:10', lessonTitle: null },
    { id: 7, day: 5, top: '255px', height: '45px', class: '9-A', time: '12:15-13:00', lessonTitle: null },
  ]);

  // Constants localized
  const daysOfWeekFull = ['YAK', 'DUSH', 'SESH', 'CHOR', 'PAY', 'JUMA', 'SHAN'];
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
  
  // April Mock Week View Days
  const weekDays = [
    { date: 29, active: false, code: '' },
    { date: 30, active: true, code: 'D1' }, 
    { date: 31, active: false, code: 'D2' },
    { date: 1, active: false, code: 'D3' },
    { date: 2, active: false, code: 'D4' },
    { date: 3, active: false, code: 'D5' },
    { date: 4, active: false, code: 'D6' }
  ];

  /* Handlers */
  const handleCreateLesson = (id: number) => {
    // Show editor, and simulatenously set the lesson title to "Sarlavhasiz dars"
    const newEvents = weekEvents.map(e => e.id === id ? { ...e, lessonTitle: 'Sarlavhasiz dars' } : e);
    setWeekEvents(newEvents);
    setShowEditor(true);
  };

  const handleLinkLesson = (id: number, lessonTitle: string) => {
    const newEvents = weekEvents.map(e => e.id === id ? { ...e, lessonTitle } : e);
    setWeekEvents(newEvents);
    setLinkModalData(null);
  };

  const handleRemoveLessonConfirm = () => {
    if(!removeModalData) return;
    const newEvents = weekEvents.map(e => e.id === removeModalData.id ? { ...e, lessonTitle: null } : e);
    setWeekEvents(newEvents);
    setRemoveModalData(null);
  };

  return (
    <div className="flex flex-col h-full w-full font-sans animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Container matches full width of dashboard content area */}
      <div className="flex-1 bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col overflow-hidden m-6 mb-8 relative">
        
        {/* Header Toolbar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-50 shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-slate-500 rounded-lg bg-slate-50 border border-slate-100">
              <CalendarDays className="w-4 h-4" />
            </div>
            <h2 className="text-[20px] font-extrabold text-slate-800 tracking-tight">
               {view === 'month' ? 'Mart 2026' : 'Aprel 2026'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex bg-slate-50 border gap-1 border-slate-200/60 p-1 rounded-xl shadow-sm">
                <button 
                  onClick={() => setView('week')} 
                  className={`px-5 py-1.5 rounded-[8px] text-[13px] font-bold transition-all ${view === 'week' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Hafta
                </button>
                <button 
                  onClick={() => setView('month')} 
                  className={`px-5 py-1.5 rounded-[8px] text-[13px] font-bold transition-all ${view === 'month' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Oy
                </button>
             </div>
             
             <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
                <EyeOff className="w-4 h-4" />
             </button>
          </div>

          <div className="flex items-center gap-2">
             <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
                <ChevronLeft className="w-4 h-4" />
             </button>
             <button className="px-5 py-1.5 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
                Bugun
             </button>
             <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
                <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#fcfcfd]">
          {view === 'month' ? (
            // ================== MONTH VIEW ==================
            <div className="flex flex-col min-h-full">
              {/* Grid Header */}
              <div className="grid grid-cols-7 border-b border-slate-100 bg-white sticky top-0 z-10">
                {daysOfWeekFull.map(day => (
                  <div key={day} className="py-4 text-center border-r border-slate-50 last:border-r-0">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-[#fdfdfd]">
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayNum = i + 1;
                  const isHoliday = dayNum >= 20 && dayNum <= 29;
                  const isToday = dayNum === 29;
                  const hasD1 = dayNum === 2 || dayNum === 9 || dayNum === 16 || dayNum === 30;
                  const hasD2 = dayNum === 3 || dayNum === 10 || dayNum === 17 || dayNum === 31;
                  const event = mockMonthEvents[dayNum];
                  const code = event ? event.code : hasD1 ? 'D1' : hasD2 ? 'D2' : '';
                  const validEmpty = dayNum > 31;

                  if (validEmpty) {
                     return <div key={`empty-${i}`} className="border-r border-b border-slate-100 p-2 min-h-[120px] flex gap-1 opacity-50 bg-slate-50">
                       <span className="text-[13px] font-bold text-slate-300">{dayNum - 31}</span>
                       {(dayNum - 31) === 1 && <span className="text-[10px] text-slate-300 font-bold mt-0.5 opacity-50">D3</span>}
                     </div>;
                  }

                  return (
                    <div 
                      key={dayNum} 
                      className={`border-r border-b border-slate-100 p-2.5 min-h-[120px] flex flex-col relative transition-colors ${isHoliday ? 'bg-rose-50/40' : 'bg-white hover:bg-slate-50/50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[13px] font-bold flex items-center gap-1.5 ${isToday ? 'w-6 h-6 rounded-full bg-slate-800 text-white justify-center shadow-md' : 'text-slate-700'}`}>
                           {dayNum === 30 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                           {dayNum}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wide">{code}</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5">
                         {isHoliday && (
                            <span className="text-[10px] font-bold text-rose-400 mt-auto opacity-70 mb-1 pointer-events-none text-left pl-1">
                              Bahorgi ta'til
                            </span>
                         )}
                         {event && !isHoliday && (
                           <div className="space-y-1.5">
                             {event.daysActive.map((clsName, clsIdx) => {
                               const style = classStyles[clsName] || classStyles['5-A'];
                               return (
                                 <div key={clsIdx} className={`px-2 py-1 ${style.bg} ${style.text} rounded-lg flex items-center gap-1.5 text-[10px] font-bold shadow-sm`}>
                                   <div className={`w-1.5 h-1.5 rounded-full ${style.solid}`}></div>
                                   {clsName}
                                 </div>
                               );
                             })}
                           </div>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // ================== WEEK VIEW ==================
            <div className="flex flex-col relative min-h-[800px]">
               {/* Grid Header */}
               <div className="flex border-b border-slate-100 bg-white sticky top-0 z-20 shadow-[0_1px_0_rgba(241,245,249,1)]">
                 <div className="w-[80px] shrink-0 border-r border-slate-50 bg-white"></div>
                 {daysOfWeekFull.map((day, idx) => {
                   const { date, active, code } = weekDays[idx];
                   const isHoliday = date === 29; 

                   return (
                     <div key={day} className={`flex-1 py-3 px-3 flex items-center justify-between border-r border-slate-50 last:border-r-0 ${isHoliday ? 'bg-rose-50/40 relative' : ''}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black tracking-widest text-slate-400">{day}</span>
                          <span className={`text-[13px] font-bold flex items-center gap-1.5 ${active ? 'text-slate-900' : 'text-slate-500'}`}>
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                            {date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 relative">
                          <span className={`text-[10px] font-bold text-slate-300 relative z-10 transition-colors ${openDaySettings?.idx === idx ? 'text-slate-800' : ''}`}>{code}</span>
                          
                          {/* Day Settings Button & Popover */}
                          {active && (
                            <div className="relative z-50">
                               <button 
                                 onClick={() => setOpenDaySettings(openDaySettings?.idx === idx ? null : { idx, menu: 'main' })}
                                 className={`w-5 h-5 rounded flex justify-center items-center transition-colors ${openDaySettings?.idx === idx ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                               >
                                 <Settings2 className="w-3 h-3" />
                               </button>

                               {openDaySettings?.idx === idx && (
                                 <div className="absolute top-full right-0 mt-2 bg-white rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 w-[160px] p-1.5 animate-in fade-in zoom-in-95 duration-100">
                                    
                                    {openDaySettings.menu === 'main' && (
                                      <>
                                        <button 
                                          onClick={() => { setEditingDay(idx); setOpenDaySettings(null); }}
                                          className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-[8px] transition-colors flex items-center gap-2.5 mb-1 group"
                                        >
                                          <PenLine className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-900" />
                                          Tahrirlash
                                        </button>
                                        <button 
                                          onClick={() => setOpenDaySettings({ idx, menu: 'move' })}
                                          className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-[8px] transition-colors flex items-center justify-between mb-0.5 group"
                                        >
                                          <div className="flex items-center gap-2.5">
                                            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                                            Ko'chirish
                                          </div>
                                        </button>
                                        <button 
                                          onClick={() => setOpenDaySettings({ idx, menu: 'rotation' })}
                                          className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-[8px] transition-colors flex items-center justify-between mb-0.5 group"
                                        >
                                          <div className="flex items-center gap-2.5">
                                            <RotateCcw className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                                            Aylanish
                                          </div>
                                        </button>
                                        <div className="h-px bg-slate-100 my-1"></div>
                                        <button 
                                          onClick={() => setOpenDaySettings({ idx, menu: 'block' })}
                                          className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-[8px] transition-colors flex items-center justify-between group"
                                        >
                                          <div className="flex items-center gap-2.5">
                                            <Ban className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500" />
                                            Bloklash
                                          </div>
                                        </button>
                                      </>
                                    )}

                                    {openDaySettings.menu === 'move' && (
                                      <div className="animate-in slide-in-from-right-2 duration-200">
                                        <div className="px-2 py-1.5 flex items-center gap-2 border-b border-slate-100 mb-1 pb-2">
                                           <button onClick={() => setOpenDaySettings({ idx, menu: 'main' })} className="text-slate-400 hover:text-slate-800"><ChevronLeft className="w-3.5 h-3.5" /></button>
                                           <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Ko'chirish</span>
                                        </div>
                                        <div className="relative group cursor-not-allowed">
                                           <button disabled className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-400 rounded-[8px] flex items-center gap-2.5">
                                             <ArrowRightLeft className="w-3.5 h-3.5 opacity-50" />
                                             Darslarni surish
                                           </button>
                                           <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Tez kunda</div>
                                        </div>
                                      </div>
                                    )}

                                    {openDaySettings.menu === 'rotation' && (
                                      <div className="animate-in slide-in-from-right-2 duration-200">
                                        <div className="px-2 py-1.5 flex items-center gap-2 border-b border-slate-100 mb-1 pb-2">
                                           <button onClick={() => setOpenDaySettings({ idx, menu: 'main' })} className="text-slate-400 hover:text-slate-800"><ChevronLeft className="w-3.5 h-3.5" /></button>
                                           <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Aylanish</span>
                                        </div>
                                        <button className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-[8px] transition-colors flex items-center gap-2.5">
                                          <RotateCcw className="w-3.5 h-3.5" />
                                          Aylanishni tekislash
                                        </button>
                                      </div>
                                    )}

                                    {openDaySettings.menu === 'block' && (
                                      <div className="animate-in slide-in-from-right-2 duration-200">
                                        <div className="px-2 py-1.5 flex items-center gap-2 border-b border-slate-100 mb-1 pb-2">
                                           <button onClick={() => setOpenDaySettings({ idx, menu: 'main' })} className="text-slate-400 hover:text-slate-800"><ChevronLeft className="w-3.5 h-3.5" /></button>
                                           <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider">Bloklash</span>
                                        </div>
                                        <button className="w-full text-left px-3 py-2 text-[12px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-[8px] transition-colors flex items-center gap-2.5">
                                          <ShieldBan className="w-3.5 h-3.5" />
                                          Maxsus dam olish
                                        </button>
                                      </div>
                                    )}

                                 </div>
                               )}
                            </div>
                          )}
                        </div>
                     </div>
                   );
                 })}
               </div>

               {/* Grid Body Flex Container */}
               <div className="flex flex-1 relative bg-white">
                 
                 {/* Left Time Axis */}
                 <div className="w-[80px] shrink-0 border-r border-slate-50 bg-white flex flex-col shadow-[1px_0_0_rgba(241,245,249,1)] z-10 relative">
                    {times.map((time) => (
                      <div key={time} className="h-[100px] border-b border-slate-50 relative">
                        <span className="absolute -top-2.5 right-4 text-[10px] font-bold text-slate-400">{time}</span>
                      </div>
                    ))}
                 </div>

                 {/* Main Grid Lines */}
                 <div className="flex-1 flex relative">
                   {daysOfWeekFull.map((day, dIdx) => {
                     const isHolidayDay = weekDays[dIdx].date === 29;
                     return (
                       <div key={day} className={`flex-1 border-r border-slate-50 last:border-r-0 relative ${isHolidayDay ? 'bg-rose-50/20' : ''}`}>
                         {times.map((time) => (
                           <div key={time} className="h-[100px] border-b border-slate-50/60 border-solid hover:bg-slate-50/30 transition-colors cursor-crosshair"></div>
                         ))}
                       </div>
                     );
                   })}
                   
                   {/* Placed Events Blocks */}
                   {weekEvents.map((ev) => {
                     const style = classStyles[ev.class] || classStyles['5-A'];
                     const isHovered = hoveredWeekEvent === ev.id;
                     const hasLesson = ev.lessonTitle !== null;
                     const isEditing = editingDay === ev.day;
                     
                     return (
                       <div
                         key={ev.id}
                         onMouseEnter={() => setHoveredWeekEvent(ev.id)}
                         onMouseLeave={() => setHoveredWeekEvent(null)}
                         className={`absolute rounded-[10px] border ${isEditing ? 'bg-emerald-400 border-emerald-400 text-white shadow-md' : (hasLesson && !isHovered ? 'bg-emerald-400 border-emerald-400 text-white' : `${style.bg} ${style.border} ${style.text}`)} px-3 py-2 overflow-hidden ${isEditing ? 'cursor-default' : 'cursor-pointer'} transition-all z-10 animate-in fade-in duration-300`}
                         style={{
                           left: `calc(((100%) / 7) * ${ev.day} + 6px)`,
                           width: `calc(((100%) / 7) - 12px)`,
                           top: `calc(${ev.top} + 20px)`,
                           height: hasLesson && !isEditing ? '65px' : ev.height, // Expand only if it has a inner pill and not editing
                           zIndex: isHovered || isEditing ? 50 : 10,
                           boxShadow: isHovered && !isEditing ? '0 10px 40px -10px rgba(0,0,0,0.1)' : (isEditing ? '0 10px 30px -5px rgba(52,211,153,0.3)' : 'none')
                         }}
                       >
                         {/* Default View With Or Without Lesson Pill */}
                         <div className={`flex flex-col justify-start h-full transition-opacity absolute inset-0 px-2.5 py-2 ${isHovered && !isEditing ? 'opacity-0 invisible' : 'opacity-100 visible'}`}>
                            {hasLesson && !isEditing ? (
                              <>
                                <div className="flex items-center gap-1.5 flex-wrap leading-tight mb-1.5 opacity-90 text-white">
                                  <span className="font-extrabold text-[11px] whitespace-nowrap">{ev.class}</span>
                                  <span className="text-[9px] font-semibold whitespace-nowrap">{ev.time}</span>
                                </div>
                                <div className="bg-white rounded-lg px-2 py-1.5 flex items-center justify-between shadow-sm animate-in zoom-in-95 duration-200">
                                   <div className="flex items-center gap-1.5 min-w-0">
                                      <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                      <span className="text-[11px] font-bold text-slate-700 truncate">{ev.lessonTitle}</span>
                                   </div>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setRemoveModalData({ id: ev.id, lessonTitle: ev.lessonTitle! }); }} 
                                     className="shrink-0 p-0.5 ml-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                                   >
                                     <X className="w-3.5 h-3.5" />
                                   </button>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-start justify-between h-full">
                                <div className={`flex flex-col leading-tight ${isEditing ? 'text-white' : ''}`}>
                                  <span className={`text-[10px] font-semibold ${isEditing ? 'opacity-90' : 'opacity-70'} mb-0.5 font-mono tracking-tight`}>{ev.time}</span>
                                  <span className={`font-black text-[14px]`}>{ev.class}</span>
                                </div>
                                {isEditing && (
                                   <button className="text-white/80 hover:text-white mt-0.5">
                                      <X className="w-3.5 h-3.5" />
                                   </button>
                                )}
                              </div>
                            )}
                            
                            {/* Visual handle for edit mode */}
                            {isEditing && (
                               <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-[3px] rounded-full bg-white/40"></div>
                            )}
                         </div>

                         {/* Hover View (Matches 1x1 screenshot with +Create and Link buttons) */}
                         {!isEditing && (
                           <div className={`flex flex-col justify-center h-full transition-opacity absolute inset-0 px-3 py-1.5 bg-blend-darken ${isHovered ? 'opacity-100 visible bg-black/5' : 'opacity-0 invisible'}`}>
                              <div className="flex items-center justify-between pointer-events-none mb-1">
                                 <div className="flex items-center gap-1.5">
                                   <span className="font-extrabold text-[12px]">{ev.class}</span>
                                   <span className="text-[10px] font-semibold opacity-80">{ev.time}</span>
                                 </div>
                                 <ExternalLink className="w-3 h-3 opacity-60" />
                              </div>
                              <div className="flex gap-2 mt-auto">
                                {hasLesson ? (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setShowEditor(true); }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded bg-black/10 hover:bg-black/20 transition-colors text-[11px] font-bold text-white shadow-sm w-full justify-center`}
                                  >
                                    <FileText className="w-3.5 h-3.5" /> Darsni ochish
                                  </button>
                                ) : (
                                  <>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleCreateLesson(ev.id); }}
                                      className={`flex items-center gap-1 px-2.5 py-1 rounded bg-black/5 hover:bg-black/10 transition-colors text-[10px] font-bold ${style.text}`}
                                    >
                                      <Plus className="w-3 h-3" /> Yaratish
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setLinkModalData({ id: ev.id, className: ev.class }); }}
                                      className={`flex items-center gap-1 px-2.5 py-1 rounded bg-black/5 hover:bg-black/10 transition-colors text-[10px] font-bold ${style.text}`}
                                    >
                                      <ExternalLink className="w-3 h-3" /> Bog'lash
                                    </button>
                                  </>
                                )}
                              </div>
                           </div>
                         )}
                       </div>
                     );
                   })}
                 </div>

               </div>
               
               {/* Floating Edit Mode Bar */}
               {editingDay !== null && (
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-[16px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 p-1.5 z-[100] animate-in slide-in-from-bottom-6 fade-in duration-300 flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-400 mb-1.5 mt-0.5">Dars jadvalini tahrirlash</span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setEditingDay(null)} className="px-5 py-2 rounded-[10px] bg-slate-800 text-white text-[12px] font-bold flex items-center gap-1.5 hover:bg-slate-900 transition-colors shadow-sm active:scale-95">
                         <Check className="w-3.5 h-3.5" /> Saqlash
                      </button>
                      <button onClick={() => setEditingDay(null)} className="px-4 py-2 rounded-[10px] bg-white border border-slate-200 text-slate-600 text-[12px] font-bold flex items-center gap-1.5 hover:bg-slate-50 transition-colors active:scale-95">
                         <X className="w-3.5 h-3.5" /> Bekor qilish
                      </button>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Renders Overlays */}
      {showEditor && <LessonEditorModal onClose={() => setShowEditor(false)} />}
      {linkModalData && (
        <LinkLessonModal 
          targetClass={linkModalData.className} 
          onClose={() => setLinkModalData(null)} 
          // @ts-ignore - simulating link action easily for mock
          onLink={(title) => handleLinkLesson(linkModalData.id, title)} 
        />
      )}
      {removeModalData && (
        <RemoveLessonModal 
          targetName={removeModalData.lessonTitle} 
          onClose={() => setRemoveModalData(null)}
          onConfirm={handleRemoveLessonConfirm}
        />
      )}
    </div>
  );
}
