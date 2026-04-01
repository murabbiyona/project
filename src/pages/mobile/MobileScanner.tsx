import { Camera, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const mockScans = [
  { name: 'Karimov Jasur', time: '08:01' },
  { name: 'Abdullayeva Madina', time: '08:02' },
  { name: 'Toshmatov Sardor', time: '08:03' },
  { name: "Rahimova Zilola", time: '08:04' },
  { name: "Nazarov Bobur", time: '08:05' },
];

const classes = ['5-A', '5-B', '6-A', '6-B', '7-A'];
const subjects = ['Matematika', 'Algebra', 'Geometriya'];

export default function MobileScanner() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const today = new Date().toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Camera className="w-6 h-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-zinc-900">QR Davomat</h1>
      </div>

      {/* Camera Viewfinder */}
      <div className="bg-zinc-900 rounded-2xl p-6 flex flex-col items-center gap-4">
        <div
          className="relative bg-zinc-800 rounded-xl flex items-center justify-center"
          style={{ width: 300, height: 300 }}
        >
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />

          <p className="text-zinc-400 text-sm text-center px-8">
            QR kodni kameraga ko'rsating
          </p>
        </div>

        <button className="w-full min-h-12 bg-emerald-500 text-white font-semibold rounded-xl active:bg-emerald-600">
          Kamerani yoqish
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full min-h-12 px-4 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-base appearance-none"
        >
          <option value="">Sinfni tanlang</option>
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full min-h-12 px-4 bg-white border border-zinc-200 rounded-xl text-zinc-900 text-base appearance-none"
        >
          <option value="">Fanni tanlang</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="bg-white border border-zinc-200 rounded-xl px-4 min-h-12 flex items-center text-zinc-600">
          {today}
        </div>
      </div>

      {/* Scan Results */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 mb-3">Oxirgi skanerlashlar</h2>
        <div className="space-y-3">
          {mockScans.map((scan, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-sm font-bold text-emerald-700">
                  {scan.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-zinc-900">
                  {scan.name} — {scan.time}
                </span>
              </div>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-zinc-500 mt-3">
          5/28 o'quvchi qayd etildi
        </p>
      </div>

      {/* Finish Button */}
      <button className="w-full min-h-12 bg-red-500 text-white font-semibold rounded-xl active:bg-red-600">
        Davomat yakunlash
      </button>
    </div>
  );
}
