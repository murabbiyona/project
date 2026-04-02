import { useState } from 'react';
import { Search, Plus, ChevronRight, ChevronDown, Trash2, Target } from 'lucide-react';

export function StandardsTab({ onAddStandards }: { onAddStandards: () => void }) {
  const [expanded, setExpanded] = useState(false);


  const standardsList = [
    { code: 'INF.5.P.1', desc: 'Algoritm va Sprayt boshqaruvi' },
    { code: 'INF.5.P.2', desc: 'Internetda xavfsiz qidiruv va brauzer tugmalari' },
    { code: 'INF.5.P.3', desc: 'Raqamli tasvir yaratish va fayllarni saqlash' },
    { code: 'INF.5.P.4', desc: 'Elektron pochta va onlayn xavfsizlik odobi' },
  ];

  return (
    <div className="flex-1 bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 max-w-[900px]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Standards</h2>
        </div>
        <div className="flex items-center gap-3">
           <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-sm bg-white">
             <Search className="w-4 h-4" />
           </button>
           <button onClick={onAddStandards} className="flex items-center gap-2 bg-slate-900 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md active:scale-95">
             <Plus className="w-4 h-4" /> Add Standards
           </button>
        </div>
      </div>

      {/* Primary Container Box */}
      <div className={`rounded-2xl border transition-colors ${expanded ? 'border-slate-200 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}>
        
        {/* Accordion Header */}
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="w-full flex items-center justify-between p-4 group"
        >
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100 transition-colors">
               {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
             </div>
             <div className="text-left">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-slate-900 text-[15px]">5-sinf (Informatika)</h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Custom</span>
                </div>
                <p className="text-[13px] text-slate-500 font-medium tracking-tight">
                   • 4 standards • 0 covered
                </p>
             </div>
          </div>
          <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg text-[12px] font-extrabold text-slate-500">
             0%
          </div>
        </button>

        {/* Accordion Content */}
        {expanded && (
          <div className="border-t border-slate-100 bg-slate-50/30">
            {standardsList.map((std, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4 border-b border-slate-50 hover:bg-slate-50 group transition-colors">
                <div className="w-5 h-5 rounded-full border border-slate-300 mt-0.5 shrink-0 group-hover:border-slate-400 transition-colors"></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-[13px] mb-0.5 leading-tight">{std.code}</h4>
                  <p className="text-[13px] text-slate-500 font-medium leading-snug">{std.desc}</p>
                </div>
              </div>
            ))}
            
            {/* Delete Bar */}
            <div className="flex justify-end p-4 border-t border-slate-100 bg-white rounded-b-2xl">
              <button className="flex items-center gap-2 text-[13px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
