import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Search, Check, ImagePlus, User, ChevronDown } from 'lucide-react';

const avatarColors = [
  'bg-white border-2 border-slate-900', // Default
  'bg-indigo-400', 'bg-blue-400',
  'bg-emerald-400', 'bg-amber-400', 'bg-rose-400',
  'bg-teal-400', 'bg-slate-400'
];

export function CreateStudentModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState(0);
  const [classOpen, setClassOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[6px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl border border-white/20 animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Pane - Avatar */}
        <div className="w-full md:w-[40%] bg-slate-50/50 p-8 flex flex-col items-center justify-center border-r border-slate-100/80">
          <h2 className="font-extrabold text-slate-800 text-lg tracking-tight mb-2">{t('createStudent.chooseAvatar')}</h2>
          <p className="text-[12px] font-medium text-slate-400 text-center mb-8">{t('createStudent.avatarDesc')}</p>
          
          <div className={`w-36 h-36 rounded-full flex items-center justify-center mb-10 shadow-sm border border-slate-100 ${avatarColors[selectedColor]}`}>
             <User className={`w-12 h-12 ${selectedColor === 0 ? 'text-slate-300' : 'text-white'}`} strokeWidth={2.5} />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {avatarColors.map((color, i) => (
              <button 
                key={i}
                onClick={() => setSelectedColor(i)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative
                  ${color} ${i === 0 ? 'border border-slate-200 object-cover shadow-sm hover:border-slate-300' : 'hover:saturate-150 hover:scale-105 shadow-md'}
                  ${selectedColor === i ? 'ring-2 ring-slate-900 ring-offset-2' : ''}
                `}
              >
                {selectedColor === i && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </div>
                )}
                {i !== 0 && <User className="w-5 h-5 text-white/90" strokeWidth={2.5} />}
                {i === 0 && <User className="w-5 h-5 text-slate-400" strokeWidth={2.5} />}
              </button>
            ))}
            <button className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400 hover:bg-slate-50 flex flex-col items-center justify-center gap-0.5 transition-all">
               <ImagePlus className="w-4 h-4" />
               <span className="text-[9px] font-bold uppercase tracking-wider">{t('createStudent.upload')}</span>
            </button>
          </div>
        </div>

        {/* Right Pane - Form */}
        <div className="w-full md:w-[60%] flex flex-col">
          <div className="flex items-center justify-between px-8 pt-8 pb-4">
             <div>
               <h2 className="font-black text-slate-900 text-xl tracking-tight">{t('createStudent.createProfile')}</h2>
               <p className="text-[12px] text-slate-500 font-medium mt-1">{t('createStudent.createProfileDesc')}</p>
             </div>
             <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all self-start shadow-sm"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-4 space-y-5">
             <div className="flex gap-4">
               <div className="flex-1">
                 <label className="text-xs font-black text-slate-500 mb-2 block">{t('createStudent.fullName')} *</label>
                 <div className="relative group">
                   <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300 group-focus-within:text-slate-700 transition-colors"/>
                   <input className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder={t('createStudent.fullNamePlaceholder')} />
                 </div>
               </div>
               <div className="w-[140px]">
                 <label className="text-xs font-black text-slate-500 mb-2 block">{t('createStudent.studentId')}</label>
                 <div className="relative group">
                   <div className="absolute left-3.5 top-3.5 text-slate-300 font-bold group-focus-within:text-slate-700 transition-colors">#</div>
                   <input className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder={t('createStudent.studentIdPlaceholder')} />
                 </div>
               </div>
             </div>

             {/* Class Selection */}
             <div className="relative">
               <label className="text-xs font-black text-slate-500 mb-2 block">{t('createStudent.classSelection')}</label>
               <button onClick={() => setClassOpen(!classOpen)} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center justify-between hover:border-slate-300 transition-all focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5">
                 <div className="flex items-center gap-2 bg-rose-50 text-rose-500 px-3 py-1 rounded-[10px] text-xs font-bold border border-rose-100">
                   5-A <X className="w-3 h-3 hover:text-rose-700 ml-1 cursor-pointer" />
                 </div>
                 <ChevronDown className="w-4 h-4 text-slate-400" />
               </button>
               {classOpen && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-2xl z-20 p-2 animate-in slide-in-from-top-2 duration-200">
                   <div className="relative mb-2">
                     <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                     <input className="w-full bg-slate-50 border-none rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-0 placeholder:text-slate-400" placeholder={t('createStudent.searchClasses')} autoFocus />
                   </div>
                   <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                     {['9-B (emerald)', '9-A (amber)', '8-B (orange)', '8-A (rose)', '7-D (fuchsia)', '7-B (purple)', '7-A (indigo)', '6-D (blue)', '6-B (teal)'].map(c => {
                       const [name, col] = c.split(' (')
                       const color = col.replace(')','');
                       return (
                         <button key={name} className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-3 transition-colors">
                            <div className={`w-2 h-2 rounded-full bg-${color}-400`}></div> {name}
                         </button>
                       )
                     })}
                   </div>
                 </div>
               )}
             </div>

             {/* Tags Selection */}
             <div className="relative">
               <label className="text-xs font-black text-slate-500 mb-2 block">{t('createStudent.tags')}</label>
               <button onClick={() => setTagsOpen(!tagsOpen)} className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 flex items-center justify-between hover:border-slate-300 transition-all text-slate-400 font-medium text-sm">
                 <div>{t('createStudent.selectTags')}</div>
                 <ChevronDown className="w-4 h-4 text-slate-400" />
               </button>
               {tagsOpen && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-2xl z-30 p-2 animate-in slide-in-from-top-2 duration-200">
                   <div className="relative mb-2">
                     <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-300" />
                     <input className="w-full bg-slate-50 border-none rounded-xl pl-9 pr-3 py-2 text-sm focus:ring-0 placeholder:text-slate-400" placeholder={t('createStudent.searchTags')} autoFocus />
                   </div>
                   <div className="py-4 text-center text-[13px] text-slate-500 font-medium">{t('createStudent.noTagsFound')}</div>
                   <button className="w-full text-left px-3 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors mt-2">
                     {t('createStudent.createTag')}
                   </button>
                 </div>
               )}
             </div>

             {/* Emails */}
             <div>
               <label className="text-xs font-black text-slate-500 mb-2 block">{t('createStudent.studentEmail')}</label>
               <div className="relative">
                 <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round"/></svg>
                 <input type="email" className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder={t('createStudent.studentEmailPlaceholder')} />
               </div>
             </div>

             <div>
               <label className="text-xs font-black text-slate-500 mb-2 block">{t('createStudent.parentEmail')}</label>
               <div className="relative">
                 <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round"/></svg>
                 <input type="email" className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder={t('createStudent.parentEmailPlaceholder')} />
               </div>
               <p className="text-[11px] text-slate-400 font-medium mt-1.5 ml-1">{t('createStudent.parentEmailDesc')}</p>
             </div>
             
             <div>
               <label className="text-xs font-black text-slate-500 mb-2 block">{t('createStudent.phoneNumber')}</label>
               <div className="relative">
                 <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                 <input type="tel" className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all placeholder:text-slate-300 placeholder:font-medium" placeholder={t('createStudent.phoneNumberPlaceholder')} />
               </div>
             </div>
          </div>

          <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 mt-auto flex items-center justify-end gap-3 rounded-br-[32px]">
            <button onClick={onClose} className="px-6 py-2.5 text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">{t('common.cancel')}</button>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[13px] font-bold hover:bg-black transition-all shadow-md active:scale-95">
              <User className="w-4 h-4" /> {t('createStudent.createProfile')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
