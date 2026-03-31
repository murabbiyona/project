import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Plus, Filter, Mail, Phone,
  Calendar, Check, X, Download, Sliders, MessageSquare, Trash2,
  UserPen, GraduationCap, Edit, ArrowUpRight, ChevronDown
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const CLASSES = [
  { id: '7-A', label: '7-A', color: 'bg-indigo-400' },
  { id: '7-B', label: '7-B', color: 'bg-purple-400', time: '13:00 \u2013 13:45' },
  { id: '7-D', label: '7-D', color: 'bg-rose-400' },
  { id: '8-A', label: '8-A', color: 'bg-rose-400' },
  { id: '8-B', label: '8-B', color: 'bg-orange-400' },
  { id: '9-A', label: '9-A', color: 'bg-amber-400', time: '12:15 \u2013 13:00' },
  { id: '9-B', label: '9-B', color: 'bg-emerald-400' },
  { id: 'none', label: 'No Class', color: 'bg-slate-300' },
];

const STUDENTS = [
  { id: '1168', name: 'Asadbek Panjiyev', initials: 'AP', color: 'bg-amber-400', classId: '9-A', score: '39%', status: 'Active' },
  { id: '1169', name: 'Davron Eshbo\u02bbriyev', initials: 'DE', color: 'bg-amber-400', classId: '9-A', score: '54%', status: 'Active' },
  { id: '1170', name: 'Dilafruz Abdumurodova', initials: 'DA', color: 'bg-amber-400', classId: '9-A', score: '77%', status: 'Active' },
  { id: '1171', name: 'Dilora Karimova', initials: 'DK', color: 'bg-amber-400', classId: '9-A', score: '46%', status: 'Active' },
  { id: '1172', name: 'Dilshodbek Jovliyev', initials: 'DJ', color: 'bg-amber-400', classId: '9-A', score: '69%', status: 'Active' },
  { id: '1173', name: 'Elnur Avduvaitov', initials: 'EA', color: 'bg-amber-400', classId: '9-A', score: '62%', status: 'Active' },
  { id: '1105', name: 'Asadbek Abdusalomov', initials: 'AA', color: 'bg-purple-400', classId: '7-B', score: '100%', status: 'Active' },
  { id: '1106', name: 'Behruz Omondavlatov', initials: 'BO', color: 'bg-purple-400', classId: '7-B', score: '100%', status: 'Active' },
  { id: '1107', name: 'Charos Abdurahimova', initials: 'CA', color: 'bg-purple-400', classId: '7-B', score: '100%', status: 'Active' },
  { id: '1108', name: 'Durdona Choriyeva', initials: 'DC', color: 'bg-purple-400', classId: '7-B', score: '100%', status: 'Active' },
];

