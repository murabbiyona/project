import { useState } from 'react';
import { 
  GraduationCap, Search, Plus,
  Target, ChevronDown, ChevronRight, Check, X, Edit2, Trash2
} from 'lucide-react';

const CLASSES = [
  { id: '6-D', label: '6-D', time: '13:00 - 13:45', color: 'bg-blue-100', textColor: 'text-blue-500', dot: 'bg-blue-500', stats: { sets: 0, standards: 0, covered: 0, perc: 0 } },
  { id: '7-A', label: '7-A', time: '13:00 - 13:45', color: 'bg-indigo-100', textColor: 'text-indigo-500', dot: 'bg-indigo-500', stats: { sets: 1, standards: 15, covered: 10, perc: 66 } },
  { id: '7-B', label: '7-B', time: '12:15 - 13:00', color: 'bg-purple-100', textColor: 'text-purple-500', dot: 'bg-purple-500', stats: { sets: 1, standards: 12, covered: 12, perc: 100 } },
  { id: '7-D', label: '7-D', time: '12:15 - 13:00', color: 'bg-fuchsia-100', textColor: 'text-fuchsia-500', dot: 'bg-fuchsia-500', stats: { sets: 1, standards: 10, covered: 8, perc: 80 } },
  { id: '8-A', label: '8-A', time: '12:15 - 13:00', color: 'bg-rose-100', textColor: 'text-rose-500', dot: 'bg-rose-500', stats: { sets: 2, standards: 20, covered: 5, perc: 25 } },
  { id: '8-B', label: '8-B', time: '12:15 - 13:00', color: 'bg-orange-100', textColor: 'text-orange-500', dot: 'bg-orange-500', stats: { sets: 1, standards: 15, covered: 15, perc: 100 } },
  { id: '9-A', label: '9-A', time: '12:15 - 13:00', color: 'bg-amber-100', textColor: 'text-amber-500', dot: 'bg-amber-500', stats: { sets: 1, standards: 11, covered: 11, perc: 100 } },
];

const STANDARDS = [
  { id: '1', code: 'INF.9.4.1', title: 'Fayllar iyerarxiyasi va formatlar' },
  { id: '2', code: 'INF.9.4.2', title: 'Shaxsiy ma\'lumotlar va parollar xavfsizligi' },
  { id: '3', code: 'INF.9.4.3', title: 'Kommunikatsiya vositalari va E-pochta' },
  { id: '4', code: 'INF.9.4.4', title: 'Rasterli va Vektorli grafika texnologiyasi' },
  { id: '5', code: 'INF.9.4.5', title: 'Elektron jadvalda matematik modellashtirish' },
  { id: '6', code: 'INF.9.4.6', title: 'Ma\'lumotlarni vizuallashtirish (Diagrammalar)' },
  { id: '7', code: 'INF.9.4.7', title: 'Taqdimotda animatsiya va interaktivlik' },
  { id: '8', code: 'INF.9.4.8', title: 'Matn muxarriri va murakkab hujjatlar' },
];

const FRAMEWORKS = [
  'Digital Technologies — Years 1-2',
  'Digital Technologies — Years 3-4',
  'Digital Technologies — Years 5-6',
  'Digital Technologies — Years 7-8',
  'Digital Technologies — Years 9-10',
  'Digital Technologies — Foundation',
];

const MY_SETS = [
  { id: 1, title: '5-sinf (Informatika)', subject: 'Axborot texnologiyalari', grade: 5, added: true, items: [] },
  { id: 2, title: 'Informatika (6-sinf uchun diagnostik test asosida)', subject: 'Axborot texnologiyalari', grade: 6, added: false, items: [
      { code: 'INF.6.DT.1', desc: 'Internetda xavfsiz qidiruv va brauzer bilan ishlash' },
      { code: 'INF.6.DT.2', desc: 'Matnli hujjatlar (Word) va elektron jadvallar (Excel)' },
      { code: 'INF.6.DT.3', desc: 'Algoritm tushunchasi va Sprayt harakati' },
      { code: 'INF.6.DT.4', desc: 'Takrorlash bloklari va Pen uskunasi yordamida shakllar chizish' },
  ] },
  { id: 3, title: 'Informatika (7-sinf uchun diagnostik test asosida)', subject: 'Axborot texnologiyalari', grade: 7, added: false, items: [] },
  { id: 4, title: 'Informatika (8-sinf uchun diagnostik test asosida)', subject: 'Axborot texnologiyalari', grade: 8, added: false, items: [] },
  { id: 5, title: 'Informatika (9-sinf)', subject: 'Axborot texnologiyalari', grade: 9, added: true, items: [] },
];

