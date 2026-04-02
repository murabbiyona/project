import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

const presetColors = [
  'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-cyan-400',
  'bg-blue-400', 'bg-indigo-400', 'bg-purple-400', 'bg-pink-400'
];

export function CreateTopicModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-[400px] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
           <h2 className="font-bold text-slate-900 text-[17px]">{t('createTopic.title', 'Create')}</h2>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
           <div>
             <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">{t('createTopic.name', 'Name')}</label>
             <input type="text" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all placeholder:text-slate-400" placeholder={t('createTopic.namePlaceholder', 'e.g., Homework, Tests, Projects')} autoFocus />
           </div>

           <div>
             <label className="text-[13px] font-medium text-slate-700 mb-1.5 block">{t('createTopic.weight', 'Weight (%) %')}</label>
             <input type="number" defaultValue="100" className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all" />
           </div>

           <div>
             <label className="text-[13px] font-medium text-slate-700 mb-2 block">{t('createTopic.color', 'Color')}</label>
             <div className="flex flex-wrap gap-3">
               {presetColors.map((color, i) => (
                 <button 
                   key={i}
                   onClick={() => setSelectedColor(i)}
                   className={`w-8 h-8 rounded-full ${color} transition-all
                     ${selectedColor === i ? 'ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-110'}
                   `}
                 />
               ))}
               <button 
                 onClick={() => setSelectedColor(9)}
                 className={`w-8 h-8 rounded-full relative overflow-hidden transition-all flex items-center justify-center
                   ${selectedColor === 9 ? 'ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-110'}
                 `}
               >
                 {/* Rainbow sweep effect */}
                 <div className="absolute inset-0 bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)]"></div>
               </button>
             </div>
           </div>
        </div>

        <div className="px-6 py-4 flex flex-row-reverse gap-3 bg-white border-t border-slate-100">
          <button className="flex-1 bg-slate-800 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-slate-900 transition-colors shadow-sm">{t('createTopic.createBtn', 'Create')}</button>
          <button onClick={onClose} className="flex-1 bg-white border border-slate-200 text-slate-700 rounded-lg py-2.5 text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors">{t('common.cancel', 'Cancel')}</button>
        </div>

      </div>
    </div>
  );
}
