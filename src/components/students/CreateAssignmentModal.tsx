import { useTranslation } from 'react-i18next';
import { X, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

export function CreateAssignmentModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md border border-white/20 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
           <div>
             <h2 className="font-black text-slate-900 text-xl tracking-tight">{t('createAssignment.title')}</h2>
             <p className="text-[12px] text-slate-500 font-medium mt-1">{t('createAssignment.desc')}</p>
           </div>
           <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all self-start shadow-sm"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-8 pb-4 space-y-5">
           <div>
             <label className="text-xs font-black text-slate-500 mb-2 block">{t('createAssignment.assignmentTitle')} *</label>
             <input className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder={t('createAssignment.titlePlaceholder')} autoFocus />
           </div>

           <div>
             <label className="text-xs font-black text-slate-500 mb-2 block">{t('createAssignment.selectClass')}</label>
             <button className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between hover:border-slate-300 transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5">
               <div className="flex items-center gap-2 text-slate-800 text-sm font-bold">
                 <div className="w-2 h-2 rounded-full bg-rose-400"></div> 5-A
               </div>
               <ChevronDown className="w-4 h-4 text-slate-400" />
             </button>
           </div>

           <div className="flex gap-4">
             <div className="flex-1">
               <label className="text-xs font-black text-slate-500 mb-2 block">{t('createAssignment.topic')}</label>
               <button className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between hover:border-slate-300 transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5">
                 <div className="text-slate-500 text-sm font-medium">{t('createAssignment.noTopic')}</div>
                 <ChevronDown className="w-4 h-4 text-slate-400" />
               </button>
             </div>
             <div className="w-[120px]">
               <label className="text-xs font-black text-slate-500 mb-2 block">{t('createAssignment.points')}</label>
               <input type="number" defaultValue="100" className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all text-center" />
             </div>
           </div>

           <div>
             <label className="text-xs font-black text-slate-500 mb-2 block">{t('createAssignment.dueDate')}</label>
             <div className="relative group">
               <input type="date" defaultValue="2026-03-29" className="w-full bg-white border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full" />
               <CalendarIcon className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-slate-700 transition-colors" />
             </div>
           </div>
        </div>

        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 mt-4 flex items-center justify-end gap-3 rounded-b-[32px]">
          <button onClick={onClose} className="px-6 py-2.5 text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">{t('common.cancel')}</button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[13px] font-bold hover:bg-black transition-all shadow-md active:scale-95">
            {t('createAssignment.createButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
