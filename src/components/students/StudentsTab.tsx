import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search, Filter, ChevronDown, Calendar, ArrowUp, Edit, Trash2, Plus, BookOpen } from 'lucide-react';
import { Checkbox } from '../ui/Checkbox';

const studentsMock = [
  { id: '1001', name: 'Alibek Safarov', initials: 'AS', att: 100, statusKey: 'active' },
  { id: '1002', name: "Dinora Jo'rayeva", initials: 'DJ', att: 100, statusKey: 'active' },
  { id: '1003', name: 'Diyora Eshmirzayeva', initials: 'DE', att: 100, statusKey: 'active' },
  { id: '1004', name: 'Doston Anorboyev', initials: 'DA', att: 94, statusKey: 'active' },
  { id: '1005', name: 'Elyor Jovliyev', initials: 'EJ', att: 94, statusKey: 'active' },
  { id: '1006', name: 'Farida Safarova', initials: 'FS', att: 82, statusKey: 'active' },
];

export function StudentsTab({ onNewStudent }: { onNewStudent: () => void }) {
  const { t } = useTranslation();
  const [filterOpen, setFilterOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => setSelected(studentsMock.map(s => s.id));
  const deselectAll = () => { setSelected([]); setIsEditing(false); };

  const handleEditMode = () => {
     if(isEditing) {
       deselectAll();
     } else {
       setIsEditing(true);
     }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/30 relative">
      <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100/60 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {t('studentsTab.students')} <span className="text-slate-400 font-medium ml-1">{t('studentsTab.studentsCount', { count: studentsMock.length })}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={handleEditMode}
            className={`p-2.5 rounded-xl border transition-all ${isEditing ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 shadow-sm'}`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2.5 bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 rounded-xl border transition-all shadow-sm">
            <Search className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <button 
               onClick={() => setFilterOpen(!filterOpen)}
               className={`p-2.5 rounded-xl border transition-all shadow-sm ${filterOpen ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'}`}
            >
              <Filter className="w-4 h-4" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-50">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pt-2 pb-1">{t('studentsTab.status')}</div>
                <div className="p-1">
                  <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold bg-slate-800 text-white rounded-xl">
                    {t('studentsTab.allStudents')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
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
          
          <button className="flex flex-col items-center justify-center p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-all shadow-sm text-[12px] font-bold h-10 px-4">
            <div className="flex items-center gap-1.5"><ArrowUp className="w-3.5 h-3.5 text-slate-400" /> {t('studentsTab.sortName')}</div>
          </button>
          
          <div className="flex items-stretch h-10 ml-1 rounded-xl shadow-md overflow-hidden bg-slate-800">
            <button 
              onClick={onNewStudent}
              className="flex items-center gap-2 px-4 h-full text-[13px] font-bold text-white hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> {t('studentsTab.newStudent')}
            </button>
            <div className="w-px bg-slate-700/50"></div>
            <button className="px-3 h-full text-white hover:bg-slate-700 transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-7 pb-24">
        <div className="space-y-3">
          {studentsMock.map(student => (
            <div key={student.id} className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group">
               <div className="flex items-center gap-5">
                 {isEditing && (
                   <div className="pl-1 animate-in slide-in-from-left-2 duration-200">
                     <Checkbox checked={selected.includes(student.id)} onChange={() => toggleSelect(student.id)} />
                   </div>
                 )}
                 <div className="w-12 h-12 bg-rose-400 text-white rounded-[16px] flex items-center justify-center font-bold shadow-md shadow-rose-200">
                   {student.initials}
                 </div>
                 <div>
                   <h3 className="text-[16px] font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{student.name}</h3>
                   <p className="text-[12px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">{t('studentsTab.studentId')} ID-{student.id}</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5 border border-emerald-100 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[12px] font-bold">
                   <Calendar className="w-3 h-3" />
                   {student.att}%
                 </div>
                 <div className="flex items-center gap-2 border border-emerald-100 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[12px] font-bold w-24">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></div>
                   {t(`studentsTab.${student.statusKey}`)}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Floating Action Bar */}
      {isEditing && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white rounded-3xl shadow-2xl flex items-stretch p-1.5 animate-in slide-in-from-bottom-5 duration-300 z-50">
           {selected.length === 0 ? (
             <div className="flex items-center px-4">
                <span className="text-[13px] text-slate-300 font-medium mr-1.5">{t('studentsTab.selectStudentsOr')}</span>
                <button onClick={selectAll} className="text-[13px] font-bold text-white hover:underline px-2 py-2">{t('studentsTab.selectAll')}</button>
             </div>
           ) : (
             <div className="flex items-center px-4 border-r border-slate-700">
                <span className="text-[13px] font-bold mr-6">{t('studentsTab.studentsSelected', {count: selected.length})}</span>
                <button className="flex items-center gap-2 text-[13px] font-bold px-3 py-2 text-slate-200 hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4 opacity-70" /> {t('studentsTab.editClasses')}
                </button>
                <button className="flex items-center gap-2 text-[13px] font-bold px-3 py-2 mx-2 text-slate-200 hover:text-white bg-slate-700/50 rounded-xl transition-colors">
                  {t('studentsTab.status')} <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                <button className="flex items-center gap-2 text-[13px] font-bold px-3 py-2 text-slate-200 hover:text-white transition-colors">
                  <Trash2 className="w-4 h-4 opacity-70" /> {t('studentsTab.delete')}
                </button>
             </div>
           )}
           <button onClick={deselectAll} className="px-5 py-2 text-[13px] font-bold text-rose-400 hover:text-rose-300 transition-colors">{t('common.cancel')}</button>
        </div>
      )}
    </div>
  );
}
