import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Search, Plus, ClipboardList, Tag,
  Filter, EyeOff, FileText, Check, Link2, ListPlus, ChevronDown, Calendar, X, Mic, Send, Monitor,
  ArrowUpRight, ChevronUp, PanelRightClose
} from 'lucide-react';

const CLASSES = [
  { id: '5-A', label: '5-A', time: '08:00 — 08:45', color: '#ef4444' },
  { id: '5-B', label: '5-B', time: '08:50 — 09:35', color: '#f97316' },
  { id: '5-D', label: '5-D', time: '09:40 — 10:25', color: '#f59e0b' },
  { id: '6-A', label: '6-A', time: '10:30 — 11:15', color: '#4ade80' },
  { id: '6-B', label: '6-B', time: '11:20 — 12:05', color: '#2dd4bf' },
  { id: '6-D', label: '6-D', time: '12:10 — 12:55', color: '#60a5fa' },
  { id: '7-A', label: '7-A', time: '13:00 — 13:45', color: '#818cf8' },
  { id: '7-B', label: '7-B', time: '14:00 — 14:45', color: '#c084fc' },
  { id: '7-D', label: '7-D', time: '15:30 — 16:15', color: '#f472b6' },
  { id: '8-A', label: '8-A', time: '16:20 — 17:05', color: '#f87171' },
  { id: '8-B', label: '8-B', time: '17:10 — 17:55', color: '#fb923c' },
  { id: '9-A', label: '9-A', time: '08:00 — 08:45', color: '#fbbf24' },
  { id: '9-B', label: '9-B', time: '08:50 — 09:35', color: '#4ade80' },
];

const ASSIGNMENTS_7D = [
  { id: 'a1', title: 'Home row', type: 'Test', max: 100, color: '#4ADE80' },
  { id: 'a2', title: 'BSB', type: 'Test', max: 25, color: '#FBBF24' },
  { id: 'a3', title: 'Home row', type: 'Test', max: 100, color: '#4ADE80' },
  { id: 'a4', title: 'Test', type: 'Kahoot!', max: 10, color: '#4ADE80' },
];

const STUDENTS_7D = [
  { id: '1', name: 'Abdulhamid Malikov', initials: 'AM', color: '#f472b6', scores: [90, 24, 88, 10] },
  { id: '2', name: 'Abror Joʻrayev', initials: 'AJ', color: '#f472b6', scores: [100, 22, 94, 9] },
  { id: '3', name: 'Charos Abdusalomova', initials: 'CA', color: '#f472b6', scores: [100, 23, 82, 8] },
  { id: '4', name: 'Elyor Alisherov', initials: 'EA', color: '#f472b6', scores: [70, 22, 76, 7] },
  { id: '5', name: 'Farrux Boynazarov', initials: 'FB', color: '#f472b6', scores: [100, 23, 100, 6] },
  { id: '6', name: 'Jonibek Abdujalilov', initials: 'JA', color: '#f472b6', scores: [90, 20, 88, 5] },
  { id: '7', name: 'Manzura Ergasheva', initials: 'ME', color: '#f472b6', scores: [100, 23, 0, 4] },
  { id: '8', name: 'Mohinur Abdurasulova', initials: 'MA', color: '#f472b6', scores: [90, 22, 76, 3] },
  { id: '9', name: "Mohinur Jo'rayeva", initials: 'MJ', color: '#f472b6', scores: [100, 23, 0, 2] },
  { id: '10', name: 'Muborak Abdushukurova', initials: 'MA', color: '#f472b6', scores: [100, 23, 88, 1] },
];

