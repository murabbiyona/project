import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera, CameraOff, CheckCircle, AlertCircle,
  Volume2, VolumeX, Users, Clock, XCircle, FileText
} from 'lucide-react';
import { useQRAttendance, type QRScanResult } from '../../hooks/useQRAttendance';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { usePaperScanner } from '../../hooks/usePaperScanner';

export default function MobileScanner() {
  const { user } = useAuth();
  const {
    session, scans, loading, error,
    startSession, handleScan, finishSession, scannedCount,
  } = useQRAttendance();

  const [isScanning, setIsScanning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastScan, setLastScan] = useState<QRScanResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [finishResult, setFinishResult] = useState<any>(null);
  const [activeMode, setActiveMode] = useState<'attendance' | 'exam'>('attendance');
  
  const { processFrame, saveResult: saveExamGrade, lastResult: paperResult, setLastResult: setPaperResult } = usePaperScanner();
  const [availableExams, setAvailableExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  // Sinf va fan ro'yxatlari (DB dan)
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);
  const startTime = useRef('');

  // Sinf va fanlarni yuklash
  useEffect(() => {
    (async () => {
      // If we have a user, get their specific assignments. If not, get general ones for testing.
      if (user) {
        const { data: assignments } = await supabase
          .from('teacher_assignments')
          .select('class_id, subject_id, classes:class_id(id, name), subjects:subject_id(id, name_uz)')
          .eq('teacher_id', user.id);

        if (assignments && assignments.length > 0) {
          const classMap = new Map<string, string>();
          const subjectMap = new Map<string, string>();
          for (const a of assignments) {
            const cls = a.classes as any;
            const subj = a.subjects as any;
            if (cls) classMap.set(cls.id, cls.name);
            if (subj) subjectMap.set(subj.id, subj.name_uz);
          }
          setClasses(Array.from(classMap, ([id, name]) => ({ id, name })));
          setSubjects(Array.from(subjectMap, ([id, name]) => ({ id, name })));
          return;
        }
      }
      
      // Fallback: barcha sinflar (Guest testing mode)
      const { data: allClasses } = await supabase
        .from('classes')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      setClasses((allClasses || []).map(c => ({ id: c.id, name: c.name })));

      const { data: allSubjects } = await supabase
        .from('subjects')
        .select('id, name_uz')
        .order('name_uz');
      setSubjects((allSubjects || []).map(s => ({ id: s.id, name: s.name_uz })));
    })();
  }, [user]);

  // Aktiv testlarni yuklash
  useEffect(() => {
    if (activeMode !== 'exam') return;
    (async () => {
      const userId = user?.id || '00000000-0000-0000-0000-000000000000';
      const { data } = await supabase
        .from('assessments')
        .select('*')
        .eq('teacher_id', userId)
        .eq('status', 'active')
        .eq('method', 'qr_code')
        .order('created_at', { ascending: false });
      setAvailableExams(data || []);
    })();
  }, [user, activeMode]);

  const playBeep = useCallback((type: 'success' | 'error') => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = type === 'success' ? 800 : 300;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + (type === 'success' ? 0.15 : 0.3));
    } catch {}
  }, [soundEnabled]);

  const onQRDetected = useCallback(async (decodedText: string) => {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      if (activeMode === 'attendance') {
        const result = await handleScan(decodedText);
        setLastScan(result);

        if (result.status === 'success') {
          playBeep('success');
          if (navigator.vibrate) navigator.vibrate(100);
        } else if (result.status === 'duplicate') {
          playBeep('error');
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        } else {
          playBeep('error');
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
      } else if (activeMode === 'exam' && selectedExam) {
        try {
          const exam = availableExams.find(e => e.id === selectedExam);
          if (!exam) return;

          let qrData;
          try {
            qrData = JSON.parse(decodedText);
          } catch {
            return;
          }

          if (qrData.examId) {
            playBeep('success');
            const video = document.querySelector('video');
            if (video) {
              await processFrame(video, {
                id: qrData.examId,
                answerKey: exam.answer_key,
                questionsCount: exam.questions_count,
                variantCount: exam.variant_count
              }, {
                studentId: qrData.studentId,
                variant: qrData.variant
              });
            }
          }
        } catch (e) {
          console.error("Exam scan error:", e);
        }
      }
    } finally {
      setTimeout(() => { processingRef.current = false; }, 1500);
    }
  }, [handleScan, playBeep, activeMode, selectedExam, availableExams, processFrame]);

  const startScanner = useCallback(async () => {
    setCameraError(null);
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        onQRDetected,
        () => {},
      );
      setIsScanning(true);
    } catch (err: any) {
      setCameraError(err?.message || 'Kamerani ochishda xatolik. Ruxsat bering.');
    }
  }, [onQRDetected]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => { scannerRef.current?.stop().catch(() => {}); };
  }, []);

  const handleStartSession = async () => {
    if (!selectedClass || !selectedSubject) return;
    const cls = classes.find(c => c.id === selectedClass);
    const subj = subjects.find(s => s.id === selectedSubject);
    if (!cls || !subj) return;

    startTime.current = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
    await startSession({
      classId: cls.id,
      className: cls.name,
      subjectId: subj.id,
      subjectName: subj.name,
    });
  };

  const handleFinish = async () => {
    await stopScanner();
    const result = await finishSession();
    if (result) {
      setFinishResult(result);
    }
  };

  const attendancePercent = session
    ? Math.round((scannedCount / Math.max(session.totalStudents, 1)) * 100)
    : 0;

  if (finishResult) {
    return (
      <div className="space-y-5 text-center pt-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900">Davomat yakunlandi!</h1>
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Sinf</span>
            <span className="font-medium">{finishResult.className}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Fan</span>
            <span className="font-medium">{finishResult.subjectName}</span>
          </div>
          <div className="border-t border-zinc-100 pt-3 flex justify-between text-sm">
            <span className="text-zinc-500">Kelganlar</span>
            <span className="font-bold text-emerald-600">{finishResult.present} ta</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Kelmaganlar</span>
            <span className="font-bold text-red-500">{finishResult.absent} ta</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Jami</span>
            <span className="font-medium">{finishResult.total} ta</span>
          </div>
          <div className="border-t border-zinc-100 pt-3">
            <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${finishResult.percent}%` }}
              />
            </div>
            <p className="text-center text-sm font-bold mt-2 text-emerald-600">{finishResult.percent}% davomat</p>
          </div>
        </div>
        <button
          onClick={() => setFinishResult(null)}
          className="w-full h-12 bg-zinc-900 text-white font-semibold rounded-xl"
        >
          Yangi sessiya
        </button>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="space-y-5">
        <div className="text-center pt-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Camera className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900">QR Skaner</h1>
          <p className="text-sm text-zinc-500 mt-1">Davomat yoki Testlarni skanerlang</p>
        </div>

        <div className="flex p-1 bg-zinc-100 rounded-2xl">
          <button
            onClick={() => setActiveMode('attendance')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeMode === 'attendance' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
            }`}
          >
            <Users className="w-4 h-4" /> Davomat
          </button>
          <button
            onClick={() => setActiveMode('exam')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeMode === 'exam' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'
            }`}
          >
            <FileText className="w-4 h-4" /> Paper Test
          </button>
        </div>

        {activeMode === 'exam' && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-700">Aktiv testni tanlang</label>
            <div className="space-y-2">
              {availableExams.length > 0 ? availableExams.map(e => (
                <button
                  key={e.id}
                  onClick={() => setSelectedExam(e.id)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all ${
                    selectedExam === e.id ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-zinc-200'
                  }`}
                >
                  <p className="font-bold text-zinc-900">{e.title}</p>
                  <p className="text-xs text-zinc-500 mt-1">Sinf: {e.class_id} • {e.questions_count} ta savol</p>
                </button>
              )) : (
                <div className="bg-zinc-50 p-6 rounded-2xl text-center border border-dashed border-zinc-200">
                  <p className="text-sm text-zinc-400">Aktiv testlar topilmadi.</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Dashboard &gt; Baholash bo'limidan yangi test yarating.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {(activeMode === 'attendance' || (activeMode === 'exam' && selectedExam)) && (
          <div className="space-y-3">
            {activeMode === 'attendance' && (
              <>
                <label className="text-sm font-medium text-zinc-700">Sinf tanlang</label>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {classes.length > 0 ? classes.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedClass(c.id)}
                      className={`flex-shrink-0 h-11 px-5 rounded-xl text-sm font-semibold transition-all ${
                        selectedClass === c.id
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                          : 'bg-white text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      {c.name}
                    </button>
                  )) : (
                    <p className="text-sm text-zinc-400 py-2">
                      {loading ? 'Yuklanmoqda...' : 'Sinflar topilmadi'}
                    </p>
                  )}
                </div>

                <label className="text-sm font-medium text-zinc-700 mt-2">Fan tanlang</label>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {subjects.length > 0 ? subjects.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSubject(s.id)}
                      className={`flex-shrink-0 h-11 px-5 rounded-xl text-sm font-semibold transition-all ${
                        selectedSubject === s.id
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                          : 'bg-white text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      {s.name}
                    </button>
                  )) : (
                    <p className="text-sm text-zinc-400 py-2">
                      {loading ? 'Yuklanmoqda...' : 'Fanlar topilmadi'}
                    </p>
                  )}
                </div>
              </>
            )}

            <button
              onClick={activeMode === 'attendance' ? handleStartSession : () => setIsScanning(true)}
              disabled={(activeMode === 'attendance' && (!selectedClass || !selectedSubject)) || loading}
              className="w-full h-14 bg-emerald-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 active:bg-emerald-600 shadow-lg shadow-emerald-200 disabled:opacity-40 disabled:shadow-none"
            >
              <Camera className="w-6 h-6" />
              {activeMode === 'attendance' ? (loading ? 'Yuklanmoqda...' : 'Boshlash') : 'Skanerni yoqish'}
            </button>
          </div>
        )}

        <div className="bg-zinc-50 rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700">Qanday ishlaydi?</h3>
          <div className="space-y-2 text-xs text-zinc-500">
            <div className="flex gap-2">
              <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
              Sinf va fanni tanlang
            </div>
            <div className="flex gap-2">
              <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
              Kamerani yoqib QR kodlarni skanerlang
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-zinc-900">
            {session.className} · {session.subjectName}
          </h1>
          <p className="text-xs text-zinc-500">
            <Clock className="w-3 h-3 inline mr-1" />
            Boshlangan: {startTime.current}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-zinc-600" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-700">
            <Users className="w-4 h-4 inline mr-1" />
            {scannedCount} / {session.totalStudents} o'quvchi
          </span>
          <span className={`text-sm font-bold ${
            attendancePercent >= 80 ? 'text-emerald-600' :
            attendancePercent >= 50 ? 'text-yellow-600' : 'text-red-500'
          }`}>
            {attendancePercent}%
          </span>
        </div>
        <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              attendancePercent >= 80 ? 'bg-emerald-500' :
              attendancePercent >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${attendancePercent}%` }}
          />
        </div>
      </div>

      <div className="bg-zinc-900 rounded-3xl overflow-hidden relative border-4 border-zinc-800">
        <div id="qr-reader" className={isScanning ? 'scale-105' : 'hidden'} />
        
        {isScanning && activeMode === 'exam' && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            <div className="w-[85%] aspect-[1/1.4] border-2 border-emerald-400/50 rounded-2xl shadow-[0_0_0_400px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
            </div>
            <p className="mt-4 text-emerald-400 font-bold bg-black/50 px-4 py-1.5 rounded-full text-xs shadow-lg backdrop-blur-sm">
              Blankani ramka ichiga kiriting
            </p>
          </div>
        )}

        {!isScanning && (
          <div className="flex flex-col items-center justify-center p-8 gap-4" style={{ minHeight: 250 }}>
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-3 border-r-3 border-emerald-400 rounded-br-lg" />
              <Camera className="w-10 h-10 text-zinc-500" />
            </div>
            <p className="text-zinc-400 text-sm">QR kodni kameraga ko'rsating</p>
          </div>
        )}

        {cameraError && (
          <div className="p-3 bg-red-500/10 flex items-center gap-2 text-red-300 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {cameraError}
          </div>
        )}

        {lastScan && (
          <div className={`mx-3 mb-3 p-3 rounded-xl flex items-center gap-3 ${
            lastScan.status === 'success' ? 'bg-emerald-500/20' :
            lastScan.status === 'duplicate' ? 'bg-yellow-500/20' : 'bg-red-500/20'
          }`}>
            {lastScan.status === 'success' ? (
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            ) : lastScan.status === 'duplicate' ? (
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${
                lastScan.status === 'success' ? 'text-emerald-300' :
                lastScan.status === 'duplicate' ? 'text-yellow-300' : 'text-red-300'
              }`}>
                {lastScan.studentName}
              </p>
              <p className="text-xs text-zinc-400">
                {lastScan.status === 'success' ? 'Qayd etildi ✓' :
                 lastScan.status === 'duplicate' ? 'Allaqachon qayd etilgan' :
                 "Noma'lum QR kod"}
                {' · '}{lastScan.time}
              </p>
            </div>
          </div>
        )}

        <div className="p-4 pt-0 bg-zinc-900">
          <button
            onClick={isScanning ? stopScanner : startScanner}
            className={`w-full h-12 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isScanning
                ? 'bg-red-500 text-white'
                : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isScanning ? (
              <><CameraOff className="w-5 h-5" /> To'xtatish</>
            ) : (
              <><Camera className="w-5 h-5" /> Kamerani yoqish</>
            )}
          </button>
        </div>
      </div>

      {paperResult && (
        <div className="fixed inset-x-4 bottom-24 bg-white rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 ring-1 ring-zinc-100 z-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900">Natija tayyor!</h3>
                <p className="text-xs text-zinc-500">Variant: {paperResult.variant}</p>
              </div>
            </div>
            <button onClick={() => setPaperResult(null)} className="p-2 hover:bg-zinc-100 rounded-full">
              <XCircle className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="bg-zinc-50 rounded-2xl p-4 flex items-center justify-between mb-5">
            <div className="text-center flex-1 border-r border-zinc-200">
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Ball</p>
              <p className="text-2xl font-black text-zinc-900">{paperResult.score} / {paperResult.maxScore}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Foiz</p>
              <p className={`text-2xl font-black ${
                (paperResult.score / paperResult.maxScore) >= 0.86 ? 'text-emerald-500' :
                (paperResult.score / paperResult.maxScore) >= 0.71 ? 'text-blue-500' :
                (paperResult.score / paperResult.maxScore) >= 0.56 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {Math.round((paperResult.score / paperResult.maxScore) * 100)}%
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setPaperResult(null)}
              className="flex-1 h-12 bg-zinc-100 text-zinc-600 font-bold rounded-xl"
            >
              Bekor qilish
            </button>
            <button
              onClick={async () => {
                try {
                  await saveExamGrade(paperResult);
                  setPaperResult(null);
                  playBeep('success');
                } catch (e) {
                  alert('Saqlashda xatolik yuz berdi');
                }
              }}
              className="flex-1 h-12 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-200"
            >
              Saqlash
            </button>
          </div>
        </div>
      )}

      {scans.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900 mb-2">
            Qayd etilganlar ({scannedCount})
          </h2>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {scans.map((scan, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-700 flex-shrink-0">
                    {scans.length - i}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{scan.studentName}</p>
                    <p className="text-[10px] text-zinc-400">{scan.time}</p>
                  </div>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleFinish}
        disabled={loading}
        className="w-full h-12 bg-zinc-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? 'Yakunlanmoqda...' : (
          <><CheckCircle className="w-5 h-5" /> Davomatni yakunlash</>
        )}
      </button>

      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
