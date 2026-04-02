import { useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface QRScanResult {
  studentId: string
  studentName: string
  time: string
  status: 'success' | 'duplicate' | 'unknown'
}

export interface AttendanceSession {
  classId: string
  className: string
  subjectId: string
  subjectName: string
  periodNumber: number
  totalStudents: number
  startedAt: string
}

export function useQRAttendance() {
  const { user } = useAuth()
  const [session, setSession] = useState<AttendanceSession | null>(null)
  const [scans, setScans] = useState<QRScanResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scannedIds = useRef<Set<string>>(new Set())
  // Map QR code → student info
  const qrStudentMap = useRef<Map<string, { id: string; name: string }>>(new Map())

  /**
   * Sessiya boshlash — sinf tanlaganda o'quvchilar va ularning QR kodlarini yuklaydi
   */
  const startSession = useCallback(async (params: {
    classId: string
    className: string
    subjectId: string
    subjectName: string
    periodNumber?: number
  }) => {
    if (!user) return
    setLoading(true)
    setError(null)
    scannedIds.current.clear()
    qrStudentMap.current.clear()
    setScans([])

    try {
      // O'quvchilarni va ularning QR kodlarini olish
      const { data: students, error: err } = await supabase
        .from('students')
        .select('id, first_name, last_name, qr_code')
        .eq('class_id', params.classId)
        .eq('is_active', true)
        .order('last_name')

      if (err) throw new Error(err.message)

      // QR code → student map tuzish
      for (const s of (students || [])) {
        const qr = s.qr_code || s.id // QR kodi bo'lmasa, student ID ishlatiladi
        qrStudentMap.current.set(qr, {
          id: s.id,
          name: `${s.last_name} ${s.first_name}`,
        })
        // ID bo'yicha ham mapping (agar QR kodda ID bo'lsa)
        if (s.qr_code && s.qr_code !== s.id) {
          qrStudentMap.current.set(s.id, {
            id: s.id,
            name: `${s.last_name} ${s.first_name}`,
          })
        }
      }

      // Bugungi mavjud davomatni tekshirish (qayta skan qilmaslik uchun)
      const today = new Date().toISOString().split('T')[0]
      const { data: existing } = await supabase
        .from('attendance')
        .select('student_id')
        .eq('class_id', params.classId)
        .eq('date', today)
        .eq('period_number', params.periodNumber || 1)
        .eq('status', 'present')

      // Allaqachon qayd etilganlarni set ga qo'shish
      const existingScans: QRScanResult[] = []
      for (const record of (existing || [])) {
        scannedIds.current.add(record.student_id)
        const info = qrStudentMap.current.get(record.student_id)
        if (info) {
          existingScans.push({
            studentId: info.id,
            studentName: info.name,
            time: 'avval',
            status: 'success',
          })
        }
      }
      setScans(existingScans)

      setSession({
        classId: params.classId,
        className: params.className,
        subjectId: params.subjectId,
        subjectName: params.subjectName,
        periodNumber: params.periodNumber || 1,
        totalStudents: students?.length || 0,
        startedAt: new Date().toISOString(),
      })
    } catch (e: any) {
      setError(e.message || 'Sessiyani boshlashda xatolik')
    } finally {
      setLoading(false)
    }
  }, [user])

  /**
   * QR kod skanerlanganda — attendance ga yozadi
   * Telegram bot xuddi shunday: chat_id orqali profilni topadi va yozadi
   * Bu yerda qr_code orqali studentni topadi va attendance ga yozadi
   */
  const handleScan = useCallback(async (qrCode: string): Promise<QRScanResult> => {
    if (!user || !session) {
      return { studentId: '', studentName: qrCode, time: now(), status: 'unknown' }
    }

    const code = qrCode.trim()

    // 1. Allaqachon skanerlangan — duplicate
    const studentInfo = qrStudentMap.current.get(code)
    if (studentInfo && scannedIds.current.has(studentInfo.id)) {
      return {
        studentId: studentInfo.id,
        studentName: studentInfo.name,
        time: now(),
        status: 'duplicate',
      }
    }

    // 2. O'quvchini topish (QR code yoki ID bo'yicha)
    if (!studentInfo) {
      // DB dan to'g'ridan-to'g'ri qidirish (agar map da yo'q bo'lsa)
      const { data } = await supabase
        .from('students')
        .select('id, first_name, last_name')
        .or(`qr_code.eq.${code},id.eq.${code}`)
        .eq('class_id', session.classId)
        .eq('is_active', true)
        .maybeSingle()

      if (!data) {
        return { studentId: '', studentName: code, time: now(), status: 'unknown' }
      }

      // Map ga qo'shish
      qrStudentMap.current.set(code, {
        id: data.id,
        name: `${data.last_name} ${data.first_name}`,
      })

      return await recordAttendance(data.id, `${data.last_name} ${data.first_name}`)
    }

    return await recordAttendance(studentInfo.id, studentInfo.name)
  }, [user, session])

  /**
   * Attendance ga yozish — Telegram bot xuddi shunday profilga yozadi
   */
  const recordAttendance = async (studentId: string, studentName: string): Promise<QRScanResult> => {
    if (!user || !session) {
      return { studentId, studentName, time: now(), status: 'unknown' }
    }

    try {
      const today = new Date().toISOString().split('T')[0]

      const { error: err } = await supabase
        .from('attendance')
        .upsert({
          student_id: studentId,
          class_id: session.classId,
          teacher_id: user.id,
          date: today,
          period_number: session.periodNumber,
          status: 'present',
          check_method: 'qr_scan',
          check_time: new Date().toISOString(),
        }, {
          onConflict: 'student_id,date,period_number',
        })

      if (err) throw err

      scannedIds.current.add(studentId)
      const result: QRScanResult = {
        studentId,
        studentName,
        time: now(),
        status: 'success',
      }
      setScans(prev => [result, ...prev])
      return result
    } catch (e: any) {
      setError(e.message)
      return { studentId, studentName, time: now(), status: 'unknown' }
    }
  }

  /**
   * Davomat yakunlash — kelmagan o'quvchilarni "absent" deb belgilash
   * + Telegram orqali xabar yuborish (xuddi telegram-notify kabi)
   */
  const finishSession = useCallback(async () => {
    if (!user || !session) return null
    setLoading(true)

    try {
      const today = new Date().toISOString().split('T')[0]

      // Kelmagan o'quvchilarni topish va absent deb belgilash
      const allStudentIds = Array.from(qrStudentMap.current.values()).map(s => s.id)
      const absentIds = allStudentIds.filter(id => !scannedIds.current.has(id))

      if (absentIds.length > 0) {
        const absentRows = absentIds.map(id => ({
          student_id: id,
          class_id: session.classId,
          teacher_id: user.id,
          date: today,
          period_number: session.periodNumber,
          status: 'absent' as const,
          check_method: 'auto' as const,
          check_time: new Date().toISOString(),
          note: 'QR skanerlash yakunlangandan keyin avtomatik absent',
        }))

        await supabase
          .from('attendance')
          .upsert(absentRows, { onConflict: 'student_id,date,period_number' })
      }

      // Telegram orqali xabar yuborish (telegram-notify Edge Function orqali)
      const presentCount = scans.filter(s => s.status === 'success').length
      const absentCount = absentIds.length
      const totalStudents = session.totalStudents
      const attendancePercent = totalStudents > 0
        ? Math.round((presentCount / totalStudents) * 100)
        : 0

      try {
        const { data: { session: authSession } } = await supabase.auth.getSession()
        if (authSession?.access_token) {
          await supabase.functions.invoke('telegram-notify', {
            body: {
              className: session.className,
              subjectName: session.subjectName,
              lessonTitle: `QR Davomat — ${session.periodNumber}-dars`,
              totalStudents,
              assessedCount: presentCount,
              averageScore: attendancePercent,
              gradeDistribution: {
                5: presentCount,   // kelganlar
                4: 0,
                3: 0,
                2: absentCount,    // kelmaganlar
              },
              duration: Math.round((Date.now() - new Date(session.startedAt).getTime()) / 60000),
            },
          })
        }
      } catch {
        // Telegram yuborilmasa ham davom etamiz
      }

      const result = {
        className: session.className,
        subjectName: session.subjectName,
        present: presentCount,
        absent: absentCount,
        total: totalStudents,
        percent: attendancePercent,
      }

      // Sessiyani tozalash
      setSession(null)
      setScans([])
      scannedIds.current.clear()
      qrStudentMap.current.clear()

      return result
    } catch (e: any) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, session, scans])

  return {
    session,
    scans,
    loading,
    error,
    startSession,
    handleScan,
    finishSession,
    scannedCount: scans.filter(s => s.status === 'success').length,
  }
}

function now() {
  return new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
