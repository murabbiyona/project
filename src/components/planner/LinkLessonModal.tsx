import { X, Search, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

export function LinkLessonModal({ onClose, onLink, targetClass }: { onClose: () => void, onLink?: (title: string) => void, targetClass: string }) {
  const [unitOpen, setUnitOpen] = useState(true); // Open by default matching screenshot
  const [selectedUnit, setSelectedUnit] = useState('Barcha bo\'limlar');

  const units = [
    'Barcha bo\'limlar',
    '01. Raqamli asoslar va xavfsizlik',
    '02. Kommunikatsiya va AKT ta\'siri',
    '03. Grafika va multimedia dizayni',
    '04. Ma\'lumotlarni tahlil qilish (Elektron jadvallar)',
    '05. Ma\'lumotlar bazasi va tizimlar',
    '06. Veb texnologiyalar'
  ];

  const [addedLessons, setAddedLessons] = useState<number[]>([]);

  const mockLessons = [
    { id: 11, title: '11. Ma\'lumotlar bazasi va Primary Key', unit: '05. Ma\'lumotlar bazasi va tizimlar' },
    { id: 12, title: '12. CRUD amallari va boshqaruv', unit: '05. Ma\'lumotlar bazasi va tizimlar' },
    { id: 13, title: '13. Loyihalash va ekran maketlari', unit: '05. Ma\'lumotlar bazasi va tizimlar' },
    { id: 14, title: '14. Tizimni joriy qilish usullari', unit: '05. Ma\'lumotlar bazasi va tizimlar' },
    { id: 15, title: '15. Veb sahifa qatlamlari', unit: '06. Veb texnologiyalar' },
  ];

  const handleLink = () => {
     if (onLink) {
        onLink(addedLessons.length > 0 
          ? mockLessons.find(l => l.id === addedLessons[0])?.title || 'Dars' 
          : 'Sarlavhasiz dars');
     }
  };

  const toggleAdd = (id: number) => {
    if (addedLessons.includes(id)) {
      setAddedLessons(addedLessons.filter(lId => lId !== id));
    } else {
      setAddedLessons([...addedLessons, id]);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-[640px] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-white relative shrink-0">
           <div>
              <h2 className="font-extrabold text-slate-900 text-[18px] tracking-tight mb-1">
                Darsni {targetClass} ga bog'lash
              </h2>
              <p className="text-[12px] font-medium text-slate-500">
                Ushbu jadval o'rniga bog'lash uchun darslarni qidiring va tanlang.
              </p>
           </div>
           <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors -mt-4">
             <X className="w-4 h-4" />
           </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 flex flex-col relative h-[380px]">
           
           {/* Search Input */}
           <div className="relative mb-6">
              <Search className="absolute left-3.5 top-3.5 w-[15px] h-[15px] text-slate-400" />
              <input 
                type="text" 
                placeholder="Darslarni qidirish..." 
                className="w-full bg-white border border-slate-200 rounded-[10px] pl-10 pr-4 py-3 text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors shadow-sm"
              />
           </div>

           {/* Dropdowns */}
           <div className="flex gap-4 mb-4 relative z-50">
             
             {/* Class */}
             <div className="flex-1 space-y-1.5">
               <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
                 Sinf
               </label>
               <div className="w-full bg-white border border-slate-200 rounded-[10px] px-3.5 py-3 flex items-center justify-between shadow-sm hover:border-slate-300 transition-colors cursor-not-allowed opacity-80">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                     <span className="text-[13px] font-bold text-slate-700">{targetClass}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
               </div>
             </div>

             {/* Unit */}
             <div className="flex-1 space-y-1.5 relative">
               <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-1">
                 Bo'lim
               </label>
               <button 
                 onClick={() => setUnitOpen(!unitOpen)}
                 className="w-full bg-white border border-slate-200 rounded-[10px] px-3.5 py-3 flex items-center justify-between shadow-sm hover:border-slate-300 transition-colors active:scale-[0.98]"
               >
                  <span className="text-[13px] font-bold text-slate-700">{selectedUnit}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${unitOpen ? 'rotate-180' : ''}`} />
               </button>

               {unitOpen && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-100 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {units.map((u, i) => (
                      <button 
                        key={i}
                        onClick={() => { setSelectedUnit(u); setUnitOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2"
                      >
                         <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                           {selectedUnit === u && <Check className="w-[14px] h-[14px] text-slate-800" />}
                         </div>
                         <div className="flex items-center gap-2 max-w-full">
                           {i > 0 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>}
                           <span className={`text-[13px] truncate ${selectedUnit === u ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>{u}</span>
                         </div>
                      </button>
                    ))}
                 </div>
               )}
             </div>
           </div>

           {/* Content Area - Lessons List */}
           <div className="flex-1 flex flex-col border-t border-slate-100 mt-2 pt-2 relative z-0 overflow-y-auto custom-scrollbar -mx-6 px-6">
              {unitOpen ? (
                <div className="h-full flex items-center justify-center pt-8">
                  <span className="text-[13px] font-medium text-slate-400">Yuklanmoqda...</span>
                </div>
              ) : (
                <div className="space-y-1 pb-4">
                  {mockLessons.map((lesson) => {
                    const isAdded = addedLessons.includes(lesson.id);
                    return (
                      <div key={lesson.id} className="flex items-center justify-between py-3 group">
                        <div className="flex gap-3 min-w-0 pr-4">
                           <div className="pt-1.5 shrink-0">
                             <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                           </div>
                           <div className="min-w-0">
                             <h4 className="text-[13px] font-bold text-slate-800 truncate mb-0.5">{lesson.title}</h4>
                             <p className="text-[11px] text-slate-500 font-medium truncate">{lesson.unit}</p>
                           </div>
                        </div>
                        {isAdded ? (
                          <button 
                            onClick={() => toggleAdd(lesson.id)}
                            className="shrink-0 px-3.5 py-1.5 rounded-md text-[11px] font-bold text-white bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" /> Qo'shildi
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleAdd(lesson.id)}
                            className="shrink-0 px-3.5 py-1.5 rounded-md text-[11px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            Qo'shish
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
           </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-[13px] text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors active:scale-95 shadow-sm">
            Bekor qilish
          </button>
          <button 
            onClick={handleLink} 
            disabled={addedLessons.length === 0 && selectedUnit === 'Barcha bo\'limlar'}
            className={`px-5 py-2.5 rounded-xl font-bold text-[13px] text-white transition-colors active:scale-95 shadow-md ${
              addedLessons.length > 0 
                ? 'bg-slate-800 hover:bg-slate-900' 
                : (selectedUnit === 'Barcha bo\'limlar' ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900')
            }`}
          >
            {addedLessons.length > 0 ? `${addedLessons.length} ta darsni bog'lash` : (selectedUnit === 'Barcha bo\'limlar' ? 'Bog\'lash' : 'Bog\'lash')}
          </button>
        </div>

      </div>
    </div>
  );
}
