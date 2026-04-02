import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, X, Check, AlertTriangle, Volume2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const classOptions = ['5-A', '5-B', '6-A', '6-B', '7-A'];
const subjectOptions = ['Matematika', 'Algebra', 'Geometriya', 'Fizika'];

const mockStudents = [
  'Karimov Jasur',
  'Abdullayeva Madina',
  'Toshmatov Sardor',
  'Rahimova Zilola',
  'Nazarov Bobur',
  'Islomova Shahlo',
  'Umarov Azizbek',
  'Xolmatova Dilfuza',
  'Ergashev Sherzod',
  'Qodirova Kamola',
];

const gradeValues = [2, 3, 4, 5];

const gradeMap: Record<string, number> = {
  'bir': 1, '1': 1,
  'ikki': 2, '2': 2,
  'uch': 3, '3': 3,
  "to'rt": 4, 'tort': 4, 'turt': 4, '4': 4,
  'besh': 5, '5': 5,
};

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function matchStudent(text: string): { name: string; confidence: number } | null {
  const cleanText = text.toLowerCase().replace(/\d+/g, '').trim();
  const words = cleanText.split(/\s+/).filter(w => w.length >= 3);
  const candidates: { name: string; score: number }[] = [];

  for (const fullName of mockStudents) {
    const parts = fullName.toLowerCase().split(' ');
    const lastName = parts[0];
    const firstName = parts[1] ?? '';
    let best = 0;

    if (cleanText.includes(lastName)) best = Math.max(best, 0.95);
    else if (cleanText.includes(firstName)) best = Math.max(best, 0.80);
    else {
      for (const word of words) {
        for (const part of parts) {
          const maxLen = Math.max(word.length, part.length);
          const sim = 1 - levenshtein(word, part) / maxLen;
          if (sim > 0.65) best = Math.max(best, sim * 0.75);
        }
      }
    }
    if (best > 0.4) candidates.push({ name: fullName, score: best });
  }

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.score - a.score);
  return { name: candidates[0].name, confidence: candidates[0].score };
}

function extractGrade(text: string): number | null {
  const lower = text.toLowerCase();
  for (const word of lower.split(/\s+/)) {
    if (gradeMap[word] !== undefined) return gradeMap[word];
  }
  const nums = lower.match(/\d+/g);
  if (nums) {
    for (const n of nums) {
      const v = parseInt(n);
      if (v >= 1 && v <= 5) return v;
    }
  }
  return null;
}

interface BatchItem {
  id: string;
  student: string;
  grade: number;
  confidence: number;
}

const gradeColor = (g: number | null) => {
  if (g === null) return 'bg-zinc-100 text-zinc-500';
  if (g <= 2) return 'bg-red-500 text-white';
  if (g === 3) return 'bg-yellow-500 text-white';
  if (g === 4) return 'bg-blue-500 text-white';
  return 'bg-emerald-500 text-white';
};

const gradeRing = (g: number) => {
  if (g <= 2) return 'ring-red-300';
  if (g === 3) return 'ring-yellow-300';
  if (g === 4) return 'ring-blue-300';
  return 'ring-emerald-300';
};

