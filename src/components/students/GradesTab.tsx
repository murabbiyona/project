import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, EyeOff, PanelRight, Plus, ChevronUp, ChevronDown, Check, Tag } from 'lucide-react';

const studentsMock = [
  { id: '1001', name: 'Alibek Safarov', initials: 'AS' },
  { id: '1002', name: "Dinora Jo'rayeva", initials: 'DJ' },
  { id: '1003', name: 'Diyora Eshmirzayeva', initials: 'DE' },
  { id: '1004', name: 'Doston Anorboyev', initials: 'DA' },
  { id: '1005', name: 'Elyor Jovliyev', initials: 'EJ' },
  { id: '1006', name: 'Farida Safarova', initials: 'FS' },
  { id: '1007', name: 'Halima Jumanazarova', initials: 'HJ' },
];

export function GradesTab({ 
  onNewAssignment,
  onManageTopics,
  onCreateTopic
}: { 
  onNewAssignment: () => void,
  onManageTopics: () => void,
  onCreateTopic: () => void
}) {
  const { t } = useTranslation();
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="flex flex-1 h-full gap-5 bg-slate-50/30">
      <div className="flex-1 flex flex-col bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100/60 sticky top-0 z-10 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{t('gradesTab.assignments')} <span className="text-slate-400 font-medium ml-1">(0)</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 rounded-xl border transition-all shadow-sm">
              <Search className="w-4 h-4" />
            </button>
            <div className="relative">
              <button onClick={() => setFilterOpen(!filterOpen)} className="p-2.5 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 rounded-xl border transition-all shadow-sm">
                <Filter className="w-4 h-4" />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-50">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pt-2 pb-1">{t('studentsTab.status')}</div>
                  <div className="p-1">
                    <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold bg-slate-800 text-white rounded-xl">
                      {t('studentsTab.allStudents')}
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      {t('studentsTab.active')}
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      {t('studentsTab.away')}
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      {t('studentsTab.archived')}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="p-2.5 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 rounded-xl border transition-all shadow-sm">
              <EyeOff className="w-4 h-4" />
            </button>
            <button className="p-2.5 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 rounded-xl border transition-all shadow-sm mr-2">
              <PanelRight className="w-4 h-4" />
            </button>
            
            <button onClick={onNewAssignment} className="flex items-center gap-2 bg-slate-900 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95">
              <Plus className="w-4 h-4" /> {t('gradesTab.newAssignment')}
            </button>
          </div>
        </div>
        
        {/* Table Head */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 h-16 relative sticky top-[81px] z-10">
          <div className="flex items-center w-[300px] border-r border-slate-100 px-6 shrink-0 bg-slate-50/90 backdrop-blur-sm shadow-[1px_0_0_rgba(241,245,249,1)]">
             {t('gradesTab.studentName')} <ChevronUp className="w-3 h-3 ml-2" />
          </div>
          <div className="flex-1 flex items-stretch">
             {/* Empty Column for assignments list */}
             <div className="flex-1 flex justify-center items-center text-slate-200 font-black text-2xl border-r border-slate-100 w-[120px] shrink-0">
               -
             </div>
             {/* Add Column */}
             <div className="w-[120px] shrink-0 flex flex-col justify-center items-center text-center border-r border-slate-100 hover:bg-white hover:text-slate-800 transition-colors cursor-pointer group">
               <Plus className="w-4 h-4 text-slate-300 group-hover:text-slate-600 mb-1" />
               <span>{t('gradesTab.add')}</span>
             </div>
             {/* Total Column */}
             <div className="w-[120px] shrink-0 border-l-2 border-slate-100 flex items-center justify-center gap-1.5 shadow-[-4px_0_12px_rgba(0,0,0,0.02)] pl-1">
               {t('gradesTab.total')} <div className="flex flex-col"><ChevronUp className="w-2.5 h-2.5" /><ChevronDown className="w-2.5 h-2.5 -mt-1" /></div>
             </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto pb-10">
          {studentsMock.map((student) => (
             <div key={student.id} className="flex border-b border-slate-50 group hover:bg-slate-50/30 transition-colors h-[72px]">
               {/* Sticky Student Profile Col */}
               <div className="flex items-center w-[300px] border-r border-slate-100 px-6 shrink-0 bg-white group-hover:bg-slate-50/30 transition-colors z-[5] shadow-[1px_0_0_rgba(241,245,249,1)] relative">
                 <div className="w-9 h-9 bg-rose-400 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm shadow-rose-200">
                   {student.initials}
                 </div>
                 <div className="ml-4 font-bold text-slate-900 group-hover:text-slate-700 transition-colors text-[14px]">{student.name}</div>
               </div>
               
               <div className="flex-1 flex items-stretch">
                 {/* Empty Assignments Value */}
                 <div className="flex-1 flex justify-center items-center text-slate-300 font-bold border-r border-slate-100 w-[120px] shrink-0">
                   -
                 </div>
                 {/* Empty Add Value */}
                 <div className="w-[120px] shrink-0 border-r border-slate-100 flex justify-center items-center font-bold text-slate-300">
                   
                 </div>
                 {/* Empty Total Value */}
                 <div className="w-[120px] shrink-0 border-l-2 border-slate-100 flex items-center justify-center text-slate-300 font-bold shadow-[-4px_0_12px_rgba(0,0,0,0.02)] relative z-[5]">
                   -
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* Right Widget Column */}
      <div className="w-[280px] shrink-0 bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
               <Tag className="w-4 h-4" />
             </div>
             <h2 className="font-extrabold text-slate-900 leading-tight">
                {t('gradesTab.gradeTopics').split(' ')[0]}<br/>
                {t('gradesTab.gradeTopics').split(' ').slice(1).join(' ')}
             </h2>
           </div>
           <div className="flex gap-2">
             <button onClick={onManageTopics} className="p-1.5 text-slate-300 hover:text-slate-800 transition-colors"><PanelRight className="w-4 h-4" /></button>
             <button onClick={onCreateTopic} className="p-1.5 text-slate-300 hover:text-slate-800 transition-colors"><Plus className="w-4 h-4" /></button>
           </div>
        </div>

        <div className="p-8 flex flex-col items-center justify-center border-b border-slate-50">
          <div className="relative w-36 h-36 flex items-center justify-center mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="16" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="16" fill="none" strokeDasharray="251.2" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                 <Check className="w-5 h-5" strokeWidth={3} />
               </div>
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-black text-slate-900 text-3xl tracking-tight">100%</h3>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{t('gradesTab.topicWeights')}</p>
          </div>
        </div>
        
        <div className="p-5 flex-1">
          <div className="flex items-center gap-4 bg-blue-50/80 border border-blue-200/60 rounded-[18px] p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-[18px]"></div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm border-2 border-white shadow-sm ring-1 ring-blue-500/20">
              100<span className="text-[10px]">%</span>
            </div>
            <h4 className="font-extrabold text-slate-800 text-[15px] group-hover:text-blue-900 transition-colors">Kahoot!</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
