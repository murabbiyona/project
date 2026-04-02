import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  GraduationCap, Search, Calendar, Filter, Upload, ChevronLeft, ChevronRight, Check, X, Clock, FileText,
  Edit2, Loader2, AlertCircle,
} from 'lucide-react';
import { useClasses } from '../hooks/useClasses';
import { useStudents } from '../hooks/useStudents';
import { useAttendance } from '../hooks/useAttendance';
import type { AttendanceStatus } from '../types/database';
import { cn } from '../lib/utils';

const STATUS_ORDER: (AttendanceStatus | null)[] = [null, 'present', 'absent', 'late', 'excused'];

const CLASS_CARD_STYLES = [
  { border: 'border-blue-200', ring: 'ring-blue-50', iconBorder: 'border-blue-100', accent: 'text-blue-500', bar: 'bg-blue-400' },
  { border: 'border-indigo-200', ring: 'ring-indigo-50', iconBorder: 'border-indigo-100', accent: 'text-indigo-500', bar: 'bg-indigo-400' },
  { border: 'border-purple-200', ring: 'ring-purple-50', iconBorder: 'border-purple-100', accent: 'text-purple-500', bar: 'bg-purple-400' },
  { border: 'border-fuchsia-200', ring: 'ring-fuchsia-50', iconBorder: 'border-fuchsia-100', accent: 'text-fuchsia-500', bar: 'bg-fuchsia-400' },
  { border: 'border-rose-200', ring: 'ring-rose-50', iconBorder: 'border-rose-100', accent: 'text-rose-500', bar: 'bg-rose-400' },
  { border: 'border-orange-200', ring: 'ring-orange-50', iconBorder: 'border-orange-100', accent: 'text-orange-500', bar: 'bg-orange-400' },
  { border: 'border-amber-200', ring: 'ring-amber-50', iconBorder: 'border-amber-100', accent: 'text-amber-600', bar: 'bg-amber-400' },
] as const;

const LIST_DOT = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-rose-500', 'bg-orange-500', 'bg-amber-500'] as const;

const AVATAR_BG = ['bg-rose-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400', 'bg-teal-400', 'bg-sky-400', 'bg-indigo-400', 'bg-violet-400'] as const;

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toISODate(y: number, m1: number, day: number) {
  return `${y}-${pad2(m1)}-${pad2(day)}`;
}

function initials(first: string, last: string) {
  const a = first.trim()[0] || '';
  const b = last.trim()[0] || '';
  return (a + b).toUpperCase() || '?';
}

function hashPick<T>(id: string, arr: readonly T[]): T {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return arr[h % arr.length];
}

type ViewMode = 'month' | 'day' | 'class';

