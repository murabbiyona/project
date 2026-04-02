import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MoreHorizontal, Check, ChevronDown, ChevronRight,
  Calendar, X, Plus, Undo2, Redo2, Bold, Italic, Underline,
  Strikethrough, List, ListOrdered, Code, Minus, Link2,
  Image as ImageIcon, Video, File, Sliders, Clock, Target,
  Loader2, Search, RefreshCw, Send, Copy, BookOpen, Sparkles
} from 'lucide-react';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const CLASSES_DATA = [
  { id: '12', name: '9-B', color: 'bg-emerald-500', dotColor: 'bg-emerald-500', schedule: { start: '8:00 AM', end: '8:45 AM' } },
  { id: '13', name: '9-A', color: 'bg-amber-400',   dotColor: 'bg-amber-400',   schedule: { start: '11:25 AM', end: '12:10 PM' } },
  { id: '1',  name: '5-A', color: 'bg-rose-500',    dotColor: 'bg-rose-500',    schedule: { start: '10:35 AM', end: '11:20 AM' } },
  { id: '2',  name: '5-B', color: 'bg-orange-500',  dotColor: 'bg-orange-500',  schedule: { start: '9:40 AM',  end: '10:25 AM' } },
  { id: '3',  name: '5-D', color: 'bg-amber-500',   dotColor: 'bg-amber-500',   schedule: { start: '8:00 AM',  end: '8:45 AM'  } },
  { id: '4',  name: '6-A', color: 'bg-emerald-500', dotColor: 'bg-emerald-500', schedule: { start: '12:15 PM', end: '1:00 PM'  } },
  { id: '5',  name: '6-B', color: 'bg-cyan-500',    dotColor: 'bg-cyan-500',    schedule: { start: '13:00 PM', end: '13:45 PM' } },
  { id: '6',  name: '7-D', color: 'bg-fuchsia-500', dotColor: 'bg-fuchsia-500', schedule: { start: '15:30 PM', end: '16:15 PM' } },
  { id: '7',  name: '8-B', color: 'bg-orange-400',  dotColor: 'bg-orange-400',  schedule: { start: '17:10 PM', end: '17:55 PM' } },
  { id: '8',  name: '8-A', color: 'bg-rose-400',    dotColor: 'bg-rose-400',    schedule: { start: '13:00 PM', end: '13:45 PM' } },
];

const UNITS = [
  { id: '1', number: '01', title: 'Raqamli asoslar va xavfsizlik' },
  { id: '2', number: '02', title: 'Kommunikatsiya va AKT ta\u2018siri' },
  { id: '3', number: '03', title: 'Grafika va multimedia dizayni' },
  { id: '4', number: '04', title: 'Ma\u2018lumotlarni tahlil qilish (Elektron jadvallar)' },
  { id: '5', number: '05', title: 'Ma\u2018lumotlar bazasi va tizimlar' },
];

const STANDARDS = [
  { code: 'INF.9.4.1', subject: 'Informatika (9-sinf)' },
];

const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// ─── Types ───────────────────────────────────────────────────────────────────
interface ScheduleEntry {
  dateKey: string;        // 'YYYY-MM-DD'
  day: number;
  month: number;
  year: number;
  weekday: string;
  times: { className: string; start: string; end: string; color: string }[];
}

