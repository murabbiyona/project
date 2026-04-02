import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface ReportData {
  classId: string
  className: string
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  totalStudents: number
  assessedStudents: number
  averageScore: number
  gradeDistribution: Record<number, number>
  attendanceRate: number
  topStudents: { name: string; score: number }[]
  bottomStudents: { name: string; score: number }[]
  subjectBreakdown: { subject: string; average: number }[]
  generatedAt: string
}

export function useReports() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Hisobot generatsiya qilish
  const generateReport = useCallback(async (
    classId: string,
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  ): Promise<ReportData | null> => {
    if (!user || !profile?.school_id) return null

    setLoading(true)
    setError(null)

    try {
      // Davr bo'yicha sana hisoblash
      const now = new Date()
      const startDate = new Date()
      switch (period) {
        case 'daily': startDate.setDate(now.getDate() - 1); break
        case 'weekly': startDate.setDate(now.getDate() - 7); break
        case 'monthly': startDate.setMonth(now.getMonth() - 1); break
        case 'quarterly': startDate.setMonth(now.getMonth() - 3); break
      }
      const startStr = startDate.toISOString().split('T')[0]

      // Sinf ma'lumotlari
      const { data: classData } = await supabase
        .from('classes')
        .select('name')
        .eq('id', classId)
        .single()

      // O'quvchilar
      const { data: students } = await supabase
        .from('students')
        .select('id, first_name, last_name')
        .eq('class_id', classId)
        .eq('is_active', true)

      const studentIds = (students || []).map(s => s.id)
      const totalStudents = studentIds.length

      if (totalStudents === 0) {
        setError("Bu sinfda o'quvchilar topilmadi")
        setLoading(false)
        return null
      }

      // Baholar
      const { data: grades } = await supabase
        .from('grades')
        .select('student_id, score, max_score, percentage, subject_id')
        .eq('class_id', classId)
        .gte('date', startStr)

      // Davomat
      const { data: attendance } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('class_id', classId)
        .gte('date', startStr)

      // Fanlar
      const subjectIds = [...new Set((grades || []).map(g => g.subject_id).filter(Boolean))]
      let subjectsMap: Record<string, string> = {}
      if (subjectIds.length > 0) {
        const { data: subjects } = await supabase
          .from('subjects')
          .select('id, name_uz')
          .in('id', subjectIds)
        if (subjects) {
          subjectsMap = Object.fromEntries(subjects.map(s => [s.id, s.name_uz]))
        }
      }

      // Hisoblashlar
      const gradeDistribution: Record<number, number> = { 2: 0, 3: 0, 4: 0, 5: 0 }
      const studentScores: Record<string, number[]> = {}

      for (const g of (grades || [])) {
        const pct = g.percentage || (g.max_score > 0 ? (g.score / g.max_score) * 100 : 0)
        const grade = pct >= 86 ? 5 : pct >= 71 ? 4 : pct >= 56 ? 3 : 2
        gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1

        if (!studentScores[g.student_id]) studentScores[g.student_id] = []
        studentScores[g.student_id].push(pct)
      }

      // O'rtacha
      const allScores = (grades || []).map(g => g.percentage || 0)
      const averageScore = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0

      // Top/bottom o'quvchilar
      const studentAvgs = Object.entries(studentScores).map(([sid, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length
        const student = (students || []).find(s => s.id === sid)
        return {
          name: student ? `${student.last_name} ${student.first_name}` : 'Noma\'lum',
          score: Math.round(avg)
        }
      }).sort((a, b) => b.score - a.score)

      const topStudents = studentAvgs.slice(0, 5)
      const bottomStudents = studentAvgs.slice(-5).reverse()

      // Fan bo'yicha
      const subjectScores: Record<string, number[]> = {}
      for (const g of (grades || [])) {
        const subId = g.subject_id || 'unknown'
        if (!subjectScores[subId]) subjectScores[subId] = []
        subjectScores[subId].push(g.percentage || 0)
      }
      const subjectBreakdown = Object.entries(subjectScores).map(([sid, scores]) => ({
        subject: subjectsMap[sid] || 'Noma\'lum fan',
        average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      })).sort((a, b) => b.average - a.average)

      // Davomat foizi
      const totalAttendance = (attendance || []).length
      const presentCount = (attendance || []).filter(a => a.status === 'present').length
      const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0

      const assessedStudents = Object.keys(studentScores).length

      const report: ReportData = {
        classId,
        className: classData?.name || 'Sinf',
        period,
        totalStudents,
        assessedStudents,
        averageScore,
        gradeDistribution,
        attendanceRate,
        topStudents,
        bottomStudents,
        subjectBreakdown,
        generatedAt: new Date().toISOString(),
      }

      setLoading(false)
      return report
    } catch (err: any) {
      setError(err.message || 'Hisobot yaratishda xatolik')
      setLoading(false)
      return null
    }
  }, [user, profile])

  // Telegram ga hisobot yuborish
  const sendReportToTelegram = useCallback(async (report: ReportData) => {
    if (!user) return false

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return false

      const periodLabels: Record<string, string> = {
        daily: 'Kunlik', weekly: 'Haftalik', monthly: 'Oylik', quarterly: 'Choraklik'
      }

      const dist = report.gradeDistribution
      const response = await fetch(`${supabaseUrl}/functions/v1/telegram-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          className: report.className,
          subjectName: `${periodLabels[report.period]} hisobot`,
          lessonTitle: `${periodLabels[report.period]} tahlil`,
          totalStudents: report.totalStudents,
          assessedCount: report.assessedStudents,
          averageScore: report.averageScore,
          gradeDistribution: dist,
          duration: null,
        }),
      })

      const data = await response.json()
      return data.sent === true
    } catch {
      return false
    }
  }, [user])

  return { generateReport, sendReportToTelegram, loading, error }
}
