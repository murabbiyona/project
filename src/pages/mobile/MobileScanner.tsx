import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera, CameraOff, CheckCircle, AlertCircle,
  Volume2, VolumeX, Users, Clock, XCircle
} from 'lucide-react';
import { useQRAttendance, type QRScanResult } from '../../hooks/useQRAttendance';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

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
    if (!user) return;
    (async () => {
      // O'qituvchiga biriktirilgan sinflar
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
      } else {
        // Fallback: barcha sinflar
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
      }
    })();
  }, [user]);

  // Ovoz chiqarish (Telegram bot vibrate kabi)
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

  // QR skanerlanganda — backend ga yozish
  const onQRDetected = useCallback(async (decodedText: string) => {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
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
    } finally {
      // 1 soniya kutish — bir xil QR kodni qayta-qayta o'qimaslik uchun
      setTimeout(() => { processingRef.current = false; }, 1000);
    }
  }, [handleScan, playBeep]);

  // Kamerani yoqish
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

  // Kamerani to'xtatish
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

  // Unmount da kamerani to'xtatish
  useEffect(() => {
    return () => { scannerRef.current?.stop().catch(() => {}); };
  }, []);

  // Sessiya boshlash
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

  // Davomat yakunlash
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

  // ─── YAKUNLASH NATIJASI ───────────────────
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
        <p className="text-xs text-zinc-400">Telegram orqali xabarnoma yuborildi</p>
        <button
          onClick={() => setFinishResult(null)}
          className="w-full h-12 bg-zinc-900 text-white font-semibold rounded-xl"
        >
          Yangi sessiya
        </button>
      </div>
    );
  }

  // ─── SESSIYA BOSHLANMAGAN — sinf/fan tanlash ───
  if (!session) {
    return (
      <div className="space-y-5">
        <div className="text-center pt-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Camera className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900">QR Davomat</h1>
          <p className="text-sm text-zinc-500 mt-1">O'quvchilar QR kodini skanerlang</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-3">
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
        </div>

        <button
          onClick={handleStartSession}
          disabled={!selectedClass || !selectedSubject || loading}
          className="w-full h-14 bg-emerald-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-2 active:bg-emerald-600 shadow-lg shadow-emerald-200 disabled:opacity-40 disabled:shadow-none"
        >
          <Camera className="w-6 h-6" />
          {loading ? 'Yuklanmoqda...' : 'Boshlash'}
        </button>

        {/* Qanday ishlaydi */}
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
            <div className="flex gap-2">
              <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
              Har bir QR skan — "keldi" deb yoziladi (DB ga)
            </div>
            <div className="flex gap-2">
              <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">4</span>
              Yakunlash — kelmaganlar avtomatik "absent" bo'ladi
            </div>
            <div className="flex gap-2">
              <span className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">5</span>
              Telegram orqali xabarnoma yuboriladi
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── AKTIV SESSIYA — SKANERLASH ─────────────
  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
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

      {/* Live counter */}
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

      {/* QR Scanner */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden">
        <div id="qr-reader" className={isScanning ? '' : 'hidden'} />

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

        {/* Oxirgi skan natijasi */}
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

        {/* Kamera tugmasi */}
        <div className="p-3 pt-0">
          <button
            onClick={isScanning ? stopScanner : startScanner}
            className={`w-full h-12 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              isScanning
                ? 'bg-red-500 text-white'
                : 'bg-emerald-500 text-white'
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

      {/* Skan tarixi */}
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

      {/* Yakunlash tugmasi */}
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
