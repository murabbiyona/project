import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RotateCcw } from 'lucide-react';

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

export default function MobileGrades() {
  const [selectedClass, setSelectedClass] = useState('5-A');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [grades, setGrades] = useState<Record<string, number | null>>({});
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'uz-UZ';

      rec.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        processUtterance(transcript);
      };

      rec.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          setIsListening(false);
          setVoiceStatus('Xatolik: ' + event.error);
          setTimeout(() => setVoiceStatus(null), 2000);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const processUtterance = (text: string) => {
    const studentMatch = matchStudent(text);
    const grade = extractGrade(text);

    if (studentMatch && grade !== null) {
      handleGrade(studentMatch.name, grade);
      setVoiceStatus(`${studentMatch.name}: ${grade}`);
      setTimeout(() => setVoiceStatus(null), 2000);
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      setVoiceStatus('Tushunmadim...');
      setTimeout(() => setVoiceStatus(null), 1500);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setVoiceStatus('Eshitilyapti...');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleGrade = (student: string, grade: number) => {
    setGrades((prev) => ({
      ...prev,
      [student]: prev[student] === grade ? null : grade,
    }));
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Tezkor baholash</h1>
        <button 
          onClick={() => { if(confirm('Baholarni tozalash?')) setGrades({}); }}
          className="text-zinc-400 active:text-red-500 transition-colors"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Class filter pills */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {classOptions.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedClass(c)}
              className={`flex-shrink-0 min-h-10 px-4 rounded-full text-sm font-medium transition-all ${
                selectedClass === c
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white text-zinc-700 border border-zinc-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {subjectOptions.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`flex-shrink-0 min-h-10 px-4 rounded-full text-sm font-medium transition-all ${
                selectedSubject === s
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-zinc-700 border border-zinc-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-2">
        {mockStudents.map((student, i) => (
          <div
            key={student}
            className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-transparent active:border-zinc-200"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-zinc-100 rounded-full flex items-center justify-center text-xs font-medium text-zinc-500">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-zinc-900">{student}</span>
            </div>
            <div className="flex gap-1.5">
              {gradeValues.map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleGrade(student, grade)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all active:scale-95 ${
                    grades[student] === grade
                      ? grade <= 2
                        ? 'bg-red-500 text-white'
                        : grade === 3
                        ? 'bg-yellow-500 text-white'
                        : grade === 4
                        ? 'bg-blue-500 text-white'
                        : 'bg-emerald-500 text-white'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-zinc-100 via-zinc-100 to-transparent flex gap-3">
        <button 
          onClick={toggleListening}
          className={`w-14 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-white text-zinc-600 border border-zinc-200'
          }`}
        >
          {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>

        <button className="flex-1 min-h-12 bg-emerald-500 text-white font-semibold rounded-xl active:bg-emerald-600 shadow-lg relative overflow-hidden transition-all">
          {voiceStatus ? (
            <span className="absolute inset-0 flex items-center justify-center bg-emerald-600 animate-in fade-in slide-in-from-bottom-2 uppercase font-black italic text-xs">
              {voiceStatus}
            </span>
          ) : (
            `Saqlash (${Object.values(grades).filter(Boolean).length} ta baho)`
          )}
        </button>
      </div>
    </div>
  );
}
