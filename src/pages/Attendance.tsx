import { useState } from 'react';
import { 
  GraduationCap, Search, Calendar,
  Filter, Upload, ChevronLeft, ChevronRight, Check, X, Clock, FileText, Edit2
} from 'lucide-react';

const CLASSES = [
  { id: '6-D', label: '6-D', time: '13:00 - 13:45', color: 'bg-blue-100', textColor: 'text-blue-500', dot: 'bg-blue-500', stats: { present: 45, absent: 5, perc: 90 } },
  { id: '7-A', label: '7-A', time: '13:00 - 13:45', color: 'bg-indigo-100', textColor: 'text-indigo-500', dot: 'bg-indigo-500', stats: { present: 50, absent: 2, perc: 96 } },
  { id: '7-B', label: '7-B', time: '12:15 - 13:00', color: 'bg-purple-100', textColor: 'text-purple-500', dot: 'bg-purple-500', stats: { present: 48, absent: 4, perc: 92 } },
  { id: '7-D', label: '7-D', time: '12:15 - 13:00', color: 'bg-fuchsia-100', textColor: 'text-fuchsia-500', dot: 'bg-fuchsia-500', stats: { present: 52, absent: 0, perc: 100 } },
  { id: '8-A', label: '8-A', time: '12:15 - 13:00', color: 'bg-rose-100', textColor: 'text-rose-500', dot: 'bg-rose-500', stats: { present: 40, absent: 10, perc: 80 } },
  { id: '8-B', label: '8-B', time: '12:15 - 13:00', color: 'bg-orange-100', textColor: 'text-orange-500', dot: 'bg-orange-500', stats: { present: 47, absent: 3, perc: 94 } },
  { id: '9-A', label: '9-A', time: '12:15 - 13:00', color: 'bg-amber-100', textColor: 'text-amber-500', dot: 'bg-amber-500', stats: { present: 63, absent: 22, perc: 74 } },
];

const STUDENTS = [
  { id: '1', name: 'Asadbek Panjiyev', initials: 'AP', status: { '4': 'P', '6': 'A', '11': 'A', '13': 'A', '18': 'P', '29': 'P' } },
  { id: '2', name: 'Davron Eshbo\'riyev', initials: 'DE', status: { '4': 'P', '6': 'A', '11': 'P', '13': 'P', '18': 'P', '29': 'A' } },
  { id: '3', name: 'Dilafruz Abdumurodova', initials: 'DA', status: { '4': 'P', '6': 'P', '11': 'P', '13': 'A', '18': 'P', '29': 'L' } },
  { id: '4', name: 'Dilora Karimova', initials: 'DK', status: { '4': 'A', '6': 'A', '11': 'A', '13': 'P', '18': 'P', '29': 'E' } },
  { id: '5', name: 'Dilshodbek Jovliyev', initials: 'DJ', status: { '4': 'P', '6': 'P', '11': 'P', '13': 'P', '18': 'P', '29': null } },
  { id: '6', name: 'Elnur Avduvaitov', initials: 'EA', status: { '4': 'P', '6': 'P', '11': 'P', '13': 'A', '18': 'P', '29': null } },
  { id: '7', name: 'Jasmina Nazarova', initials: 'JN', status: { '4': 'A', '6': 'A', '11': 'P', '13': 'A', '18': 'P', '29': null } },
  { id: '8', name: 'Javohir Abduzairov', initials: 'JA', status: { '4': 'P', '6': 'P', '11': 'P', '13': 'P', '18': 'P', '29': null } },
  { id: '9', name: 'Kibora Farhodova', initials: 'KF', status: { '4': 'P', '6': 'A', '11': 'P', '13': 'P', '18': 'P', '29': null } },
  { id: '10', name: 'Nafisa Jo\'rayeva', initials: 'NJ', status: { '4': 'P', '6': 'A', '11': 'P', '13': 'P', '18': 'P', '29': null } },
];

const MONTH_DAYS = Array.from({ length: 18 }, (_, i) => i + 1);
const CLASS_DAYS = [4, 6, 11, 13, 18];