export default function Attendance() {
  const { classes, loading: classesLoading } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [focusDate, setFocusDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridByKey, setGridByKey] = useState<Record<string, AttendanceStatus | null>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { fetchAttendanceRange, saveAttendanceCell, loading: attendanceLoading } = useAttendance();

  useEffect(() => {
    if (classes.length && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const { students, loading: studentsLoading } = useStudents(selectedClassId || undefined, {
    enabled: !!selectedClassId,
  });

  const vy = viewMonth.getFullYear();
  const vm0 = viewMonth.getMonth();

  const columnCal = useMemo(() => {
    if (viewMode === 'day') {
      return { y: focusDate.getFullYear(), m0: focusDate.getMonth() };
    }
    return { y: vy, m0: vm0 };
  }, [viewMode, focusDate, vy, vm0]);

  const cy = columnCal.y;
  const cm0 = columnCal.m0;
  const lastDay = new Date(cy, cm0 + 1, 0).getDate();

  const headerDate = viewMode === 'day' ? focusDate : viewMonth;
  const monthLabel = headerDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const visibleDayNumbers = useMemo(() => {
    const days: number[] = [];
    for (let d = 1; d <= lastDay; d++) {
      const wd = new Date(cy, cm0, d).getDay();
      if (viewMode === 'class') {
        if (wd >= 1 && wd <= 5) days.push(d);
      } else if (viewMode === 'month') {
        days.push(d);
      }
    }
    if (viewMode === 'day') {
      return [focusDate.getDate()];
    }
    return days;
  }, [cy, cm0, lastDay, viewMode, focusDate]);

  const rangeStart = toISODate(cy, cm0 + 1, 1);
  const rangeEnd = toISODate(cy, cm0 + 1, lastDay);

  const loadGrid = useCallback(async () => {
    if (!selectedClassId) return;
    setLoadError(null);
    const rows = await fetchAttendanceRange(selectedClassId, rangeStart, rangeEnd);
    const next: Record<string, AttendanceStatus | null> = {};
    for (const r of rows) {
      const k = cellKey(r.student_id, r.date);
      next[k] = r.status;
    }
    setGridByKey(next);
  }, [selectedClassId, rangeStart, rangeEnd, fetchAttendanceRange]);

  useEffect(() => {
    void loadGrid();
  }, [loadGrid]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) ||
        String(s.journal_number || '').includes(q)
    );
  }, [students, searchQuery]);

  const statsForDay = useMemo(() => {
    if (!selectedClassId || !students.length) {
      return { present: 0, absent: 0, recordPct: 0, focusIso: rangeStart };
    }
    const focusIso =
      viewMode === 'day'
        ? toISODate(focusDate.getFullYear(), focusDate.getMonth() + 1, focusDate.getDate())
        : (() => {
            const t = new Date();
            const todayIso = toISODate(t.getFullYear(), t.getMonth() + 1, t.getDate());
            if (todayIso >= rangeStart && todayIso <= rangeEnd) return todayIso;
            return rangeStart;
          })();
    let present = 0;
    let absent = 0;
    for (const st of students) {
      const k = cellKey(st.id, focusIso);
      const s = gridByKey[k];
      if (s) {
        if (s === 'present' || s === 'late' || s === 'excused') present++;
        if (s === 'absent') absent++;
      }
    }
    const denom = present + absent;
    const recordPct = denom > 0 ? Math.round((present / denom) * 100) : 0;
    return { present, absent, recordPct, focusIso };
  }, [selectedClassId, students, gridByKey, rangeStart, rangeEnd, viewMode, focusDate]);

  const cycleViewMode = () => {
    if (viewMode === 'month') setViewMode('class');
    else if (viewMode === 'class') setViewMode('day');
    else setViewMode('month');
  };

  const goToday = () => {
    const t = new Date();
    setViewMonth(new Date(t.getFullYear(), t.getMonth(), 1));
    setFocusDate(t);
  };

  const prevNav = () => {
    if (viewMode === 'day') {
      const d = new Date(focusDate);
      d.setDate(d.getDate() - 1);
      setFocusDate(d);
      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      return;
    }
    setViewMonth(new Date(vy, vm0 - 1, 1));
  };

  const nextNav = () => {
    if (viewMode === 'day') {
      const d = new Date(focusDate);
      d.setDate(d.getDate() + 1);
      setFocusDate(d);
      setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
      return;
    }
    setViewMonth(new Date(vy, vm0 + 1, 1));
  };

  const getDayLabel = (dayNum: number) => {
    const d = new Date(cy, cm0, dayNum);
    return d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  async function applyCellStatus(studentId: string, iso: string, nextStatus: AttendanceStatus | null) {
    if (!selectedClassId || savingKey) return;
    const key = cellKey(studentId, iso);
    const prevSnapshot = { ...gridByKey };
    setGridByKey((g) => ({ ...g, [key]: nextStatus }));
    setSavingKey(key);
    setLoadError(null);

    const { error } = await saveAttendanceCell({
      student_id: studentId,
      class_id: selectedClassId,
      date: iso,
      status: nextStatus,
      period_number: 1,
    });

    setSavingKey(null);
    if (error) {
      setGridByKey(prevSnapshot);
      setLoadError(error);
    }
  }

  async function onCellClick(studentId: string, dayNum: number) {
    if (!selectedClassId || savingKey) return;
    const iso = toISODate(cy, cm0 + 1, dayNum);
    const key = cellKey(studentId, iso);
    const cur = gridByKey[key] ?? null;
    const idx = STATUS_ORDER.indexOf(cur);
    const nextStatus = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    await applyCellStatus(studentId, iso, nextStatus);
  }

  function exportCsv() {
    if (!selectedClassId || !filteredStudents.length) return;
    const headers = ['Student', ...visibleDayNumbers.map((d) => toISODate(cy, cm0 + 1, d))];
    const lines = [headers.join(',')];
    for (const st of filteredStudents) {
      const row = [
        `"${st.first_name} ${st.last_name}"`,
        ...visibleDayNumbers.map((d) => {
          const s = gridByKey[cellKey(st.id, toISODate(cy, cm0 + 1, d))];
          return s ?? '';
        }),
      ];
      lines.push(row.join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `davomat-${selectedClassId.slice(0, 8)}-${rangeStart}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const loading = classesLoading || (selectedClassId && (studentsLoading || attendanceLoading));

  const dayModeIso = toISODate(focusDate.getFullYear(), focusDate.getMonth() + 1, focusDate.getDate());

  return (
    <div className="flex h-full bg-[#F8FAFC] overflow-hidden" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      <div
        className={cn(
          'flex flex-col shrink-0 bg-white border-r border-slate-100 overflow-y-auto custom-scrollbar transition-all duration-300 w-[320px]'
        )}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h1 className="text-[20px] font-black text-slate-800 tracking-tight">All Classes</h1>
          </div>

          {classesLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Yuklanmoqda…
            </div>
          )}

          {!classesLoading && classes.length === 0 && (
            <p className="text-sm text-slate-500">Sinf topilmadi. Avval «Sinflar» bo&apos;limida sinf yarating.</p>
          )}

          <div className="space-y-4">
            {classes.map((cls, idx) => {
              const isSelected = selectedClassId === cls.id;
              const cardStyle = CLASS_CARD_STYLES[idx % CLASS_CARD_STYLES.length];
              const dot = LIST_DOT[idx % LIST_DOT.length];

              if (!isSelected) {
                return (
                  <div
                    key={cls.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedClassId(cls.id)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedClassId(cls.id)}
                    className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div className={cn('w-2.5 h-2.5 rounded-full', dot)} />
                    <span className="text-[15px] font-extrabold text-slate-600 group-hover:text-slate-800 transition-colors">
                      {cls.name}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={cls.id}
                  className={cn(
                    'border rounded-[24px] transition-all duration-300 shadow-sm',
                    cardStyle.border,
                    'ring-4',
                    cardStyle.ring
                  )}
                >
                  <div className={cn('p-6 pb-5 border-b border-dashed', cardStyle.border)}>
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border',
                          cardStyle.iconBorder,
                          cardStyle.accent
                        )}
                      >
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-[18px] font-black text-slate-800 mb-1">{cls.name}</h3>
                        <p className="text-[13px] font-bold text-slate-400">—</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex-1 bg-white border border-slate-100 rounded-xl py-3 px-2 text-center shadow-sm">
                        <p className="text-[18px] font-black text-slate-800">{statsForDay.present}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Present</p>
                      </div>
                      <div className="flex-1 bg-white border border-slate-100 rounded-xl py-3 px-2 text-center shadow-sm">
                        <p className="text-[18px] font-black text-slate-800">{statsForDay.absent}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Absent</p>
                      </div>
                    </div>

                    <div className="w-full">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        <span>Record</span>
                        <span>{statsForDay.recordPct}%</span>
                      </div>
                      <div className="h-1.5 bg-white border border-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all', cardStyle.bar)}
                          style={{ width: `${statsForDay.recordPct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {statsForDay.focusIso} uchun (keldi / kelmadi)
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-8 overflow-hidden min-w-0">
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-700 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <h1 className="text-[20px] font-black text-slate-800 tracking-tight truncate">{monthLabel}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                className={cn(
                  'w-10 h-10 flex items-center justify-center rounded-[14px] border text-slate-500 hover:bg-slate-50 transition-colors shadow-sm',
                  searchOpen ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200'
                )}
                aria-label="Qidiruv"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
                aria-label="Filtr"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={exportCsv}
                disabled={!selectedClassId || !filteredStudents.length}
                className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-40"
                aria-label="Eksport"
              >
                <Upload className="w-4 h-4" />
              </button>

              <div className="flex items-center bg-white border border-slate-200 rounded-[14px] shadow-sm overflow-hidden h-10">
                <button
                  type="button"
                  onClick={prevNav}
                  className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                  aria-label="Oldingi"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={goToday}
                  className="px-4 h-full flex items-center justify-center text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors border-x border-slate-200"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={nextNav}
                  className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                  aria-label="Keyingi"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={cycleViewMode}
                className="w-10 h-10 flex items-center justify-center rounded-[14px] bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-lg group relative"
                aria-label="Ko'rinish rejimi"
              >
                <Calendar className="w-4 h-4" />
                <span className="absolute top-12 right-0 whitespace-nowrap bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg pointer-events-none">
                  {viewMode === 'day' ? 'Barcha kunlar' : viewMode === 'class' ? 'Oy ko‘rinishi' : 'Kunlik ko‘rinish'}
                </span>
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="px-6 pb-2 border-b border-slate-50">
              <input
                type="search"
                placeholder="O‘quvchi ismi bo‘yicha qidirish…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          )}

          {loadError && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-rose-50 text-rose-800 text-sm px-4 py-2 border border-rose-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {loadError}
            </div>
          )}

          <div className="flex-1 overflow-auto custom-scrollbar relative min-h-0">
            {loading && (
              <div className="absolute inset-0 z-30 bg-white/60 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            )}
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th
                    className="sticky left-0 z-20 px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest min-w-[250px] border-r border-slate-100 bg-white shadow-[0_1px_0_#f1f5f9]"
                  >
                    STUDENT NAME
                  </th>

                  {viewMode === 'day' ? (
                    <>
                      <th className="w-20 px-2 py-4 text-center border-r border-slate-100 bg-slate-50 shadow-[0_1px_0_#f1f5f9]">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-bold text-slate-400">
                            {focusDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                          </span>
                          <span className="text-[14px] font-black text-slate-800">{focusDate.getDate()}</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-white shadow-[0_1px_0_#f1f5f9] text-left min-w-[280px]">
                        STATUS
                      </th>
                    </>
                  ) : (
                    visibleDayNumbers.map((d) => (
                      <th
                        key={d}
                        className="w-[60px] px-2 py-4 text-center border-r border-slate-100 bg-white shadow-[0_1px_0_#f1f5f9]"
                      >
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
                {filteredStudents.map((student) => {
                  const av = hashPick(student.id, AVATAR_BG);
                  const dayRowKey = cellKey(student.id, dayModeIso);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="sticky left-0 z-[15] px-6 py-4 border-r border-slate-100 bg-white group-hover:bg-slate-50/50 transition-colors shadow-[1px_0_0_#f1f5f9]">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm shrink-0',
                              av
                            )}
                          >
                            {initials(student.first_name, student.last_name)}
                          </div>
                          <span className="text-[14px] font-bold text-slate-700 truncate">
                            {student.first_name} {student.last_name}
                          </span>
                        </div>
                      </td>

                      {viewMode === 'day' ? (
                        <>
                          <td className="px-2 py-4 text-center border-r border-slate-100 bg-slate-50">
                            {renderCell(gridByKey[dayRowKey] ?? null, savingKey === dayRowKey)}
                          </td>
                          <td className="px-6 py-4 bg-white">
                            <div className="flex items-center gap-2 flex-wrap">
                              {(['present', 'absent', 'late', 'excused'] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    const cur = gridByKey[dayRowKey] ?? null;
                                    const next = cur === st ? null : st;
                                    void applyCellStatus(student.id, dayModeIso, next);
                                  }}
                                  className={cn(
                                    'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                                    gridByKey[dayRowKey] === st ? statusBtnActive(st) : 'text-slate-300 hover:bg-slate-100'
                                  )}
                                >
                                  {st === 'present' && <Check className="w-4 h-4" strokeWidth={3} />}
                                  {st === 'absent' && <X className="w-4 h-4" strokeWidth={3} />}
                                  {st === 'late' && <Clock className="w-4 h-4" strokeWidth={3} />}
                                  {st === 'excused' && <FileText className="w-4 h-4" strokeWidth={3} />}
                                </button>
                              ))}
                              <button
                                type="button"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-slate-100 transition-colors"
                                aria-hidden
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        visibleDayNumbers.map((d) => {
                          const iso = toISODate(cy, cm0 + 1, d);
                          const k = cellKey(student.id, iso);
                          const s = gridByKey[k] ?? null;
                          const busy = savingKey === k;
                          return (
                            <td key={d} className="px-2 py-4 text-center border-r border-slate-50">
                              <button
                                type="button"
                                onClick={() => void onCellClick(student.id, d)}
                                disabled={busy || !selectedClassId}
                                className="mx-auto block disabled:opacity-50"
                              >
                                {renderCell(s, busy)}
                              </button>
                            </td>
                          );
                        })
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!loading && selectedClassId && filteredStudents.length === 0 && (
              <div className="p-12 text-center text-slate-500 text-sm">O‘quvchilar ro‘yxati bo‘sh yoki qidiruv natijasi yo‘q.</div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-white shrink-0 mt-auto">
            <span className="text-[13px] font-bold text-slate-400">
              {filteredStudents.length} ta o‘quvchi
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center bg-emerald-100 text-emerald-500">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </div>
                <span className="text-[12px] font-bold text-slate-500">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center bg-rose-100 text-rose-500">
                  <X className="w-3 h-3" strokeWidth={3} />
                </div>
                <span className="text-[12px] font-bold text-slate-500">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-100 text-amber-500">
                  <Clock className="w-3 h-3" strokeWidth={3} />
                </div>
                <span className="text-[12px] font-bold text-slate-500">Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-100 text-blue-500">
                  <FileText className="w-3 h-3" strokeWidth={3} />
                </div>
                <span className="text-[12px] font-bold text-slate-500">Excused</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-[12px] font-bold text-slate-500">Bo‘sh / belgilanmagan</span>
              </div>
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

function cellKey(studentId: string, isoDate: string) {
  return `${studentId}|${isoDate}`;
}

function statusBtnActive(st: AttendanceStatus) {
  if (st === 'present') return 'bg-emerald-100 text-emerald-500';
  if (st === 'absent') return 'bg-rose-100 text-rose-500';
  if (st === 'late') return 'bg-amber-100 text-amber-500';
  return 'bg-blue-100 text-blue-500';
}

function renderCell(s: AttendanceStatus | null, busy: boolean) {
  if (busy) {
    return (
      <div className="mx-auto w-8 h-8 rounded-[10px] flex items-center justify-center bg-slate-50">
        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
      </div>
    );
  }
  if (!s) {
    return <div className="mx-auto w-8 h-8 rounded-[10px] border-2 border-dashed border-slate-200 bg-white" />;
  }
  if (s === 'present') {
    return (
      <div className="mx-auto w-8 h-8 rounded-[10px] bg-emerald-100 text-emerald-500 flex items-center justify-center">
        <Check className="w-4 h-4" strokeWidth={3} />
      </div>
    );
  }
  if (s === 'absent') {
    return (
      <div className="mx-auto w-8 h-8 rounded-[10px] bg-rose-100 text-rose-500 flex items-center justify-center">
        <X className="w-4 h-4" strokeWidth={3} />
      </div>
    );
  }
  if (s === 'late') {
    return (
      <div className="mx-auto w-8 h-8 rounded-[10px] bg-amber-100 text-amber-500 flex items-center justify-center">
        <Clock className="w-4 h-4" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div className="mx-auto w-8 h-8 rounded-[10px] bg-blue-100 text-blue-500 flex items-center justify-center">
      <FileText className="w-4 h-4" strokeWidth={3} />
    </div>
  );
}

