import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// --- Types ---

export interface ClassStat {
  class_id: string
  class_name: string
  student_count: number
  average_grade: number
  attendance_rate: number
  top_students: { id: string; name: string; average: number }[]
  bottom_students: { id: string; name: string; average: number }[]
}

export interface StudentRanking {
  student_id: string
  name: string
  class_id: string
  class_name: string
  average_grade: number
  total_assessments: number
}

export interface GradeDistribution {
  five: number
  four: number
  three: number
  two: number
}

export interface AttendanceStats {
  total: number
  present: number
  absent: number
  late: number
  excused: number
  present_percent: number
  absent_percent: number
  late_percent: number
  excused_percent: number
}

export interface TrendPoint {
  period: string
  average_grade: number
  count: number
}

export interface StudentAnalysis {
  student_id: string
  name: string
  class_name: string
  overall_average: number
  grade_distribution: GradeDistribution
  attendance: AttendanceStats
  grades: {
    id: string
    score: number
    max_score: number
    percentage: number
    grade_type: string
    date: string
    subject_id: string
    comment: string | null
  }[]
  strengths: string[]
  weaknesses: string[]
}

// --- Helpers ---

function percentageToGrade(pct: number): 5 | 4 | 3 | 2 {
  if (pct >= 86) return 5
  if (pct >= 71) return 4
  if (pct >= 56) return 3
  return 2
}

function safePercent(numerator: number, denominator: number): number {
  if (denominator === 0) return 0
  return Math.round((numerator / denominator) * 1000) / 10
}

function buildDistribution(
  grades: { score: number; max_score: number; percentage: number | null }[]
): GradeDistribution {
  const dist: GradeDistribution = { five: 0, four: 0, three: 0, two: 0 }
  for (const g of grades) {
    const pct = g.percentage ?? (g.max_score ? (g.score / g.max_score) * 100 : 0)
    const ball = percentageToGrade(pct)
    if (ball === 5) dist.five++
    else if (ball === 4) dist.four++
    else if (ball === 3) dist.three++
    else dist.two++
  }
  return dist
}

function buildAttendanceStats(
  records: { status: string }[]
): AttendanceStats {
  const total = records.length
  let present = 0
  let absent = 0
  let late = 0
  let excused = 0

  for (const r of records) {
    switch (r.status) {
      case 'present': present++; break
      case 'absent': absent++; break
      case 'late': late++; break
      case 'excused': excused++; break
    }
  }

  return {
    total,
    present,
    absent,
    late,
    excused,
    present_percent: safePercent(present, total),
    absent_percent: safePercent(absent, total),
    late_percent: safePercent(late, total),
    excused_percent: safePercent(excused, total),
  }
}

// --- Hook ---