export default function Attendance() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>('9-A');
  const [viewMode, setViewMode] = useState<'month' | 'day' | 'class'>('month'); // class -> shows only class days (Image 1)

  const toggleViewMode = () => {
    if (viewMode === 'month') setViewMode('class');
    else if (viewMode === 'class') setViewMode('day');
    else setViewMode('month');
  };

  const getDayLabel = (d: number) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[d % 7];
  };

  const visibleDays = viewMode === 'class' ? CLASS_DAYS : MONTH_DAYS;

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      {/* ─── Column 1: All Classes ─── */}
      <div className={`flex flex-col shrink-0 bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar transition-all duration-300 w-[320px]`}>
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
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex-1 bg-white border border-amber-100 rounded-xl py-3 px-2 text-center shadow-sm">
                        <p className="text-[18px] font-black text-slate-800">{cls.stats.present}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Present</p>
                      </div>
                      <div className="flex-1 bg-white border border-amber-100 rounded-xl py-3 px-2 text-center shadow-sm">
                        <p className="text-[18px] font-black text-slate-800">{cls.stats.absent}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Absent</p>
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span>Record</span>
                        <span>{cls.stats.perc}%</span>
                      </div>
                      <div className="h-1.5 bg-white border border-slate-100 rounded-full overflow-hidden">
                        <div className="w-[74%] h-full bg-amber-400 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Column 2: Data Grid ─── */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-700">
                <Calendar className="w-5 h-5" />
              </div>
              <h1 className="text-[20px] font-black text-slate-800 tracking-tight">March 2026</h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                <Search className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                <Filter className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                <Upload className="w-4 h-4" />
              </button>
              
              <div className="flex items-center bg-white border border-slate-200 rounded-[14px] shadow-sm overflow-hidden h-10">
                <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button className="px-4 h-full flex items-center justify-center text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors border-x border-slate-200">Today</button>
                <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>

              <button 
                onClick={toggleViewMode}
                className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg group relative"
              >
                <Calendar className="w-4 h-4" />
                <span className="absolute top-12 right-0 whitespace-nowrap bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                  {viewMode === 'day' ? 'Show all days' : viewMode === 'class' ? 'Switch to month view' : 'Switch to day view'}
                </span>
              </button>
            </div>
          </div>
          
          {/* Grid */}
          <div className="flex-1 overflow-auto custom-scrollbar relative">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[250px] border-r border-slate-100 bg-white shadow-[0_1px_0_#f1f5f9]">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                      STUDENT NAME <span className="text-[8px]">▼</span>
                    </div>
                  </th>
                  
                  {viewMode === 'day' ? (
                    <>
                      <th className="w-20 px-2 py-4 text-center border-r border-slate-100 bg-slate-50 shadow-[0_1px_0_#f1f5f9]">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400">SUN</span>
                          <span className="text-[14px] font-black text-slate-800">29</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-white shadow-[0_1px_0_#f1f5f9] w-full text-left w-full">
                        STATUS
                      </th>
                    </>
                  ) : (
                    visibleDays.map(d => (
                      <th key={d} className={`w-[60px] px-2 py-4 text-center border-r border-slate-100 bg-white shadow-[0_1px_0_#f1f5f9]`}>
                        <div className="flex flex-col items-center">
                          <span className="text-[9px] font-bold text-slate-400">{getDayLabel(d)}</span>
                          <span className="text-[13px] font-black text-slate-800 mt-0.5">{d}</span>
                        </div>
                      </th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {STUDENTS.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 border-r border-slate-100 bg-white group-hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                          {student.initials}
                        </div>
                        <span className="text-[14px] font-bold text-slate-700">{student.name}</span>
                      </div>
                    </td>
                    
                    {viewMode === 'day' ? (
                      <>
                        <td className="px-2 py-4 text-center border-r border-slate-100 bg-slate-50">
                          {student.status['29'] ? (
                            <div className="mx-auto flex items-center justify-center">
                              {student.status['29'] === 'P' && <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-500 flex items-center justify-center"><Check className="w-4 h-4" strokeWidth={3}/></div>}
                              {student.status['29'] === 'A' && <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-500 flex items-center justify-center"><X className="w-4 h-4" strokeWidth={3}/></div>}
                              {student.status['29'] === 'L' && <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-500 flex items-center justify-center"><Clock className="w-4 h-4" strokeWidth={3}/></div>}
                              {student.status['29'] === 'E' && <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center"><FileText className="w-4 h-4" strokeWidth={3}/></div>}
                            </div>
                          ) : (
                            <div className="mx-auto w-8 h-8 rounded-lg border-2 border-dashed border-slate-200 bg-white" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${student.status['29'] === 'P' ? 'bg-emerald-100 text-emerald-500' : 'text-slate-300 hover:bg-slate-100'}`}><Check className="w-4 h-4" strokeWidth={3} /></button>
                            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${student.status['29'] === 'A' ? 'bg-rose-100 text-rose-500' : 'text-slate-300 hover:bg-slate-100'}`}><X className="w-4 h-4" strokeWidth={3} /></button>
                            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${student.status['29'] === 'L' ? 'bg-amber-100 text-amber-500' : 'text-slate-300 hover:bg-slate-100'}`}><Clock className="w-4 h-4" strokeWidth={3} /></button>
                            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${student.status['29'] === 'E' ? 'bg-blue-100 text-blue-500' : 'text-slate-300 hover:bg-slate-100'}`}><FileText className="w-4 h-4" strokeWidth={3} /></button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-100 transition-colors relative group">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {(student.id === '1' || student.id === '4') && (
                              <div className="flex items-center gap-2 ml-2">
                                <input type="text" placeholder="Add a note..." className={`w-36 bg-white border ${student.id === '4' ? 'border-slate-600 ring-4 ring-slate-100' : 'border-slate-200 shadow-sm'} rounded-lg px-3 py-1.5 text-[13px] font-medium text-slate-800 outline-none transition-all`} />
                                <button className="px-4 py-1.5 bg-slate-500 hover:bg-slate-600 text-white text-[12px] font-bold rounded-lg transition-colors shadow-sm">Add</button>
                              </div>
                            )}
                          </div>
                        </td>
                      </>
                    ) : (
                      visibleDays.map(d => {
                        const s = (student.status as Record<string, string | null>)[d.toString()];
                        return (
                          <td key={d} className="px-2 py-4 text-center border-r border-slate-50">
                            {s ? (
                              <div className="mx-auto flex items-center justify-center">
                                {s === 'P' && <div className="w-8 h-8 rounded-[10px] bg-emerald-100 text-emerald-500 flex items-center justify-center"><Check className="w-4 h-4" strokeWidth={3}/></div>}
                                {s === 'A' && <div className="w-8 h-8 rounded-[10px] bg-rose-100 text-rose-500 flex items-center justify-center"><X className="w-4 h-4" strokeWidth={3}/></div>}
                                {s === 'L' && <div className="w-8 h-8 rounded-[10px] bg-amber-100 text-amber-500 flex items-center justify-center"><Clock className="w-4 h-4" strokeWidth={3}/></div>}
                                {s === 'E' && <div className="w-8 h-8 rounded-[10px] bg-blue-100 text-blue-500 flex items-center justify-center"><FileText className="w-4 h-4" strokeWidth={3}/></div>}
                              </div>
                            ) : (
                              <div className="mx-auto w-8 h-8 rounded-[10px] border-2 border-dashed border-slate-200 bg-white" />
                            )}
                          </td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend Footer */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white shrink-0 mt-auto">
            <span className="text-[13px] font-bold text-slate-400">Showing 17 students</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><div className="w-5 h-5 rounded flex items-center justify-center bg-emerald-100 text-emerald-500"><Check className="w-3 h-3" strokeWidth={3}/></div><span className="text-[12px] font-bold text-slate-500">Present</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 rounded flex items-center justify-center bg-rose-100 text-rose-500"><X className="w-3 h-3" strokeWidth={3}/></div><span className="text-[12px] font-bold text-slate-500">Absent</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 rounded flex items-center justify-center bg-amber-100 text-amber-500"><Clock className="w-3 h-3" strokeWidth={3}/></div><span className="text-[12px] font-bold text-slate-500">Late</span></div>
              <div className="flex items-center gap-2"><div className="w-5 h-5 rounded flex items-center justify-center bg-blue-100 text-blue-500"><FileText className="w-3 h-3" strokeWidth={3}/></div><span className="text-[12px] font-bold text-slate-500">Excused</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /><span className="text-[12px] font-bold text-slate-500">Has notes</span></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
}
