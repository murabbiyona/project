import { X, Plus, Clock, ChevronDown, Palette } from 'lucide-react';

export function EditClassModal({ classInfo, onClose }: { classInfo: { id: string, name: string, time: string, color: string }, onClose: () => void }) {
  const defaultSchedule = [
    { day: 'Wednesday', startTime: '11:25', endTime: '12:10' },
    { day: 'Friday', startTime: '12:15', endTime: '13:00' }
  ];
  
  const initialSchedule = classInfo.name.startsWith('8-') ? [
    { day: 'Wednesday', startTime: classInfo.name === '8-B' ? '17:10' : '13:00', endTime: classInfo.name === '8-B' ? '17:55' : '13:45' }
  ] : defaultSchedule;

  const activeSchedule = initialSchedule;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-[540px] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50 relative shrink-0">
           <h2 className="font-extrabold text-slate-900 text-[19px] tracking-tight">Edit Class</h2>
           <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all shadow-sm">
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6">
           
           {/* Class Name */}
           <div className="space-y-2">
             <label className="text-[12px] font-bold text-slate-600">Class Name <span className="text-rose-500">* *</span></label>
             <div className="flex gap-3">
               <input 
                 type="text" 
                 defaultValue={classInfo.name} 
                 className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-slate-800 transition-all shadow-sm" 
               />
               <button className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 active:scale-95 ${classInfo.color}`}>
                 <Palette className="w-5 h-5 text-white" />
               </button>
             </div>
           </div>

           {/* Description */}
           <div className="space-y-2">
             <label className="text-[12px] font-bold text-slate-600">Description</label>
             <input 
               type="text" 
               defaultValue={classInfo.time} 
               className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-700 focus:outline-none focus:border-slate-400 transition-all shadow-sm" 
             />
           </div>

           {/* Weekly Schedule Header */}
           <div className="pt-2 flex items-center justify-between">
             <label className="text-[12px] font-bold text-slate-600">Weekly Schedule</label>
             <button className="flex items-center gap-1.5 text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors">
               <Plus className="w-4 h-4" /> Add Time Slot
             </button>
           </div>

           {/* Schedule Rows */}
           <div className="space-y-4">
             {activeSchedule.map((slot, idx) => (
               <div key={idx} className="flex items-center gap-3">
                 <div className="relative flex-1">
                   <select 
                     className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm cursor-pointer"
                     defaultValue={slot.day}
                   >
                     <option>Monday</option>
                     <option>Tuesday</option>
                     <option>Wednesday</option>
                     <option>Thursday</option>
                     <option>Friday</option>
                     <option>Saturday</option>
                   </select>
                   <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                 </div>
                 
                 <div className="relative w-[120px]">
                   <input 
                     type="text" 
                     defaultValue={slot.startTime} 
                     className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm" 
                   />
                   <Clock className="absolute right-4 top-4 w-4 h-4 text-slate-400" />
                 </div>
                 
                 <span className="text-[13px] font-medium text-slate-400">to</span>
                 
                 <div className="relative w-[120px]">
                   <input 
                     type="text" 
                     defaultValue={slot.endTime} 
                     className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:border-slate-400 shadow-sm" 
                   />
                   <Clock className="absolute right-4 top-4 w-4 h-4 text-slate-400" />
                 </div>
                 
                 <button className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                   <X className="w-[18px] h-[18px]" />
                 </button>
               </div>
             ))}
           </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-md active:scale-95">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
