import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap, Search, Plus, ClipboardList, Tag,
  Filter, EyeOff, Maximize2, FileText, Check, Link2, ListPlus, ChevronDown, Calendar, X, Edit2, Trash2
} from 'lucide-react';
import VoiceGrading from '../components/grading/VoiceGrading';
import type { Student } from '../types/database';

const CLASSES = [
  { id: '6-D', label: '6-D', time: '13:00 - 13:45', color: 'bg-blue-100', textColor: 'text-blue-500', dot: 'bg-blue-500', students: [{i:'AA'}] },
  { id: '7-A', label: '7-A', time: '13:00 - 13:45', color: 'bg-indigo-100', textColor: 'text-indigo-500', dot: 'bg-indigo-500', students: [{i:'AA'}] },
  { id: '7-B', label: '7-B', time: '12:15 - 13:00', color: 'bg-purple-100', textColor: 'text-purple-500', dot: 'bg-purple-500', students: [{i:'BA'}] },
  { id: '7-D', label: '7-D', time: '12:15 - 13:00', color: 'bg-fuchsia-100', textColor: 'text-fuchsia-500', dot: 'bg-fuchsia-500', students: [{i:'BA'}] },
  { id: '8-A', label: '8-A', time: '12:15 - 13:00', color: 'bg-rose-100', textColor: 'text-rose-500', dot: 'bg-rose-500', students: [{i:'BA'}] },
  { id: '8-B', label: '8-B', time: '12:15 - 13:00', color: 'bg-orange-100', textColor: 'text-orange-500', dot: 'bg-orange-500', students: [{i:'BA'}] },
  { id: '9-A', label: '9-A', time: '12:15 - 13:00', color: 'bg-amber-100', textColor: 'text-amber-500', dot: 'bg-amber-500', students: [{i:'AP'}, {i:'DE'}, {i:'DA'}] },
  { id: '9-B', label: '9-B', time: '12:15 - 13:00', color: 'bg-emerald-100', textColor: 'text-emerald-500', dot: 'bg-emerald-500', students: [{i:'BA'}] },
];

const STUDENTS_9A = [
  { id: '1', name: 'Asadbek Panjiyev', initials: 'AP', total: { grade: 'A', score: '100.0%', color: 'text-emerald-500', bg: 'bg-emerald-50/50' }, assign: { score: '10', total: '/10' } },
  { id: '2', name: 'Davron Eshbo\'riyev', initials: 'DE', total: { grade: 'A', score: '90.0%', color: 'text-emerald-500', bg: 'bg-emerald-50/50' }, assign: { score: '9', total: '/10' } },
  { id: '3', name: 'Dilafruz Abdumurodova', initials: 'DA', total: { grade: 'B', score: '80.0%', color: 'text-emerald-500', bg: 'bg-emerald-50/50' }, assign: { score: '8', total: '/10' } },
  { id: '4', name: 'Dilora Karimova', initials: 'DK', total: { grade: 'C', score: '70.0%', color: 'text-amber-500', bg: 'bg-amber-50/50' }, assign: { score: '7', total: '/10' } },
  { id: '5', name: 'Dilshodbek Jovliyev', initials: 'DJ', total: { grade: 'D', score: '60.0%', color: 'text-orange-500', bg: 'bg-orange-50/50' }, assign: { score: '6', total: '/10' } },
  { id: '6', name: 'Elnur Avduvaitov', initials: 'EA', total: { grade: 'F', score: '50.0%', color: 'text-rose-500', bg: 'bg-rose-50' }, assign: { score: '5', total: '/10' } },
  { id: '7', name: 'Nafisa Jo\'rayeva', initials: 'NJ', total: { grade: 'F', score: '10.0%', color: 'text-rose-500', bg: 'bg-rose-50' }, assign: { score: '1', total: '/10' } },
  { id: '8', name: 'O\'rol Karimov', initials: 'OK', total: { grade: 'F', score: '0.0%', color: 'text-rose-500', bg: 'bg-rose-50' }, assign: { score: '0', total: '/10' } },
  { id: '9', name: 'Saida Baxtiyorova', initials: 'SB', total: { grade: '—', score: '', color: 'text-slate-400', bg: '' }, assign: { score: '0', isEditing: true } },
  { id: '10', name: 'Samandar Muhamaddiyev', initials: 'SM', total: { grade: '—', score: '', color: 'text-slate-400', bg: '' }, assign: { score: '—' } },
  { id: '11', name: 'Sardor Pardayev', initials: 'SP', total: { grade: '—', score: '', color: 'text-slate-400', bg: '' }, assign: { score: '—' } },
  { id: '12', name: 'Sevinch Eshonqulova', initials: 'SE', total: { grade: '—', score: '', color: 'text-slate-400', bg: '' }, assign: { score: '—' } },
  { id: '13', name: 'Sokina Allayorova', initials: 'SA', total: { grade: '—', score: '', color: 'text-slate-400', bg: '' }, assign: { score: '—' } },
];