export default function Standards() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>('9-A');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState<'browse' | 'my'>('browse');
  const [expandedSetId, setExpandedSetId] = useState<number | null>(2);

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      {/* ─── Column 1: All Classes ─── */}
      <div className="flex flex-col shrink-0 bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar transition-all duration-300 w-[320px]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-[20px] font-black text-slate-800 tracking-tight">All Classes</h1>
          </div>

          <div className="space-y-4">
            {CLASSES.map((cls) => {
              const isSelected = selectedClassId === cls.id;
              
              if (!isSelected) {
                return (
                  <div 
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${cls.dot}`} />
                    <span className="text-[15px] font-extrabold text-slate-600 group-hover:text-slate-800 transition-colors">{cls.label}</span>
                  </div>
                );
              }

              return (
                <div 
                  key={cls.id}
                  className={`border rounded-[24px] transition-all duration-300 ${
                    `border-${cls.textColor.split('-')[1]}-200 bg-${cls.textColor.split('-')[1]}-50/30 shadow-sm ring-4 ring-${cls.textColor.split('-')[1]}-50`
                  }`}
                >
                  <div className="p-6 pb-5 border-b border-dashed border-amber-200">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white ${cls.textColor} shadow-sm border border-amber-100`}>
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-[18px] font-black text-slate-800 mb-1">{cls.label}</h3>
                        <p className="text-[13px] font-bold text-slate-400">{cls.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-5">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex-1 bg-white border border-amber-100 rounded-xl py-3 px-1 text-center shadow-sm">
                        <p className="text-[18px] font-black text-slate-800">{cls.stats.sets}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Std. Sets</p>
                      </div>
                      <div className="flex-1 bg-white border border-amber-100 rounded-xl py-3 px-1 text-center shadow-sm">
                        <p className="text-[18px] font-black text-slate-800">{cls.stats.standards}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Standards</p>
                      </div>
                      <div className="flex-1 bg-white border border-amber-100 rounded-xl py-3 px-1 text-center shadow-sm">
                        <p className="text-[18px] font-black text-slate-800">{cls.stats.covered}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Covered</p>
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span>Coverage</span>
                        <span>{cls.stats.perc}%</span>
                      </div>
                      <div className="h-1.5 bg-white border border-slate-100 rounded-full overflow-hidden">
                        <div className="w-[100%] h-full bg-amber-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Column 2: Data Panel ─── */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-700">
                <Target className="w-5 h-5" />
              </div>
              <h1 className="text-[20px] font-black text-slate-800 tracking-tight">Standards</h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                <Search className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowModal(true)}
                className="px-5 h-10 flex items-center gap-2 justify-center rounded-[14px] bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg group relative"
              >
                <Plus className="w-4 h-4" strokeWidth={3} />
                <span className="text-[14px] font-black">Add Standards</span>
              </button>
            </div>
          </div>
          
          {/* Main Content (Accordion) */}
          <div className="flex-1 overflow-auto custom-scrollbar p-6 pt-2">
            
            {/* Standard Sets */}
            {selectedClassId === '9-A' ? (
              <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                {/* Accordion Header */}
                <div 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-50 rounded-[14px] shadow-sm border border-slate-100 flex items-center justify-center text-slate-500">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[16px] font-black text-slate-800">Informatika (9-sinf)</h3>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100/80 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-widest">Custom</span>
                      </div>
                      <p className="text-[12px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                        <span>• 11 standards</span>
                        <span>• 11 covered</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-[14px] font-black text-emerald-500 pr-2">100%</div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100 bg-white border-t border-slate-100">
                    {STANDARDS.map(std => (
                      <div key={std.id} className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-6 h-6 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[14px] font-bold text-slate-800">{std.code}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold uppercase tracking-widest">Covered</span>
                          </div>
                          <p className="text-[14px] font-medium text-slate-600">{std.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Target className="w-16 h-16 mb-4 opacity-50" />
                <h2 className="text-[20px] font-black text-slate-800 mb-2">No Standards</h2>
                <p className="text-[14px] font-medium text-slate-500">Click the + Add Standards button to get started.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* ─── Add Standards Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[900px] h-[80vh] rounded-[24px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 relative">
            <div className="p-6 border-b border-slate-100 shrink-0 relative flex items-center justify-center">
              <h2 className="text-[20px] font-black text-slate-800 absolute left-6 border-none">Add Standards</h2>
              
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl shadow-inner">
                <button 
                  onClick={() => setModalTab('browse')}
                  className={`px-6 py-2 rounded-xl text-[13px] font-bold transition-all ${modalTab === 'browse' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  Browse All
                </button>
                <button 
                  onClick={() => setModalTab('my')}
                  className={`px-6 py-2 rounded-xl text-[13px] font-bold transition-all ${modalTab === 'my' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  My Standards
                </button>
              </div>

              <button onClick={() => setShowModal(false)} className="absolute right-6 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
              {modalTab === 'browse' ? (
                <>
                  <div className="space-y-4 shrink-0 mb-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Search</label>
                      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 focus-within:border-slate-800 transition-colors">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Search by name, subject, or framework..." className="bg-transparent outline-none text-[14px] font-medium text-slate-800 w-full" />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Country', val: 'All Countries' },
                        { label: 'Region', val: 'All Regions' },
                        { label: 'Subject', val: 'All Subjects' },
                        { label: 'Grade', val: 'All Grades' },
                      ].map((filter, i) => (
                        <div key={i}>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">{filter.label}</label>
                          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors">
                            <span className="text-[13px] font-bold text-slate-700">{filter.val}</span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-3 shrink-0">
                      <h3 className="text-[14px] font-black text-slate-800">Standards</h3>
                      <span className="text-[12px] font-medium text-slate-500">Showing 100 of 11,997 — narrow your filters</span>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-y-auto bg-white shadow-sm flex-1 custom-scrollbar">
                      <div className="divide-y divide-slate-100">
                        {FRAMEWORKS.map((fw, idx) => (
                          <div key={idx} className="p-4 px-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                              <span className="text-[14px] font-medium text-slate-700">{fw}</span>
                            </div>
                            <button className="px-5 py-1.5 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors bg-white shadow-sm">
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4 shrink-0 mb-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Name</label>
                      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus-within:border-slate-800">
                        <input type="text" placeholder="e.g. My Science Objectives" className="bg-transparent outline-none text-[13px] font-medium text-slate-800 w-full" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Subject</label>
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus-within:border-slate-800">
                          <input type="text" placeholder="e.g. Science" className="bg-transparent outline-none text-[13px] font-medium text-slate-800 w-full" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Grade Level</label>
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 transition-colors focus-within:border-slate-800">
                          <input type="text" placeholder="e.g. 3-5" className="bg-transparent outline-none text-[13px] font-medium text-slate-800 w-full" />
                        </div>
                      </div>
                    </div>

                    <button className="px-5 py-2 mt-2 bg-slate-800 text-white rounded-lg text-[13px] font-black hover:bg-slate-900 transition-colors shadow-sm">
                      Create
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-3 shrink-0 px-1">
                      <h3 className="text-[14px] font-black text-slate-800">Standards</h3>
                      <span className="text-[12px] font-medium text-slate-500">5 custom sets</span>
                    </div>

                    <div className="border border-slate-200 rounded-2xl overflow-y-auto bg-white shadow-sm flex-1 custom-scrollbar">
                      <div className="divide-y divide-slate-100">
                        {MY_SETS.map((set) => {
                          const isExp = expandedSetId === set.id;
                          return (
                            <div key={set.id} className="border-b border-slate-100 last:border-none relative">
                              <div 
                                className="p-4 px-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                                onClick={() => setExpandedSetId(isExp ? null : set.id)}
                              >
                                <div className="flex items-center gap-3">
                                  {isExp ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />}
                                  <span className="text-[14px] font-medium text-slate-700">
                                    {set.title} <span className="text-slate-400 mx-1">·</span> {set.subject} <span className="text-slate-400 mx-1">·</span> {set.grade}
                                  </span>
                                  {set.id === 1 && (
                                    <div className="flex items-center gap-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="text-slate-400 hover:text-slate-600"><Edit2 className="w-3.5 h-3.5" /></button>
                                      <button className="text-slate-400 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  {isExp && <span className="text-[12px] font-medium text-slate-500">{set.items.length} Total</span>}
                                  {set.added ? (
                                    <button className="px-4 py-1.5 rounded-lg text-[13px] font-bold bg-slate-800 text-white flex items-center gap-1.5 shadow-sm">
                                      <Check className="w-3.5 h-3.5" strokeWidth={3} /> Added
                                    </button>
                                  ) : (
                                    <button className="px-5 py-1.5 border border-slate-200 rounded-lg text-[13px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors bg-white shadow-sm">
                                      Add
                                    </button>
                                  )}
                                </div>
                              </div>

                              {isExp && set.items.length > 0 && (
                                <div className="bg-white px-5 pb-5 pt-1">
                                  <div className="pl-7 pr-2 space-y-1">
                                    {set.items.map((item, idx) => (
                                      <div key={idx} className="flex items-start gap-4 py-2.5 group/item cursor-pointer">
                                        <span className="text-[13px] font-bold text-slate-800 w-24 shrink-0">{item.code}</span>
                                        <span className="text-[13px] font-medium text-slate-600 flex-1">{item.desc}</span>
                                        <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                          <button className="text-slate-400 hover:text-slate-600"><Edit2 className="w-3.5 h-3.5" /></button>
                                          <button className="text-slate-400 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                      </div>
                                    ))}
                                    
                                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                                      <input type="text" placeholder="Code" className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-800 outline-none focus:border-slate-400" />
                                      <input type="text" placeholder="Standard description..." className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-800 outline-none focus:border-slate-400" />
                                      <button className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors bg-white shadow-sm">
                                        <Plus className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0 rounded-b-[24px]">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-[13px] font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="px-8 py-2.5 bg-slate-800 text-white text-[13px] font-bold rounded-xl shadow-sm hover:bg-slate-900 transition-colors">
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
}
