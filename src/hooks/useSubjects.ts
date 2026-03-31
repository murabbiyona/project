import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Subject } from '../types/database'

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSubjects = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .order('name_uz')

    setSubjects((data || []) as Subject[])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  async function createSubject(input: {
    name_uz: string
    name_ru?: string
    name_en?: string
    icon?: string
    color?: string
  }) {
    const { data, error } = await supabase
      .from('subjects')
      .insert(input as any)
      .select()
      .single()

    if (!error) await fetchSubjects()
    return { data, error: error?.message || null }
  }

  return { subjects, loading, fetchSubjects, createSubject }
}
