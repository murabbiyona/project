import { useState } from 'react';
import { GraduationCap, Calendar as CalendarIcon, ChevronDown, Check, Plus, RefreshCw, Pencil, Trash2 } from 'lucide-react';
import { RotationScheduleModal } from '../components/timetable/RotationScheduleModal';
import { EditClassModal } from '../components/timetable/EditClassModal';

const classColors: Record<string, { bg: string; icon: string; border: string; solidIcon: string }> = {
  '5-A': { bg: 'bg-rose-50', icon: 'text-rose-400', border: 'border-rose-200', solidIcon: 'bg-rose-400' },
  '5-B': { bg: 'bg-orange-50', icon: 'text-orange-400', border: 'border-orange-200', solidIcon: 'bg-orange-400' },
  '5-D': { bg: 'bg-yellow-50', icon: 'text-yellow-500', border: 'border-yellow-200', solidIcon: 'bg-yellow-500' },
  '6-A': { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-200', solidIcon: 'bg-emerald-500' },
  '6-B': { bg: 'bg-cyan-50', icon: 'text-cyan-500', border: 'border-cyan-200', solidIcon: 'bg-cyan-500' },
  '6-D': { bg: 'bg-sky-50', icon: 'text-sky-400', border: 'border-sky-200', solidIcon: 'bg-sky-400' },
  '7-D': { bg: 'bg-fuchsia-50', icon: 'text-fuchsia-400', border: 'border-fuchsia-200', solidIcon: 'bg-fuchsia-400' },
  '8-A': { bg: 'bg-rose-50', icon: 'text-rose-400', border: 'border-rose-200', solidIcon: 'bg-rose-400' },
  '8-B': { bg: 'bg-orange-50', icon: 'text-orange-400', border: 'border-orange-200', solidIcon: 'bg-orange-400' },
  '9-A': { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-200', solidIcon: 'bg-amber-400' },
  '9-B': { bg: 'bg-emerald-50', icon: 'text-emerald-500', border: 'border-emerald-200', solidIcon: 'bg-emerald-400' },
};

const classesMock = [
  { id: '7', name: '7-D', time: '15:30 - 16:15', code: '7-D' },
  { id: '8', name: '8-A', time: '13:00 - 13:45', code: '8-A' },
  { id: '9', name: '8-B', time: '17:10 - 17:55', code: '8-B' },
  { id: '10', name: '9-A', time: '12:15 - 13:00', code: '9-A' },
  { id: '11', name: '9-B', time: '11:25 - 12:10', code: '9-B' },
];

const scheduleBlocks = [
  { day: 3, top: '100px', height: '45px', bg: 'bg-emerald-400', text: 'text-white', name: '8:00 - 8:45\n9-B' },
  { day: 5, top: '100px', height: '45px', bg: 'bg-amber-400', text: 'text-white', name: '8:00 - 8:45\n5-D' },
  { day: 5, top: '240px', height: '45px', bg: 'bg-orange-400', text: 'text-white', name: '9:40 - 10:25\n5-B' },
  { day: 5, top: '335px', height: '45px', bg: 'bg-rose-400', text: 'text-white', name: '10:35 - 11:20\n5-A' },
  { day: 3, top: '425px', height: '45px', bg: 'bg-amber-400', text: 'text-white', name: '11:25 - 12:10\n9-A' },
  { day: 5, top: '425px', height: '45px', bg: 'bg-emerald-400', text: 'text-white', name: '11:25 - 12:10\n9-B' },
  { day: 5, top: '515px', height: '45px', bg: 'bg-amber-400', text: 'text-white', name: '12:15 - 1:00\n9-A' },
];

export default function Timetable() {
  const [semesterOpen, setSemesterOpen] = useState(false);

  const [rotationModalOpen, setRotationModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<null | { id: string, name: string, time: string, color: string }>(null);

  return (
    <div className="flex gap-6 h-full w-full font-sans animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
      
      {/* Left Column: Classes */}
      <div className="w-[300px] flex-shrink-0 bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col p-6 h-full max-h-[calc(100vh-80px)] overflow-hidden">
        
        <div className="flex items-center gap-3 mb-6 shrink-0">
           <div className="w-9 h-9 bg-slate-50 flex items-center justify-center rounded-xl border border-slate-100 shadow-sm text-slate-500">
             <GraduationCap className="w-5 h-5" />
           </div>
           <h2 className="text-[19px] font-extrabold text-slate-900 tracking-tight">Classes</h2>
        </div>

        {/* Semester Dropdown */}
        <div className="relative mb-6 shrink-0 z-20">
          <button 
            onClick={() => setSemesterOpen(!semesterOpen)}
            className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3 flex items-center justify-between text-[13px] font-bold text-slate-700 hover:border-slate-300 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span>2025-2026-o'quv yili</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${semesterOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {semesterOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-2 animate-in slide-in-from-top-2 duration-200 overflow-hidden">
               <button className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-slate-900 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">2025-2026-o'quv yili</div>
                    <div className="text-[11px] text-slate-400 font-medium">Sep 2, 2025 — May 25, 2026</div>
                  </div>
               </button>
               <div className="border-t border-slate-100 mt-1 pt-1">
                 <button className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-900">
                   <Plus className="w-4 h-4" /> New Semester
                 </button>
               </div>
            </div>
          )}
        </div>

        <p className="text-[12px] font-medium text-slate-400 text-center mb-5 shrink-0">Drag classes onto the calendar</p>

        {/* Draggable Classes List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 pb-4">
          {classesMock.map(cls => {
            const color = classColors[cls.code];
            return (
              <div 
                key={cls.id} 
                className={`p-5 rounded-[18px] border-2 cursor-grab active:cursor-grabbing transition-all bg-white shadow-sm flex items-center justify-between group ${color.border} hover:shadow-md`}
              >
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center ${color.bg}`}>
                      <GraduationCap className={`w-6 h-6 ${color.icon}`} strokeWidth={1.5} />
                   </div>
                   <div>
                      <h3 className="font-extrabold text-slate-900 text-[15px]">{cls.name}</h3>
                      <p className="text-[12px] text-slate-400 font-medium mt-0.5">{cls.time}</p>
                   </div>
                </div>

                {/* Hover Actions */}
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => setEditingClass({ id: cls.id, name: cls.name, time: cls.time, color: color.solidIcon })}
                     className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors group/btn relative"
                   >
                     <Pencil className="w-4 h-4" />
                     {/* Edit Tooltip */}
                     <div className="absolute right-0 bottom-full mb-1 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 invisible group-hover/btn:opacity-100 group-hover/btn:visible whitespace-nowrap transition-all z-50">
                       Edit class
                     </div>
                   </button>
                   <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Add Class Button */}
        <div className="shrink-0 pt-4">
          <button className="w-full border border-dashed border-slate-300 rounded-[16px] py-3.5 flex items-center justify-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 transition-all font-sans active:scale-95">
             <Plus className="w-4 h-4" /> Add Class
          </button>
        </div>
      </div>

      {/* Right Column: Schedule Calendar */}
      <div className="flex-1 bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-full max-h-[calc(100vh-80px)] overflow-hidden">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 shrink-0">
           <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-slate-50 flex items-center justify-center rounded-xl border border-slate-100 shadow-sm text-slate-500">
               <CalendarIcon className="w-5 h-5" />
             </div>
             <h2 className="text-[20px] font-extrabold text-slate-900 tracking-tight">Schedule</h2>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400">
                <Check className="w-4 h-4" /> Saved
             </div>
             <button 
               onClick={() => setRotationModalOpen(true)}
               className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[13px] font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
             >
               <RefreshCw className="w-4 h-4" /> Set Rotation
             </button>
           </div>
        </div>

        {/* Schedule Grid Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative">
          
          {/* Grid Headers */}
          <div className="flex border-b border-slate-100 sticky top-0 bg-white z-20">
             <div className="w-[80px] shrink-0 border-r border-slate-100 bg-white shadow-[1px_0_0_rgba(241,245,249,1)]"></div>
             {[1,2,3,4,5,6].map(day => (
                <div key={day} className="flex-1 py-4 text-center border-r border-slate-50 last:border-r-0">
                   <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">DAY {day}</span>
                </div>
             ))}
          </div>

          {/* Grid Body */}
          <div className="flex flex-1 relative min-h-[800px]">
             
             {/* Time Column */}
             <div className="w-[80px] shrink-0 border-r border-slate-100 bg-white border-b border-white z-10 shadow-[1px_0_0_rgba(241,245,249,1)]">
               {[7,8,9,10,11,12].map(time => (
                 <div key={time} className="h-[100px] border-b border-slate-50 relative flex justify-center">
                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">{time} {time === 12 ? 'PM' : 'AM'}</span>
                 </div>
               ))}
             </div>

             {/* Days Columns */}
             <div className="flex-1 flex relative">
               {/* Background Lines */}
               {[1,2,3,4,5,6].map(day => (
                 <div key={day} className="flex-1 border-r border-slate-50 last:border-r-0 flex flex-col relative">
                    {[7,8,9,10,11,12].map(time => (
                      <div key={time} className="h-[100px] border-b border-slate-50 border-dashed hover:bg-slate-50/30 transition-colors"></div>
                    ))}
                 </div>
               ))}
               
               {/* Placed Blocks (Absolute positioned over the flex grid) */}
               {scheduleBlocks.map((block, idx) => (
                 <div 
                   key={idx} 
                   className={`absolute rounded-xl ${block.bg} ${block.text} p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-center cursor-pointer hover:brightness-110 hover:shadow-md transition-all z-10`}
                   style={{
                     left: `calc(80px + ((100% - 80px) / 6) * ${block.day - 1} + 8px)`,
                     width: `calc(((100% - 80px) / 6) - 16px)`,
                     top: block.top,
                     height: block.height,
                   }}
                 >
                   <p className="text-[11px] font-extrabold tracking-tight whitespace-pre-line leading-tight">{block.name}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>

      </div>

      {rotationModalOpen && <RotationScheduleModal onClose={() => setRotationModalOpen(false)} />}
      {editingClass && <EditClassModal classInfo={editingClass} onClose={() => setEditingClass(null)} />}
    </div>
  );
}