export default function Students() {
  const [selectedClassId, setSelectedClassId] = useState('9-A');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>('1168');
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showImportDropdown, setShowImportDropdown] = useState(false);

  const filteredStudents = STUDENTS.filter(s => s.classId === selectedClassId);
  const activeStudent = STUDENTS.find(s => s.id === selectedStudentId);

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F8FAFC] overflow-hidden" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      
      {/* \u2500\u2500\u2500 Column 1: Classes \u2500\u2500\u2500 */}
      <div className="w-[200px] xl:w-[240px] bg-white border-r border-slate-100 flex flex-col p-4 shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-slate-800" />
            <h2 className="text-[16px] font-extrabold text-slate-800">All Classes</h2>
          </div>
          <button 
            onClick={() => setShowCreateClassModal(true)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 space-y-1">
          {CLASSES.map(cls => (
            <button
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`w-full group flex flex-col items-start p-3 rounded-2xl transition-all relative ${
                selectedClassId === cls.id ? 'bg-amber-50 ring-2 ring-amber-200 shadow-sm' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 w-full">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cls.color}`} />
                <span className={`text-[14px] font-extrabold ${selectedClassId === cls.id ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                  {cls.label}
                </span>
              </div>
              {cls.time && (
                <div className="ml-5 mt-1.5 text-[12px] font-medium text-slate-400">{cls.time}</div>
              )}
            </button>
          ))}
        </div>

        {/* Stats Card at bottom of Class list */}
        <div className="mt-8 bg-slate-50 rounded-2xl p-5 border border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-2 mt-[-4px]">
            <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${CLASSES.find(c => c.id === selectedClassId)?.color || 'text-amber-500'}`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="text-right">
              <h3 className="text-[16px] font-extrabold text-slate-800">{selectedClassId}</h3>
              <p className="text-[12px] font-medium text-slate-400">{filteredStudents.length} students</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-5 mt-6">
            <div className="text-center">
              <p className="text-[16px] font-black text-slate-800">{filteredStudents.length}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-black text-slate-800">{filteredStudents.length}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active</p>
            </div>
            <div className="text-center">
              <p className="text-[16px] font-black text-slate-800">0</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Away</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[12px] font-bold text-slate-600 mb-1.5">
            <span>Active</span>
            <span>100%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full w-full" />
          </div>
        </div>
      </div>

      {/* \u2500\u2500\u2500 Column 2: Student List \u2500\u2500\u2500 */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] border-r border-slate-100 p-6 overflow-hidden relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[14px] bg-white shadow-sm flex items-center justify-center border border-slate-100 text-slate-700">
               <UserPen className="w-6 h-6" />
            </div>
            <h1 className="text-[24px] font-extrabold text-slate-900 tracking-tight">
              Students <span className="text-slate-400 text-[18px] font-medium">({filteredStudents.length})</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
              <Edit className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
              <Search className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
            <button className="h-10 px-4 flex items-center gap-2 rounded-[14px] bg-white border border-slate-200 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <ArrowUpRight className="w-4 h-4 text-slate-400" /> Sort: Name
            </button>
            <div className="relative flex items-center shadow-sm rounded-xl overflow-visible">
              <button 
                onClick={() => setShowEditModal(true)}
                className="h-10 px-5 flex items-center gap-2 bg-slate-900 text-white text-[14px] font-bold hover:bg-slate-800 transition-colors rounded-l-[14px]"
              >
                <Plus className="w-4 h-4" strokeWidth={3} /> New Student
              </button>
              <button 
                onClick={() => setShowImportDropdown(!showImportDropdown)}
                className="h-10 px-3 bg-slate-900 text-white border-l border-slate-700 hover:bg-slate-800 transition-colors rounded-r-[14px]"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showImportDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <button className="w-full px-4 py-2.5 flex items-center gap-3 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                    <Download className="w-4 h-4" /> Import CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
          {filteredStudents.map(student => {
            const isChecked = checkedIds.includes(student.id);
            const isSelected = selectedStudentId === student.id;

            return (
              <div
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected ? 'border-amber-400 bg-white ring-4 ring-amber-50 shadow-md transform scale-[1.01]' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleCheck(student.id); }}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isChecked ? 'bg-slate-800 border-slate-800 text-white' : 'border-slate-300 bg-slate-50 group-hover:border-slate-400'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" strokeWidth={4} />}
                  </button>
                  
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-black text-white shrink-0 shadow-sm ${student.color}`}>
                    {student.initials}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-extrabold text-slate-800 truncate">{student.name}</h3>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">Student ID: ID-{student.id}</p>
                </div>

                <div className="flex items-center gap-5 shrink-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-rose-100 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[13px] font-black text-rose-600">{student.score}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[12px] font-bold text-slate-600">{student.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Bottom Selection Toolbar */}
        {checkedIds.length > 0 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-5 bg-[#2D333D] text-white px-6 py-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-10 duration-300 z-50">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border-2 border-white/20 bg-white/10 flex items-center justify-center">
                <Check className="w-3 h-3" strokeWidth={4} />
              </div>
              <span className="text-[14px] font-bold whitespace-nowrap">{checkedIds.length} student{checkedIds.length > 1 ? 's' : ''} selected</span>
            </div>
            <div className="h-5 w-[1px] bg-white/10" />
            <button className="flex items-center gap-2 hover:text-white/80 transition-colors text-[14px] font-bold">
              <BookOpenIcon className="w-4 h-4 text-slate-400" /> Edit Classes
            </button>
            <div className="relative group/status">
              <button className="flex items-center gap-2 hover:text-white/80 transition-colors text-[14px] font-bold">
                Status <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <button className="flex items-center gap-2 hover:text-rose-400 transition-colors text-[14px] font-bold text-white/90">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button onClick={() => setCheckedIds([])} className="hover:text-white/60 transition-colors text-[14px] font-bold border-l border-white/10 pl-5 ml-2">
              Clear
            </button>
          </div>
        )}
      </div>

      {/* \u2500\u2500\u2500 Column 3: Profile Detail \u2500\u2500\u2500 */}
      <div className="w-[320px] xl:w-[380px] shrink-0 bg-white flex flex-col overflow-hidden relative shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10 border-l border-slate-100">
        {activeStudent ? (
          <>
            <div className="relative pt-16 pb-8 px-8 flex flex-col items-center border-b border-slate-100">
              {/* Profile Background Graphics */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-100/50 rounded-full blur-3xl -mr-20 -mt-20" />
              
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-[40px] font-black text-white shadow-xl ring-8 ring-white mb-6 z-10 ${activeStudent.color}`}>
                {activeStudent.initials}
              </div>

              <div className="flex items-center gap-2 text-[12px] font-black text-emerald-600 bg-white px-2.5 py-1 rounded-full border border-emerald-100 shadow-sm mb-4 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                ACTIVE
              </div>

              <h2 className="text-[24px] font-black text-slate-800 text-center leading-tight z-10">
                {activeStudent.name}
              </h2>
              <p className="text-[14px] font-bold text-slate-400 mt-2 z-10">ID-{activeStudent.id}</p>

              <Link 
                to={`/students/${activeStudent.id}`}
                className="mt-8 w-full py-3.5 bg-amber-400 text-white text-[15px] font-black rounded-2xl shadow-lg shadow-amber-400/20 hover:bg-amber-500 transition-all hover:-translate-y-0.5 z-10 flex items-center justify-center"
              >
                View Profile
              </Link>
            </div>

            <div className="px-8 py-6 flex-1 space-y-8 overflow-y-auto custom-scrollbar">
              {/* Classes Section */}
              <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-widest mb-4">Classes</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 rounded-xl bg-amber-50 text-amber-600 text-[14px] font-bold">
                    {activeStudent.classId}
                  </span>
                </div>
              </div>

              {/* Contact Section */}
              <div>
                <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-widest mb-4">Contact</h4>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-amber-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-400 mb-0.5">Student Email</p>
                      <p className="text-[14px] font-bold text-slate-500 italic">Not provided</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-amber-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-400 mb-0.5">Parent Email</p>
                      <p className="text-[14px] font-bold text-slate-500 italic">Not provided</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-amber-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-slate-400 mb-0.5">Phone Number</p>
                      <p className="text-[14px] font-bold text-slate-500 italic">Not provided</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 bg-white flex gap-3 border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
              <button className="flex-1 py-3.5 px-4 rounded-2xl bg-white border border-slate-200 text-slate-500 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                <Mail className="w-4 h-4" />
                <span className="text-[14px] font-bold text-slate-600">Email</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-amber-400 text-white text-[14px] font-black shadow-lg shadow-amber-400/20 hover:bg-amber-500 transition-colors">
                <MessageSquare className="w-4 h-4" fill="currentColor" /> Chat
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 mb-4 scale-110">
              <UserPen className="w-6 h-6" />
            </div>
            <h3 className="text-[16px] font-black text-slate-800 mb-2">No Student Selected</h3>
            <p className="text-[14px] font-bold text-slate-400 max-w-[200px]">Click on a student card to see their full profile.</p>
          </div>
        )}
      </div>

      {/* \u2500\u2500\u2500 Edit Student Modal \u2500\u2500\u2500 */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[840px] rounded-[32px] overflow-hidden shadow-2xl flex animate-in zoom-in-95 duration-300">
            {/* Left: Avatar picker */}
            <div className="w-[320px] bg-slate-50 p-12 flex flex-col items-center border-r border-slate-100">
              <h3 className="text-[18px] font-black text-slate-800 mb-1">Choose Avatar</h3>
              <p className="text-[12px] font-bold text-slate-400 mb-8 text-center">Select a profile picture for the student.</p>
              
              <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center text-[32px] font-black text-slate-400 mb-10 shadow-inner">
                {activeStudent?.initials || 'AP'}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {['bg-slate-800', 'bg-indigo-400', 'bg-sky-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400', 'bg-emerald-500', 'bg-slate-400'].map((c, i) => (
                  <button key={i} className={`w-12 h-12 rounded-[14px] ${c} hover:scale-110 transition-transform relative flex items-center justify-center shadow-sm`}>
                    {i === 0 && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-800 rounded-full border-2 border-white flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
                <button className="w-12 h-12 rounded-[14px] bg-white border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 transition-colors">
                  <div className="flex flex-col items-center scale-90">
                    <Plus className="w-4 h-4 mb-0.5" />
                    <span className="text-[8px] font-black uppercase tracking-wider">Upload</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 p-10 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-[20px] font-black text-slate-800">Edit Student Profile</h2>
                  <p className="text-[13px] font-bold text-slate-400 mt-1">Update the student information below.</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[13px] font-black text-slate-800">Full Name * *</label>
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-slate-400 transition-colors shadow-sm">
                      <UserPen className="w-5 h-5 text-slate-400" />
                      <input className="bg-transparent outline-none text-[14px] font-bold text-slate-800 w-full" defaultValue={activeStudent?.name} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-black text-slate-800">Student ID</label>
                    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-slate-400 transition-colors shadow-sm">
                      <span className="text-slate-400 font-bold">#</span>
                      <input className="bg-transparent outline-none text-[14px] font-bold text-slate-800 w-full" defaultValue={`ID-${activeStudent?.id}`} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-black text-slate-800">Class Selection</label>
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-slate-400 transition-colors cursor-pointer group shadow-sm">
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 text-[13px] font-bold">
                        9-A <X className="w-3.5 h-3.5 cursor-pointer hover:text-amber-800" />
                      </span>
                    </div>
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-black text-slate-800">Tags</label>
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-slate-400 transition-colors cursor-pointer group shadow-sm">
                    <span className="text-[14px] font-bold text-slate-400">Select tags...</span>
                    <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-black text-slate-800">Student Email</label>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-slate-400 transition-colors shadow-sm">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <input className="bg-transparent outline-none text-[14px] font-bold text-slate-800 w-full" placeholder="student@school.edu" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-black text-slate-800">Parent Email</label>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-slate-400 transition-colors shadow-sm">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <input className="bg-transparent outline-none text-[14px] font-bold text-slate-800 w-full" placeholder="parent@example.com" />
                  </div>
                  <p className="text-[12px] font-bold text-slate-400">We'll send a confirmation link to the parent.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-black text-slate-800">Phone Number</label>
                  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3.5 focus-within:border-slate-400 transition-colors shadow-sm">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <input className="bg-transparent outline-none text-[14px] font-bold text-slate-800 w-full" placeholder="+1 555-0123" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3.5 text-[15px] font-black text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button className="px-8 py-3.5 bg-slate-900 text-white text-[15px] font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 flex items-center gap-2 transition-all hover:-translate-y-0.5">
                  <Download className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Create Class Modal ─── */}
      {showCreateClassModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[560px] rounded-[24px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-[18px] font-black text-slate-800">Create Class</h2>
              <button onClick={() => setShowCreateClassModal(false)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-black text-slate-800">Class Name * *</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-slate-400 transition-colors shadow-sm">
                    <input className="bg-transparent outline-none text-[14px] font-bold text-slate-800 w-full" placeholder="e.g., Math 101" autoFocus />
                  </div>
                  <button className="w-12 h-12 rounded-2xl bg-rose-400 text-white flex items-center justify-center shadow-sm hover:bg-rose-500 transition-colors shrink-0">
                    <Sliders className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-black text-slate-800">Description</label>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-slate-400 transition-colors shadow-sm">
                  <input className="bg-transparent outline-none text-[14px] font-bold text-slate-800 w-full" placeholder="e.g., Advanced algebra for 10th graders" />
                </div>
              </div>

              <div className="flex items-center gap-4 text-[13px]">
                <span className="font-bold text-slate-400">Semester:</span>
                <span className="font-extrabold text-slate-700">2025–2026-o'quv yili</span>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-black text-slate-800">Weekly Schedule</h3>
                  <button className="flex items-center gap-1.5 text-[13px] font-black text-slate-800 hover:text-slate-600 transition-colors">
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} /> Add Time Slot
                  </button>
                </div>
                <p className="text-[13px] font-medium text-slate-500">
                  No recurring schedule. Add time slots to show this class on the weekly calendar.
                </p>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 p-6 pt-0 mt-2">
              <button 
                onClick={() => setShowCreateClassModal(false)}
                className="px-6 py-3 text-[14px] font-black text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-3 bg-slate-900 text-white text-[14px] font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all hover:-translate-y-0.5">
                Create Class
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

function BookOpenIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