const STUDENTS_9B = [
  { id: '1', name: 'Namoz Abdumo\'minov', initials: 'NA' },
  { id: '2', name: 'O\'g\'iloy Abdumurotova', initials: 'OA' },
  { id: '3', name: 'Otabek Mahmudov', initials: 'OM' },
  { id: '4', name: 'Rayhona Abdusalomova', initials: 'RA' },
  { id: '5', name: 'Rayxona Eshmirzayeva', initials: 'RE' },
  { id: '6', name: 'Sabrina Abrayeva', initials: 'SA' },
  { id: '7', name: 'Shahnoza Anorboyeva', initials: 'SA' },
];

const STUDENTS_5A = [
  { id: '1', name: 'Alibek Safarov', initials: 'AS' },
  { id: '2', name: 'Dinora Jo\'rayeva', initials: 'DJ' },
  { id: '3', name: 'Diyora Eshmirzayeva', initials: 'DE' },
  { id: '4', name: 'Doston Anorboyev', initials: 'DA' },
  { id: '5', name: 'Elyor Jovliyev', initials: 'EJ' },
  { id: '6', name: 'Farida Safarova', initials: 'FS' },
  { id: '7', name: 'Halima Jumanazarova', initials: 'HJ' },
];

// Mock o'quvchilarni Student tipiga aylantirish
function toStudents(list: { id: string; name: string; initials: string }[]): Student[] {
  return list.map(s => {
    const parts = s.name.split(' ')
    return {
      id: s.id,
      school_id: '',
      class_id: '',
      profile_id: null,
      first_name: parts[0] || '',
      last_name: parts.slice(1).join(' ') || '',
      journal_number: null,
      birth_date: null,
      gender: null,
      photo_url: null,
      status: 'active' as const,
      tags: [],
      created_at: '',
      updated_at: '',
    } as Student
  })
}

function getStudentsForClass(classId: string | null): Student[] {
  if (classId === '9-A') return toStudents(STUDENTS_9A)
  if (classId === '9-B') return toStudents(STUDENTS_9B)
  return toStudents(STUDENTS_5A)
}

interface LocalAssignment {
  id: string;
  title: string;
  classId: string;
  topic: string;
  points: number;
  dueDate: string;
}