export function useAnalytics() {
  const { user, profile } = useAuth()

  const [classStats, setClassStats] = useState<ClassStat[]>([])
  const [studentRankings, setStudentRankings] = useState<StudentRanking[]>([])
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistribution>({
    five: 0, four: 0, three: 0, two: 0,
  })
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    total: 0, present: 0, absent: 0, late: 0, excused: 0,
    present_percent: 0, absent_percent: 0, late_percent: 0, excused_percent: 0,
  })
  const [weeklyTrends, setWeeklyTrends] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const schoolId = profile?.school_id

  // ---------- fetch all analytics on mount ----------
  const fetchAnalytics = useCallback(async () => {
    if (!user || !schoolId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 1. Fetch teacher's classes
      const { data: classes, error: classErr } = await supabase
        .from('classes')
        .select('id, name')
        .eq('school_id', schoolId)

      if (classErr) throw classErr
      if (!classes || classes.length === 0) {
        setLoading(false)
        return
      }

      const classIds = classes.map((c) => c.id)
      const classMap = new Map(classes.map((c) => [c.id, c.name]))

      // 2. Parallel fetches: students, grades, attendance
      const [studentsRes, gradesRes, attendanceRes] = await Promise.all([
        supabase
          .from('students')
          .select('id, first_name, last_name, class_id')
          .eq('school_id', schoolId)
          .eq('is_active', true)
          .in('class_id', classIds),
        supabase
          .from('grades')
          .select('id, student_id, class_id, subject_id, score, max_score, percentage, grade_type, date, comment')
          .eq('teacher_id', user.id)
          .in('class_id', classIds)
          .order('date', { ascending: false }),
        supabase
          .from('attendance')
          .select('id, student_id, class_id, date, status')
          .eq('teacher_id', user.id)
          .in('class_id', classIds),
      ])

      if (studentsRes.error) throw studentsRes.error
      if (gradesRes.error) throw gradesRes.error
      if (attendanceRes.error) throw attendanceRes.error

      const students = studentsRes.data || []
      const grades = gradesRes.data || []
      const attendance = attendanceRes.data || []

      const studentMap = new Map(
        students.map((s) => [s.id, `${s.first_name} ${s.last_name}`])
      )
      const studentClassMap = new Map(
        students.map((s) => [s.id, s.class_id])
      )

      // ---------- Class Statistics ----------
      const classStatsResult: ClassStat[] = []

      for (const cls of classes) {
        const classStudents = students.filter((s) => s.class_id === cls.id)
        const classGrades = grades.filter((g) => g.class_id === cls.id)
        const classAttendance = attendance.filter((a) => a.class_id === cls.id)

        // Average grade (percentage-based)
        let avgGrade = 0
        if (classGrades.length > 0) {
          const totalPct = classGrades.reduce((sum, g) => {
            const pct = g.percentage ?? (g.max_score ? (g.score / g.max_score) * 100 : 0)
            return sum + pct
          }, 0)
          avgGrade = Math.round((totalPct / classGrades.length) * 10) / 10
        }

        // Attendance rate
        const totalAttendance = classAttendance.length
        const presentCount = classAttendance.filter(
          (a) => a.status === 'present' || a.status === 'late'
        ).length
        const attendanceRate = safePercent(presentCount, totalAttendance)

        // Per-student averages for top/bottom
        const studentAvgs: { id: string; name: string; average: number }[] = []
        for (const s of classStudents) {
          const sGrades = classGrades.filter((g) => g.student_id === s.id)
          if (sGrades.length === 0) continue
          const avg =
            sGrades.reduce((sum, g) => {
              const pct = g.percentage ?? (g.max_score ? (g.score / g.max_score) * 100 : 0)
              return sum + pct
            }, 0) / sGrades.length
          studentAvgs.push({
            id: s.id,
            name: `${s.first_name} ${s.last_name}`,
            average: Math.round(avg * 10) / 10,
          })
        }
        studentAvgs.sort((a, b) => b.average - a.average)

        classStatsResult.push({
          class_id: cls.id,
          class_name: cls.name,
          student_count: classStudents.length,
          average_grade: avgGrade,
          attendance_rate: attendanceRate,
          top_students: studentAvgs.slice(0, 5),
          bottom_students: studentAvgs.slice(-5).reverse(),
        })
      }

      setClassStats(classStatsResult)

      // ---------- Student Rankings (across all classes) ----------
      const rankingMap = new Map<
        string,
        { total: number; count: number }
      >()

      for (const g of grades) {
        const pct = g.percentage ?? (g.max_score ? (g.score / g.max_score) * 100 : 0)
        const existing = rankingMap.get(g.student_id)
        if (existing) {
          existing.total += pct
          existing.count += 1
        } else {
          rankingMap.set(g.student_id, { total: pct, count: 1 })
        }
      }

      const rankings: StudentRanking[] = []
      for (const [studentId, data] of rankingMap.entries()) {
        const classId = studentClassMap.get(studentId)
        rankings.push({
          student_id: studentId,
          name: studentMap.get(studentId) || 'Noma\'lum',
          class_id: classId || '',
          class_name: classId ? (classMap.get(classId) || '') : '',
          average_grade: Math.round((data.total / data.count) * 10) / 10,
          total_assessments: data.count,
        })
      }
      rankings.sort((a, b) => b.average_grade - a.average_grade)
      setStudentRankings(rankings)

      // ---------- Grade Distribution ----------
      setGradeDistribution(buildDistribution(grades))

      // ---------- Attendance Stats ----------
      setAttendanceStats(buildAttendanceStats(attendance))

      // ---------- Weekly / Monthly Trends ----------
      // Group grades by ISO week
      const weekMap = new Map<string, { total: number; count: number }>()
      for (const g of grades) {
        if (!g.date) continue
        const d = new Date(g.date)
        // Get Monday of that week
        const day = d.getDay()
        const diff = d.getDate() - day + (day === 0 ? -6 : 1)
        const monday = new Date(d)
        monday.setDate(diff)
        const weekKey = monday.toISOString().split('T')[0]

        const pct = g.percentage ?? (g.max_score ? (g.score / g.max_score) * 100 : 0)
        const existing = weekMap.get(weekKey)
        if (existing) {
          existing.total += pct
          existing.count += 1
        } else {
          weekMap.set(weekKey, { total: pct, count: 1 })
        }
      }

      const trends: TrendPoint[] = []
      for (const [period, data] of weekMap.entries()) {
        trends.push({
          period,
          average_grade: Math.round((data.total / data.count) * 10) / 10,
          count: data.count,
        })
      }
      trends.sort((a, b) => a.period.localeCompare(b.period))
      setWeeklyTrends(trends)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analytikani yuklashda xatolik'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [user, schoolId])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // ---------- Individual Student Analysis ----------
  const fetchStudentAnalysis = useCallback(
    async (studentId: string): Promise<StudentAnalysis | null> => {
      if (!user || !schoolId) return null

      try {
        // Parallel: student info, grades, attendance
        const [studentRes, gradesRes, attendanceRes] = await Promise.all([
          supabase
            .from('students')
            .select('id, first_name, last_name, class_id')
            .eq('id', studentId)
            .eq('school_id', schoolId)
            .single(),
          supabase
            .from('grades')
            .select('id, student_id, class_id, subject_id, score, max_score, percentage, grade_type, date, comment')
            .eq('student_id', studentId)
            .eq('teacher_id', user.id)
            .order('date', { ascending: false }),
          supabase
            .from('attendance')
            .select('id, student_id, class_id, date, status')
            .eq('student_id', studentId)
            .eq('teacher_id', user.id),
        ])

        if (studentRes.error) throw studentRes.error
        if (gradesRes.error) throw gradesRes.error
        if (attendanceRes.error) throw attendanceRes.error

        const student = studentRes.data
        const grades = gradesRes.data || []
        const attendanceRecords = attendanceRes.data || []

        // Class name
        let className = ''
        if (student.class_id) {
          const { data: cls } = await supabase
            .from('classes')
            .select('name')
            .eq('id', student.class_id)
            .single()
          className = cls?.name || ''
        }

        // Overall average
        let overallAverage = 0
        if (grades.length > 0) {
          const totalPct = grades.reduce((sum, g) => {
            const pct = g.percentage ?? (g.max_score ? (g.score / g.max_score) * 100 : 0)
            return sum + pct
          }, 0)
          overallAverage = Math.round((totalPct / grades.length) * 10) / 10
        }

        // Per-subject averages for strengths/weaknesses
        const subjectMap = new Map<string, { total: number; count: number }>()
        for (const g of grades) {
          const pct = g.percentage ?? (g.max_score ? (g.score / g.max_score) * 100 : 0)
          const existing = subjectMap.get(g.subject_id)
          if (existing) {
            existing.total += pct
            existing.count += 1
          } else {
            subjectMap.set(g.subject_id, { total: pct, count: 1 })
          }
        }

        // Fetch subject names for identified subjects
        const subjectIds = Array.from(subjectMap.keys())
        let subjectNameMap = new Map<string, string>()

        if (subjectIds.length > 0) {
          const { data: subjects } = await supabase
            .from('subjects')
            .select('id, name')
            .in('id', subjectIds)

          if (subjects) {
            subjectNameMap = new Map(subjects.map((s) => [s.id, s.name]))
          }
        }

        const subjectAvgs = Array.from(subjectMap.entries()).map(
          ([subjectId, data]) => ({
            subjectId,
            name: subjectNameMap.get(subjectId) || subjectId,
            average: data.total / data.count,
          })
        )
        subjectAvgs.sort((a, b) => b.average - a.average)

        // Strengths: subjects with average >= 71 (grade 4 or 5)
        const strengths = subjectAvgs
          .filter((s) => s.average >= 71)
          .map((s) => `${s.name} (${Math.round(s.average * 10) / 10}%)`)

        // Weaknesses: subjects with average < 56 (grade 2)
        const weaknesses = subjectAvgs
          .filter((s) => s.average < 56)
          .map((s) => `${s.name} (${Math.round(s.average * 10) / 10}%)`)

        return {
          student_id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          class_name: className,
          overall_average: overallAverage,
          grade_distribution: buildDistribution(grades),
          attendance: buildAttendanceStats(attendanceRecords),
          grades: grades.map((g) => ({
            id: g.id,
            score: g.score,
            max_score: g.max_score,
            percentage: g.percentage ?? (g.max_score ? (g.score / g.max_score) * 100 : 0),
            grade_type: g.grade_type,
            date: g.date,
            subject_id: g.subject_id,
            comment: g.comment,
          })),
          strengths,
          weaknesses,
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Talaba ma\'lumotlarini yuklashda xatolik'
        setError(message)
        return null
      }
    },
    [user, schoolId]
  )

  return {
    classStats,
    studentRankings,
    gradeDistribution,
    attendanceStats,
    weeklyTrends,
    fetchStudentAnalysis,
    loading,
    error,
  }
}
