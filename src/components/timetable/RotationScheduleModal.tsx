import { useState } from 'react';

import { X, Minus, Plus, ArrowLeft, Info, List, Calendar as CalendarIcon, Trash2, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export function RotationScheduleModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1 State
  const [duration, setDuration] = useState(5);
  const [durationType, setDurationType] = useState<'weekly'|'daily'>('daily');
  const [configType, setConfigType] = useState<'num'|'letter'>('letter');

  // Step 2 State
  const [view, setView] = useState<'list'|'calendar'>('list');
  const [shiftRotation, setShiftRotation] = useState(true);
  const [countryHolidaysOpen, setCountryHolidaysOpen] = useState(false);
  const [holidayPreset, setHolidayPreset] = useState('No preset');

  const daysLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  const generatePreviewRow = (shiftStart: number) => {
    return daysLabels.map((lbl, idx) => {
      if (idx === 0) return { label: lbl, active: false, code: 'OFF' };
      // Just simple mock sequence for preview based on screenshot
      const sequenceNum = ['1','2','3','4','5','1','2'];
      const sequenceLet = ['A','B','C','D','E','A','B'];
      const baseCode = configType === 'num' ? `D${sequenceNum[(idx - 1 + shiftStart) % 5]}` : `D${sequenceLet[(idx - 1 + shiftStart) % 5]}`;
      return {
        label: lbl,
        active: true,
        code: baseCode,
        isFirstRow: shiftStart === 0
      };
    });
  };

  const row1 = generatePreviewRow(0);
  const row2 = generatePreviewRow(1);

  const customDays = [
    { name: "Kuzgi ta'til", date: "Tue, Nov 4, 2025" },
    { name: "Kuzgi ta'til", date: "Wed, Nov 5, 2025" },
    { name: "Kuzgi ta'til", date: "Thu, Nov 6, 2025" },
    { name: "Kuzgi ta'til", date: "Fri, Nov 7, 2025" },
    { name: "Kuzgi ta'til", date: "Sat, Nov 8, 2025" },
    { name: "Kuzgi ta'til", date: "Sun, Nov 9, 2025" },
    { name: "Qishki ta'til", date: "Sun, Dec 28, 2025" },
    { name: "Qishki ta'til", date: "Mon, Dec 29, 2025" },
    { name: "Qishki ta'til", date: "Tue, Dec 30, 2025" },
    { name: "Qishki ta'til", date: "Wed, Dec 31, 2025" },
  ];

  const presets = ['No preset', 'AU Australia', 'AT Austria', 'BE Belgium', 'BR Brazil', 'CA Canada', 'CN China', 'DK Denmark', 'FI Finland', 'FR France', 'DE Germany'];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] w-full max-w-[900px] border border-slate-100 flex overflow-hidden animate-in zoom-in-95 duration-200 h-[600px] max-h-[90vh]">
        
        {/* Left Settings Panel */}
        <div className="w-[320px] bg-[#fdfdfd] border-r border-slate-100 p-8 flex flex-col overflow-y-auto shrink-0 relative">
           
           {step === 1 ? (
             <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors mb-6">
               <X className="w-5 h-5" />
             </button>
           ) : (
             <button onClick={() => setStep(1)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors mb-6">
               <ArrowLeft className="w-5 h-5" />
             </button>
           )}
           
           <h2 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight mb-2">
             {step === 1 ? 'Rotation Schedule' : 'Blocked Days'}
           </h2>
           <p className="text-[13px] text-slate-500 font-medium mb-8 leading-relaxed">
             {step === 1 ? 'Configure your weekly class rotation structure.' : 'Set holidays and non-teaching days.'}
           </p>

           <div className="relative mb-10 shrink-0">
              <div className={`h-0.5 absolute top-1/2 -translate-y-1/2 left-4 right-4 z-0 transition-colors ${step === 2 ? 'bg-emerald-300' : 'bg-slate-200'}`}></div>
              <div className="flex justify-between items-center relative z-10 cursor-pointer">
                <button 
                  onClick={() => setStep(1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ring-4 ring-white transition-colors ${step === 1 ? 'bg-slate-900 text-white shadow-md' : 'bg-emerald-100 text-emerald-600'}`}>
                  1
                </button>
                <button 
                  onClick={() => setStep(2)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ring-4 ring-white transition-colors ${step === 2 ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                  2
                </button>
              </div>
           </div>

           {step === 1 ? (
             <>
               {/* Duration Settings */}
               <div className="space-y-4 mb-8">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">Duration</label>
                  <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3 bg-white shadow-sm">
                     <button onClick={() => setDuration(Math.max(1, duration - 1))} className="text-slate-400 hover:text-slate-900"><Minus className="w-4 h-4" /></button>
                     <span className="text-[13px] font-bold text-slate-700">{duration} {duration === 1 || durationType === 'weekly' && duration === 1 ? 'week' : 'days'}</span>
                     <button onClick={() => setDuration(duration + 1)} className="text-slate-400 hover:text-slate-900"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex bg-slate-50/50 border border-slate-200 rounded-xl p-1 shadow-sm">
                     <button 
                      onClick={() => setDurationType('weekly')}
                      className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all ${durationType === 'weekly' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                     >
                       Weekly
                     </button>
                     <button 
                      onClick={() => setDurationType('daily')}
                      className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all ${durationType === 'daily' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                     >
                       Daily
                     </button>
                  </div>
               </div>

               {/* Configuration Settings */}
               <div className="space-y-4 mb-auto">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">Configuration</label>
                  <div className="flex bg-slate-50/50 border border-slate-200 rounded-xl p-1 shadow-sm">
                     <button 
                      onClick={() => setConfigType('num')}
                      className={`flex-1 py-2.5 text-[13px] font-bold tracking-[0.2em] rounded-lg transition-all ${configType === 'num' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                     >
                       1 2 3
                     </button>
                     <button 
                      onClick={() => setConfigType('letter')}
                      className={`flex-1 py-2.5 text-[13px] font-bold tracking-[0.2em] rounded-lg transition-all ${configType === 'letter' ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                     >
                       A B C
                     </button>
                  </div>
               </div>

               {/* Footer */}
               <div className="space-y-3 pt-6 mt-6 border-t border-slate-100">
                  <button onClick={() => setStep(2)} className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold text-[13px] shadow-sm hover:bg-slate-900 transition-colors active:scale-95">Save Configuration</button>
                  <button onClick={onClose} className="w-full text-slate-400 py-3.5 rounded-xl font-bold text-[13px] hover:text-slate-900 hover:bg-slate-50 transition-colors active:scale-95">Cancel</button>
               </div>
             </>
           ) : (
             <>
               {/* Country Holidays */}
               <div className="space-y-4 mb-8">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">Country Holidays</label>
                  <div className="relative">
                    <button 
                      onClick={() => setCountryHolidaysOpen(!countryHolidaysOpen)} 
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between text-[13px] font-bold text-slate-700 hover:border-slate-300 transition-all shadow-sm"
                    >
                      <span>{holidayPreset}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${countryHolidaysOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {countryHolidaysOpen && (
                      <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50 py-2 max-h-64 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                         {presets.map(c => (
                            <div 
                              key={c} 
                              onClick={() => { setHolidayPreset(c); setCountryHolidaysOpen(false); }}
                              className="px-4 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer flex items-center gap-2 transition-colors"
                            >
                              {holidayPreset === c ? <Check className="w-4 h-4 text-slate-900" /> : <div className="w-4 h-4" />}
                              <span className={holidayPreset === c ? "font-bold text-slate-900" : ""}>{c}</span>
                            </div>
                         ))}
                      </div>
                    )}
                  </div>
               </div>

               {/* Shift Rotation */}
               <div className="space-y-4 mb-auto">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">Shift Rotation</label>
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex bg-slate-50/50 border border-slate-200 rounded-xl p-1 shadow-sm">
                     <button 
                      onClick={() => setShiftRotation(false)}
                      className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all ${!shiftRotation ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                     >
                       Off
                     </button>
                     <button 
                      onClick={() => setShiftRotation(true)}
                      className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-all ${shiftRotation ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                     >
                       On
                     </button>
                  </div>
               </div>

               {/* Footer */}
               <div className="space-y-3 pt-6 mt-6 border-t border-slate-100">
                  <button onClick={onClose} className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold text-[13px] shadow-sm hover:bg-slate-900 transition-colors active:scale-95">Done</button>
                  <button onClick={() => setStep(1)} className="w-full text-slate-400 py-3.5 rounded-xl font-bold text-[13px] hover:text-slate-900 hover:bg-slate-50 transition-colors active:scale-95">Back</button>
               </div>
             </>
           )}
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-white flex flex-col pt-6 relative overflow-hidden">
           
           {step === 1 ? (
             // Step 1 Preview 
             <div className="flex-1 flex flex-col justify-center px-10">
               <div className="flex flex-col gap-4">
                 <div className="flex gap-3 px-2">
                   {row1.map((day, idx) => (
                     <div key={`header-${idx}`} className="flex-1 text-center">
                        <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">{day.label}</span>
                     </div>
                   ))}
                 </div>
                 {/* Row 1 */}
                 <div className="flex gap-3">
                   {row1.map((day, idx) => (
                     <div key={`r1-${idx}`} className={`flex-1 aspect-square rounded-[12px] flex items-center justify-center text-[13px] font-bold transition-all
                        ${day.active 
                           ? 'border-[1.5px] border-emerald-400 text-emerald-600 bg-white shadow-sm hover:bg-emerald-50/50' 
                           : 'border border-dashed border-slate-200 text-slate-300 bg-slate-50/30'}
                     `}>
                        {day.code}
                     </div>
                   ))}
                 </div>
                 {/* Row 2 */}
                 {durationType === 'daily' && (
                   <div className="flex gap-3 mt-2">
                     {row2.map((day, idx) => (
                       <div key={`r2-${idx}`} className={`flex-1 aspect-square rounded-[12px] flex items-center justify-center text-[13px] font-bold transition-all
                          ${day.active 
                             ? 'border-[1.5px] border-slate-300 text-slate-600 bg-white hover:bg-slate-50 shadow-sm' 
                             : 'border border-dashed border-slate-200 text-slate-300 bg-slate-50/30'}
                       `}>
                          {day.code}
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
           ) : (
             // Step 2 Content
             <div className="flex-1 overflow-hidden flex flex-col animate-in fade-in duration-300">
                {/* Right Header */}
                <div className="px-8 flex justify-between items-center shrink-0 mb-6">
                  <h3 className="text-[17px] font-bold text-slate-900">Public Holidays</h3>
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 group relative cursor-pointer">
                    <span>Sep 2, 2025 – May 25, 2026</span>
                    <Info className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                    
                    {/* Tooltip */}
                    <div className="absolute right-0 top-full mt-2 w-[280px] bg-slate-800 text-white text-[12px] p-3 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 leading-relaxed font-sans">
                      Showing holidays for the current semester: 2025-2026-o'quv yili. Only dates within this range apply to the planner.
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="px-8 flex gap-4 shrink-0 pb-6 border-b border-slate-100">
                  <div className="flex bg-slate-50 border border-slate-200/60 p-1 rounded-xl shadow-sm">
                    <button onClick={() => setView('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${view === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                      <List className="w-4 h-4" /> List
                    </button>
                    <button onClick={() => setView('calendar')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${view === 'calendar' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>
                      <CalendarIcon className="w-4 h-4" /> Calendar
                    </button>
                  </div>
                  <div className="flex-1 flex gap-3">
                    <div className="relative flex-1">
                       <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                       <input type="text" placeholder="Select Dates" className="w-full h-full pl-9 pr-3 rounded-xl border border-slate-200/80 bg-white text-[13px] font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-slate-800 transition-colors" />
                    </div>
                    <div className="flex-[2] relative">
                       <input type="text" placeholder="Add a custom blocked day..." className="w-full h-full pl-4 pr-10 rounded-xl border border-slate-200/80 bg-white text-[13px] font-medium placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-slate-800 transition-colors" />
                       <button className="absolute right-3 top-3 text-slate-300 hover:text-slate-600"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                   {view === 'list' ? (
                     <>
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Custom Days</h4>
                        <div className="space-y-1">
                          {customDays.map((cd, i) => (
                             <div key={i} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-50 group border border-transparent hover:border-slate-100 transition-colors">
                                <div className="flex items-center gap-3">
                                  <span className="text-[13px] font-bold text-slate-700">{cd.name}</span>
                                  <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">Custom</span>
                                </div>
                                <div className="flex items-center gap-6">
                                  <span className="text-[13px] font-medium text-slate-400">{cd.date}</span>
                                  <div className="flex items-center gap-3">
                                    <button className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    <div className="w-4 h-4 rounded-[4px] border border-slate-300"></div>
                                  </div>
                                </div>
                             </div>
                          ))}
                        </div>
                     </>
                   ) : (
                     // Calendar View
                     <div className="max-w-[500px] mx-auto mt-4 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden select-none">
                        <div className="flex items-center justify-center gap-8 py-5 border-b border-slate-50">
                          <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                          <span className="text-[15px] font-extrabold text-slate-800">Mar 2026</span>
                          <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                        <div className="p-4 grid grid-cols-7 gap-x-1 gap-y-2">
                           {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                             <div key={d} className="text-center text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{d}</div>
                           ))}
                           {/* Empty days before March 1 (Sunday is 1st in Mar 2026! So no empty prefix) */}
                           
                           {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                             const isHoliday = day >= 20 && day <= 29;
                             const isToday = day === 29;
                             return (
                               <div key={day} className={`h-[52px] flex flex-col p-1.5 rounded-lg border border-transparent relative hover:border-slate-100 cursor-pointer ${isToday ? 'bg-slate-50' : ''}`}>
                                  <span className={`text-[12px] font-bold z-10 ${isToday ? 'w-6 h-6 flex items-center justify-center bg-slate-800 text-white rounded-full' : 'text-slate-700'}`}>{day}</span>
                                  {isHoliday && (
                                    <div className={`absolute bottom-1.5 left-1 right-1 px-1 py-0.5 rounded text-[9px] font-bold z-0 whitespace-nowrap overflow-hidden text-ellipsis ${isToday ? 'bg-orange-100 text-orange-600' : 'bg-orange-50 text-orange-500'}`}>
                                      Bahorgi ta'til
                                    </div>
                                  )}
                               </div>
                             );
                           })}
                           {/* Empty days to finish grid */}
                           <div className="h-[52px] p-1.5 opacity-30 text-[12px] font-medium text-slate-400">1</div>
                           <div className="h-[52px] p-1.5 opacity-30 text-[12px] font-medium text-slate-400">2</div>
                           <div className="h-[52px] p-1.5 opacity-30 text-[12px] font-medium text-slate-400">3</div>
                           <div className="h-[52px] p-1.5 opacity-30 text-[12px] font-medium text-slate-400">4</div>
                        </div>
                     </div>
                   )}
                </div>
             </div>
           )}

        </div>

      </div>
    </div>
  );
}
