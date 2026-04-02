import { useMemo } from 'react';
import { Users, BarChart2, CheckCircle, ClipboardList, TrendingUp, Trophy } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';

function GradeBadge({ grade }: { grade: number }) {
  const rounded = Math.round(grade);
  const colors: Record<number, string> = {
    5: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    4: 'bg-blue-50 text-blue-600 border-blue-200',
    3: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    2: 'bg-red-50 text-red-600 border-red-200',
  };
  const color = colors[rounded] || 'bg-zinc-50 text-zinc-500 border-zinc-200';
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
      {grade.toFixed(1)}
    </span>
  );
}

function MedalBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="inline-flex items-center justify-center size-7 rounded-full bg-yellow-100 text-yellow-600 text-sm font-bold">🥇</span>;
  if (rank === 2) return <span className="inline-flex items-center justify-center size-7 rounded-full bg-zinc-100 text-zinc-500 text-sm font-bold">🥈</span>;
  if (rank === 3) return <span className="inline-flex items-center justify-center size-7 rounded-full bg-amber-100 text-amber-600 text-sm font-bold">🥉</span>;
  return <span className="inline-flex items-center justify-center size-7 text-sm font-semibold text-zinc-400">{rank}</span>;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-xl bg-zinc-100" />
        <div className="flex-1 space-y-2">
          <div className="h-7 w-20 bg-zinc-100 rounded-lg" />
          <div className="h-4 w-28 bg-zinc-100 rounded" />
        </div>
      </div>
    </div>
  );
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-zinc-200/80 p-6 animate-pulse ${className}`}>
      <div className="h-5 w-40 bg-zinc-100 rounded mb-6" />
      <div className="space-y-3">
        <div className="h-8 bg-zinc-100 rounded-lg" />
        <div className="h-8 bg-zinc-50 rounded-lg w-4/5" />
        <div className="h-8 bg-zinc-50 rounded-lg w-3/5" />
        <div className="h-8 bg-zinc-50 rounded-lg w-2/5" />
      </div>
    </div>
  );
}

export default function Analytics() {
  const { classStats, studentRankings, gradeDistribution, attendanceStats, weeklyTrends, loading, error } = useAnalytics();

  const totalStudents = useMemo(
    () => (classStats || []).reduce((sum, c) => sum + c.student_count, 0),
    [classStats]
  );

  const overallAvgGrade = useMemo(() => {
    if (!classStats || classStats.length === 0) return 0;
    const total = classStats.reduce((sum, c) => sum + c.average_grade * c.student_count, 0);
    const students = classStats.reduce((sum, c) => sum + c.student_count, 0);
    return students > 0 ? total / students : 0;
  }, [classStats]);

  const overallAttendance = useMemo(() => {
    if (!attendanceStats || attendanceStats.total === 0) return 0;
    return ((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100;
  }, [attendanceStats]);

  const totalAssessments = useMemo(
    () => (studentRankings || []).reduce((sum, s) => sum + s.total_assessments, 0),
    [studentRankings]
  );

  const sortedClasses = useMemo(
    () => [...(classStats || [])].sort((a, b) => b.average_grade - a.average_grade),
    [classStats]
  );

  const maxGradeCount = useMemo(() => {
    if (!gradeDistribution) return 1;
    return Math.max(gradeDistribution.five, gradeDistribution.four, gradeDistribution.three, gradeDistribution.two, 1);
  }, [gradeDistribution]);

  const maxWeeklyScore = useMemo(() => {
    if (!weeklyTrends || weeklyTrends.length === 0) return 100;
    return Math.max(...weeklyTrends.map(w => w.average_grade), 1);
  }, [weeklyTrends]);

  const displayedTrends = useMemo(
    () => (weeklyTrends || []).slice(-8),
    [weeklyTrends]
  );

  const top20 = useMemo(
    () => (studentRankings || []).slice(0, 20),
    [studentRankings]
  );

  const attendanceParts = useMemo(() => {
    if (!attendanceStats || attendanceStats.total === 0) return { present: 0, absent: 0, late: 0, excused: 0 };
    const t = attendanceStats.total;
    return {
      present: (attendanceStats.present / t) * 100,
      absent: (attendanceStats.absent / t) * 100,
      late: (attendanceStats.late / t) * 100,
      excused: (attendanceStats.excused / t) * 100,
    };
  }, [attendanceStats]);

  const hasData = classStats && classStats.length > 0;

  // Loading state
  if (loading) {
    return (
      <div className="px-6 pt-4 pb-8 space-y-6 animate-in fade-in duration-300">
        <div>
          <div className="h-8 w-48 bg-zinc-100 rounded-lg animate-pulse mb-1" />
          <div className="h-4 w-72 bg-zinc-50 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <SkeletonBlock />
            <SkeletonBlock />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <SkeletonBlock className="min-h-[280px]" />
            <SkeletonBlock className="min-h-[240px]" />
          </div>
        </div>
        <SkeletonBlock className="min-h-[300px]" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-6 pt-4 pb-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="size-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="size-8 text-red-400" />
          </div>
          <p className="text-zinc-900 font-semibold text-lg">Xatolik yuz berdi</p>
          <p className="text-zinc-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!hasData) {
    return (
      <div className="px-6 pt-4 pb-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="size-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="size-8 text-zinc-300" />
          </div>
          <p className="text-zinc-900 font-semibold text-lg">Hali ma'lumotlar yo'q</p>
          <p className="text-zinc-500 text-sm mt-1">Sinf va baholar qo'shilgandan so'ng statistika shu yerda ko'rinadi</p>
        </div>
      </div>
    );
  }

  const summaryCards = [
    {
      icon: Users,
      value: totalStudents,
      label: "Jami o'quvchilar",
      accent: 'bg-blue-50 text-blue-600',
    },
    {
      icon: BarChart2,
      value: overallAvgGrade.toFixed(1),
      label: "O'rtacha baho",
      accent: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: CheckCircle,
      value: `${overallAttendance.toFixed(0)}%`,
      label: 'Davomat darajasi',
      accent: 'bg-violet-50 text-violet-600',
    },
    {
      icon: ClipboardList,
      value: totalAssessments,
      label: 'Jami baholashlar',
      accent: 'bg-amber-50 text-amber-600',
    },
  ];

  const gradeRows = gradeDistribution
    ? [
        { label: '5 - A\'lo', count: gradeDistribution.five, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
        { label: '4 - Yaxshi', count: gradeDistribution.four, color: 'bg-blue-500', bg: 'bg-blue-50' },
        { label: '3 - Qoniqarli', count: gradeDistribution.three, color: 'bg-yellow-500', bg: 'bg-yellow-50' },
        { label: '2 - Qoniqarsiz', count: gradeDistribution.two, color: 'bg-red-500', bg: 'bg-red-50' },
      ]
    : [];

  const donutGradient = `conic-gradient(
    #10b981 0% ${attendanceParts.present}%,
    #ef4444 ${attendanceParts.present}% ${attendanceParts.present + attendanceParts.absent}%,
    #f59e0b ${attendanceParts.present + attendanceParts.absent}% ${attendanceParts.present + attendanceParts.absent + attendanceParts.late}%,
    #8b5cf6 ${attendanceParts.present + attendanceParts.absent + attendanceParts.late}% 100%
  )`;

  return (
    <div className="px-6 pt-4 pb-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Analitika</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Sinflar bo'yicha umumiy ko'rsatkichlar</p>
      </div>

      {/* Section 1: Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-zinc-200/80 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow"
            >
              <div className={`size-12 rounded-xl flex items-center justify-center ${card.accent}`}>
                <Icon className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900 tracking-tight">{card.value}</p>
                <p className="text-sm text-zinc-500 font-medium">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 2: Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Grade Distribution */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-xl bg-emerald-50">
                <BarChart2 className="size-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Baholar taqsimoti</h2>
            </div>
            <div className="space-y-4">
              {gradeRows.map((row) => (
                <div key={row.label} className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-zinc-600 w-28 shrink-0">{row.label}</span>
                  <div className={`flex-1 h-9 rounded-lg ${row.bg} overflow-hidden`}>
                    <div
                      className={`h-full rounded-lg ${row.color} transition-all duration-700 ease-out flex items-center justify-end pr-3`}
                      style={{ width: `${Math.max((row.count / maxGradeCount) * 100, 4)}%` }}
                    >
                      <span className="text-xs font-bold text-white drop-shadow-sm">{row.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trends */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-xl bg-blue-50">
                <TrendingUp className="size-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Haftalik ko'rsatkichlar</h2>
            </div>
            {displayedTrends.length > 0 ? (
              <div className="flex items-end gap-2 h-48">
                {displayedTrends.map((trend, idx) => {
                  const heightPct = (trend.average_grade / maxWeeklyScore) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      <span className="text-xs font-bold text-zinc-700">{trend.average_grade.toFixed(0)}</span>
                      <div className="w-full flex justify-center flex-1 items-end">
                        <div
                          className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500 ease-out hover:from-blue-600 hover:to-blue-500"
                          style={{ height: `${Math.max(heightPct, 4)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-zinc-400 truncate w-full text-center">{trend.period}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-zinc-400 text-sm">
                Ma'lumot mavjud emas
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Performance */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-violet-50">
                <Trophy className="size-5 text-violet-600" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Sinflar reytingi</h2>
            </div>
            <div className="space-y-3">
              {sortedClasses.map((cls, idx) => (
                <div
                  key={cls.class_id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50/80 hover:bg-zinc-100/80 transition-colors"
                >
                  <span className="text-sm font-bold text-zinc-400 w-5 text-center">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-zinc-800">{cls.class_name}</span>
                      <GradeBadge grade={cls.average_grade} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                      <span>{cls.student_count} o'quvchi</span>
                      <span>{cls.attendance_rate.toFixed(0)}% davomat</span>
                    </div>
                    <div className="h-1.5 bg-zinc-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-500"
                        style={{ width: `${cls.attendance_rate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Breakdown */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-amber-50">
                <CheckCircle className="size-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Davomat taqsimoti</h2>
            </div>
            {attendanceStats && attendanceStats.total > 0 ? (
              <div className="flex items-center gap-6">
                {/* Donut */}
                <div className="relative shrink-0">
                  <div
                    className="size-32 rounded-full"
                    style={{ background: donutGradient }}
                  />
                  <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-lg font-bold text-zinc-900">{attendanceParts.present.toFixed(0)}%</p>
                      <p className="text-[10px] text-zinc-400 font-medium">keldi</p>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="space-y-2.5 flex-1">
                  {[
                    { label: 'Keldi', pct: attendanceParts.present, count: attendanceStats.present, color: 'bg-emerald-500' },
                    { label: 'Kelmadi', pct: attendanceParts.absent, count: attendanceStats.absent, color: 'bg-red-500' },
                    { label: 'Kechikdi', pct: attendanceParts.late, count: attendanceStats.late, color: 'bg-amber-500' },
                    { label: 'Sababli', pct: attendanceParts.excused, count: attendanceStats.excused, color: 'bg-violet-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <div className={`size-2.5 rounded-full ${item.color} shrink-0`} />
                      <span className="text-sm text-zinc-600 flex-1">{item.label}</span>
                      <span className="text-sm font-bold text-zinc-800">{item.count}</span>
                      <span className="text-xs text-zinc-400 w-10 text-right">{item.pct.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-zinc-400 text-sm">
                Davomat ma'lumotlari mavjud emas
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Student Rankings Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50">
              <Users className="size-5 text-rose-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">O'quvchilar reytingi</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Eng yuqori natijalar bo'yicha — top 20</p>
            </div>
          </div>
        </div>
        {top20.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60">
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3 w-12">#</th>
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3">Ism</th>
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3">Sinf</th>
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3">O'rtacha ball</th>
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3">Baho</th>
                  <th className="text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider px-6 py-3">Baholashlar soni</th>
                </tr>
              </thead>
              <tbody>
                {top20.map((student, idx) => (
                  <tr
                    key={student.student_id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <MedalBadge rank={idx + 1} />
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-semibold text-zinc-800">{student.name}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-zinc-500">{student.class_name}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                            style={{ width: `${(student.average_grade / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-zinc-700">{student.average_grade.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <GradeBadge grade={student.average_grade} />
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-medium text-zinc-600">{student.total_assessments}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <p className="text-zinc-400 text-sm">O'quvchi reytinglari hali mavjud emas</p>
          </div>
        )}
      </div>
    </div>
  );
}
