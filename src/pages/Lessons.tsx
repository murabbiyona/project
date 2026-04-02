import { useState } from 'react';
import { Search, Plus, FileText, ArrowUp, Layers, GraduationCap, X, ChevronDown, Check, Edit3, List as ListIcon, Calendar, Image as ImageIcon, Bold, Italic, Underline, Strikethrough, Link as LinkIcon, ListOrdered, List, Code, Eye, Download, Import, Trash2, MoreVertical, Folder, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LessonsCalendar from '../components/lessons/LessonsCalendar';

const CLASSES = [
  { id: '1', name: '5-A', color: 'bg-rose-500', colorName: 'rose', units: 5, lessons: 12 },
  { id: '2', name: '5-B', color: 'bg-orange-500', colorName: 'orange', units: 4, lessons: 10 },
  { id: '3', name: '5-D', color: 'bg-amber-500', colorName: 'amber', units: 5, lessons: 14 },
  { id: '4', name: '6-A', color: 'bg-emerald-500', colorName: 'emerald', units: 6, lessons: 16 },
  { id: '5', name: '6-B', color: 'bg-cyan-500', colorName: 'cyan', units: 6, lessons: 15 },
  { id: '6', name: '6-D', color: 'bg-sky-500', colorName: 'sky', units: 6, lessons: 15 },
  { id: '7', name: '7-A', color: 'bg-blue-500', colorName: 'blue', units: 7, lessons: 20 },
  { id: '8', name: '7-B', color: 'bg-indigo-500', colorName: 'indigo', units: 7, lessons: 18 },
  { id: '9', name: '7-D', color: 'bg-purple-500', colorName: 'purple', units: 7, lessons: 21 },
  { id: '10', name: '8-A', color: 'bg-rose-400', colorName: 'rose', units: 8, lessons: 24 },
  { id: '11', name: '8-B', color: 'bg-orange-400', colorName: 'orange', units: 8, lessons: 22 },
  { id: '12', name: '9-A', color: 'bg-amber-400', colorName: 'amber', units: 6, lessons: 16, time: '12:15 - 13:00' },
  { id: '13', name: '9-B', color: 'bg-emerald-500', colorName: 'emerald', units: 6, lessons: 17, time: '11:25 - 12:10' },
];

const UNITS = [
  { id: '1', number: '01', title: 'Raqamli asoslar va xavfsizlik', desc: 'Fayllar bilan ishlash ko\u2018nikmasini sh...', lessons: 2, progress: 0 },
  { id: '2', number: '02', title: 'Kommunikatsiya va AKT ta\u2018siri', desc: 'Onlayn muloqot va raqamli iqtisodiy...', lessons: 2, progress: 0 },
  { id: '3', number: '03', title: 'Grafika va multimedia dizayni', desc: 'Tasvirlar turlari va auditoriya uchun...', lessons: 3, progress: 0 },
  { id: '4', number: '04', title: 'Ma\u2018lumotlarni tahlil qilish (Elektr...', desc: 'Ma\u2018lumotlar modeli va matematik t...', lessons: 3, progress: 0 },
  { id: '5', number: '05', title: 'Ma\u2018lumotlar bazasi va tizimlar', desc: 'Relyatsion ma\u2018lumotlar va tizim xiz...', lessons: 4, progress: 0 },
  { id: '6', number: '06', title: 'Veb texnologiyalar', desc: 'Veb qatlamlari va butun chorak ma...', lessons: 2, progress: 0 },
];

const LESSONS_MOCK = [
  { id: 'l1', title: '01. Kompyuterda ma\u2018lumotlarni tartiblash', views: 1, statusKey: 'unscheduled' },
  { id: 'l2', title: '2-dars: Shaxsiy xavfsizlik va parollar', views: 1, statusKey: 'unscheduled' },
];

export default function Lessons() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeClass, setActiveClass] = useState<string>('9-A');
  const [activeUnit, setActiveUnit] = useState<string | null>('1');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUnitSort, setShowUnitSort] = useState(false);
  const [showCreateClasses, setShowCreateClasses] = useState(false);
  const [previewLesson, setPreviewLesson] = useState<any>(null);
  const [showEditorMenu, setShowEditorMenu] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [lessonMenuId, setLessonMenuId] = useState<string | null>(null);
  const [moveTargetClass, setMoveTargetClass] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const selectedClassInfo = CLASSES.find(c => c.name === activeClass)!;
  const selectedUnitObj = UNITS.find(u => u.id === activeUnit);
  
  const colorName = selectedClassInfo?.colorName || 'slate';
  
  const getDynamicColorClasses = (isActive: boolean) => {
    if (!isActive) return 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md';
    switch(colorName) {
      case 'amber': return 'border-amber-400 bg-amber-50/30 shadow-md ring-4 ring-amber-400/10';
      case 'rose': return 'border-rose-400 bg-rose-50/30 shadow-md ring-4 ring-rose-400/10';
      case 'orange': return 'border-orange-400 bg-orange-50/30 shadow-md ring-4 ring-orange-400/10';
      case 'emerald': return 'border-emerald-400 bg-emerald-50/30 shadow-md ring-4 ring-emerald-400/10';
      case 'cyan': return 'border-cyan-400 bg-cyan-50/30 shadow-md ring-4 ring-cyan-400/10';
      case 'sky': return 'border-sky-400 bg-sky-50/30 shadow-md ring-4 ring-sky-400/10';
      case 'blue': return 'border-blue-400 bg-blue-50/30 shadow-md ring-4 ring-blue-400/10';
      case 'indigo': return 'border-indigo-400 bg-indigo-50/30 shadow-md ring-4 ring-indigo-400/10';
      case 'purple': return 'border-purple-400 bg-purple-50/30 shadow-md ring-4 ring-purple-400/10';
      default: return 'border-slate-400 bg-slate-50/30 shadow-md ring-4 ring-slate-400/10';
    }
  };

  const getDynamicIconBg = (isActive: boolean) => {
    if (!isActive) return 'bg-slate-50 border-slate-100/50 text-slate-400';
    switch(colorName) {
      case 'amber': return 'bg-amber-100/60 border-amber-200/50 text-amber-500';
      case 'rose': return 'bg-rose-100/60 border-rose-200/50 text-rose-500';
      case 'orange': return 'bg-orange-100/60 border-orange-200/50 text-orange-500';
      case 'emerald': return 'bg-emerald-100/60 border-emerald-200/50 text-emerald-500';
      default: return 'bg-slate-100 border-slate-200/50 text-slate-500';
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 gap-2 p-3 scrollbar-hide" style={{ fontFamily: "'Urbanist', sans-serif" }}>

      {/* COLUMN 1: Classes */}
      <div className="w-[240px] shrink-0 bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-left-4 duration-500">
        <div className="px-5 py-5 flex items-center justify-between border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">{t('lessons.allClasses')}</h2>
          </div>
          <button className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide">
          {CLASSES.map((cls) => {
            const isActive = activeClass === cls.name;
            return (
              <button 
                key={cls.id}
                onClick={() => setActiveClass(cls.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${isActive ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
              >
                {isActive ? (
                   <div className={`w-[46px] h-[46px] rounded-[14px] ${getDynamicIconBg(true).replace('text-', 'bg-opacity-20 text-').split(' ')[0]} flex items-center justify-center shrink-0`}>
                     <GraduationCap className={`w-5 h-5 ${getDynamicIconBg(true).split(' ').find(c => c.startsWith('text-'))}`} />
                   </div>
                ) : (
                  <div className="w-[46px] flex justify-center py-2 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${cls.color}`}></div>
                  </div>
                )}
                
                <div className="flex flex-col items-start min-w-0">
                  <span className={`text-[15px] font-extrabold ${isActive ? 'text-slate-900' : 'text-slate-600'} tracking-tight`}>{cls.name}</span>
                  {isActive && cls.time && (
                    <span className="text-[12px] font-bold text-slate-500">{cls.time}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Class Bottom Stats */}
        {selectedClassInfo && (
           <div className="p-4 border-t border-slate-50 bg-white shrink-0">
             <div className="flex gap-2 mb-4">
               <div className="flex-1 bg-amber-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1">
                 <span className="text-[18px] font-black text-amber-900">{selectedClassInfo.units}</span>
                 <span className="text-[11px] font-bold text-amber-700/70 uppercase tracking-wider">{t('lessons.bolimiStatLabel', 'Bo\u2018lim')}</span>
               </div>
               <div className="flex-1 bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1">
                 <span className="text-[18px] font-black text-slate-900">{selectedClassInfo.lessons}</span>
                 <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t('lessons.darslarStatLabel', 'Darslar')}</span>
               </div>
             </div>
             <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <span className="text-[12px] font-bold text-slate-500">{t('lessons.progress')}</span>
                 <span className="text-[12px] font-black text-slate-900">0%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-slate-300 w-0"></div>
               </div>
             </div>
           </div>
        )}
      </div>

      {/* COLUMN 2: Units */}
      <div className="flex-1 min-w-0 bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
         <div className="px-6 py-5 flex items-center justify-between border-b border-slate-50 shrink-0">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
               <Layers className="w-4 h-4" />
             </div>
             <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">{t('lessons.unitsCol')}</h2>
           </div>
           
           <div className="flex items-center gap-2">
             <button className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
               <Search className="w-4 h-4" />
             </button>
             <div className="relative">
               <button 
                 onClick={() => setShowUnitSort(!showUnitSort)}
                 className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
               >
                 <ArrowUp className="w-4 h-4" />
               </button>
               {showUnitSort && (
                 <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                   <button className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left text-[14px] font-semibold text-slate-900">
                     {t('lessons.sortByName')} <Check className="w-4 h-4 text-slate-900" />
                   </button>
                   <button className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left text-[14px] font-medium text-slate-600">
                     {t('lessons.sortByLessonsCount')}
                   </button>
                 </div>
               )}
             </div>
             <button 
               onClick={() => setShowCreateModal(true)}
               className="h-10 px-4 rounded-xl bg-slate-900 text-white flex items-center gap-2 text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-md ml-2"
             >
               <Plus className="w-4 h-4" /> {t('lessons.createUnitBtn')}
             </button>
           </div>
         </div>
         
         <div className="flex-1 overflow-y-auto p-6 space-y-4">
           {UNITS.map((unit) => {
             const isActive = activeUnit === unit.id;
             return (
             <button 
               key={unit.id}
               onClick={() => setActiveUnit(unit.id)}
               className={`w-full flex items-center gap-4 p-4 rounded-[20px] transition-all border ${getDynamicColorClasses(isActive)}`}
             >
               <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center shrink-0 border ${getDynamicIconBg(isActive)}`}>
                 <Layers className={`w-6 h-6 outline-none`} />
               </div>
               
               <div className="flex flex-col items-start flex-1 min-w-0">
                 <span className="text-[15px] font-extrabold text-slate-900 truncate w-full text-left leading-tight py-0.5">{unit.number}. {unit.title}</span>
                 <span className="text-[13px] font-medium text-slate-500 truncate w-full text-left line-clamp-1">{unit.desc}</span>
               </div>
               
               {isActive && (
                 <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                   <span className="text-[11px] font-bold text-amber-600">{unit.lessons}</span>
                 </div>
               )}
             </button>
           )})}
         </div>

         {/* Unit Selected Footer */}
         {selectedUnitObj && (
           <div className="p-4 border-t border-slate-50 bg-white shrink-0 animate-in slide-in-from-bottom-2 duration-300">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                 <Layers className="w-5 h-5" />
               </div>
               <div className="flex flex-col flex-1 min-w-0">
                 <span className="text-[14px] font-extrabold text-slate-900 truncate w-full">{selectedUnitObj.number}. {selectedUnitObj.title}</span>
                 <span className="text-[11px] font-medium text-slate-500 truncate w-full">{selectedUnitObj.desc}</span>
               </div>
             </div>
             <div className="flex gap-2 mb-4">
               <div className="flex-1 bg-amber-50/50 rounded-[14px] p-2 flex flex-col items-center justify-center gap-1 border border-amber-100/50">
                 <span className="text-[16px] font-black text-amber-900">{selectedUnitObj.lessons}</span>
                 <span className="text-[10px] font-bold text-amber-700/70 uppercase tracking-wider">{t('lessons.darslarStatLabel', 'Darslar')}</span>
               </div>
               <div className="flex-1 bg-emerald-50/50 rounded-[14px] p-2 flex flex-col items-center justify-center gap-1 border border-emerald-100/50">
                 <span className="text-[16px] font-black text-emerald-900">9</span>
                 <span className="text-[10px] font-bold text-emerald-700/70 uppercase tracking-wider">{t('lessons.classesLabel')}</span>
               </div>
             </div>
             <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
               <span>{t('lessons.completed')}</span>
               <span>0/2</span>
             </div>
           </div>
         )}
      </div>

      {/* COLUMN 3: Lessons */}
      <div className="flex-[1.2] min-w-0 bg-slate-50/50 rounded-[24px] flex flex-col relative">
        
        {/* State 1: Nothing Selected */}
        {!activeUnit && (
          <div className="flex flex-col items-center justify-center h-full bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-[16px] font-extrabold text-slate-900 mb-2">{t('lessons.noUnitSelected')}</h3>
            <p className="text-[13px] font-medium text-slate-500 text-center leading-relaxed">
              {t('lessons.noUnitDesc')}
            </p>
          </div>
        )}

        {/* State 2: When unit is selected */}
        {activeUnit && selectedUnitObj && (
          <div className="absolute inset-0 bg-transparent flex flex-col justify-start z-10 animate-in fade-in duration-300">
             
             {/* 3rd Col Header */}
             <div className="px-4 py-4 flex items-center justify-between shrink-0 bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 mb-4">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200/50">
                   <FileText className="w-4 h-4" />
                 </div>
                 <h2 className="text-[18px] font-extrabold text-slate-900 tracking-tight">{t('lessons.lessonsCol')}</h2>
               </div>
               
               <div className="flex items-center gap-2">
                 <button className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                   <Edit3 className="w-4 h-4" />
                 </button>
                 <button className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                   <Search className="w-4 h-4" />
                 </button>
                 <button className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                   <ArrowUp className="w-4 h-4" />
                 </button>
                 
                 <button
                   onClick={() => navigate('/lessons/editor')}
                   className="h-8 px-3 rounded-xl bg-[#1e293b] text-white flex items-center gap-1.5 text-[12px] font-bold hover:bg-slate-800 transition-colors shadow-md ml-1"
                 >
                   <Plus className="w-4 h-4" /> {t('lessons.newLesson')}
                 </button>

                 <div className="flex items-center gap-1 ml-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                    <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-sm' : 'w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors'}>
                      <ListIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('calendar')} className={viewMode === 'calendar' ? 'w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shadow-sm' : 'w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors'}>
                      <Calendar className="w-4 h-4" />
                    </button>
                 </div>
               </div>
             </div>

             {/* Calendar View */}
             {viewMode === 'calendar' && (
               <div className="flex-1 overflow-hidden">
                 <LessonsCalendar activeClass={activeClass} />
               </div>
             )}

             {/* Lessons List */}
             {viewMode === 'list' && <div className="flex-1 overflow-y-auto space-y-4 pb-24">
               {LESSONS_MOCK.map((lesson) => {
                  const isSelected = selectedLessons.includes(lesson.id);
                  return (
                  <div 
                    key={lesson.id}
                    className={`relative w-full flex items-center p-5 bg-white border ${isSelected ? 'border-slate-400 shadow-md ring-1 ring-slate-400/20' : 'border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-amber-200'} rounded-[20px] transition-all group animate-in slide-in-from-bottom-4 duration-500`}
                    onMouseLeave={() => setLessonMenuId(null)}
                  >
                     {/* Checkbox */}
                     <div className="mr-5 flex items-center justify-center shrink-0">
                       <input 
                         type="checkbox" 
                         checked={isSelected}
                         onChange={(e) => {
                           if (e.target.checked) setSelectedLessons([...selectedLessons, lesson.id]);
                           else setSelectedLessons(selectedLessons.filter(id => id !== lesson.id));
                         }}
                         className="w-5 h-5 rounded-[6px] border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-offset-0 cursor-pointer transition-colors"
                       />
                     </div>
                     
                     {/* Main Content — one-click opens editor */}
                     <div
                       onClick={() => navigate('/lessons/editor')}
                       className="flex items-center flex-1 cursor-pointer"
                     >
                       <div className="w-[52px] h-[52px] rounded-[16px] bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100/50 group-hover:scale-105 transition-transform mr-5">
                         <FileText className="w-6 h-6 text-amber-500" />
                       </div>
                       <div className="flex flex-col items-start min-w-0 mr-auto">
                         <span className="text-[16px] font-extrabold text-slate-900 mb-1.5 line-clamp-1 pr-4">{lesson.title}</span>
                         <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                           <span className="text-[13px] font-semibold text-slate-500">{selectedUnitObj?.number}. {selectedUnitObj?.title.substring(0,25)}..</span>
                         </div>
                       </div>
                       
                       {/* Stats */}
                       <div className="flex items-center gap-4 pl-4 border-l border-slate-100 shrink-0 mr-4">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100/50 text-slate-400">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[12px] font-bold">{lesson.views}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100/50 pt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mb-0.5"></div>
                            <span className="text-[12px] font-bold text-orange-600 tracking-wide">{t(`lessons.${lesson.statusKey}`)}</span>
                          </div>
                       </div>
                     </div>

                     {/* Context Menu */}
                     <div className="relative shrink-0 ml-2">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setLessonMenuId(lessonMenuId === lesson.id ? null : lesson.id);
                         }}
                         className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                       >
                         <MoreVertical className="w-4 h-4" />
                       </button>

                       {lessonMenuId === lesson.id && (
                         <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-200">
                            <button
                              onClick={() => { navigate('/lessons/editor'); setLessonMenuId(null); }}
                              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left text-[14px] font-bold text-slate-700"
                            >
                              <Edit3 className="w-4 h-4 text-slate-400" /> {t('lessons.editLesson')}
                            </button>
                            <div className="h-[1px] bg-slate-100 my-1"></div>
                            <button 
                              onClick={() => setLessonMenuId(null)}
                              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left text-[14px] font-bold text-red-500"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" /> {t('lessons.deleteLesson')}
                            </button>
                         </div>
                       )}
                     </div>

                  </div>
                );})}
             </div>}
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      {selectedLessons.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1e293b] text-white rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.24)] border border-slate-800/80 p-1.5 pr-2 flex items-center shrink-0 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-3 pl-4 pr-5 py-2.5 hover:bg-slate-800 rounded-full cursor-pointer transition-colors" onClick={() => setSelectedLessons([])}>
             <div className="w-4 h-4 rounded-[4px] bg-white flex items-center justify-center shrink-0">
               <Check className="w-3 h-3 text-slate-900" strokeWidth={3} />
             </div>
             <span className="text-[13px] font-extrabold whitespace-nowrap">{selectedLessons.length} {t('lessons.selectedCount')}</span>
          </div>
          
          <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>
          
          <button 
            onClick={() => setIsMoveModalOpen(true)}
            className="px-5 py-2.5 hover:bg-slate-800 rounded-full text-[13px] font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <ArrowRightLeft className="w-4 h-4" /> {t('lessons.move')}
          </button>
          
          <button className="px-5 py-2.5 hover:bg-slate-800 rounded-full text-[13px] font-bold flex items-center gap-2 transition-colors whitespace-nowrap">
            <Trash2 className="w-4 h-4" /> {t('common.delete')}
          </button>
          
          <button 
            onClick={() => setSelectedLessons([])}
            className="px-5 py-2.5 hover:bg-slate-800 rounded-full text-[13px] font-bold text-slate-400 transition-colors whitespace-nowrap"
          >
            {t('lessons.clear')}
          </button>
        </div>
      )}

      {/* Move Lesson Modal */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-[700px] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-5 flex items-start justify-between border-b border-slate-100 shrink-0">
               <div>
                 <h2 className="font-extrabold text-slate-900 text-[18px] tracking-tight mb-1">{selectedLessons.length} {t('lessons.moveLessonTitle')}</h2>
                 <p className="text-[13px] font-medium text-slate-500">{t('lessons.moveLessonDesc')}</p>
               </div>
               <button onClick={() => setIsMoveModalOpen(false)} className="p-2 -mr-2 bg-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Content */}
            <div className="flex h-[400px] bg-slate-50/50">
               
               {/* Col 1: Classes */}
               <div className="flex-1 w-1/2 border-r border-slate-100 flex flex-col bg-white">
                 <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                   <GraduationCap className="w-4 h-4" /> {t('lessons.classLabel')}
                 </div>
                 <div className="flex-1 overflow-y-auto p-3 scrollbar-hide space-y-1">
                    {CLASSES.map(cls => (
                      <button 
                        key={cls.id}
                        onClick={() => setMoveTargetClass(cls.name)}
                        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors ${moveTargetClass === cls.name ? 'bg-slate-50 border-slate-200/60 ring-1 ring-slate-200/50 shadow-sm' : 'hover:bg-slate-50 border-transparent'} border`}
                      >
                         <div className={`w-2 h-2 rounded-full ${cls.color}`}></div>
                         <span className={`text-[14px] font-bold ${moveTargetClass === cls.name ? 'text-slate-900' : 'text-slate-600'}`}>{cls.name}</span>
                      </button>
                    ))}
                 </div>
               </div>

               {/* Col 2: Units */}
               <div className="flex-1 w-1/2 flex flex-col bg-white relative">
                 <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                   <Layers className="w-4 h-4" /> {t('lessons.unitLabel')}
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 scrollbar-hide space-y-3">
                    {!moveTargetClass ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">
                        <Folder className="w-10 h-10 text-slate-200 mb-4" />
                        <p className="text-[13px] font-medium text-slate-500 max-w-[200px] leading-relaxed">{t('lessons.selectClassFirst')}</p>
                      </div>
                    ) : (
                      UNITS.map(u => (
                        <button key={u.id} className="w-full flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all text-left group">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-slate-100 transition-colors">
                            <Layers className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900 leading-tight mb-1">{u.number}. {u.title}</div>
                            <div className="text-[12px] font-medium text-slate-500">{u.lessons} {t('lessons.lessonsCountLabel')} • {t('lessons.allTopics')}</div>
                          </div>
                        </button>
                      ))
                    )}
                 </div>
               </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white shrink-0">
               <button onClick={() => setIsMoveModalOpen(false)} className="px-6 py-2.5 bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-[14px] font-bold transition-all shadow-sm">
                 {t('lessons.cancel')}
               </button>
               <button 
                 onClick={() => {
                   setIsMoveModalOpen(false);
                   setSelectedLessons([]);
                   setMoveTargetClass(null);
                 }}
                 disabled={!moveTargetClass}
                 className="px-6 py-2.5 bg-[#475569] text-white rounded-xl text-[14px] font-bold hover:bg-slate-700 transition-all shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] disabled:opacity-30 disabled:cursor-not-allowed"
               >
                 {selectedLessons.length} {t('lessons.moveLessonTitle')}
               </button>
            </div>

          </div>
        </div>
      )}

      {/* Create Unit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-[540px] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-8 py-6 flex items-start justify-between relative shrink-0">
               <div>
                 <h2 className="font-extrabold text-slate-900 text-[19px] tracking-tight mb-1">{t('lessons.createUnitTitle')}</h2>
                 <p className="text-[13px] font-medium text-slate-500">{t('lessons.createUnitDesc')}</p>
               </div>
               <button onClick={() => setShowCreateModal(false)} className="p-2 -mr-2 bg-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 space-y-5">
               
               {/* Name */}
               <div className="space-y-2">
                 <label className="text-[13px] font-bold text-slate-700">{t('lessons.unitNameLabel')} <span className="text-slate-400">*</span></label>
                 <input 
                   type="text" 
                   placeholder={t('lessons.unitNamePlaceholder')}
                   className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all shadow-sm placeholder:text-slate-300"
                 />
               </div>

               {/* Link to Classes */}
               <div className="space-y-2">
                 <div className="flex items-center gap-2 text-slate-600 mb-1">
                   <div className="w-4 h-4 flex items-center justify-center"><Layers className="w-3.5 h-3.5" /></div>
                   <label className="text-[13px] font-bold text-slate-700">{t('lessons.linkToClassesLabel')}</label>
                 </div>
                 
                 <div className="relative">
                   <div 
                     onClick={() => setShowCreateClasses(!showCreateClasses)}
                     className="relative flex min-h-[50px] w-full items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer hover:border-slate-300 transition-colors shadow-sm"
                   >
                     <div className="px-3 py-1.5 bg-amber-50 rounded-lg flex items-center gap-1.5 border border-amber-100/50 shadow-sm">
                       <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                       <span className="text-[12px] font-bold text-amber-600">{activeClass}</span>
                     </div>
                     <div className="ml-auto p-1 text-slate-400">
                       <ChevronDown className="w-4 h-4" />
                     </div>
                   </div>

                   {showCreateClasses && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 max-h-[200px] overflow-y-auto p-2 scrollbar-hide animate-in fade-in slide-in-from-top-2">
                        {CLASSES.map((c) => (
                           <label key={c.id} className="flex items-center gap-3 w-full p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                             <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" defaultChecked={c.name === activeClass} />
                             <div className={`w-2 h-2 rounded-full ${c.color}`}></div>
                             <span className="text-[14px] font-bold text-slate-700">{c.name}</span>
                           </label>
                        ))}
                     </div>
                   )}
                 </div>
                 <p className="text-[11px] font-medium text-slate-500 mt-1.5 ml-1">{t('lessons.linkDesc')}</p>
               </div>

               {/* Description */}
               <div className="space-y-2 pt-1">
                 <label className="text-[13px] font-bold text-slate-700">{t('lessons.descLabel')}</label>
                 <textarea 
                   placeholder={t('lessons.descPlaceholder')}
                   rows={3}
                   className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all shadow-sm resize-none placeholder:text-slate-300"
                 />
               </div>

            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-end gap-3 shrink-0 bg-slate-50/50">
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors bg-white shadow-sm">
                {t('lessons.cancel')}
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-[0_4px_14px_0_rgba(15,23,42,0.39)]"
              >
                {t('lessons.create')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Lesson Preview Modal */}
      {previewLesson && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-[900px] h-[85vh] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 shrink-0">
               <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
                 <Check className="w-4 h-4" /> {t('lessons.saved')}
               </div>
               <div className="flex items-center gap-3">
                 <div className="relative">
                   <div className="flex items-center bg-[#1e293b] text-white rounded-[12px] shadow-[0_4px_14px_0_rgba(15,23,42,0.39)] overflow-hidden">
                     <button 
                       onClick={() => navigate('/lessons/editor')}
                       className="px-4 py-2 text-[13px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors h-full"
                     >
                       <Edit3 className="w-4 h-4" /> {t('lessons.openEditor')}
                     </button>
                     <div className="w-[1px] h-5 bg-slate-700"></div>
                     <button 
                       onClick={() => setShowEditorMenu(!showEditorMenu)}
                       className="px-3 py-2 hover:bg-slate-800 transition-colors h-full flex items-center justify-center"
                     >
                       <ChevronDown className="w-4 h-4" />
                     </button>
                   </div>
                   
                   {showEditorMenu && (
                     <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-[16px] shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2">
                        <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left text-[14px] font-medium text-slate-700">
                          <Check className="w-4 h-4 text-slate-400" /> {t('lessons.saveNow')}
                        </button>
                        <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left text-[14px] font-medium text-slate-700">
                          <Download className="w-4 h-4 text-slate-400" /> {t('lessons.downloadPdf')}
                        </button>
                        <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left text-[14px] font-medium text-slate-700">
                          <Import className="w-4 h-4 text-slate-400" /> {t('lessons.importLesson')}
                        </button>
                        <div className="h-[1px] bg-slate-100 my-1"></div>
                        <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-50 transition-colors text-left text-[14px] font-medium text-red-500">
                          <Trash2 className="w-4 h-4 text-red-400" /> {t('lessons.deleteLesson')}
                        </button>
                     </div>
                   )}
                 </div>
                 
                 <button onClick={() => setPreviewLesson(null)} className="p-2 bg-transparent text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-[12px] transition-all">
                   <X className="w-5 h-5" />
                 </button>
               </div>
            </div>

            {/* Modal Body - Notion styling */}
            <div className="flex-1 overflow-y-auto bg-white p-16 scrollbar-hide relative" style={{ fontFamily: "'Urbanist', sans-serif" }}>
               <div className="max-w-[700px] mx-auto">
                 
                 {/* Cover Area */}
                 <button className="w-full h-[180px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] mb-10 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-slate-300 hover:bg-slate-100 transition-colors group">
                    <ImageIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    <span className="text-[14px] font-bold">{t('lessons.addCover')}</span>
                 </button>

                 <h1 className="text-[42px] font-black text-slate-900 mb-8 leading-tight tracking-tight">01. Kompyuterda ma\u2018lumotlarni tartiblash</h1>
                 
                 {/* Toolbar */}
                 <div className="flex items-center gap-1.5 border-b border-slate-100 pb-6 mb-8 flex-wrap">
                    {[
                      {i: <ChevronDown className="w-4 h-4 rotate-90" />},
                      {i: <ChevronDown className="w-4 h-4 -rotate-90" />},
                      {s: true},
                      {i: <Bold className="w-4 h-4" />},
                      {i: <Italic className="w-4 h-4" />},
                      {i: <Underline className="w-4 h-4" />},
                      {i: <Strikethrough className="w-4 h-4" />},
                      {s: true},
                      {t: 'H1'}, {t: 'H2'}, {t: 'H3'},
                      {s: true},
                      {i: <List className="w-4 h-4" />},
                      {i: <ListOrdered className="w-4 h-4" />},
                      {i: <Code className="w-4 h-4" />},
                      {i: <ListIcon className="w-4 h-4" />},
                      {s: true},
                      {i: <div className="w-3 h-0.5 bg-slate-400"></div>},
                      {i: <LinkIcon className="w-4 h-4" />},
                      {t: 'Σ'},
                      {i: <Plus className="w-4 h-4" />}
                    ].map((btn, idx) => (
                      btn.s ? <div key={idx} className="w-[1px] h-5 bg-slate-200 mx-1"></div> :
                      <button key={idx} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors text-[13px] font-bold">
                        {btn.t || btn.i}
                      </button>
                    ))}
                 </div>

                 {/* Content */}
                 <div className="space-y-6 text-[15px] font-medium text-slate-700 leading-relaxed">
                    <p className="font-bold text-slate-900 text-[16px]">Dars mavzusi: Kompyuterda ma\u2018lumotlarni tartiblash va fayl turlari</p>
                    <p className="text-[14px]"><strong className="text-slate-900">Dars kodi:</strong> INF.9.4.1 <strong className="text-slate-900 ml-4">Vaqt:</strong> 45 daqiqa</p>
                    
                    <div className="pt-4 space-y-4">
                      <p className="font-bold text-slate-900">1. Kutilayotgan natija (SMART Maqsad)</p>
                      <p>Dars yakunida o\u2018quvchi:</p>
                      <ul className="list-disc pl-6 space-y-3">
                         <li><strong className="text-slate-900 text-[14px]">Fayllarni boshqarish</strong> amallarini (yaratish, nomlash, papkalarga ajratish) biladi.</li>
                         <li>Word hujjatining standart kengaytmasi <strong className="text-slate-900 text-[14px]">.docx</strong> ekanini aniqlay oladi.</li>
                         <li>Iyerarxik papkalar tuzilmasini mustaqil yarata oladi.</li>
                      </ul>
                    </div>
                 </div>

               </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