// ─── Mini Calendar Component ─────────────────────────────────────────────────
function MiniCalendar({
  selectedClasses,
  onAdd,
  onClose,
}: {
  selectedClasses: string[];
  onAdd: (entry: ScheduleEntry) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [useClassSchedule, setUseClassSchedule] = useState(true);
  const [activeClass, setActiveClass] = useState<string | null>(selectedClasses[0] || null);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showStartDrop, setShowStartDrop] = useState(false);
  const [showEndDrop, setShowEndDrop] = useState(false);

  const TIME_OPTS = [
    '7:00 AM','7:30 AM','7:40 AM','8:00 AM','8:30 AM','8:45 AM',
    '9:00 AM','9:30 AM','9:40 AM','10:00 AM','10:25 AM','10:30 AM',
    '11:00 AM','11:20 AM','11:25 AM','12:00 PM','12:10 PM','12:15 PM',
    '1:00 PM','1:30 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM',
  ];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Get class data for selected classes
  const selectedClassData = CLASSES_DATA.filter(c => selectedClasses.includes(c.name));

  // When "Use Class Schedule" is on and activeClass is set, determine start/end
  const getActiveTime = () => {
    if (useClassSchedule && activeClass) {
      const cls = CLASSES_DATA.find(c => c.name === activeClass);
      if (cls) return { start: cls.schedule.start, end: cls.schedule.end };
    }
    return { start: customStart, end: customEnd };
  };

  const handleAdd = () => {
    const times: { className: string; start: string; end: string; color: string }[] = [];
    if (useClassSchedule) {
      // Add all selected classes with their schedule times
      selectedClassData.forEach(cls => {
        times.push({ className: cls.name, start: cls.schedule.start, end: cls.schedule.end, color: cls.dotColor });
      });
    } else if (activeClass) {
      const t = getActiveTime();
      const cls = CLASSES_DATA.find(c => c.name === activeClass);
      if (cls) times.push({ className: cls.name, start: t.start, end: t.end, color: cls.dotColor });
    }

    const entry: ScheduleEntry = {
      dateKey: `${year}-${String(month + 1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`,
      day: selectedDay,
      month,
      year,
      weekday: WEEKDAYS[new Date(year, month, selectedDay).getDay()],
      times,
    };
    onAdd(entry);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-[18px] shadow-[0_12px_40px_rgba(0,0,0,0.16)] border border-slate-100 z-50 w-[340px] overflow-hidden animate-in fade-in zoom-in-95 duration-150">

      {/* Calendar */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
          <span className="text-[15px] font-extrabold text-slate-900">{MONTHS_LONG[month]} {year}</span>
          <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map(d => <div key={d} className="text-center text-[11px] font-bold text-slate-400 uppercase py-1.5">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, idx) => {
            const active = day === selectedDay;
            const tod = day !== null && isToday(day);
            return (
              <div key={idx} onClick={() => day && setSelectedDay(day)} className={`h-9 w-9 mx-auto flex items-center justify-center rounded-full text-[13px] font-bold transition-all cursor-pointer select-none
                ${!day ? '' : active ? 'bg-slate-900 text-white shadow-sm' : tod ? 'bg-slate-100 text-slate-900 ring-1 ring-slate-300' : 'text-slate-700 hover:bg-slate-100'}`}>
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mx-5"></div>

      {/* Use Class Schedule + Times */}
      <div className="px-5 py-4 space-y-4">
        {/* Checkbox */}
        <button
          onClick={() => setUseClassSchedule(!useClassSchedule)}
          className="flex items-center gap-2.5 w-full"
        >
          <div className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-colors ${useClassSchedule ? 'bg-slate-900 border-slate-900' : 'border-slate-300'}`}>
            {useClassSchedule && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
          </div>
          <span className="text-[13px] font-semibold text-slate-700">Use Class Schedule</span>
        </button>

        {/* Available Times (when Use Class Schedule is ON) */}
        {useClassSchedule && selectedClassData.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Times</p>
            {selectedClassData.map(cls => (
              <button
                key={cls.name}
                onClick={() => setActiveClass(activeClass === cls.name ? null : cls.name)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] border-2 transition-all ${activeClass === cls.name ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${cls.dotColor}`}></div>
                  <span className="text-[13px] font-extrabold text-slate-700">{cls.name}</span>
                </div>
                <span className="text-[12px] font-bold text-slate-500">{cls.schedule.start} - {cls.schedule.end}</span>
              </button>
            ))}
          </div>
        )}

        {/* Manual time selectors (when Use Class Schedule is OFF) */}
        {!useClassSchedule && (
          <div className="space-y-3">
            {/* Class selector */}
            {selectedClassData.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {selectedClassData.map(cls => (
                  <button key={cls.name} onClick={() => setActiveClass(cls.name)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold border-2 transition-all ${activeClass === cls.name ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${activeClass === cls.name ? 'bg-white' : cls.dotColor}`}></div>
                    {cls.name}
                  </button>
                ))}
              </div>
            )}

            {/* Start time */}
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-[13px] font-medium text-slate-600 w-20 shrink-0">Start time</span>
              <div className="relative flex-1">
                <button onClick={() => { setShowStartDrop(!showStartDrop); setShowEndDrop(false); }} className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 hover:border-slate-300 transition-colors">
                  <span className={customStart ? 'text-slate-900' : 'text-slate-400'}>{customStart || 'Select'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {showStartDrop && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto">
                    {TIME_OPTS.map(t => <button key={t} onClick={() => { setCustomStart(t); setShowStartDrop(false); }} className="w-full px-3 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50">{t}</button>)}
                  </div>
                )}
              </div>
            </div>

            {/* End time */}
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-[13px] font-medium text-slate-600 w-20 shrink-0">End time</span>
              <div className="relative flex-1">
                <button onClick={() => { setShowEndDrop(!showEndDrop); setShowStartDrop(false); }} className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 hover:border-slate-300 transition-colors">
                  <span className={customEnd ? 'text-slate-900' : 'text-slate-400'}>{customEnd || 'Select'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                {showEndDrop && (
                  <div className="absolute top-full mt-1 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto">
                    {TIME_OPTS.map(t => <button key={t} onClick={() => { setCustomEnd(t); setShowEndDrop(false); }} className="w-full px-3 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50">{t}</button>)}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100">
        <button onClick={onClose} className="px-4 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          Cancel
        </button>
        <button
          onClick={handleAdd}
          className="px-5 py-2 text-[13px] font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Details Panel ─────────────────────────────────────────────────────────────
function DetailsPanel({
  onScheduleChange,
}: {
  onScheduleChange: (hasSchedule: boolean) => void;
}) {
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['9-B', '9-A']);
  const [openUnitAccordion, setOpenUnitAccordion] = useState<string | null>(null);
  const [classUnits, setClassUnits] = useState<Record<string, string>>({ '9-B': '1', '9-A': '1' });
  const [showCalendar, setShowCalendar] = useState(false);
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [standards] = useState(STANDARDS);

  const toggleClass = (name: string) => {
    setSelectedClasses(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
  };

  const getClassColor = (name: string) => CLASSES_DATA.find(c => c.name === name)?.color || 'bg-slate-400';
  const getClassDot = (name: string) => CLASSES_DATA.find(c => c.name === name)?.dotColor || 'bg-slate-400';

  const handleAddSchedule = (entry: ScheduleEntry) => {
    const updated = [...scheduleEntries];
    const existing = updated.findIndex(e => e.dateKey === entry.dateKey);
    if (existing !== -1) {
      // Merge times
      const merged = { ...updated[existing] };
      entry.times.forEach(t => {
        if (!merged.times.find(mt => mt.className === t.className)) merged.times.push(t);
      });
      updated[existing] = merged;
    } else {
      updated.push(entry);
    }
    setScheduleEntries(updated);
    onScheduleChange(updated.length > 0);
  };

  const removeScheduleEntry = (dateKey: string) => {
    const updated = scheduleEntries.filter(e => e.dateKey !== dateKey);
    setScheduleEntries(updated);
    onScheduleChange(updated.length > 0);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-2.5 shrink-0 border-b border-slate-100">
        <Sliders className="w-4 h-4 text-slate-500" />
        <h2 className="text-[15px] font-extrabold text-slate-900 tracking-tight">Details</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">

        {/* CLASSES */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">CLASSES</span>
          <div className="relative">
            <button
              onClick={() => setShowClassDropdown(!showClassDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-[14px] hover:border-slate-300 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                {selectedClasses.slice(0, 4).map(name => (
                  <div key={name} className={`w-5 h-5 rounded-full ${getClassColor(name)} flex items-center justify-center`}>
                    <span className="text-[8px] font-black text-white">{name.replace('-','')}</span>
                  </div>
                ))}
                <span className="text-[13px] font-bold text-slate-700 ml-1">
                  {selectedClasses.length} class{selectedClasses.length !== 1 ? 'es' : ''}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showClassDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showClassDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 py-2 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => setSelectedClasses([])}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-slate-100"></div>
                  <span className="text-[13px] font-medium text-slate-500">No Class</span>
                </button>
                {CLASSES_DATA.map(cls => (
                  <button
                    key={cls.id}
                    onClick={() => toggleClass(cls.name)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${cls.color}`}></div>
                      <span className={`text-[13px] font-bold ${selectedClasses.includes(cls.name) ? 'text-slate-900' : 'text-slate-600'}`}>{cls.name}</span>
                    </div>
                    {selectedClasses.includes(cls.name) && (
                      <div className={`w-5 h-5 rounded-full ${cls.color} flex items-center justify-center`}>
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* UNITS */}
        {selectedClasses.length > 0 && (
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">UNITS</span>
            <div className="space-y-2">
              {selectedClasses.map(className => {
                const isOpen = openUnitAccordion === className;
                const selectedUnitId = classUnits[className];
                const selectedUnit = UNITS.find(u => u.id === selectedUnitId);

                return (
                  <div key={className} className="border border-slate-100 rounded-[14px] overflow-hidden bg-white shadow-sm">
                    <button
                      onClick={() => setOpenUnitAccordion(isOpen ? null : className)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${getClassDot(className)} shrink-0`}></div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider w-10 shrink-0">{className}</span>
                      <span className="flex-1 text-left text-[13px] font-bold text-slate-700 truncate">
                        {selectedUnit ? `${selectedUnit.number}. ${selectedUnit.title}` : 'Select unit...'}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-50 bg-slate-50/30">
                        <button
                          onClick={() => { setClassUnits(prev => ({ ...prev, [className]: '' })); setOpenUnitAccordion(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-100/50 transition-colors"
                        >
                          <span className="text-[13px] font-medium text-slate-500 pl-5">No unit</span>
                        </button>
                        {UNITS.map(unit => (
                          <button
                            key={unit.id}
                            onClick={() => { setClassUnits(prev => ({ ...prev, [className]: unit.id })); setOpenUnitAccordion(null); }}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-100/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                                <div className="w-2 h-2 rounded-sm bg-amber-400"></div>
                              </div>
                              <span className={`text-[13px] ${classUnits[className] === unit.id ? 'font-bold text-slate-900' : 'font-semibold text-slate-600'}`}>
                                {unit.number}. {unit.title}
                              </span>
                            </div>
                            {classUnits[className] === unit.id && <Check className="w-3.5 h-3.5 text-slate-700 shrink-0" strokeWidth={2.5} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">SCHEDULE</span>

          {/* Schedule Cards */}
          {scheduleEntries.map(entry => (
            <div key={entry.dateKey} className="border border-slate-100 rounded-[14px] bg-white shadow-sm mb-2 overflow-hidden">
              <div className="flex items-start gap-3 px-4 py-3">
                {/* Date badge */}
                <div className="flex flex-col items-center w-10 shrink-0 bg-slate-50 rounded-xl pt-1.5 pb-2 border border-slate-100">
                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">{MONTHS_SHORT[entry.month]}</span>
                  <span className="text-[18px] font-black text-slate-900 leading-none">{entry.day}</span>
                </div>

                {/* Time entries */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-extrabold text-slate-900 mb-1.5">{entry.weekday}</p>
                  {entry.times.map((t, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 mb-0.5">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{t.start} - {t.end}</span>
                    </div>
                  ))}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeScheduleEntry(entry.dateKey)}
                  className="text-slate-300 hover:text-slate-600 transition-colors shrink-0 mt-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add date button */}
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-slate-200 rounded-[14px] text-[13px] font-bold text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50/50 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              {scheduleEntries.length > 0 ? 'Add another date' : 'Add a date'}
            </button>
            {showCalendar && (
              <MiniCalendar
                selectedClasses={selectedClasses}
                onAdd={handleAddSchedule}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </div>
        </div>

        {/* STANDARDS */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">STANDARDS</span>
          {standards.map((std, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-[14px] shadow-sm mb-2">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-extrabold text-slate-900">{std.code}</p>
                <p className="text-[11px] font-medium text-slate-400">{std.subject}</p>
              </div>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-[14px] transition-colors border border-dashed border-slate-200">
            <Target className="w-4 h-4" />
            Manage Standards
          </button>
        </div>

      </div>
    </div>
  );
}


const ALL_STANDARDS = [
  { code: 'INF.9.4.1', desc: 'Fayllar iyerarxiyasi va formatlar' },
  { code: 'INF.9.4.2', desc: 'Shaxsiy ma\u02bclumotlar va parollar xavfsizligi' },
  { code: 'INF.9.4.3', desc: 'Kommunikatsiya vositalari va E-pochta' },
  { code: 'INF.9.4.4', desc: 'Rasterli va Vektorli grafika texnologiyasi' },
  { code: 'INF.9.4.5', desc: 'Elektron jadvalda matematik modellashtirish' },
  { code: 'INF.9.4.6', desc: 'Ma\u02bclumoтlarni vizuallashtirish (Diagrammalar)' },
  { code: 'INF.9.4.7', desc: 'Taqdimotda animatsiya va interaktivlik' },
  { code: 'INF.9.4.8', desc: 'AKTning jamiyatga ta\u02bcsiri va E-tijorat' },
  { code: 'INF.9.4.9', desc: 'Relyatsion ma\u02bclumotlar bazasi va CRUD' },
  { code: 'INF.9.4.10', desc: 'SQL so\u02bcrovlari va filtrlash' },
  { code: 'INF.9.4.11', desc: 'Loyiha: Ma\u02bcumotlar bazasini boshqarish tizimi' },
];

const AI_RESPONSE = `Ushbu dars mazmuniga asoslanib, quyidagi tavsiyalarni berish mumkin:

**1. Fayl tuzilmasini vizualizatsiya qilish:**
O'quvchilarga shunchaki papka ochishni emas, balki "Virtual Kutubxona" loyihasini yarattiring.
• *Namuna:* "Maktab" papkasi → Ichida "9-sinf" → Uning ichida "Informatika", "Tarix", "Ona tili" papkalari. Bu iyerarxiya tushunchasini hayotiy misol bilan mustahkamlaydi.

**2. Amaliy topshiriqni murakkablashtirish:**
O'quvchilarga shunchaki papka ochishni emas, balki "Virtual Kutubxona" loyihasini yarattiring.

**3. Tabaqalashtirilgan ta\u02bcim (Diferensiatsiya):**
• **Iqtidorli o'quvchilar uchun:** Fayllarni "Saralash" (Sort by) funksiyasidan tashqari, "Guruhlash" (Group by) funksiyasini o'rgatish.
• **Yordamga muhtoj o'quvchilar uchun:** Fayl nomini o'zgartirishda (nuqtadan keyingi qismini) o'chirib yubormaslik haqida eslatma berish (chunki fayl ochilmay qolishi mumkin).

**4. Baholash uchun Exit Ticket (Darsdan chiqish chiptasi):**
Dars oxirida o'quvchilarga quyidagi savolni bering: "Agar kompyuteringizda barcha papkalar o'chib ketib, 1000 ta fayl aralashib yotsa, ularni qaysi 3 ta belgi bo'yicha tartiblagan bo'lar edingiz? (Turi, sanasi, nomi)"

*Xulosa:* Rejangiz dars o'tish uchun tayyor va sifatli.`;

// ─── Standards Panel ──────────────────────────────────────────────────────────
function StandardsPanel({ onClose }: { onClose: () => void }) {
  const [tagged, setTagged] = useState<string[]>(['INF.9.4.1']);
  const [expanded, setExpanded] = useState(true);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const filtered = ALL_STANDARDS.filter(s =>
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.desc.toLowerCase().includes(search.toLowerCase())
  );

  const tagCount = tagged.length;
  const classColors = { '9-B': 'bg-emerald-500', '9-A': 'bg-amber-400' };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-slate-100 shrink-0">
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
        <h2 className="font-extrabold text-slate-900 text-[15px] tracking-tight flex-1">
          Standards
          {tagCount > 0 && <span className="ml-2 text-[11px] font-bold text-slate-400">{tagCount} tagged</span>}
        </h2>
        <button onClick={() => setShowSearch(!showSearch)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <Search className="w-3.5 h-3.5" />
        </button>
        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {showSearch && (
        <div className="px-3 py-2 border-b border-slate-100 shrink-0">
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search standards..."
            className="w-full text-[13px] font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 transition-colors"
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Subject group */}
        <div className="border-b border-slate-50">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors"
          >
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expanded ? '' : '-rotate-90'}`} />
            <div className="flex-1 text-left">
              <p className="text-[13px] font-extrabold text-slate-800">Informatika (9-sinf)</p>
              <p className="text-[11px] font-medium text-slate-400">
                {ALL_STANDARDS.length} standards{tagCount > 0 ? ` · ${tagCount} tagged` : ''}
              </p>
            </div>
            {/* Class pills */}
            <div className="flex gap-1">
              {Object.entries(classColors).map(([name, color]) => (
                <span key={name} className={`text-[9px] font-black text-white px-1.5 py-0.5 rounded-md ${color}`}>{name}</span>
              ))}
            </div>
            {/* Stars */}
            <div className="flex gap-0.5 text-amber-400 text-[11px]">{'★★★'}</div>
          </button>

          {expanded && (
            <div className="pb-2">
              {filtered.map(std => {
                const isTagged = tagged.includes(std.code);
                const isHovered = hoveredCode === std.code;

                return (
                  <div
                    key={std.code}
                    className="relative flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
                    onMouseEnter={() => setHoveredCode(std.code)}
                    onMouseLeave={() => setHoveredCode(null)}
                  >
                    {/* Checkbox / Check circle */}
                    <button
                      onClick={() => setTagged(prev => prev.includes(std.code) ? prev.filter(c => c !== std.code) : [...prev, std.code])}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isTagged ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {isTagged && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-extrabold text-slate-800">{std.code}</span>
                        {isTagged && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">Tagged</span>
                        )}
                      </div>
                      <p className="text-[12px] font-medium text-slate-500 truncate">{std.desc}</p>
                    </div>

                    {/* Hover tooltip */}
                    {isHovered && isTagged && (
                      <div className="absolute left-0 right-0 mx-3 bottom-full mb-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl px-4 py-3 animate-in fade-in zoom-in-95 duration-100">
                        <p className="text-[12px] font-extrabold text-slate-800 mb-0.5">{std.code}</p>
                        <p className="text-[11px] text-slate-500 mb-3">{std.desc}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400">Taught</span>
                          <button
                            onClick={() => setTagged(prev => prev.filter(c => c !== std.code))}
                            className="text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AI Planning Models ─────────────────────────────────────────────────────
const PLANNING_MODELS = [
  { id: '5e', title: '5E Model', subtitle: 'Engage, Explore, Explain, Elaborate, Evaluate', color: 'emerald' },
  { id: 'smart', title: 'SMART', subtitle: 'Specific, Measurable, Achievable, Relevant, Time-bound', color: 'blue' },
  { id: '2080', title: '20/80', subtitle: "20% nazariya, 80% amaliyot", color: 'purple' },
  { id: 'backward', title: 'Backward', subtitle: "Natijadan boshlab rejalashtirish", color: 'amber' },
];

const BLOOM_LEVELS = [
  { label: 'Eslash', color: 'bg-red-50 text-red-600 border-red-200' },
  { label: 'Tushunish', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { label: "Qo'llash", color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { label: 'Tahlil', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { label: 'Sintez', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { label: 'Baholash', color: 'bg-purple-50 text-purple-600 border-purple-200' },
];

const DURATIONS = [35, 40, 45, 80];

const MOCK_PLAN_SECTIONS = [
  { name: "Jalb qilish (Engage)", time: "5 daq", content: "O'quvchilarga real hayotdan to'g'ri burchakli uchburchak misollarini ko'rsating." },
  { name: "Tadqiq qilish (Explore)", time: "12 daq", content: "Guruhda ishlash. Har bir guruhga turli o'lchamdagi uchburchaklar beriladi." },
  { name: "Tushuntirish (Explain)", time: "10 daq", content: "Formulani rasmiy tarzda taqdim eting. Vizual isbotni ko'rsating." },
  { name: "Kengaytirish (Elaborate)", time: "13 daq", content: "Murakkabroq masalalarni yeching: masofa hisoblash, koordinatalar." },
  { name: "Baholash (Evaluate)", time: "5 daq", content: "Qisqa mustaqil ish: 3 ta masala. O'z-o'zini baholash varaqasi." },
];

// ─── AI Assistant Panel ────────────────────────────────────────────────────────
function AIAssistantPanel({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [aiTab, setAiTab] = useState<'suggest' | 'plan'>('suggest');
  const [selectedModel, setSelectedModel] = useState('5e');
  const [selectedBlooms, setSelectedBlooms] = useState<string[]>([]);
  const [duration, setDuration] = useState(45);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(AI_RESPONSE.replace(/\*\*/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBloom = (label: string) => {
    setSelectedBlooms(prev => prev.includes(label) ? prev.filter(b => b !== label) : [...prev, label]);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPlan(true);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2 border-b border-slate-100 shrink-0">
        <Sparkles className="w-4 h-4 text-violet-500 shrink-0" />
        <h2 className="font-extrabold text-slate-900 text-[15px] tracking-tight flex-1">AI Assistant</h2>
        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 px-3 py-2 border-b border-slate-100 shrink-0">
        <button
          onClick={() => setAiTab('suggest')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${aiTab === 'suggest' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          Tavsiyalar
        </button>
        <button
          onClick={() => setAiTab('plan')}
          className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${aiTab === 'plan' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          Dars rejalashtirish
        </button>
      </div>

      {aiTab === 'suggest' ? (
        <>
          {/* Suggestion Response */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="text-[13px] text-slate-700 leading-relaxed space-y-3 ai-content">
              <p>Ushbu dars mazmuniga asoslanib, quyidagi tavsiyalarni berish mumkin:</p>
              <div>
                <p className="font-extrabold text-slate-900 mb-1.5">1. Fayl tuzilmasini vizualizatsiya qilish:</p>
                <p>O'quvchilarga shunchaki papka ochishni emas, balki <strong className="font-bold">"Virtual Kutubxona"</strong> loyihasini yarattiring.</p>
                <ul className="mt-1.5 space-y-1 pl-4">
                  <li className="text-[12px]">• <em>Namuna:</em> "Maktab" papkasi → Ichida "9-sinf" → Uning ichida "Informatika", "Tarix", "Ona tili" papkalari.</li>
                </ul>
              </div>
              <div>
                <p className="font-extrabold text-slate-900 mb-1.5">2. Amaliy topshiriqni murakkablashtirish:</p>
                <p>O'quvchilarga shunchaki papka ochishni emas, balki <strong className="font-bold">"Virtual Kutubxona"</strong> loyihasini yarattiring.</p>
              </div>
              <div>
                <p className="font-extrabold text-slate-900 mb-1.5">3. Tabaqalashtirilgan ta'lim (Diferensiatsiya):</p>
                <ul className="space-y-1.5 pl-2">
                  <li className="text-[12px]">• <strong>Iqtidorli o'quvchilar uchun:</strong> Fayllarni "Saralash" funksiyasidan tashqari, "Guruhlash" funksiyasini o'rgatish.</li>
                  <li className="text-[12px]">• <strong>Yordamga muhtoj o'quvchilar uchun:</strong> Fayl nomini o'zgartirishda eslatma berish.</li>
                </ul>
              </div>
              <div>
                <p className="font-extrabold text-slate-900 mb-1.5">4. Baholash uchun Exit Ticket:</p>
                <p>Dars oxirida o'quvchilarga quyidagi savolni bering: <em>"Agar kompyuteringizda 1000 ta fayl aralashib yotsa, ularni qaysi 3 ta belgi bo'yicha tartiblagan bo'lar edingiz?"</em></p>
              </div>
              <p className="text-slate-500 italic text-[12px] border-t border-slate-100 pt-3">
                Xulosa: Rejangiz dars o'tish uchun tayyor va sifatli.
              </p>
            </div>
          </div>

          {/* Actions row */}
          <div className="px-4 pb-2 flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
              <BookOpen className="w-3.5 h-3.5" /> Darsga qo'shish
            </button>
            <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200">
              <Copy className="w-3.5 h-3.5" /> {copied ? 'Nusxalandi!' : 'Nusxalash'}
            </button>
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-[14px] px-3 py-2.5 focus-within:border-slate-400 transition-colors">
              <input
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Dars haqida savol bering..."
                className="flex-1 text-[13px] font-medium text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
              />
              <button disabled={!prompt.trim()} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-900 text-white disabled:opacity-30 hover:bg-slate-800 transition-colors shrink-0">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* AI Lesson Planner */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

            {/* Planning Model */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Rejalashtirish modeli</span>
              <div className="grid grid-cols-2 gap-1.5">
                {PLANNING_MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`p-2.5 rounded-xl text-left transition-all border ${
                      selectedModel === m.id
                        ? `bg-${m.color}-50 border-${m.color}-300 ring-1 ring-${m.color}-200`
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`text-[12px] font-extrabold ${selectedModel === m.id ? 'text-slate-900' : 'text-slate-700'}`}>{m.title}</span>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-1">{m.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Bloom's Taxonomy */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Blum taksonomiyasi</span>
              <div className="flex flex-wrap gap-1.5">
                {BLOOM_LEVELS.map(level => (
                  <button
                    key={level.label}
                    onClick={() => toggleBloom(level.label)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                      selectedBlooms.includes(level.label) ? level.color : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Davomiyligi</span>
              <div className="flex gap-1.5">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all border ${
                      duration === d
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {d} daq
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl font-bold text-[13px] text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 hover:from-emerald-600 hover:via-teal-600 hover:to-indigo-600 transition-all shadow-[0_8px_20px_-8px_rgba(16,185,129,0.7)] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Yaratilmoqda...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Dars reja yaratish</>
              )}
            </button>

            {/* Generated Plan */}
            {showPlan && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Yaratilgan reja</span>
                  <button className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <BookOpen className="w-3 h-3" /> Darsga qo'shish
                  </button>
                </div>
                {MOCK_PLAN_SECTIONS.map((section, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-100 rounded-[14px] shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-extrabold text-slate-900">{section.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">{section.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Editor Page ─────────────────────────────────────────────────────────
export default function LessonEditorPage() {
  const navigate = useNavigate();
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [activePanel, setActivePanel] = useState<'details'|'standards'|'comments'|'ai'>('details');
  const [isScheduled, setIsScheduled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simulate auto-save on content changes
  const triggerSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setIsSaving(true);
    saveTimerRef.current = setTimeout(() => setIsSaving(false), 1400);
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.addEventListener('input', triggerSave);
    return () => el.removeEventListener('input', triggerSave);
  }, [triggerSave]);

  const TOOLBAR_ITEMS = [
    { type: 'btn', icon: Undo2, cmd: 'undo' },
    { type: 'btn', icon: Redo2, cmd: 'redo' },
    { type: 'sep' },
    { type: 'btn', icon: Bold, cmd: 'bold' },
    { type: 'btn', icon: Italic, cmd: 'italic' },
    { type: 'btn', icon: Underline, cmd: 'underline' },
    { type: 'btn', icon: Strikethrough, cmd: 'strikeThrough' },
    { type: 'sep' },
    { type: 'txt', label: 'H1', cmd: 'h1' },
    { type: 'txt', label: 'H2', cmd: 'h2' },
    { type: 'txt', label: 'H3', cmd: 'h3' },
    { type: 'sep' },
    { type: 'btn', icon: List, cmd: 'insertUnorderedList' },
    { type: 'btn', icon: ListOrdered, cmd: 'insertOrderedList' },
    { type: 'btn', icon: Code, cmd: 'code' },
    { type: 'sep' },
    { type: 'btn', icon: Minus, cmd: 'hr' },
    { type: 'btn', icon: Link2, cmd: 'link' },
    { type: 'txt', label: 'Σ', cmd: 'math' },
    { type: 'btn', icon: Plus, cmd: 'add' },
  ] as const;

  const execFormat = (cmd: string) => {
    if (['bold','italic','underline','strikeThrough','insertUnorderedList','insertOrderedList'].includes(cmd)) {
      document.execCommand(cmd);
    } else if (cmd === 'h1') document.execCommand('formatBlock', false, 'h1');
    else if (cmd === 'h2') document.execCommand('formatBlock', false, 'h2');
    else if (cmd === 'h3') document.execCommand('formatBlock', false, 'h3');
    triggerSave();
  };

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: "'Urbanist', sans-serif", background: '#f9fafb' }}>

      {/* ── Left icon sidebar ── */}
      <div className="w-[52px] shrink-0 flex flex-col items-center py-4 gap-1 bg-white border-r border-slate-100 z-10">
        <button
          onClick={() => navigate('/lessons')}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        {(['blocks','focus','edit','history','list','analytics','search','settings','integrations'] as const).map((_, i) => (
          <button key={i} className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors" />
        ))}
      </div>

      {/* ── Center: Editor ── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">

        {/* Top bar */}
        <div className="h-[52px] px-5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[13px] font-bold text-slate-700 truncate max-w-[320px]">
              01. Kompyuterda ma'lumotlarni tartiblash
            </span>

            {/* Status badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-colors ${isScheduled ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isScheduled ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>
              {isScheduled ? 'Scheduled' : 'Unscheduled'}
            </div>

            {/* Save state */}
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[12px] font-medium text-slate-400">Last edited about 6 hours ago</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2 flex items-center gap-0.5 border-b border-slate-100/80 shrink-0 flex-wrap">
          {TOOLBAR_ITEMS.map((item, i) => {
            if (item.type === 'sep') return <div key={i} className="w-px h-4 bg-slate-200 mx-1.5" />;
            if (item.type === 'txt') return (
              <button
                key={i}
                onMouseDown={e => { e.preventDefault(); execFormat(item.cmd); }}
                className="px-2 py-1 rounded-md text-[12px] font-black text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors min-w-[28px] text-center"
              >
                {item.label}
              </button>
            );
            const Icon = (item as any).icon;
            return (
              <button
                key={i}
                onMouseDown={e => { e.preventDefault(); execFormat(item.cmd); }}
                className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}

          {/* Add block */}
          <div className="ml-auto relative">
            <button
              onClick={e => { e.stopPropagation(); setShowAddBlock(!showAddBlock); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
            {showAddBlock && (
              <div onClick={e => e.stopPropagation()} className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] py-2 z-50 w-44 animate-in fade-in zoom-in-95 duration-150">
                {[
                  { icon: <ImageIcon className="w-4 h-4 text-blue-500" />, label: 'Image' },
                  { icon: <Video className="w-4 h-4 text-purple-500" />, label: 'Video' },
                  { icon: <File className="w-4 h-4 text-slate-500" />, label: 'File' },
                ].map(item => (
                  <button key={item.label} onClick={() => setShowAddBlock(false)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-[13px] font-bold text-slate-700">
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editable content */}
        <div className="flex-1 overflow-y-auto px-[100px] py-10">
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={triggerSave}
            className="text-[36px] font-black text-slate-900 outline-none mb-8 leading-tight tracking-tight"
          >
            01. Kompyuterda ma'lumotlarni tartiblash
          </div>

          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[400px] outline-none text-[15px] text-slate-700 leading-relaxed lesson-editor-content"
          >
            <p><strong>Dars mavzusi: Kompyuterda ma'lumotlarni tartiblash va fayl turlari</strong></p>
            <p>Dars kodi: INF.9.4.1 &nbsp;&nbsp;<strong>Vaqt:</strong> 45 daqiqa</p>
            <br />
            <h2>1. Kutilayotgan natija (SMART Maqsad)</h2>
            <p>Dars yakunida o'quvchi:</p>
            <ul>
              <li><strong>Fayllarni boshqarish</strong> amallarini (yaratish, nomlash, papkalarga ajratish) biladi.</li>
              <li>Word hujjatining standart kengaytmasi <strong>.docx</strong> ekanini aniqlay oladi.</li>
              <li>Iyerarxik papkalar tuzilmasini mustaqil yarata oladi.</li>
            </ul>
            <br />
            <h2>2. Darsning nazariy qismi (15 daqiqa)</h2>
            <ul>
              <li><strong>Fayl kengaytmasi nima?</strong> Fayl kengaytmasi — fayl nomi oxirida nuqtadan keyin qo'yadigan qo'shimcha bo'lib, u kompyuterga ushbu faylni ochish uchun qaysi dasturni ishga tushirish kerakligini aytadi.
                <ul>
                  <li><strong>.docx</strong> — matnli hujjatlar (Microsoft Word) uchun standart kengaytma.</li>
                  <li><strong>.pdf</strong> — o'zgarmas formadagi hujjatlar uchun.</li>
                </ul>
              </li>
              <li><strong>Fayllarni nomlash qoidalari:</strong> Fayl nomi ichidagi ma'lumotni tushunishga yordam berishi kerak. Nomlashda bo'sh joy qoldirmaslik va uning o'rniga <strong>pastki chiziqdan (_)</strong> foydalanish tavsiya etiladi.</li>
              <li><strong>Iyerarxik struktura:</strong> Bu ma'lumotlarni "daraxt" ko'rinishida, papkalar ichida ichki papkalar yaratish orqali tartiblashdir.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Right Details Panel ── */}
      <div className="w-[320px] shrink-0 bg-white border-l border-slate-100 flex flex-col h-full overflow-hidden">
        {/* Panel tabs — rightmost icons */}
        <div className="flex items-center justify-end gap-0.5 px-2 py-2.5 border-b border-slate-100 shrink-0">
          {([
            { id: 'details',   el: <Sliders className="w-4 h-4" /> },
            { id: 'standards', el: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
            { id: 'comments',  el: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
            { id: 'ai',        el: <Sparkles className="w-4 h-4" /> },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id as any)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                activePanel === tab.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              {tab.el}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden">
          {activePanel === 'details' && <DetailsPanel onScheduleChange={setIsScheduled} />}
          {activePanel === 'standards' && <StandardsPanel onClose={() => setActivePanel('details')} />}
          {activePanel === 'ai' && <AIAssistantPanel onClose={() => setActivePanel('details')} />}
          {activePanel === 'comments' && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-300" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-[13px] font-bold text-slate-500 mb-1">No comments yet</p>
              <p className="text-[12px] text-slate-400">Comments will appear here once added.</p>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown on outside click */}
      {showAddBlock && (
        <div className="fixed inset-0 z-40" onClick={() => setShowAddBlock(false)} />
      )}

      {/* Styles */}
      <style>{`
        .lesson-editor-content h1 { font-size: 2em; font-weight: 900; margin: 1em 0 0.5em; color: #0f172a; }
        .lesson-editor-content h2 { font-size: 1.35em; font-weight: 800; margin: 1.2em 0 0.5em; color: #1e293b; }
        .lesson-editor-content h3 { font-size: 1.1em; font-weight: 700; margin: 1em 0 0.4em; color: #334155; }
        .lesson-editor-content p { margin: 0.4em 0; }
        .lesson-editor-content ul, .lesson-editor-content ol { padding-left: 1.6em; margin: 0.5em 0; }
        .lesson-editor-content li { margin: 0.35em 0; }
        .lesson-editor-content ul li { list-style-type: disc; }
        .lesson-editor-content ul ul li { list-style-type: circle; }
        .lesson-editor-content ol li { list-style-type: decimal; }
        .lesson-editor-content strong { font-weight: 800; color: #1e293b; }
        .lesson-editor-content a { color: #3b82f6; text-decoration: underline; }
        .lesson-editor-content code { background: #f1f5f9; padding: 0.1em 0.4em; border-radius: 4px; font-size: 0.9em; font-family: monospace; }
      `}</style>
    </div>
  );
}