export default function Grading() {
  const { t } = useTranslation();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState<boolean>(false);
  const [showTopicModal, setShowTopicModal] = useState<boolean>(false);
  const [showTopicListModal, setShowTopicListModal] = useState<boolean>(false);

  // Yangi topshiriq form holati
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentPoints, setNewAssignmentPoints] = useState(100);
  const [newAssignmentDueDate, setNewAssignmentDueDate] = useState('2026-04-10');
  const [localAssignments, setLocalAssignments] = useState<LocalAssignment[]>([]);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);

  function handleCreateAssignment() {
    if (!newAssignmentTitle.trim() || !selectedClassId) return;
    const newAssignment: LocalAssignment = {
      id: Date.now().toString(),
      title: newAssignmentTitle.trim(),
      classId: selectedClassId,
      topic: '',
      points: newAssignmentPoints,
      dueDate: newAssignmentDueDate,
    };
    setLocalAssignments(prev => [...prev, newAssignment]);
    setNewAssignmentTitle('');
    setNewAssignmentPoints(100);
    setNewAssignmentDueDate('2026-04-10');
    setAssignmentSuccess(true);
    setTimeout(() => {
      setAssignmentSuccess(false);
      setShowCreateAssignmentModal(false);
    }, 1200);
  }

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      {/* ─── Column 1: All Classes ─── */}
      <div className={`flex flex-col shrink-0 bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar transition-all duration-300 ${selectedClassId ? 'w-[320px]' : 'w-[420px]'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h1 className="text-[20px] font-black text-slate-800 tracking-tight">{t('grading.allClasses')}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="h-10 px-4 bg-slate-900 text-white text-[13px] font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg">
                <Plus className="w-4 h-4" strokeWidth={3} /> {t('grading.newClass')}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {CLASSES.map((cls) => {
              const isSelected = selectedClassId === cls.id;
              
              if (selectedClassId && !isSelected) {
                // Compact format when another class is selected
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

              // Expanded format (default or when selected)
              return (
                <div 
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`border rounded-[24px] cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? `border-${cls.textColor.split('-')[1]}-200 bg-${cls.textColor.split('-')[1]}-50/50 shadow-sm ring-4 ring-${cls.textColor.split('-')[1]}-50` 
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm p-6'
                  }`}
                >
                  <div className={`${isSelected ? 'p-6 pb-5 border-b border-dashed border-rose-200' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cls.color} ${cls.textColor}`}>
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-[18px] font-black text-slate-800 mb-1">{cls.label}</h3>
                          <p className="text-[13px] font-bold text-slate-400">{cls.time}</p>
                        </div>
                      </div>
                      
                      {!isSelected && (
                        <div className="flex items-center -space-x-2">
                          {cls.students.map((student, i) => (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white bg-${cls.dot.split('-')[1]}-400`}>
                              {student.i}
                            </div>
                          ))}
                          <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-black text-white bg-${cls.dot.split('-')[1]}-300`}>
                            +10
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-6 pt-5 flex items-center justify-between">
                      <div className="text-center flex-1">
                        <p className="text-[18px] font-black text-slate-800">{cls.id === '9-A' ? '17' : cls.id === '9-B' ? '14' : '13'}</p>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{t('grading.students')}</p>
                      </div>
                      <div className={`w-px h-10 ${cls.id === '9-A' ? 'bg-amber-200' : cls.id === '9-B' ? 'bg-emerald-200' : 'bg-slate-200'}`} />
                      <div className="text-center flex-1">
                        <p className="text-[18px] font-black text-slate-800">{(cls.id === '9-A' || cls.id === '9-B') ? '1' : '0'}</p>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{t('grading.assignments')}</p>
                      </div>
                      <div className="w-full mt-4 absolute left-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-6">
                          <span>{t('grading.classAverage')}</span>
                          <span>0%</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-b-[24px] overflow-hidden">
                          <div className="w-0 h-full bg-amber-400" />
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

      {/* ─── Column 2: Data Grid / Empty State ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        {!selectedClassId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-6">
              <ClipboardList className="w-8 h-8 opacity-50" />
            </div>
            <h2 className="text-[18px] font-black text-slate-800 mb-2">{t('grading.noClassSelected')}</h2>
            <p className="text-[14px] font-medium text-slate-500 max-w-[250px] text-center">
              {t('grading.noClassSelectedDesc')}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-8 overflow-hidden">
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-700">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h1 className="text-[20px] font-black text-slate-800 tracking-tight">
                    {t('grading.assignments')} <span className="text-slate-400 text-[16px] font-medium ml-1">({((selectedClassId === '9-A' || selectedClassId === '9-B') ? 1 : 0) + localAssignments.filter(a => a.classId === selectedClassId).length})</span>
                  </h1>
                </div>

                <div className="flex gap-3">
                  <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                    <Filter className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                    <EyeOff className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  {selectedClassId && (
                    <VoiceGrading
                      classId={selectedClassId}
                      subjectId=""
                      students={getStudentsForClass(selectedClassId)}
                      gradeType="formative"
                      onGradeAdded={() => {}}
                    />
                  )}
                  <button
                    onClick={() => setShowCreateAssignmentModal(true)}
                    className="h-10 px-5 flex items-center gap-2 rounded-[14px] bg-slate-900 text-white text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    <Plus className="w-4 h-4" strokeWidth={3} /> {t('grading.newAssignment')}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto custom-scrollbar relative">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[200px] border-r border-slate-100">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                          {t('grading.studentName')} <span className="text-[8px]">▼</span>
                        </div>
                      </th>
                      <th className="w-24 px-4 py-4 text-center border-r border-slate-100 bg-slate-50/50">
                        <div className="flex flex-col items-center">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest writing-vertical-rl rotate-180 mb-2">{t('grading.total')}</span>
                          <span className="text-[10px]">▼</span>
                        </div>
                      </th>
                      {(selectedClassId === '9-A' || selectedClassId === '9-B') && (
                        <th className="w-24 px-4 py-4 text-center border-r border-slate-100 bg-blue-50/50 border-t-[3px] border-t-blue-500">
                          <div className="flex flex-col items-center text-slate-600">
                            <span className="text-[11px] font-black uppercase tracking-widest writing-vertical-rl rotate-180 mb-2 truncate max-h-[140px]">01. Fayllar va iyerarxiya</span>
                          </div>
                        </th>
                      )}
                      {localAssignments.filter(a => a.classId === selectedClassId).map((assignment) => (
                        <th key={assignment.id} className="w-24 px-4 py-4 text-center border-r border-slate-100 bg-emerald-50/50 border-t-[3px] border-t-emerald-500">
                          <div className="flex flex-col items-center text-slate-600">
                            <span className="text-[11px] font-black uppercase tracking-widest writing-vertical-rl rotate-180 mb-2 truncate max-h-[140px]">{assignment.title}</span>
                          </div>
                        </th>
                      ))}
                      <th className="w-32 px-4 py-4 text-center">
                        <button className="flex flex-col items-center mx-auto text-slate-400 hover:text-slate-600 transition-colors opacity-60 hover:opacity-100">
                          <Plus className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{t('grading.add')}</span>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(selectedClassId === '9-B' ? STUDENTS_9B : selectedClassId === '9-A' ? STUDENTS_9A : STUDENTS_5A).map((student: any) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4 border-r border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${selectedClassId === '9-B' ? 'bg-emerald-400' : 'bg-amber-400'} flex items-center justify-center text-white text-[11px] font-bold shadow-sm`}>
                              {student.initials}
                            </div>
                            <span className="text-[14px] font-bold text-slate-700">{student.name}</span>
                          </div>
                        </td>
                        {selectedClassId === '9-A' ? (
                          <>
                            <td className={`px-4 py-4 text-center border-r border-slate-100 ${student.total.bg}`}>
                              <div className="flex flex-col items-center justify-center h-full min-h-[40px]">
                                <span className={`text-[14px] font-black leading-none ${student.total.color}`}>{student.total.grade}</span>
                                {student.total.score && <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{student.total.score}</span>}
                              </div>
                            </td>
                            <td className={`px-0 py-0 text-center border-r border-slate-100 relative ${student.assign.isEditing ? 'bg-white z-20' : ''}`}>
                              {student.assign.isEditing ? (
                                <div className="absolute inset-0 border-[3px] border-slate-800 m-[1px] rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                                  <input type="text" defaultValue={student.assign.score} className="w-full h-full bg-transparent text-center text-[15px] font-black outline-none text-slate-800 bg-blue-50/10 input-no-spin" autoFocus />
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full min-h-[50px]">
                                  <span className="text-[15px] font-black text-slate-800 leading-none">{student.assign.score}</span>
                                  {student.assign.total && <span className="text-[9px] font-bold text-slate-400 mt-1">{student.assign.total}</span>}
                                </div>
                              )}
                            </td>
                          </>
                        ) : selectedClassId === '9-B' ? (
                          <>
                            <td className="px-4 py-4 text-center border-r border-slate-100 bg-slate-50/20">
                              <span className="text-[14px] font-bold text-slate-400">—</span>
                            </td>
                            <td className="px-4 py-4 text-center border-r border-slate-100">
                              <span className="text-[14px] font-bold text-slate-400">—</span>
                            </td>
                          </>
                        ) : (
                          <td className="px-4 py-4 text-center border-r border-slate-100 bg-slate-50/20">
                            <span className="text-[14px] font-bold text-slate-400">—</span>
                          </td>
                        )}
                        {localAssignments.filter(a => a.classId === selectedClassId).map((assignment) => (
                          <td key={assignment.id} className="px-4 py-4 text-center border-r border-slate-100">
                            <span className="text-[14px] font-bold text-slate-400">—</span>
                          </td>
                        ))}
                        <td className="px-4 py-4 text-center">
                          <span className="text-[14px] font-bold text-slate-400">—</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Column 3: Grade Topics ─── */}
      <div className="w-[320px] shrink-0 bg-white border-l border-slate-100 flex flex-col p-8 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] overflow-y-auto custom-scrollbar">
        {!selectedClassId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
              <Tag className="w-8 h-8 opacity-50" />
            </div>
            <h2 className="text-[18px] font-black text-slate-800 mb-2">{t('grading.gradeTopics')}</h2>
            <p className="text-[14px] font-medium text-slate-500 text-center max-w-[200px]">
              {t('grading.selectClassForTopics')}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-in fade-in duration-500">
            <div className="flex items-start justify-between mb-12">
              <div className="flex gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl text-slate-600 shadow-sm shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <h2 className="text-[20px] font-black text-slate-800 leading-tight tracking-tight">{t('grading.gradeTopics')}</h2>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <button 
                  onClick={() => setShowTopicListModal(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors"
                >
                  <ListPlus className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors">
                  <Link2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowTopicModal(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-[32px] font-black text-slate-800 leading-none mb-1">100%</h1>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t('grading.topicWeights')}</p>
              </div>
              
              {/* CSS Donut Chart */}
              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1F5F9" strokeWidth="16" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="0" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-500" strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Pill */}
            <div className="flex items-center gap-4 bg-white border border-blue-100 shadow-[0_4px_12px_rgba(59,130,246,0.1)] rounded-[20px] p-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[12px] font-black shrink-0">
                100%
              </div>
              <h3 className="text-[15px] font-bold text-slate-800 flex-1">{selectedClassId === '9-A' ? 'Test' : 'Kahoot!'}</h3>
            </div>
          </div>
        )}
      </div>

      {/* ─── Yangi topshiriq yaratish modali ─── */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[460px] rounded-[24px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <h2 className="text-[18px] font-black text-slate-800">{t('grading.newAssignment')}</h2>
                <p className="text-[13px] font-medium text-slate-500 mt-1">{t('createAssignment.desc')}</p>
              </div>
              <button onClick={() => { setShowCreateAssignmentModal(false); setAssignmentSuccess(false); }} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {assignmentSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-600" strokeWidth={3} />
                </div>
                <p className="text-[16px] font-black text-slate-800">{t('grading.assignmentCreated')}</p>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-black text-slate-800">{t('grading.title')} *</label>
                    <div className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 transition-all shadow-sm">
                      <input
                        className="bg-transparent outline-none text-[14px] font-bold text-slate-800 w-full"
                        placeholder={t('grading.titlePlaceholder')}
                        autoFocus
                        value={newAssignmentTitle}
                        onChange={e => setNewAssignmentTitle(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-black text-slate-800">{t('grading.selectClass')}</label>
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        <span className="text-[14px] font-bold text-slate-800">{selectedClassId || '9-A'}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[13px] font-black text-slate-800">{t('grading.topic')}</label>
                      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm cursor-pointer hover:border-slate-300 transition-colors relative">
                        <span className="text-[14px] font-medium text-slate-800">{t('grading.noTopic')}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-black text-slate-800">{t('grading.points')}</label>
                      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-slate-400 transition-colors">
                        <input
                          type="number"
                          value={newAssignmentPoints}
                          onChange={e => setNewAssignmentPoints(parseInt(e.target.value) || 0)}
                          className="bg-transparent outline-none text-[14px] font-medium text-slate-800 w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-black text-slate-800">{t('grading.dueDate')}</label>
                    <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-slate-400 transition-colors relative">
                      <input
                        type="date"
                        value={newAssignmentDueDate}
                        onChange={e => setNewAssignmentDueDate(e.target.value)}
                        className="bg-transparent outline-none text-[14px] font-medium text-slate-800 w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
                      />
                      <Calendar className="absolute right-4 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 pt-0 mt-4">
                  <button
                    onClick={() => setShowCreateAssignmentModal(false)}
                    className="px-5 py-2.5 text-[14px] font-black text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleCreateAssignment}
                    disabled={!newAssignmentTitle.trim()}
                    className="px-5 py-2.5 bg-slate-900 text-white text-[14px] font-black rounded-xl shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('grading.createAssignment')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── Create Topic Modal ─── */}
      {showTopicModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[420px] rounded-[24px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 relative">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <h2 className="text-[18px] font-black text-slate-800">{t('grading.create')}</h2>
              <button onClick={() => setShowTopicModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[13px] font-black text-slate-800">{t('grading.topicName')}</label>
                <div className="bg-white border-2 border-slate-400 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-slate-800">
                  <input className="bg-transparent outline-none text-[14px] font-medium text-slate-800 w-full" placeholder={t('grading.topicNamePlaceholder')} autoFocus defaultValue={"Test"} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-black text-slate-800">{t('grading.weight')}</label>
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-slate-400 transition-colors">
                  <input type="number" defaultValue="100" className="bg-transparent outline-none text-[14px] font-medium text-slate-800 w-full" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[13px] font-black text-slate-800">{t('grading.color')}</label>
                <div className="flex items-center gap-4 flex-wrap">
                  {['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400', 'bg-teal-400', 'bg-sky-400', 'bg-indigo-400', 'bg-purple-400', 'bg-pink-400'].map((color, idx) => (
                    <div key={idx} className={`w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform ${color} ${idx === 5 ? 'ring-2 ring-offset-2 ring-sky-400' : ''}`} />
                  ))}
                  <div className="w-6 h-6 rounded-full cursor-pointer hover:scale-110 transition-transform bg-gradient-to-br from-red-400 via-green-400 to-blue-400" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-start gap-3 p-6 pt-0 mt-2">
              <button className="px-10 py-2.5 bg-slate-800 text-white text-[14px] font-black rounded-xl hover:bg-slate-900 transition-colors">
                {t('grading.create')}
              </button>
              <button
                onClick={() => setShowTopicModal(false)}
                className="px-5 py-2.5 text-[14px] font-black text-slate-500 bg-white hover:bg-slate-50 rounded-xl transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Grade Topics List Modal ─── */}
      {showTopicListModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[460px] rounded-[24px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 relative">
            <div className="p-6 pb-4 flex items-start justify-between">
              <h2 className="text-[18px] font-black text-slate-800">{t('grading.gradeTopics')}</h2>
              <button onClick={() => setShowTopicListModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 pt-2 space-y-3">
              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-slate-200 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-8 bg-blue-500 rounded-full" />
                  <div>
                    <h3 className="text-[15px] font-black text-slate-800">Kahoot!</h3>
                    <p className="text-[12px] font-bold text-slate-400">100%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-slate-400 hover:text-slate-600"><Edit2 className="w-4 h-4" /></button>
                  <button className="text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-slate-200 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-8 bg-sky-400 rounded-full" />
                  <div>
                    <h3 className="text-[15px] font-black text-slate-800">Test</h3>
                    <p className="text-[12px] font-bold text-slate-400">100%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-slate-400 hover:text-slate-600"><Edit2 className="w-4 h-4" /></button>
                  <button className="text-slate-400 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        
        .writing-vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>
    </div>
  );
}