const getGradeStyle = (score: number | null, max: number | null) => {
  if (score === null || max === null || max === 0) return { grade: '—', text: 'var(--muted-foreground)', bg: 'rgba(0,0,0,0)', tailwindBg: 'bg-muted/20' };
  const p = (score / max) * 100;
  if (p >= 90) return { grade: 'A', text: '#22c55e', bg: 'rgba(34, 197, 94, 0.082)', pureHex: '#22c55e', tailwindBg: 'bg-emerald-50 dark:bg-emerald-900/20' }; 
  if (p >= 80) return { grade: 'B', text: '#84cc16', bg: 'rgba(132, 204, 22, 0.082)', pureHex: '#84cc16', tailwindBg: 'bg-green-50 dark:bg-green-900/20' };   
  if (p >= 70) return { grade: 'C', text: '#eab308', bg: 'rgba(234, 179, 8, 0.082)', pureHex: '#eab308', tailwindBg: 'bg-yellow-50 dark:bg-yellow-900/20' };  
  if (p >= 60) return { grade: 'D', text: '#f97316', bg: 'rgba(249, 115, 22, 0.082)', pureHex: '#f97316', tailwindBg: 'bg-orange-50 dark:bg-orange-900/20' }; 
  return { grade: 'F', text: '#ef4444', bg: 'rgba(239, 68, 68, 0.082)', pureHex: '#ef4444', tailwindBg: 'bg-red-50 dark:bg-red-900/20' }; 
};

