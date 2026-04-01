import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Search, Plus, BarChart2, ArrowUpDown,
  LayoutGrid, List, X, Users, BookOpen, ClipboardList, Loader2
} from 'lucide-react';
import { useClasses } from '../hooks/useClasses';

type ViewMode = 'grid' | 'list';
type SortKey = 'name' | 'students' | 'lessons' | 'assignments';

const classColors = [
  { bg: 'bg-rose-50', icon: 'text-rose-400', dot: 'bg-rose-400' },
  { bg: 'bg-orange-50', icon: 'text-orange-400', dot: 'bg-orange-400' },
  { bg: 'bg-yellow-50', icon: 'text-yellow-500', dot: 'bg-yellow-400' },
  { bg: 'bg-emerald-50', icon: 'text-emerald-500', dot: 'bg-emerald-400' },
  { bg: 'bg-cyan-50', icon: 'text-cyan-500', dot: 'bg-cyan-400' },
  { bg: 'bg-sky-50', icon: 'text-sky-400', dot: 'bg-sky-400' },
];

// Avatar colors for student initials (used in list view)
const avatarColors = [
  'bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400',
  'bg-teal-400', 'bg-sky-400', 'bg-indigo-400', 'bg-violet-400',
] as const; void avatarColors;

export default function Classes() {
  const { t } = useTranslation();
  const { classes, loading, createClass } = useClasses();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [showSort, setShowSort] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'name', label: t('classes.sortName') },
    { key: 'students', label: t('classes.sortStudents') },
    { key: 'lessons', label: t('classes.sortLessons') },
    { key: 'assignments', label: t('classes.sortAssignments') },
  ];

  const filtered = classes
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name);
      if (sortKey === 'students') return b.student_count - a.student_count;
      if (sortKey === 'lessons') return b.lesson_count - a.lesson_count;
      return b.assignment_count - a.assignment_count;
    });

  const overview = {
    classes: classes.length,
    students: classes.reduce((s, c) => s + c.student_count, 0),
    lessons: classes.reduce((s, c) => s + c.lesson_count, 0),
    assignments: classes.reduce((s, c) => s + c.assignment_count, 0),
  };

  async function handleCreateClass() {
    if (!newClassName.trim()) return;
    setCreating(true);

    // Parse name like "5-A" -> grade_level: 5, section: "A"
    const match = newClassName.match(/^(\d+)-?(.*)$/);
    const gradeLevel = match ? parseInt(match[1]) : 5;
    const section = match?.[2] || undefined;

    await createClass({
      name: newClassName.trim(),
      grade_level: gradeLevel,
      section,
    });

    setCreating(false);
    setNewClassName('');
    setNewClassDesc('');
    setShowCreateModal(false);
  }

  return (
    <div className="flex gap-6 h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Main Content */}
      <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3 flex-1">
            <GraduationCap className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            <h1 className="text-xl font-bold text-foreground">{t('classes.title')}</h1>
          </div>

          {/* Search */}
          {showSearch ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-56 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('classes.searchPlaceholder')}
                className="bg-transparent border-none outline-none flex-1 text-sm text-slate-700 placeholder:text-slate-400"
              />
              <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {t('classes.sort')}: {sortOptions.find(s => s.key === sortKey)?.label}
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 w-40">
                {sortOptions.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { setSortKey(opt.key); setShowSort(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between
                      ${sortKey === opt.key ? 'text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {opt.label}
                    {sortKey === opt.key && <span className="text-primary-500">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Class button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('classes.newClass')}
          </button>

          {/* View Toggles */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Class Cards */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <GraduationCap className="w-12 h-12 mb-3 text-slate-300" />
              <p className="text-lg font-medium">{searchQuery ? t('classes.noResults', 'Natija topilmadi') : t('classes.empty', 'Hali sinflar yo\'q')}</p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-3 text-sm text-emerald-600 font-semibold hover:text-emerald-700"
                >
                  + {t('classes.newClass')}
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filtered.map((cls, idx) => {
                const color = classColors[idx % classColors.length];
                return (
                  <Link
                    key={cls.id}
                    to={`/classes/${encodeURIComponent(cls.name)}`}
                    className="block border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className={`${color.bg} h-[120px] relative overflow-hidden flex items-center justify-center`}>
                      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-40 ${color.bg} border-4 border-white/30`}></div>
                      <div className={`absolute top-4 right-8 w-14 h-14 rounded-full opacity-30 ${color.bg} border-2 border-white/20`}></div>
                      <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                        <GraduationCap className={`w-6 h-6 ${color.icon}`} strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="p-4 bg-white">
                      <h2 className="font-bold text-slate-900 text-lg">{cls.name}</h2>
                      <p className={`text-xs font-medium mt-0.5 mb-4 ${color.icon}`}>
                        {cls.academic_year}
                      </p>
                      <div className="flex items-center justify-between">
                        {[
                          { icon: Users, val: cls.student_count, label: t('classes.students') },
                          { icon: BookOpen, val: cls.lesson_count, label: t('classes.lessons') },
                          { icon: ClipboardList, val: cls.assignment_count, label: t('classes.assign') },
                        ].map(({ icon: Icon, val, label }) => (
                          <div key={label} className="flex flex-col items-center gap-1">
                            <Icon className={`w-4 h-4 ${color.icon}`} strokeWidth={1.5} />
                            <span className="text-[11px] font-medium text-slate-600">{val} {label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((cls, i) => {
                const color = classColors[i % classColors.length];
                return (
                  <Link
                    key={cls.id}
                    to={`/classes/${encodeURIComponent(cls.name)}`}
                    className="flex items-center gap-4 border border-slate-200/80 rounded-xl px-5 py-4 hover:shadow-sm transition-shadow cursor-pointer bg-white hover:bg-slate-50/50"
                  >
                    <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center flex-shrink-0`}>
                      <GraduationCap className={`w-5 h-5 ${color.icon}`} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-slate-900">{cls.name}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{cls.academic_year}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                      <span>{cls.student_count} {t('classes.students')}</span>
                      <span>{cls.lesson_count} {t('classes.lessons')}</span>
                      <span>{cls.assignment_count} {t('classes.sortAssignments')}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Overview Panel */}
      <div className="w-[260px] flex-shrink-0">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
            <h2 className="font-bold text-slate-900">{t('classes.overview')}</h2>
          </div>
          <div className="space-y-4">
            {[
              { value: overview.classes, label: t('classes.totalClasses'), color: 'text-sky-500', bg: 'bg-sky-50', icon: GraduationCap },
              { value: overview.students, label: t('classes.totalStudents'), color: 'text-violet-500', bg: 'bg-violet-50', icon: Users },
              { value: overview.lessons, label: t('classes.totalLessons'), color: 'text-rose-500', bg: 'bg-rose-50', icon: BookOpen },
              { value: overview.assignments, label: t('classes.totalAssignments'), color: 'text-amber-500', bg: 'bg-amber-50', icon: ClipboardList },
            ].map(({ value, label, color, bg, icon: Icon }) => (
              <div key={label} className={`${bg} rounded-xl p-4 flex items-center gap-4`}>
                <Icon className={`w-5 h-5 ${color}`} strokeWidth={1.5} />
                <div>
                  <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-lg">{t('classes.createClass')}</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateClass(); }} className="px-6 py-5 space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">
                  {t('classes.className')} <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newClassName}
                    onChange={e => setNewClassName(e.target.value)}
                    placeholder={t('classes.classNamePlaceholder')}
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button type="button" className="w-9 h-9 bg-rose-400 text-white rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0">🎓</button>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">{t('classes.description')}</label>
                <input
                  value={newClassDesc}
                  onChange={e => setNewClassDesc(e.target.value)}
                  placeholder={t('classes.descriptionPlaceholder')}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">{t('classes.semester')}</label>
                <span className="text-sm text-slate-500">2025-2026-o'quv yili</span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">{t('classes.weeklySchedule')}</label>
                <button type="button" className="flex items-center gap-1 text-sm text-primary-600 font-semibold hover:text-primary-700">
                  <Plus className="w-4 h-4" /> {t('classes.addTimeSlot')}
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{t('classes.noSchedule')}</p>
            </form>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
              >
                {t('classes.cancel')}
              </button>
              <button
                onClick={handleCreateClass}
                disabled={creating || !newClassName.trim()}
                className="px-4 py-2 text-sm font-semibold bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                {t('classes.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
