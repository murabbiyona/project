import { useState } from 'react';

const classOptions = ['5-A', '5-B', '6-A', '6-B', '7-A'];
const subjectOptions = ['Matematika', 'Algebra', 'Geometriya', 'Fizika'];

const mockStudents = [
  'Karimov Jasur',
  'Abdullayeva Madina',
  'Toshmatov Sardor',
  'Rahimova Zilola',
  'Nazarov Bobur',
  'Islomova Shahlo',
  "Umarov Azizbek",
  "Xolmatova Dilfuza",
  "Ergashev Sherzod",
  "Qodirova Kamola",
];

const gradeValues = [2, 3, 4, 5];

export default function MobileGrades() {
  const [selectedClass, setSelectedClass] = useState('5-A');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const [grades, setGrades] = useState<Record<string, number | null>>({});

  const handleGrade = (student: string, grade: number) => {
    setGrades((prev) => ({
      ...prev,
      [student]: prev[student] === grade ? null : grade,
    }));
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Header */}
      <h1 className="text-2xl font-bold text-zinc-900">Tezkor baholash</h1>

      {/* Class filter pills */}
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {classOptions.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedClass(c)}
              className={`flex-shrink-0 min-h-10 px-4 rounded-full text-sm font-medium ${
                selectedClass === c
                  ? 'bg-emerald-500 text-white'
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
              className={`flex-shrink-0 min-h-10 px-4 rounded-full text-sm font-medium ${
                selectedSubject === s
                  ? 'bg-blue-500 text-white'
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
            className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm"
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
                  className={`w-10 h-10 rounded-lg text-sm font-bold ${
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

      {/* Save Button */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-4 bg-gradient-to-t from-zinc-100 via-zinc-100 to-transparent pt-6">
        <button className="w-full min-h-12 bg-emerald-500 text-white font-semibold rounded-xl active:bg-emerald-600 shadow-lg">
          Saqlash
        </button>
      </div>
    </div>
  );
}
