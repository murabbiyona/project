import { useState } from 'react';
import { Search, Filter, ArrowUp, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X, Clock, FileText } from 'lucide-react';

const studentsMock = [
  { id: '1001', name: 'Alibek Safarov', initials: 'AS' },
  { id: '1002', name: "Dinora Jo'rayeva", initials: 'DJ' },
  { id: '1003', name: 'Diyora Eshmirzayeva', initials: 'DE' },
  { id: '1004', name: 'Doston Anorboyev', initials: 'DA' },
  { id: '1005', name: 'Elyor Jovliyev', initials: 'EJ' },
  { id: '1006', name: 'Farida Safarova', initials: 'FS' },
  { id: '1007', name: 'Halima Jumanazarova', initials: 'HJ' },
  { id: '1008', name: 'Jamshid Eshmirzayev', initials: 'JE' },
  { id: '1009', name: 'Madina Jovliyeva', initials: 'MJ' },
  { id: '1010', name: 'Madina Soatmurodova', initials: 'MS' },
];

export function AttendanceTab() {
  const [showAllDays, setShowAllDays] = useState(false);

  return (
    <div className="flex flex-col flex-1 h-full bg-slate-50/30 rounded-[24px] border border-slate-100 shadow-sm overflow-hidden mb-6">
      
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-7 py-5 bg-white border-b border-slate-100/60 shrink-0">
        <div className="flex items-center gap-3">
           <CalendarIcon className="w-6 h-6 text-slate-400" />
           <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">March 2026</h2>
        </div>
        
        <div className="flex items-center gap-3">
           {/* Actions */}
           <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-sm bg-white">
             <Search className="w-4 h-4" />
           </button>
           <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-sm bg-white">
             <Filter className="w-4 h-4" />
           </button>
           <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-sm bg-white mr-2">
             <ArrowUp className="w-4 h-4" />
           </button>
           
           {/* Pagination */}
           <div className="flex items-center rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden h-10 mr-2">
              <button className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors border-r border-slate-100">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-4 text-[13px] font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors border-r border-slate-100 h-full">
                Today
              </button>
              <button className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
           </div>
           
           {/* View Toggle */}
           <button 
             onClick={() => setShowAllDays(!showAllDays)}
             className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors shadow-sm group relative
               ${showAllDays ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'}
             `}
           >
             <CalendarIcon className="w-4 h-4" />
             <div className="opacity-0 group-hover:opacity-100 absolute top-full mt-2 w-max bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-opacity pointer-events-none z-50">
               {showAllDays ? 'Show scheduled days only' : 'Show all days'}
             </div>
           </button>
        </div>
      </div>
      
      {/* Table Header Wrapper */}
      <div className="flex border-b border-slate-100 bg-white sticky top-0 z-10 shrink-0">
          {/* Static Name Column */}
          <div className="w-[300px] shrink-0 border-r border-slate-100 flex items-center px-6 h-16 bg-white z-20 shadow-[1px_0_0_rgba(241,245,249,1)]">
             <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Student Name</span>
          </div>

          {/* Dynamic Date Columns */}
          <div className="flex-1 overflow-hidden">
             <div className="flex h-16 min-w-max pr-6">
                {!showAllDays ? (
                  <>
                    <div className="w-[60px] flex flex-col items-center justify-center border-r border-slate-100 shrink-0">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Fri</span>
                       <span className="text-[14px] font-extrabold text-slate-900">6</span>
                    </div>
                    <div className="w-[60px] flex flex-col items-center justify-center border-r border-slate-100 shrink-0">
                       <span className="text-[10px] font-bold text-slate-400 uppercase">Fri</span>
                       <span className="text-[14px] font-extrabold text-slate-900">13</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[320px] flex items-center px-6 border-r border-slate-100 shrink-0">
                       <div className="flex flex-col justify-center">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Sun</span>
                         <span className="text-[15px] font-extrabold text-slate-900">29</span>
                       </div>
                       <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 ml-6">Status</span>
                    </div>
                  </>
                )}
             </div>
          </div>
      </div>

      {/* Table Body Area */}
      <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar flex">
          
          {/* Static Names Sidebar */}
          <div className="w-[300px] shrink-0 bg-white z-10 shadow-[1px_0_0_rgba(241,245,249,1)]">
            {studentsMock.map((student, idx) => (
              <div key={`name-${idx}`} className="h-[52px] flex items-center px-6 border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-rose-400 text-white flex items-center justify-center text-[12px] font-bold shadow-sm shadow-rose-200">
                  {student.initials}
                </div>
                <span className="ml-4 font-semibold text-slate-800 text-[14px] group-hover:text-slate-900 transition-colors">{student.name}</span>
              </div>
            ))}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-x-auto custom-scrollbar-horizontal">
            <div className="min-w-max pr-6">
              {studentsMock.map((_student, idx) => (
                <div key={`row-${idx}`} className="flex h-[52px] border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  {!showAllDays ? (
                    <>
                      {/* Checkmarks Mode */}
                      <div className="w-[60px] flex items-center justify-center border-r border-slate-50 shrink-0">
                        <div className={`w-[26px] h-[26px] rounded-[6px] flex items-center justify-center
                          ${idx === 6 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                          {idx === 6 ? <X className="w-3.5 h-3.5" strokeWidth={3} /> : <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        </div>
                      </div>
                      <div className="w-[60px] flex items-center justify-center border-r border-slate-50 shrink-0">
                        <div className={`w-[26px] h-[26px] rounded-[6px] flex items-center justify-center
                          ${idx === 5 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                          {idx === 5 ? <X className="w-3.5 h-3.5" strokeWidth={3} /> : <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Edit Buttons Mode */}
                      <div className="w-[320px] flex items-center px-3 border-r border-slate-50 shrink-0 gap-2">
                        <button className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center border border-slate-200 text-slate-300 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-500 transition-all">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center border border-slate-200 text-slate-300 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 transition-all">
                          <X className="w-4 h-4" />
                        </button>
                        <button className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center border border-slate-200 text-slate-300 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-500 transition-all">
                          <Clock className="w-4 h-4" />
                        </button>
                        <button className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center border border-slate-200 text-slate-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-500 transition-all">
                          <FileText className="w-4 h-4" />
                        </button>
                        {/* Empty spacing block then edit button */}
                        <div className="flex-1"></div>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer Stats & Legend */}
        <div className="h-14 bg-white border-t border-slate-100 flex items-center justify-between px-8 shrink-0 z-20">
          <p className="text-[13px] font-semibold text-slate-500">Showing {studentsMock.length} students</p>
          <div className="flex items-center gap-4 text-[12px] font-bold text-slate-500">
             <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-md bg-emerald-50 text-emerald-500 flex items-center justify-center"><Check className="w-2.5 h-2.5" strokeWidth={3}/></div> Present</div>
             <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-md bg-rose-50 text-rose-500 flex items-center justify-center"><X className="w-2.5 h-2.5" strokeWidth={3}/></div> Absent</div>
             <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-md bg-amber-50 text-amber-500 flex items-center justify-center"><Clock className="w-2.5 h-2.5" strokeWidth={3}/></div> Late</div>
             <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center"><FileText className="w-2.5 h-2.5" strokeWidth={3}/></div> Excused</div>
             <div className="flex items-center gap-1.5 ml-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div> Has notes</div>
          </div>
        </div>
      </div>
    </div>
  );
}
