import { useTranslation } from 'react-i18next';
import { X, Edit2, Trash2 } from 'lucide-react';

const mockTopics = [
  { id: 1, name: 'Kahoot!', weight: 100, color: 'bg-blue-500' },
  { id: 2, name: 'Test', weight: 100, color: 'bg-blue-500' }
];

export function ManageTopicsModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-[400px] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-5">
           <h2 className="font-bold text-slate-900 text-[17px]">{t('manageTopics.title', 'Grade Topics')}</h2>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 pb-6 space-y-3">
          {mockTopics.map(topic => (
            <div key={topic.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors bg-white group shadow-sm">
               <div className="flex items-center gap-3">
                  <div className={`w-1 h-8 rounded-full ${topic.color}`}></div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-[14px] leading-tight mb-0.5">{topic.name}</h3>
                    <p className="text-[12px] text-slate-500 font-medium">{topic.weight}%</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="hover:text-slate-700 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button className="hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