export default function Grading() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState<string | null>('7-D');
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState<boolean>(false);
  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [showTopicListModal, setShowTopicListModal] = useState<boolean>(false);

  // New assignment modal states
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentType, setNewAssignmentType] = useState<'standard' | 'paper'>('standard');

  // Render variables
  const assignments = selectedClassId === '7-D' ? ASSIGNMENTS_7D : [];
  const students = selectedClassId === '7-D' ? STUDENTS_7D : [];

  return (
    <div className="flex-1 min-w-0 flex flex-col p-8 lg:px-12">
      <div className="flex flex-col h-full gap-4">
        <div className="flex-1 min-h-0 grid p-3 -m-3" style={{ gridTemplateColumns: selectedClassId ? 'calc(25% + 0.25rem) calc(50% + 0.5rem) calc(25% - 0.75rem)' : 'calc(33.3% + 0.25rem) calc(66.7% - 0.25rem) 0', gridTemplateRows: '1fr', transition: 'grid-template-columns 350ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
          
          {/* Column 1: Classes */}
          <div className="min-w-0 min-h-0 pr-4">
            <div className="h-full grid">
              <div className="bg-card rounded-xl card-elevation flex flex-col overflow-hidden min-w-0 min-h-0 h-full">
                <div className="px-5 pt-5 pb-3 flex items-center justify-between shrink-0 gap-3 min-h-[4.5rem]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-muted">
                      <GraduationCap className="w-5 h-5 text-foreground" />
                    </div>
                    <h2 className="heading-section">Barcha sinflar</h2>
                  </div>
                  <button className="w-11 h-11 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <Plus className="w-5 h-5"/>
                  </button>
                </div>
                
                <div className="flex-1 min-h-0 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none"></div>
                  <div className="overflow-y-auto h-full custom-scrollbar">
                    <div className="px-5 pt-1 pb-5 space-y-1">
                      {CLASSES.map(cls => (
                        <button
                          key={cls.id}
                          onClick={() => setSelectedClassId(cls.id)}
                          className={
                            selectedClassId === cls.id 
                              ? "w-full flex items-center text-left gap-3 p-4 border-2 rounded-xl cursor-pointer animate-spring-bounce data-[state=open]:ring-2 data-[state=open]:ring-inset data-[state=open]:ring-primary/40" 
                              : "group w-full flex items-center text-left gap-2.5 px-3 py-2 border-2 border-transparent rounded-lg cursor-pointer transition-transform duration-200 ease-out hover:translate-x-1.5"
                          }
                          style={selectedClassId === cls.id ? { borderColor: cls.color, backgroundColor: `${cls.color}10` } : undefined}
                        >
                          {selectedClassId === cls.id ? (
                             <>
                               <div className="p-3.5 rounded-xl shrink-0" style={{ backgroundColor: `${cls.color}20` }}>
                                 <GraduationCap className="w-7 h-7" style={{ color: cls.color }} />
                               </div>
                               <div className="flex-1 min-w-0">
                                 <span className="heading-small leading-tight truncate block">{cls.label}</span>
                                 <span className="text-xs text-muted-foreground/60 mt-0.5 block truncate">{cls.time}</span>
                               </div>
                             </>
                          ) : (
                             <>
                               <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cls.color }}></div>
                               <span className="text-sm text-foreground/70 truncate flex-1 transition-all duration-200 ease-out group-hover:text-foreground group-hover:font-semibold">{cls.label}</span>
                             </>
                          )}
                        </button>
                      ))}
                      <button className="group w-full flex items-center text-left gap-2.5 px-3 py-2 border-2 border-transparent rounded-lg cursor-pointer transition-transform duration-200 ease-out hover:translate-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-muted-foreground/30"></div>
                        <span className="text-sm text-foreground/70 truncate flex-1 transition-all duration-200 ease-out group-hover:text-foreground group-hover:font-semibold">Sinf yo'q</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {selectedClassId && (
                  <div className="group/stats border-t border-border px-5 py-5 space-y-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="relative group/icon p-3.5 rounded-xl shrink-0 block overflow-hidden cursor-pointer" style={{ backgroundColor: `${CLASSES.find(c => c.id === selectedClassId)?.color}20` }}>
                        <span className="absolute inset-0 rounded-xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200" style={{ backgroundColor: CLASSES.find(c => c.id === selectedClassId)?.color }}></span>
                        <GraduationCap className="relative w-7 h-7 transition-opacity duration-200 group-hover/icon:opacity-0" style={{ color: CLASSES.find(c => c.id === selectedClassId)?.color }} />
                        <ArrowUpRight className="w-7 h-7 absolute inset-0 m-auto opacity-0 transition-opacity duration-200 group-hover/icon:opacity-100 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="heading-small leading-tight truncate">{selectedClassId}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1 leading-relaxed">
                          {CLASSES.find(c => c.id === selectedClassId)?.time}
                        </p>
                      </div>
                    </div>
                    <div className="gap-2 text-center grid grid-cols-2">
                       <div className="p-2 rounded-lg" style={{ backgroundColor: `${CLASSES.find(c => c.id === selectedClassId)?.color}15` }}>
                          <p className="text-lg font-bold">{students.length || 0}</p>
                          <p className="text-[10px] text-muted-foreground">O'quvchilar</p>
                       </div>
                       <div className="p-2 rounded-lg" style={{ backgroundColor: `${CLASSES.find(c => c.id === selectedClassId)?.color}15` }}>
                          <p className="text-lg font-bold">{assignments.length || 0}</p>
                          <p className="text-[10px] text-muted-foreground">Topshiriqlar</p>
                       </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs items-center">
                        <span className="text-muted-foreground">Sinf o'rtachasi</span>
                        <span className="font-medium">83%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: '83%', backgroundColor: CLASSES.find(c => c.id === selectedClassId)?.color }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Dashboard/Grid */}
          <div className="min-w-0 min-h-0 grid pr-4">
            <div className="bg-card rounded-xl card-elevation flex flex-col overflow-hidden min-w-0 min-h-0 h-full">
              {!selectedClassId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground h-full">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm mb-6">
                    <ClipboardList className="w-8 h-8 opacity-50" />
                  </div>
                  <h2 className="heading-section mb-2">No Class Selected</h2>
                  <p className="text-sm font-medium text-muted-foreground max-w-[250px] text-center">
                    Choose a class from the sidebar to view and manage grades
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0 gap-3 border-b border-border min-h-[4.5rem]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-muted">
                        <ClipboardList className="w-5 h-5 text-foreground" />
                      </div>
                      <h2 className="heading-section">
                        Topshiriqlar
                      </h2>
                      <span className="text-sm text-muted-foreground">({assignments.length})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="w-11 h-11 rounded-xl border border-border bg-card card-elevation text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"><Search className="w-5 h-5" /></button>
                      <button className="w-11 h-11 rounded-xl border border-border bg-card card-elevation text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"><Filter className="w-5 h-5" /></button>
                      <button className="w-11 h-11 rounded-xl border border-border bg-card card-elevation text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"><EyeOff className="w-5 h-5"/></button>
                      <button className="w-11 h-11 rounded-xl border border-border bg-card card-elevation text-primary hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"><PanelRightClose className="w-5 h-5"/></button>
                      
                      <button onClick={() => setShowCreateAssignmentModal(true)} className="h-11 px-6 flex items-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/10 hidden xl:inline-flex">
                        <Plus className="w-4 h-4 ml-[-4px]" /> Yangi topshiriq
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-h-0 overflow-auto custom-scrollbar relative">
                    <table className="border-separate border-spacing-0 w-full text-left">
                      <thead className="bg-muted sticky top-0 z-30">
                          <tr>
                            <th className="sticky left-0 z-40 border-b border-r border-border p-4 w-[250px] bg-background"></th>
                            <th className="sticky left-[250px] z-40 bg-muted border-b border-r border-border p-0 w-16 min-w-16 h-36">
                              <div className="h-full flex flex-col items-center justify-end p-2 pb-0">
                                <div className="writing-vertical transform rotate-180 font-semibold text-xs text-foreground whitespace-nowrap flex-1 flex items-center justify-start">Total</div>
                                <button className="flex items-center justify-center gap-0.5 py-1 w-full mb-1">
                                  <ChevronUp className="w-3 h-3 text-muted-foreground/40"/>
                                  <ChevronDown className="w-3 h-3 text-muted-foreground/40"/>
                                </button>
                              </div>
                            </th>
                            {assignments.map((assignment, i) => (
                              <th key={i} className="border-b border-r border-border p-0 w-16 min-w-16 h-36 text-center align-bottom" style={{ backgroundColor: `color-mix(in srgb, ${assignment.color} 8%, var(--card))` }}>
                                <div className="h-full flex flex-col items-center justify-end p-2 pb-0 cursor-pointer relative">
                                  <div className="writing-vertical transform rotate-180 font-semibold text-xs whitespace-nowrap flex-1 flex items-center justify-start">{assignment.title}</div>
                                  <button className="flex items-center justify-center gap-0.5 py-1 w-full mb-1">
                                    <ChevronUp className="w-3 h-3 text-muted-foreground/40"/>
                                    <ChevronDown className="w-3 h-3 text-muted-foreground/40"/>
                                  </button>
                                  <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t" style={{ backgroundColor: assignment.color }}></div>
                                </div>
                              </th>
                            ))}
                            <th className="border-b border-r border-border p-0 w-16 min-w-16 h-36 bg-card text-center align-bottom">
                              <button onClick={() => setShowCreateAssignmentModal(true)} className="h-full w-full flex flex-col items-center justify-center gap-2 hover:bg-muted group transition-colors">
                                <Plus className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider transition-colors group-hover:text-foreground">ADD</span>
                              </button>
                            </th>
                            <th className="border-b border-border p-0 h-36 bg-background shrink"></th>
                          </tr>
                      </thead>
                      <tbody className="bg-card text-sm">
                        <tr className="bg-muted sticky top-[144px] z-20">
                          <td className="sticky left-0 z-30 bg-muted border-b border-r border-border p-4 w-[250px] min-w-[250px] max-w-[250px] h-16">
                            <button className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                              <span className="text-xs uppercase font-medium tracking-wider text-muted-foreground">Student Name</span>
                              <div className="flex flex-col -space-y-1">
                                <ChevronUp className="w-3 h-3 text-foreground" />
                                <ChevronDown className="w-3 h-3 text-muted-foreground/40" />
                              </div>
                            </button>
                          </td>
                          <td className="sticky left-[250px] z-30 bg-muted border-b border-r border-border p-0 w-16 min-w-16 h-16 text-center">
                            <div className="h-full w-full flex flex-col items-center justify-center gap-0.5 p-1" style={{ backgroundColor: 'rgba(132, 204, 22, 0.082)' }}>
                              <span className="text-base font-bold" style={{ color: '#84cc16' }}>B</span>
                              <span className="text-[10px] text-muted-foreground">89.0%</span>
                            </div>
                          </td>
                          {assignments.map((assignment, i) => {
                             // average logic (mock)
                             const averages = [90.6, 90.5, 74.4, 55.0];
                             const grades = ['A', 'A', 'C', 'F'];
                             const colors = ['#22c55e', '#22c55e', '#eab308', '#ef4444'];
                             const bg = ['rgba(34,197,94,0.082)', 'rgba(34,197,94,0.082)', 'rgba(234,179,8,0.082)', 'rgba(239,68,68,0.082)'];
                             return (
                               <td key={i} className="bg-muted border-b border-r border-border p-0 w-16 min-w-16 h-16 text-center">
                                 <div className="h-full w-full flex flex-col items-center justify-center gap-0.5 p-1" style={{ backgroundColor: bg[i%4] }}>
                                   <span className="text-base font-bold" style={{ color: colors[i%4] }}>{grades[i%4]}</span>
                                   <span className="text-[10px] text-muted-foreground">{averages[i%4]}%</span>
                                 </div>
                               </td>
                             )
                          })}
                          <td className="bg-muted border-b border-r border-border p-0 w-16 min-w-16 h-16 bg-muted/20"></td>
                          <td className="bg-muted border-b border-border p-0 h-16 bg-muted/20"></td>
                        </tr>

                        {students.map((student: any) => {
                          const totalPercentage = student.scores.reduce((a:number,b:number)=>a+b, 0) / assignments.reduce((a:any,b:any)=>a+b.max, 0) * 100;
                          const tStyle = getGradeStyle(totalPercentage, 100);

                          return (
                          <tr key={student.id} className="group hover:bg-muted/30 transition-colors h-16">
                            <td className="sticky left-0 z-10 bg-card group-hover:bg-muted border-b border-r border-border p-3 w-[250px]">
                              <div className="flex items-center gap-3">
                                <a className="relative group/avatar rounded-full block shrink-0">
                                  <div className="rounded-full flex items-center justify-center font-semibold text-white shrink-0 overflow-hidden w-7 h-7 text-xs" style={{ backgroundColor: student.color }}>{student.initials}</div>
                                  <span className="absolute inset-0 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 flex items-center justify-center" style={{ backgroundColor: student.color }}>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                                  </span>
                                </a>
                                <div className="flex flex-col overflow-hidden">
                                  <span className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{student.name}</span>
                                </div>
                              </div>
                            </td>

                            <td className="sticky left-[250px] z-10 bg-card group-hover:bg-muted border-b border-r border-border p-0 w-16 min-w-16 h-16 text-center">
                              <div className="h-full w-full flex flex-col items-center justify-center gap-0.5 p-1" style={{ backgroundColor: tStyle.bg }}>
                                <span className="text-base font-bold" style={{ color: tStyle.text }}>{tStyle.grade}</span>
                                <span className="text-[10px] text-muted-foreground">{totalPercentage.toFixed(1)}%</span>
                              </div>
                            </td>
                            {assignments.map((assignment:any, i:number) => {
                               const score = student.scores[i];
                               const sStyle = getGradeStyle(score, assignment.max);
                               return (
                                <td key={i} className="border-b border-r border-border p-0 w-16 min-w-16 h-16 text-center">
                                  <div className={`relative w-full h-full flex items-center justify-center cursor-pointer transition-all hover:ring-2 hover:ring-inset hover:ring-primary/30 rounded-md ${sStyle.tailwindBg}`}>
                                    <div className="flex flex-col items-center justify-center leading-tight">
                                      <span className="text-sm font-bold">{score}</span>
                                    </div>
                                    <span className="absolute bottom-0.5 right-1 text-[9px] text-muted-foreground">/{assignment.max}</span>
                                  </div>
                                </td>
                               );
                            })}
                            <td className="border-b border-r border-border p-0 w-16 min-w-16 h-16 bg-muted/20 text-center align-middle transition-colors">
                            </td>
                            <td className="border-b border-border p-0 h-16 bg-muted/20 transition-colors"></td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Column 3: Topics */}
          {selectedClassId && (
            <div className="min-w-0 min-h-0 grid transition-all animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-card rounded-xl card-elevation flex flex-col overflow-hidden min-w-0 min-h-0 h-full">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 gap-3 min-h-[5rem]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-muted text-foreground"><Tag className="w-5 h-5" /></div>
                    <h2 className="heading-section">Baho mavzulari</h2>
                  </div>
                  <div className="flex gap-1.5 text-muted-foreground">
                    <button onClick={() => setShowTopicListModal(true)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"><ListPlus className="w-4 h-4" /></button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"><Link2 className="w-4 h-4" /></button>
                    <button onClick={() => setShowTopicModal(true)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <div className="relative overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                  <div className="px-6 py-6 space-y-6">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative w-36 h-36 shrink-0 mt-2">
                         <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-sm">
                           <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--muted)" strokeWidth="12" />
                           <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="0" strokeLinecap="round" className="transition-all duration-1000" />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-500 bg-card rounded-full m-[18px]">
                           <Check className="w-8 h-8" strokeWidth={3} />
                         </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                         <div className="text-[36px] font-black leading-none mb-1 text-foreground">100%</div>
                         <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Mavzu og'irliklari</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-6">
                      <button className="w-full flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer bg-card card-elevation border border-border hover:border-amber-400 group relative">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400 rounded-l-xl" />
                         <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-[14px] shrink-0 border" style={{ backgroundColor: 'rgba(251, 191, 36, 0.063)', borderColor: 'rgb(251,191,36)', color: 'rgb(251,191,36)' }}>
                           50%
                         </div>
                         <div className="flex-1 text-left">
                           <span className="text-[15px] font-bold text-foreground">BSB (25)</span>
                         </div>
                      </button>
                      
                      <button className="w-full flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer bg-card card-elevation border border-border hover:border-blue-500 group relative">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-xl" />
                         <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50 text-blue-600 font-black text-[14px] shrink-0 border border-blue-100">
                           40%
                         </div>
                         <div className="flex-1 text-left">
                           <span className="text-[15px] font-bold text-foreground">CHSB</span>
                         </div>
                      </button>

                      <button className="w-full flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer bg-card card-elevation border border-border hover:border-emerald-500 group relative">
                         <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-xl" />
                         <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-50 text-emerald-600 font-black text-[14px] shrink-0 border border-emerald-100 text-center leading-none">
                           10%
                         </div>
                         <div className="flex-1 text-left">
                           <span className="text-[15px] font-bold text-foreground">Formativ baholash</span>
                         </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-[540px] rounded-2xl shadow-2xl flex flex-col border border-border animate-in zoom-in-95 duration-300 max-h-[90vh]">
            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-border flex items-start justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold text-foreground">Topshiriq yaratish</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Baholash uchun yangi topshiriq yarating.</p>
              </div>
              <button onClick={() => setShowCreateAssignmentModal(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted ml-4 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
              {/* Sarlavha */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Sarlavha <span className="text-destructive">*</span></label>
                <div className="bg-background border border-input rounded-lg px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition-all">
                  <input 
                    className="bg-transparent outline-none text-sm text-foreground w-full placeholder:text-muted-foreground" 
                    placeholder="masalan, 5-bob testi" 
                    autoFocus 
                    value={newAssignmentTitle}
                    onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  />
                </div>
              </div>

              {/* Sinf tanlang */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Sinf tanlang</label>
                <div className="bg-background border border-input rounded-lg px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:border-ring/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <span className="text-sm text-foreground">7-D</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              {/* Mavzu + Ballar */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Mavzu</label>
                  <div className="bg-background border border-input rounded-lg px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:border-ring/50 transition-colors">
                    <span className="text-sm text-muted-foreground">Mavzu yo'q</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground">Ballar</label>
                  <div className="bg-background border border-input rounded-lg px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition-all">
                    <input type="number" defaultValue="100" className="bg-transparent outline-none text-sm text-foreground w-full" />
                  </div>
                </div>
              </div>

              {/* Topshirish sanasi */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Topshirish sanasi</label>
                <div className="bg-background border border-input rounded-lg px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:border-ring/50 transition-colors">
                  <input type="date" className="bg-transparent outline-none text-sm text-foreground w-full" defaultValue="2026-04-02" />
                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
                </div>
              </div>

              {/* Topshiriq turi */}
              <div className="space-y-2.5 pt-1">
                <label className="text-sm font-semibold text-foreground">Topshiriq turi</label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Oddiy — active */}
                  <button 
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group ${
                      newAssignmentType === 'standard' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/50'
                    }`} 
                    onClick={() => setNewAssignmentType('standard')}
                    type="button"
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${newAssignmentType === 'standard' ? 'bg-primary/10' : 'bg-muted'}`}>
                      <FileText className={`w-4 h-4 ${newAssignmentType === 'standard' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <span className="text-[13px] font-semibold text-foreground leading-tight">Oddiy topshiriq</span>
                  </button>

                  {/* Qog'oz — active/clickable */}
                  <button 
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group ${
                      newAssignmentType === 'paper' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/50'
                    }`} 
                    onClick={() => setNewAssignmentType('paper')}
                    type="button"
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${newAssignmentType === 'paper' ? 'bg-primary/10' : 'bg-muted'}`}>
                      <ClipboardList className={`w-4 h-4 ${newAssignmentType === 'paper' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <span className="text-[13px] font-semibold text-foreground leading-tight">Qog'oz format</span>
                  </button>

                  {/* Jonli baho — coming soon */}
                  <button className="flex items-center justify-between gap-2 p-3 rounded-xl border border-border text-left bg-muted/30 cursor-not-allowed" type="button" disabled>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted shrink-0">
                        <Monitor className="w-4 h-4 text-muted-foreground/60" />
                      </div>
                      <span className="text-[13px] font-semibold text-muted-foreground/70 leading-tight">Jonli baho</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500 uppercase tracking-wide shrink-0">Tez kunda</span>
                  </button>

                  {/* Voice grading — coming soon */}
                  <button className="flex items-center justify-between gap-2 p-3 rounded-xl border border-border text-left bg-muted/30 cursor-not-allowed" type="button" disabled>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted shrink-0">
                        <Mic className="w-4 h-4 text-muted-foreground/60" />
                      </div>
                      <span className="text-[13px] font-semibold text-muted-foreground/70 leading-tight">Voice grading</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500 uppercase tracking-wide shrink-0">Tez kunda</span>
                  </button>

                  {/* Telegram quiz — coming soon, full width */}
                  <button className="col-span-2 flex items-center justify-between gap-2 p-3 rounded-xl border border-border text-left bg-muted/30 cursor-not-allowed" type="button" disabled>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted shrink-0">
                        <Send className="w-4 h-4 text-muted-foreground/60" />
                      </div>
                      <span className="text-[13px] font-semibold text-muted-foreground/70 leading-tight">Telegram quiz</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500 uppercase tracking-wide shrink-0">Tez kunda</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border bg-muted/20 shrink-0 rounded-b-2xl">
              <button
                onClick={() => setShowCreateAssignmentModal(false)}
                className="px-4 py-2.5 text-sm font-medium text-foreground bg-background hover:bg-muted border border-border rounded-lg transition-colors"
              >
                Bekor qilish
              </button>
              <button 
                onClick={() => {
                  if (newAssignmentType === 'paper') {
                    const id = Math.random().toString(36).substring(7);
                    navigate(`/grading/paper-exam/${id}?classId=${selectedClassId || '7-D'}&title=${encodeURIComponent(newAssignmentTitle || 'Yangi test')}`);
                    setShowCreateAssignmentModal(false);
                  } else {
                    // Standard logic (existing mockup)
                    setShowCreateAssignmentModal(false);
                  }
                  // Reset states
                  setNewAssignmentTitle('');
                  setNewAssignmentType('standard');
                }}
                className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Topshiriq yaratish
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--muted); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--muted-foreground); }
        
        .writing-vertical {
          writing-mode: vertical-rl;
        }
      `}</style>
    </div>
  );
}
