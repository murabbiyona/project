import { useState } from 'react';
import { 
  Folder, BarChart2, FileText, Edit2, Mail, Phone, MessageSquare, 
  GraduationCap, ClipboardCheck, AlertTriangle, TrendingUp, Hexagon,
  Search, Filter, ArrowUpRight, Plus, File, Minus, Edit, Trash2, Check, X,
  ChevronDown, Calendar
} from 'lucide-react';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, assignments, notes
  const [showEditGradeModal, setShowEditGradeModal] = useState(false);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);

  return (
    <div className="flex h-full bg-transparent overflow-hidden" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      {/* ─── Left Sidebar ─── */}
      <div className="w-[300px] xl:w-[340px] bg-white border-r border-slate-100 p-6 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-8">
          <Folder className="w-5 h-5 text-slate-700" />
          <h1 className="text-[20px] font-black text-slate-900">Portfolio</h1>
        </div>

        <div className="space-y-4 mb-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all border ${
              activeTab === 'overview' 
                ? 'bg-amber-50 border-amber-400 shadow-sm ring-4 ring-amber-50/50' 
                : 'bg-white border-transparent hover:border-slate-200'
            }`}
          >
            <div className={`mt-0.5 ${activeTab === 'overview' ? 'text-amber-500' : 'text-slate-400'}`}>
              <BarChart2 className="w-5 h-5" />
            </div>
            <div className="text-left flex-1">
              <h3 className={`text-[15px] font-extrabold ${activeTab === 'overview' ? 'text-amber-900' : 'text-slate-700'}`}>
                Overview
              </h3>
              <p className={`text-[12px] font-bold ${activeTab === 'overview' ? 'text-amber-700/60' : 'text-slate-400'}`}>
                Grades, attendance & trends
              </p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('assignments')}
            className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all border ${
              activeTab === 'assignments' 
                ? 'bg-amber-50 border-amber-400 shadow-sm ring-4 ring-amber-50/50' 
                : 'bg-white border-transparent hover:border-slate-200'
            }`}
          >
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <div className="text-left flex-1">
              <h3 className={`text-[15px] font-bold ${activeTab === 'assignments' ? 'text-amber-900' : 'text-slate-600'}`}>
                Assignments <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black align-middle">1</span>
              </h3>
              <p className={`text-[12px] font-bold ${activeTab === 'assignments' ? 'text-amber-700/60' : 'text-slate-400'}`}>
                Work and submissions
              </p>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('notes')}
            className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all border ${
              activeTab === 'notes' 
                ? 'bg-amber-50 border-amber-400 shadow-sm ring-4 ring-amber-50/50' 
                : 'bg-white border-transparent hover:border-slate-200'
            }`}
          >
            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
            <div className="text-left flex-1">
              <h3 className={`text-[15px] font-bold ${activeTab === 'notes' ? 'text-amber-900' : 'text-slate-600'}`}>
                Notes
              </h3>
            </div>
          </button>
        </div>

        <div className="border-t border-slate-100 pt-8 mt-4 flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <h2 className="text-[16px] font-black text-slate-800">Contact Info</h2>
            </div>
            <button className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-slate-700 transition-colors">
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-widest mb-3">Classes</h4>
              <span className="inline-block px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-[13px] font-bold">
                9-A
              </span>
            </div>

            <div>
              <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-widest mb-3">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 mb-0.5">Student Email</p>
                    <p className="text-[13px] font-bold text-slate-500 italic">Not provided</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 mb-0.5">Parent Email</p>
                    <p className="text-[13px] font-bold text-slate-500 italic">Not provided</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 mb-0.5">Phone Number</p>
                    <p className="text-[13px] font-bold text-slate-500 italic">Not provided</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm shrink-0">
            <Mail className="w-5 h-5" />
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl bg-amber-400 text-white text-[14px] font-black shadow-lg shadow-amber-400/20 hover:bg-amber-500 transition-colors">
            <MessageSquare className="w-4 h-4" fill="currentColor" /> Chat
          </button>
        </div>
      </div>

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Overall Grade</p>
                    <h2 className="text-[28px] font-black text-slate-800 leading-none">0%</h2>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[12px] font-bold text-slate-400 mt-4">Weighted average</p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Attendance</p>
                    <h2 className="text-[28px] font-black text-rose-500 leading-none">38.5%</h2>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <ClipboardCheck className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[12px] font-bold text-slate-400 mt-4">5 of 13 days</p>
              </div>

              <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Missing</p>
                    <h2 className="text-[28px] font-black text-emerald-500 leading-none">0</h2>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[12px] font-bold text-slate-400 mt-4">All caught up</p>
              </div>
            </div>

            {/* Middle Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm min-h-[300px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="text-[16px] font-black text-slate-800">Grade Trends</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <TrendingUp className="w-8 h-8 mb-3 opacity-50" />
                  <p className="text-[13px] font-bold">No grades recorded yet</p>
                </div>
              </div>

              <div className="col-span-1 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm min-h-[300px] flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200">
                    <Hexagon className="w-4 h-4" />
                  </div>
                  <h3 className="text-[16px] font-black text-slate-800">Category Strengths</h3>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <Hexagon className="w-10 h-10 mb-3 opacity-50" strokeWidth={1} />
                  <p className="text-[13px] font-bold">No grades recorded yet</p>
                </div>
              </div>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm min-h-[300px] flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200">
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-[16px] font-black text-slate-800">Weekly Attendance</h3>
                </div>
                
                <div className="flex-1 flex items-end px-4 pt-4 gap-8">
                  {/* Y-axis */}
                  <div className="flex flex-col justify-between h-full text-[11px] font-black text-slate-400 pb-8 absolute left-6 top-24 bottom-6">
                    <span>5</span>
                    <span>4</span>
                    <span>2</span>
                    <span>0</span>
                  </div>
                  
                  {/* Chart area */}
                  <div className="flex-1 h-full pl-6 border-b border-dashed border-slate-200 relative grid grid-cols-6 gap-2">
                    {/* Hover state overlay for Feb 16 */}
                    <div className="absolute top-0 bottom-0 left-[33.33%] w-[16.66%] bg-slate-50/50 -ml-1 pointer-events-none z-0" />
                    
                    {/* Tooltip for Feb 16 */}
                    <div className="absolute top-0 left-[33.33%] translate-x-4 bg-white border border-slate-100 shadow-lg rounded-xl p-3 z-10 w-36 hidden xl:block">
                      <p className="text-[11px] font-black text-slate-600 mb-2">Week of Feb 16</p>
                      <div className="space-y-1 text-[11px] font-bold text-slate-500">
                        <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-sm bg-emerald-500"></span>Present</span><span className="text-slate-700">1</span></div>
                        <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-sm bg-amber-400"></span>Late</span><span className="text-slate-700">0</span></div>
                        <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-sm bg-sky-400"></span>Excused</span><span className="text-slate-700">0</span></div>
                        <div className="flex justify-between"><span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-sm bg-rose-500"></span>Absent</span><span className="text-slate-700">1</span></div>
                      </div>
                    </div>

                    {/* Bars */}
                    {[
                      { date: 'Feb 2', present: 0, absent: 40 },
                      { date: 'Feb 9', present: 0, absent: 40 },
                      { date: 'Feb 16', present: 15, absent: 25 },
                      { date: 'Feb 23', present: 40, absent: 0 },
                      { date: 'Mar 2', present: 15, absent: 25 },
                      { date: 'Mar 9', present: 0, absent: 40 },
                      { date: 'Mar 16', present: 20, absent: 0 },
                    ].map((week, i) => (
                      <div key={i} className="flex flex-col items-center justify-end h-full w-full z-10 relative group">
                        <div className="w-4 h-full flex flex-col justify-end gap-0.5">
                          {week.absent > 0 && <div className="w-full bg-rose-500 rounded-t-sm" style={{ height: `${week.absent}%` }} />}
                          {week.present > 0 && <div className="w-full bg-emerald-500 rounded-t-sm group-hover:bg-emerald-400 transition-colors" style={{ height: `${week.present}%` }} />}
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 mt-3 absolute -bottom-6 whitespace-nowrap">{week.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 text-[11px] font-bold text-slate-500 relative mt-16 pb-2">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500"></span> Present</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-400"></span> Late</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-sky-400"></span> Excused</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-rose-500"></span> Absent</span>
                </div>
              </div>

              <div className="col-span-1 bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm min-h-[300px] flex flex-col relative items-center justify-center">
                <div className="absolute top-6 left-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-widest">Attendance</h3>
                </div>

                <div className="relative w-40 h-40 mt-12 mb-8 shrink-0">
                  {/* CSS Donut Chart */}
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="16" />
                    {/* ~38% present (emerald), rest absent (rose) */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F43F5E" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="154" className="transition-all duration-1000" />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[28px] font-black text-slate-800 leading-tight">38.5%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Attendance</span>
                  </div>

                  {/* Present Tag Float */}
                  <div className="absolute -top-1 left-2 bg-white px-2 py-0.5 rounded-full shadow-md text-[10px] font-bold border border-slate-100 flex items-center gap-1 h-5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></span> Present <span className="text-slate-800 ml-1">5</span>
                  </div>
                  {/* Absent Tag Float */}
                  <div className="absolute top-[60%] -right-4 bg-white px-2 py-0.5 rounded-full shadow-md text-[10px] font-bold border border-slate-100 flex items-center gap-1 h-5 z-10">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-sm"></span> Absent <span className="text-slate-800 ml-1">8</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-auto mb-2 text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-slate-700">5</span> Present</div>
                  <div className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-rose-500" /> <span className="text-slate-700">8</span> Absent</div>
                  <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-full border-[3px] border-amber-400 flex items-center justify-center"><div className="w-1 h-1 bg-amber-400 rounded-full" /></div> <span className="text-slate-700">0</span> Late</div>
                  <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 rounded-sm bg-sky-100 text-sky-500 flex items-center justify-center font-serif italic text-[10px]">E</div> <span className="text-slate-700">0</span> Excused</div>
                </div>
              </div>
            </div>
            
            <div className="h-10"></div> {/* Bottom padding */}
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm h-full flex flex-col p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-700">
                  <FileText className="w-5 h-5" />
                </div>
                <h1 className="text-[20px] font-black text-slate-800 tracking-tight">
                  Assignments <span className="text-slate-400 text-[16px] font-medium ml-1">(1)</span>
                </h1>
              </div>

              <div className="flex gap-3">
                <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                  <Search className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="h-10 px-4 flex items-center gap-2 rounded-[14px] bg-white border border-slate-200 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                  <ArrowUpRight className="w-4 h-4 text-slate-400" /> Sort: Due Date
                </button>
                <button 
                  onClick={() => setShowCreateAssignmentModal(true)}
                  className="h-10 px-5 flex items-center gap-2 rounded-[14px] bg-slate-900 text-white text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} /> Add Assignment
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <File className="w-5 h-5 fill-current opacity-20 absolute" />
                    <FileText className="w-5 h-5 relative" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-black text-slate-800 mb-1 leading-none hover:text-blue-600 transition-colors cursor-pointer">01. Fayllar va iyerarxiya</h3>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Test</span>
                      <span className="text-[12px] font-bold text-slate-400">Apr 1</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm text-slate-400 hover:text-slate-800 transition-all opacity-0 group-hover:opacity-100">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-sm text-slate-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowEditGradeModal(true)}
                    className="w-9 h-9 rounded-[10px] bg-white border border-slate-200 text-slate-400 shadow-sm flex items-center justify-center hover:text-slate-700 hover:border-slate-300 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm h-full flex flex-col p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-700">
                  <FileText className="w-5 h-5" />
                </div>
                <h1 className="text-[20px] font-black text-slate-800 tracking-tight">
                  Notes <span className="text-slate-400 text-[16px] font-medium ml-1">(1)</span>
                </h1>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-100 rounded-[14px]">
                  <button className="px-4 h-8 rounded-xl text-[12px] font-bold text-slate-500 hover:text-slate-700 transition-colors">Positive</button>
                  <button className="px-4 h-8 rounded-xl text-[12px] font-bold text-slate-500 hover:text-slate-700 transition-colors">Concern</button>
                  <button className="px-4 h-8 rounded-xl bg-white shadow-sm text-[12px] font-bold text-slate-800 border border-slate-200">Neutral</button>
                </div>
                <button className="h-10 px-5 flex items-center gap-2 rounded-[14px] bg-slate-500 text-white text-[13px] font-bold hover:bg-slate-600 transition-colors shadow-sm ml-2">
                  <Plus className="w-4 h-4" strokeWidth={3} /> Add Note
                </button>
              </div>
            </div>

            <div className="mb-6 flex-shrink-0">
              <div className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 focus-within:border-slate-400 focus-within:bg-white transition-all shadow-sm">
                <textarea 
                  className="w-full bg-transparent outline-none text-[14px] font-medium text-slate-800 resize-none min-h-[80px]"
                  placeholder="Add a note about this student..."
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm bg-white transition-all relative group">
                <p className="text-[14px] font-medium text-slate-800 leading-relaxed pr-24">
                  Sartaroshxonada ishlaydi ekan. Menimcha dadasi sartarosh. Unga yordamchi bo'lsa kerak
                </p>
                <p className="text-[11px] font-bold text-slate-400 mt-3">about 6 hours ago</p>
                
                <div className="absolute top-5 right-5 space-y-2 flex flex-col items-end">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg">
                    Neutral
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Edit Grade Modal ─── */}
      {showEditGradeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[420px] rounded-[24px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 relative">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-[18px] font-black text-slate-800">Edit Grade</h2>
                <button onClick={() => setShowEditGradeModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-[13px] font-bold text-slate-500 mb-6">01. Fayllar va iyerarxiya</p>

              <div className="space-y-2 mb-8">
                <label className="text-[13px] font-black text-slate-800">Score (out of 10)</label>
                <div className="bg-white border-2 border-slate-400 rounded-xl px-4 py-3 shadow-sm select-auto flex items-center focus-within:border-slate-600">
                  <input type="number" className="bg-transparent outline-none text-[15px] font-black text-slate-800 w-full" autoFocus />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button 
                  onClick={() => setShowEditGradeModal(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-5 py-2.5 bg-slate-400 text-white text-[13px] font-black rounded-xl hover:bg-slate-500 transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Create Assignment Modal ─── */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[460px] rounded-[24px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-black text-slate-800">Create Assignment</h2>
                <p className="text-[13px] font-medium text-slate-500 mt-1">Create a new assignment for grading.</p>
              </div>
              <button onClick={() => setShowCreateAssignmentModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[13px] font-black text-slate-800">Title * *</label>
                <div className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 transition-all shadow-sm">
                  <input className="bg-transparent outline-none text-[14px] font-bold text-slate-800 w-full" placeholder="e.g. Chapter 5 Quiz" autoFocus />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-black text-slate-800">Select a class</label>
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <span className="text-[14px] font-bold text-slate-800">9-A</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-black text-slate-800">Topic</label>
                  <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
                    <span className="text-[14px] font-medium text-slate-600">No topic</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-black text-slate-800">Points</label>
                  <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-slate-400 transition-colors">
                    <input type="number" defaultValue="100" className="bg-transparent outline-none text-[14px] font-medium text-slate-800 w-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-black text-slate-800">Due Date</label>
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm focus-within:border-slate-400 transition-colors">
                  <input type="text" defaultValue="03/29/2026" className="bg-transparent outline-none text-[14px] font-medium text-slate-800 w-full" />
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 pt-0 mt-4">
              <button 
                onClick={() => setShowCreateAssignmentModal(false)}
                className="px-5 py-2.5 text-[14px] font-black text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button className="px-5 py-2.5 bg-slate-900 text-white text-[14px] font-black rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all hover:-translate-y-0.5">
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>
    </div>
  );
}
