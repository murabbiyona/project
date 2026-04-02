import { useState } from 'react';
import { 
  Check, ChevronLeft, ChevronRight, Plus, EyeOff, Calendar, X, ChevronDown
} from 'lucide-react';

export default function Tasks() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex h-full bg-[#f8f9fa] overflow-hidden" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      {/* ─── Column 1: Task List ─── */}
      <div className="flex flex-col shrink-0 bg-[#f8f9fa] border-r border-slate-200 overflow-y-auto custom-scrollbar w-[360px] p-6">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-700 font-bold border border-slate-200 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"/></svg>
             </div>
             <h1 className="text-[20px] font-black text-slate-800 tracking-tight">Tasks <span className="text-slate-400 font-medium ml-1">1</span></h1>
           </div>
           <div className="flex items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                 <EyeOff className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 h-9 bg-slate-900 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
              >
                 <Plus className="w-4 h-4" /> New Task
              </button>
           </div>
        </div>

        <div>
           <h3 className="flex items-center gap-2 text-[14px] font-bold text-rose-500 mb-3 ml-1">
             <span className="w-4 h-4 rounded-full border-2 border-rose-500 text-[10px] flex items-center justify-center font-black">!</span>
             Overdue <span className="text-rose-400 font-medium">(1)</span>
           </h3>
           <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-start gap-4 hover:border-slate-300 transition-colors cursor-pointer">
             <div className="w-5 h-5 rounded-[6px] border-2 border-slate-200 mt-0.5 shrink-0" />
             <div className="flex-1 w-full relative h-[60px]">
               <p className="text-[14px] font-bold text-slate-700 leading-snug pr-4">O'quvchilarning 3 choraklik davomatlarini qo'yib chiqish</p>
               <p className="text-[11px] font-bold text-rose-500 absolute bottom-0 right-0">Mar 27</p>
             </div>
           </div>
        </div>
      </div>

      {/* ─── Column 2: Calendar ─── */}
      <div className="flex-1 flex flex-col p-8 bg-[#f8f9fa] overflow-hidden">
         <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <h1 className="text-[20px] font-black text-slate-800 tracking-tight">March 2026</h1>
            </div>
            
            <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-10">
              <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
              <button className="px-4 h-full flex items-center justify-center text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors border-x border-slate-200">Today</button>
              <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
            </div>
         </div>

         <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col min-h-0 relative">
            <div className="grid grid-cols-7 border-b border-slate-100 bg-[#f8f9fa]">
               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                 <div key={d} className="px-4 py-3 text-center text-[12px] font-bold text-slate-500 border-r border-slate-100 last:border-none uppercase tracking-widest">{d}</div>
               ))}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-5 h-full relative">
               {Array.from({length: 35}).map((_, i) => {
                 const day = i - 0; // Starts sunday 1
                 const isDate = day > 0 && day <= 31;
                 const isToday = isDate && day === 29;
                 const isTaskDay = isDate && day === 27;
                 
                 return (
                   <div key={i} className={`border-r border-b border-slate-100 last:border-b-0 p-2 ${isDate ? 'bg-white' : 'bg-slate-50/50'}`}>
                      {isDate && (
                         <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold mb-1 ${isToday ? 'bg-slate-800 text-white' : 'text-slate-600'}`}>
                           {day}
                         </div>
                      )}
                      
                      {isTaskDay && (
                        <div className="mt-1 px-2.5 py-1.5 bg-white border border-slate-200 shadow-sm rounded-lg text-[11px] font-bold text-slate-700 truncate cursor-pointer hover:border-slate-300 transition-colors">
                          O'quvchila...
                        </div>
                      )}
                      {isToday && (
                        <div className="mt-1 px-2.5 py-1.5 bg-slate-100 border border-slate-200 shadow-sm rounded-lg text-[11px] font-bold text-slate-700 truncate cursor-pointer hover:border-slate-300 transition-colors opacity-50 relative pointer-events-none">
                          <Check className="w-3 h-3 absolute top-1/2 left-2 -translate-y-1/2" />
                          <span className="pl-4">O'quvchila...</span>
                        </div>
                      )}
                   </div>
                 )
               })}
            </div>
         </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-[460px] rounded-[24px] shadow-2xl animate-in zoom-in-95 duration-300 relative">
              <div className="p-6 border-b border-slate-100 pt-7 flex items-start justify-between">
                 <div>
                   <h2 className="text-[20px] font-black text-slate-800">Create New Task</h2>
                   <p className="text-[14px] font-medium text-slate-500 mt-1">Add a new task to your list.</p>
                 </div>
                 <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors mt-1">
                   <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-6 space-y-6">
                 <div className="space-y-2">
                   <label className="text-[13px] font-black text-slate-800 flex items-center gap-1">Title <span className="text-rose-500">*</span></label>
                   <div className="border border-slate-400 rounded-lg px-4 py-3 focus-within:border-slate-800 focus-within:ring-4 focus-within:ring-slate-100 transition-all shadow-sm bg-white">
                      <input type="text" placeholder="Enter task title" className="w-full bg-transparent outline-none text-[14px] text-slate-800 font-medium" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[13px] font-black text-slate-800">Due Date</label>
                   <div className="border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between hover:border-slate-300 transition-colors shadow-sm bg-white cursor-pointer">
                      <span className="text-[14px] text-slate-400 font-medium">mm/dd/yyyy</span>
                      <Calendar className="w-4 h-4 text-slate-800" />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-[13px] font-black text-slate-800">Tag</label>
                   <div className="border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between hover:border-slate-300 transition-colors shadow-sm bg-white cursor-pointer">
                      <span className="text-[14px] text-slate-400 font-medium">Select tag...</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                   </div>
                 </div>
                 <div className="pt-2 flex items-center gap-4">
                    <button className="flex-1 bg-slate-800 text-white rounded-xl py-3 text-[14px] font-black hover:bg-slate-900 transition-colors shadow-sm">
                       Create
                    </button>
                    <button onClick={() => setShowModal(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 rounded-xl py-3 text-[14px] font-bold hover:bg-slate-50 transition-colors shadow-sm">
                       Cancel
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