export default function MobileGrades() {
  const [selectedClass, setSelectedClass] = useState('5-A');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [grades, setGrades] = useState<Record<string, number | null>>({});
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [batch, setBatch] = useState<BatchItem[]>([]);
  const [interimText, setInterimText] = useState('');
  const [flashStudent, setFlashStudent] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isVoiceModeRef = useRef(false);

  useEffect(() => { isVoiceModeRef.current = isVoiceMode; }, [isVoiceMode]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = 'uz-UZ';
    rec.continuous = true;      // Uzluksiz tinglaydi
    rec.interimResults = true;
    recognitionRef.current = rec;

    rec.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim().toLowerCase();
          setInterimText('');
          processSingleUtterance(transcript);
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      if (interim) setInterimText(interim);
    };

    rec.onerror = (event: any) => {
      if (event.error === 'no-speech') return;
      setIsListening(false);
      if (event.error !== 'aborted') {
        setVoiceError('Xato: ' + event.error);
        setTimeout(() => setVoiceError(null), 2500);
      }
    };

    rec.onend = () => {
      setIsListening(false);
      setInterimText('');
      // Auto-restart if still in voice mode
      if (isVoiceModeRef.current) {
        setTimeout(() => {
          try { rec.start(); setIsListening(true); } catch { /* already started */ }
        }, 300);
      }
    };

    return () => { rec.abort(); };
  }, []);

  function processSingleUtterance(transcript: string) {
    const studentMatch = matchStudent(transcript);
    const grade = extractGrade(transcript);

    if (!studentMatch || grade === null) return; // silently skip unrecognized

    // Check duplicate (same student already in batch)
    setBatch(prev => {
      const exists = prev.find(b => b.student === studentMatch.name);
      if (exists) {
        // Update grade for that student
        return prev.map(b => b.student === studentMatch.name ? { ...b, grade, confidence: studentMatch.confidence } : b);
      }
      return [...prev, { id: Date.now().toString(), student: studentMatch.name, grade, confidence: studentMatch.confidence }];
    });

    // Flash the student row
    setFlashStudent(studentMatch.name);
    setTimeout(() => setFlashStudent(null), 1200);
    if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
  }

  const startListening = useCallback(() => {
    try { recognitionRef.current?.start(); setIsListening(true); } catch { /* already running */ }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.abort();
    setIsListening(false);
    setInterimText('');
  }, []);

  function toggleVoiceMode() {
    if (isVoiceMode) {
      stopListening();
      setIsVoiceMode(false);
      isVoiceModeRef.current = false;
    } else {
      setIsVoiceMode(true);
      isVoiceModeRef.current = true;
      setBatch([]);
      startListening();
    }
  }

  function removeBatchItem(id: string) {
    setBatch(prev => prev.filter(b => b.id !== id));
  }

  function saveAll() {
    if (batch.length === 0) return;
    const updates: Record<string, number> = {};
    for (const item of batch) updates[item.student] = item.grade;
    setGrades(prev => ({ ...prev, ...updates }));
    setBatch([]);
    stopListening();
    setIsVoiceMode(false);
    isVoiceModeRef.current = false;
  }

  function handleGrade(student: string, grade: number) {
    setGrades(prev => ({ ...prev, [student]: prev[student] === grade ? null : grade }));
  }

  const gradedCount = Object.values(grades).filter(v => v !== null).length;

  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Tezkor baholash</h1>
        <button
          onClick={() => { if (confirm('Baholarni tozalash?')) setGrades({}); }}
          className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg active:bg-red-100 transition-colors"
        >
          Tozalash
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {classOptions.map(c => (
            <button key={c} onClick={() => setSelectedClass(c)}
              className={`flex-shrink-0 min-h-10 px-4 rounded-full text-sm font-medium transition-colors ${selectedClass === c ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {subjectOptions.map(s => (
            <button key={s} onClick={() => setSelectedSubject(s)}
              className={`flex-shrink-0 min-h-10 px-4 rounded-full text-sm font-medium transition-colors ${selectedSubject === s ? 'bg-blue-500 text-white' : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Voice mode status bar */}
      <AnimatePresence>
        {isVoiceMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 ${isListening ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800' : 'bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'}`}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-zinc-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  {isListening ? 'Eshitilyapti...' : 'Qayta ulanmoqda...'}
                </p>
                {interimText && (
                  <p className="text-xs text-zinc-400 truncate italic mt-0.5">"{interimText}"</p>
                )}
                {!interimText && (
                  <p className="text-xs text-zinc-400 mt-0.5">Masalan: "Karimov besh", "Madina to'rt"</p>
                )}
              </div>
              <Volume2 className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {voiceError && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700">{voiceError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch pending panel */}
      <AnimatePresence>
        {batch.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-sm"
          >
            <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {batch.length} ta baho tayyor
                </span>
              </div>
              <button onClick={() => setBatch([])} className="text-xs text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1">
                <Trash2 className="w-3 h-3" />
                Hammasini o'chir
              </button>
            </div>
            <div className="divide-y divide-zinc-50 dark:divide-zinc-700/50">
              {batch.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 flex-1">{item.student}</span>
                  <span className="text-xs text-zinc-400">{Math.round(item.confidence * 100)}%</span>
                  <span className={`w-8 h-8 rounded-lg text-sm font-black flex items-center justify-center ring-2 ${gradeColor(item.grade)} ${gradeRing(item.grade)}`}>
                    {item.grade}
                  </span>
                  <button onClick={() => removeBatchItem(item.id)} className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-red-400 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student List */}
      <div className="space-y-2">
        {mockStudents.map((student, i) => {
          const isFlashing = flashStudent === student;
          const inBatch = batch.find(b => b.student === student);
          return (
            <motion.div
              key={student}
              animate={isFlashing ? { scale: [1, 1.015, 1] } : {}}
              transition={{ duration: 0.4 }}
              className={`bg-white dark:bg-zinc-800/80 rounded-xl p-3 flex items-center justify-between shadow-sm transition-all duration-300 ${isFlashing ? 'ring-2 ring-emerald-400 shadow-emerald-100' : ''}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-6 h-6 bg-zinc-100 dark:bg-zinc-700 rounded-full flex items-center justify-center text-xs font-medium text-zinc-500 dark:text-zinc-400 flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{student}</span>
                {inBatch && (
                  <span className={`flex-shrink-0 w-6 h-6 rounded-md text-xs font-black flex items-center justify-center ${gradeColor(inBatch.grade)}`}>
                    {inBatch.grade}
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                {gradeValues.map(grade => (
                  <button
                    key={grade}
                    onClick={() => handleGrade(student, grade)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all active:scale-90 ${grades[student] === grade ? gradeColor(grade) : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'}`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom bar — sticky, not fixed */}
      <div className="sticky bottom-0 pt-3 pb-1 -mx-4 px-4 bg-gradient-to-t from-slate-100 dark:from-zinc-950 via-slate-100/90 dark:via-zinc-950/90 to-transparent">
        <div className="flex gap-2.5">
          {/* Mic toggle */}
          <button
            onClick={toggleVoiceMode}
            className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-all active:scale-90 flex-shrink-0 ${
              isVoiceMode ? 'bg-red-500 text-white shadow-red-500/25' : 'bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {isVoiceMode
              ? <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
              : <MicOff className="w-4 h-4" />
            }
          </button>

          {/* Save / Confirm all */}
          {batch.length > 0 ? (
            <button
              onClick={saveAll}
              className="flex-1 h-10 bg-emerald-500 text-white font-bold rounded-lg active:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {batch.length} ta bahoni saqlash
            </button>
          ) : (
            <button
              disabled={gradedCount === 0}
              className="flex-1 h-10 bg-emerald-500 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-semibold rounded-lg active:bg-emerald-600 shadow-lg shadow-emerald-500/20 disabled:shadow-none text-sm transition-all"
            >
              {gradedCount > 0 ? `Saqlash (${gradedCount} ta baho)` : 'Saqlash'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
