import { useState } from 'react';
import { X, Search, ChevronDown, ChevronRight, Check, Trash2 } from 'lucide-react';

export function AddStandardsModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'browse'|'my'>('browse');
  const [countryOpen, setCountryOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-[900px] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 relative shrink-0">
           <h2 className="font-extrabold text-slate-900 text-[19px] tracking-tight">Add Standards</h2>
           
           <div className="absolute left-1/2 -translate-x-1/2 flex bg-slate-50 border border-slate-100/60 p-1.5 rounded-2xl transition-colors">
             <button 
                onClick={() => setTab('browse')}
                className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${tab === 'browse' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
             >
               Browse All
             </button>
             <button 
                onClick={() => setTab('my')}
                className={`px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${tab === 'my' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'}`}
             >
               My Standards
             </button>
           </div>
           
           <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all shadow-sm"><X className="w-5 h-5" /></button>
        </div>

        {/* Tab Content: Browse All */}
        {tab === 'browse' && (
          <>
            {/* Filters */}
            <div className="px-8 space-y-5 mb-5 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div>
                 <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 block">Search</label>
                 <div className="relative group">
                   <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                   <input type="text" className="w-full bg-slate-50/50 border border-slate-200/80 rounded-[18px] pl-11 pr-4 py-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all placeholder:text-slate-400 shadow-sm" placeholder="Search by name, subject, or framework..." />
                 </div>
               </div>
               
               <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 block">Country</label>
                    <button onClick={() => setCountryOpen(!countryOpen)} className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3 flex items-center justify-between text-[13px] font-bold text-slate-700 hover:border-slate-300 transition-all shadow-sm">
                      <span>All Countries</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                    {countryOpen && (
                      <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 py-2 max-h-64 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                         <div className="px-4 py-2 text-[13px] font-bold text-slate-900 bg-slate-50 flex items-center gap-2"><Check className="w-4 h-4 text-slate-900"/> All Countries</div>
                         {['Afghanistan','Albania','Algeria','Andorra','Angola','Antigua & Barbuda','Argentina'].map(c => (
                            <div key={c} className="px-10 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer transition-colors">{c}</div>
                         ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 block">Region</label>
                    <button className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3 flex items-center justify-between text-[13px] font-medium text-slate-500 hover:border-slate-300 transition-all shadow-sm">
                      <span>All Regions</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 block">Subject</label>
                    <button className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3 flex items-center justify-between text-[13px] font-medium text-slate-500 hover:border-slate-300 transition-all shadow-sm">
                      <span>All Subjects</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 block">Grade</label>
                    <button className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3 flex items-center justify-between text-[13px] font-medium text-slate-500 hover:border-slate-300 transition-all shadow-sm">
                      <span>All Grades</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
               </div>
            </div>

            {/* List Header */}
            <div className="px-8 py-4 flex items-center justify-between shrink-0 border-t border-slate-100 bg-slate-50/30">
              <h3 className="text-[13px] font-bold text-slate-900">Standards</h3>
              <p className="text-[11px] font-bold text-slate-400">Showing 100 of 11,997 — <span className="text-slate-500">narrow your filters</span></p>
            </div>

            {/* List Content */}
            <div className="flex-1 px-8 pb-8 pt-2 overflow-y-auto custom-scrollbar flex flex-col gap-2.5 bg-slate-50/30">
               {[
                 'Digital Technologies — Years 1-2',
                 'Digital Technologies — Years 3-4',
                 'Digital Technologies — Years 5-6',
                 'Digital Technologies — Years 7-8',
                 'Digital Technologies — Years 9-10',
                 'Digital Technologies — Foundation'
               ].map(std => (
                 <div key={std} className="border border-slate-200/60 rounded-[14px] px-5 py-3.5 hover:border-slate-300 hover:shadow-sm bg-white transition-all flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                     <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                       <ChevronRight className="w-4 h-4" />
                     </div>
                     <span className="text-[14px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{std}</span>
                   </div>
                   <button className="opacity-0 group-hover:opacity-100 px-5 py-1.5 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95">
                     Add
                   </button>
                 </div>
               ))}
            </div>
          </>
        )}

        {/* Tab Content: My Standards */}
        {tab === 'my' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Create Form */}
            <div className="px-8 space-y-4 mb-5 shrink-0">
               <div>
                 <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 block">Name</label>
                 <input type="text" className="w-full bg-white border border-slate-200/80 rounded-[14px] px-4 py-3 text-[14px] font-bold text-slate-900 focus:outline-none focus:border-slate-800 transition-all placeholder:text-slate-400 placeholder:font-medium shadow-sm" placeholder="e.g. My Science Objectives" />
               </div>
               
               <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 block">Subject</label>
                    <input type="text" className="w-full bg-slate-50/50 border border-slate-200/80 rounded-[14px] px-4 py-3 text-[13px] font-medium text-slate-900 focus:outline-none focus:border-slate-800 transition-all placeholder:text-slate-400 shadow-sm" placeholder="e.g. Science" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2.5 block">Grade Level</label>
                    <input type="text" className="w-full bg-slate-50/50 border border-slate-200/80 rounded-[14px] px-4 py-3 text-[13px] font-medium text-slate-900 focus:outline-none focus:border-slate-800 transition-all placeholder:text-slate-400 shadow-sm" placeholder="e.g. 3-5" />
                  </div>
               </div>

               <div className="pt-2">
                 <button className="bg-slate-500 text-white font-bold text-[13px] px-6 py-2.5 rounded-xl hover:bg-slate-600 transition-colors shadow-sm active:scale-95">
                   Create
                 </button>
               </div>
            </div>

            {/* List Header */}
            <div className="px-8 py-4 flex items-center justify-between shrink-0 border-t border-slate-100 bg-slate-50/30">
              <h3 className="text-[13px] font-bold text-slate-900">Standards</h3>
              <p className="text-[11px] font-bold text-slate-400">5 custom sets</p>
            </div>

            {/* List Content */}
            <div className="flex-1 px-8 pb-8 pt-2 overflow-y-auto custom-scrollbar flex flex-col gap-2.5 bg-slate-50/30 relative">
               
               {/* Already Added item */}
               <div className="border border-slate-200/60 rounded-[14px] px-5 py-3.5 bg-white flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="text-slate-400">
                     <ChevronRight className="w-4 h-4" />
                   </div>
                   <span className="text-[14px] font-bold text-slate-700">5-sinf (Informatika) <span className="font-medium text-slate-400 ml-1">· Axborot texnologiyalari - 5</span></span>
                 </div>
                 <button className="flex items-center gap-1.5 px-4 py-1.5 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-500 bg-slate-50/50 shadow-sm pointer-events-none">
                   <Check className="w-4 h-4" /> Added
                 </button>
               </div>

               {/* Other Items */}
               {[
                 { title: 'Informatika (6-sinf uchun diagnostik test asosida)', desc: 'Axborot texnologiyalari - 6' },
                 { title: 'Informatika (7-sinf uchun diagnostik test asosida)', desc: 'Axborot texnologiyalari - 7' },
                 { title: 'Informatika (8-sinf uchun diagnostik test asosida)', desc: 'Axborot texnologiyalari - 8' },
                 { title: 'Informatika (9-sinf)', desc: 'Axborot texnologiyalari - 9' },
               ].map((std, idx) => (
                 <div key={idx} className="border border-slate-200/60 rounded-[14px] px-5 py-3.5 hover:border-slate-300 hover:shadow-sm bg-white transition-all flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                     <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                       <ChevronRight className="w-4 h-4" />
                     </div>
                     <span className="text-[14px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{std.title} <span className="text-slate-400 ml-1">· {std.desc}</span></span>
                   </div>
                   <button className="opacity-0 group-hover:opacity-100 px-5 py-1.5 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95">
                     Add
                   </button>
                 </div>
               ))}

               {/* Delete action at the bottom */}
               <div className="sticky bottom-0 mt-auto pt-6 pb-2 right-0 flex justify-end pointer-events-none">
                  <button className="pointer-events-auto flex items-center gap-2 text-[13px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl transition-colors bg-white shadow-sm border border-slate-100">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
