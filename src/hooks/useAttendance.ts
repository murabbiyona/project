import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Attendance, AttendanceStatus } from '../types/database'

export interface AttendanceWithStudent extends Attendance {
  student?: {
    first_name: string
    last_name: string
    journal_number: number | null
  }
}

export function useAttendance(classId?: string) {
  const { user } = useAuth()
  const [records, setRecords] = useState<AttendanceWithStudent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendance = useCallback(async (date?: string) => {
    if (!user) return
    setLoading(true)
    setError(null)

    const targetDate = date || new Date().toISOString().split('T')[0]

    let query = supabase
      .from('attendance')
      .select(`*, student:students(first_name, last_name, journal_number)`)
      .eq('date', targetDate)
      .order('created_at')

    if (classId) query = query.eq('class_id', classId)

    const { data, error: err } = await query

    if (err) {
      setError(err.message)
    } else {
      setRecords((data || []) as AttendanceWithStudent[])
    }
    setLoading(false)
  }, [user, classId])

  async function markAttendance(input: {
    student_id: string
    class_id: string
    status: AttendanceStatus
    period_number?: number
    check_method?: 'qr_scan' | 'face_id' | 'manual' | 'auto'
    note?: string
  }) {
    if (!user) return { error: 'Foydalanuvchi topilmadi' }

    const today = new Date().toISOString().split('T')[0]

    const { data, error: err } = await supabase
      .from('attendance')
      .upsert({
        student_id: input.student_id,
        class_id: input.class_id,
        teacher_id: user.id,
        date: today,
        period_number: input.period_number || 1,
        status: input.status,
        check_method: input.check_method || 'manual',
        check_time: new Date().toISOString(),
        note: input.note,
      }, {
        onConflict: 'student_id,date,period_number'
      })
      .select()

    if (!err) await fetchAttendance(today)
    return { data, error: err?.message || null }
  }

  async function bulkMarkAttendance(entries: {
    student_id: string
    class_id: string
    status: AttendanceStatus
    period_number?: number
  }[]) {
    if (!user) return { error: 'Foydalanuvchi topilmadi' }

    const today = new Date().toISOString().split('T')[0]

    const rows = entries.map(e => ({
      student_id: e.student_id,
      class_id: e.class_id,
      teacher_id: user.id,
      date: today,
      period_number: e.period_number || 1,
      status: e.status,
      check_method: 'manual' as const,
      check_time: new Date().toISOString(),
    }))

    const { error: err } = await supabase
      .from('attendance')
      .upsert(rows, { onConflict: 'student_id,date,period_number' })

    if (!err) await fetchAttendance(today)
    return { error: err?.message || null }
  }

  return { records, loading, error, fetchAttendance, markAttendance, bulkMarkAttendance }
}
