import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export type PlanningModel = '5E' | 'SMART' | '20/80' | 'backward_design'
export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create'

export interface LessonPlanParams {
  classId: string
  subjectId: string
  subject?: string
  topic: string
  planningModel: PlanningModel
  bloomLevel?: BloomLevel
  duration?: number // minutes
}

export interface GeneratePlanResult {
  plan: GeneratedLessonPlan | null
  error: string | null
}

export interface GeneratedLessonPlan {
  title: string
  topic: string
  planning_model: PlanningModel
  bloom_level?: BloomLevel
  duration: number
  objectives: string[]
  lesson_structure: Record<string, any>
  materials: string[]
  assessment_notes: string
  raw_response: string
}

// ─── Planning model prompt builders ───────────────────────────────────────────

function build5EPrompt(subject: string, topic: string, bloom: string, duration: number): string {
  return `Sen tajribali pedagog-metodistsisan. Quyidagi mavzu bo'yicha 5E modelida dars rejasini tuzing.

Fan: ${subject}
Mavzu: ${topic}
Bloom darajasi: ${bloom}
Davomiyligi: ${duration} daqiqa

5E modeli bo'yicha har bir bosqich uchun batafsil ko'rsatmalar bering:

1. ENGAGE (Qiziqtirish) — ~${Math.round(duration * 0.1)} daqiqa
   - O'quvchilarning e'tiborini jalb qilish strategiyasi
   - Dars mavzusiga bog'liq savol yoki muammo
   - Oldingi bilimlarni faollashtirish usuli

2. EXPLORE (O'rganish) — ~${Math.round(duration * 0.25)} daqiqa
   - Amaliy tadqiqot yoki faoliyat
   - Guruh/juftlik bilan ishlash topshiriqlari
   - O'quvchilar mustaqil kashf qilishi kerak bo'lgan tushunchalar

3. EXPLAIN (Tushuntirish) — ~${Math.round(duration * 0.2)} daqiqa
   - Asosiy tushunchalarni rasmiylashtirish
   - Kalit terminlar va ta'riflar
   - O'qituvchi tomonidan tushuntirish strategiyasi

4. ELABORATE (Kengaytirish) — ~${Math.round(duration * 0.3)} daqiqa
   - Bilimlarni yangi vaziyatlarga qo'llash mashqlari
   - Chuqurlashtirish topshiriqlari
   - Differensatsiya — ilg'or va zaif o'quvchilar uchun

5. EVALUATE (Baholash) — ~${Math.round(duration * 0.15)} daqiqa
   - Formativ baholash usullari
   - O'z-o'zini baholash savollari
   - Darsdan olingan natijalarni umumlashtirish

Javobni JSON formatida quyidagi strukturada bering:
{
  "title": "Dars sarlavhasi",
  "objectives": ["maqsad1", "maqsad2"],
  "lesson_structure": {
    "engage": { "duration": N, "activities": [...], "materials": [...], "teacher_notes": "..." },
    "explore": { "duration": N, "activities": [...], "materials": [...], "teacher_notes": "..." },
    "explain": { "duration": N, "activities": [...], "materials": [...], "teacher_notes": "..." },
    "elaborate": { "duration": N, "activities": [...], "materials": [...], "teacher_notes": "..." },
    "evaluate": { "duration": N, "activities": [...], "materials": [...], "teacher_notes": "..." }
  },
  "materials": ["kerakli material1", "material2"],
  "assessment_notes": "Baholash bo'yicha qo'shimcha eslatmalar"
}`
}

function buildSMARTPrompt(
  subject: string,
  topic: string,
  bloom: string,
  duration: number
): string {
  return `Sen tajribali pedagog-metodistsisan. Quyidagi mavzu bo'yicha SMART maqsadlar asosida dars rejasini tuzing.

Fan: ${subject}
Mavzu: ${topic}
Bloom darajasi: ${bloom}
Davomiyligi: ${duration} daqiqa

Har bir dars maqsadi SMART mezonlariga mos bo'lishi kerak:
- Specific (Aniq): Maqsad aniq va tushunarli
- Measurable (O'lchanadigan): Natija o'lchanadigan, tekshirib ko'rsa bo'ladigan
- Achievable (Erishiladigan): Berilgan vaqt va resurslar doirasida real
- Relevant (Tegishli): Mavzuga va o'quv dasturiga mos
- Time-bound (Muddatli): Aniq vaqt doirasida bajarilishi kerak

Dars rejasini quyidagi tarkibda tuzing:
1. SMART maqsadlar ro'yxati (kamida 3 ta)
2. Har bir maqsad uchun faoliyat rejasi
3. Muvaffaqiyat ko'rsatkichlari — natijani qanday baholash mumkin
4. Vaqt taqsimoti
5. Kerakli materiallar

Javobni JSON formatida bering:
{
  "title": "Dars sarlavhasi",
  "objectives": ["SMART maqsad 1", "SMART maqsad 2", "SMART maqsad 3"],
  "lesson_structure": {
    "smart_objectives": [
      {
        "objective": "...",
        "specific": "...",
        "measurable": "...",
        "achievable": "...",
        "relevant": "...",
        "time_bound": "...",
        "activities": ["..."],
        "success_criteria": "...",
        "duration": N
      }
    ],
    "opening": { "duration": N, "activities": [...] },
    "main_activities": { "duration": N, "activities": [...] },
    "assessment": { "duration": N, "activities": [...] },
    "closing": { "duration": N, "activities": [...] }
  },
  "materials": ["material1", "material2"],
  "assessment_notes": "..."
}`
}

function build2080Prompt(
  subject: string,
  topic: string,
  bloom: string,
  duration: number
): string {
  const teacherTime = Math.round(duration * 0.2)
  const studentTime = Math.round(duration * 0.8)

  return `Sen tajribali pedagog-metodistsisan. Quyidagi mavzu bo'yicha 20/80 modelida dars rejasini tuzing.

Fan: ${subject}
Mavzu: ${topic}
Bloom darajasi: ${bloom}
Davomiyligi: ${duration} daqiqa

20/80 qoidasi: O'qituvchi darsning atigi 20% (~${teacherTime} daqiqa) da tushuntiradi, qolgan 80% (~${studentTime} daqiqa) o'quvchilarning faol ishtirokiga ajratiladi.

O'QITUVCHI VAQTI — ${teacherTime} daqiqa (20%):
- Qisqa va aniq tushuntirish
- Asosiy tushuncha va kalit so'zlarni kiritish
- Ko'rsatma va namuna berish
- Aniq yo'riqnoma

O'QUVCHI FAOLIYATI — ${studentTime} daqiqa (80%):
- Guruh loyihalari va hamkorlikdagi o'rganish
- Amaliy mashqlar va tajribalar
- Munozara va taqdimotlar
- Peer teaching (o'quvchilar bir-biriga o'rgatishi)
- Muammoli vaziyatlarni yechish
- Ijodiy topshiriqlar

Javobni JSON formatida bering:
{
  "title": "Dars sarlavhasi",
  "objectives": ["maqsad1", "maqsad2"],
  "lesson_structure": {
    "teacher_led": {
      "duration": ${teacherTime},
      "percentage": 20,
      "segments": [
        { "activity": "...", "duration": N, "description": "...", "key_points": [...] }
      ]
    },
    "student_led": {
      "duration": ${studentTime},
      "percentage": 80,
      "segments": [
        { "activity": "...", "duration": N, "description": "...", "grouping": "individual|pair|group", "materials": [...] }
      ]
    },
    "transitions": ["..."]
  },
  "materials": ["material1", "material2"],
  "assessment_notes": "..."
}`
}

function buildBackwardDesignPrompt(
  subject: string,
  topic: string,
  bloom: string,
  duration: number
): string {
  return `Sen tajribali pedagog-metodistsisan. Quyidagi mavzu bo'yicha Backward Design (Teskari loyihalash) modelida dars rejasini tuzing.

Fan: ${subject}
Mavzu: ${topic}
Bloom darajasi: ${bloom}
Davomiyligi: ${duration} daqiqa

Backward Design — Grant Wiggins va Jay McTighe tomonidan ishlab chiqilgan model. Dars rejasi oxiridan boshlab — kerakli natijadan boshlab tuziladigan:

1-BOSQICH: KERAKLI NATIJALAR (Desired Results)
   - O'quvchilar nimani bilishi va qila olishi kerak?
   - Asosiy tushunchalar (Big Ideas)
   - Muhim savollar (Essential Questions)
   - O'quv maqsadlari va ko'nikmalar

2-BOSQICH: BAHOLASH DALILLARI (Assessment Evidence)
   - Natijaga erishganini qanday isbotlash mumkin?
   - Autentik baholash topshirig'i
   - Boshqa dalillar (testlar, kuzatish, uy vazifasi)
   - Muvaffaqiyat mezonlari (rubrika)

3-BOSQICH: O'RGANISH REJASI (Learning Plan)
   - Kerakli natijaga erishish uchun qanday faoliyatlar kerak?
   - Darsning bosqichlari va vaqt taqsimoti
   - O'qitish strategiyalari
   - Differensatsiya usullari

Javobni JSON formatida bering:
{
  "title": "Dars sarlavhasi",
  "objectives": ["maqsad1", "maqsad2"],
  "lesson_structure": {
    "stage1_desired_results": {
      "big_ideas": ["..."],
      "essential_questions": ["..."],
      "learning_objectives": ["..."],
      "knowledge": ["O'quvchilar biladi..."],
      "skills": ["O'quvchilar qila oladi..."]
    },
    "stage2_assessment_evidence": {
      "performance_task": { "description": "...", "criteria": [...] },
      "other_evidence": ["test", "kuzatish", "..."],
      "rubric": { "excellent": "...", "good": "...", "developing": "...", "beginning": "..." }
    },
    "stage3_learning_plan": {
      "activities": [
        { "phase": "...", "duration": N, "activity": "...", "description": "...", "materials": [...] }
      ],
      "differentiation": {
        "advanced": "...",
        "struggling": "...",
        "ell": "..."
      }
    }
  },
  "materials": ["material1", "material2"],
  "assessment_notes": "..."
}`
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLessonPlanner() {
  const { user, session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedLessonPlan | null>(null)

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

  // Select the correct prompt builder
  function buildPrompt(params: LessonPlanParams): string {
    const bloom = params.bloomLevel || 'understand'
    const duration = params.duration || 45
    const subject = params.subject?.trim() || params.subjectId || "Ko'rsatilmagan"

    switch (params.planningModel) {
      case '5E':
        return build5EPrompt(subject, params.topic, bloom, duration)
      case 'SMART':
        return buildSMARTPrompt(subject, params.topic, bloom, duration)
      case '20/80':
        return build2080Prompt(subject, params.topic, bloom, duration)
      case 'backward_design':
        return buildBackwardDesignPrompt(subject, params.topic, bloom, duration)
      default:
        return build5EPrompt(subject, params.topic, bloom, duration)
    }
  }

  // Call the edge function and parse the response into a structured plan
  const generatePlan = useCallback(
    async (params: LessonPlanParams): Promise<GeneratePlanResult> => {
      if (!user || !session) {
        const msg = 'Tizimga kiring'
        setError(msg)
        return { plan: null, error: msg }
      }

      setError(null)
      setLoading(true)
      setGeneratedPlan(null)

      try {
        const prompt = buildPrompt(params)

        const response = await fetch(
          `${supabaseUrl}/functions/v1/gemini-ai`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              messages: [{ role: 'user', content: prompt }],
              context: "Sen O'zbekiston maktablari uchun dars reja tuzuvchi AI yordamchisisisan. Javobni faqat JSON formatida ber, boshqa hech narsa qo'shma.",
              model: 'gpt-4o-mini',
            }),
          }
        )

        if (!response.ok) {
          const errBody = await response.json().catch(() => null)
          throw new Error(
            errBody?.error || `Server xatolik: ${response.status}`
          )
        }

        const data = await response.json()
        const rawContent: string = data.content || data.message || ''

        // Extract JSON from the response (handle markdown code fences)
        let jsonStr = rawContent
        const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (jsonMatch) {
          jsonStr = jsonMatch[1].trim()
        }

        let parsed: any
        try {
          parsed = JSON.parse(jsonStr)
        } catch {
          // If JSON parsing fails, build a minimal structure from the raw text
          parsed = {
            title: params.topic,
            objectives: [],
            lesson_structure: { raw_text: rawContent },
            materials: [],
            assessment_notes: '',
          }
        }

        const plan: GeneratedLessonPlan = {
          title: parsed.title || params.topic,
          topic: params.topic,
          planning_model: params.planningModel,
          bloom_level: params.bloomLevel,
          duration: params.duration || 45,
          objectives: parsed.objectives || [],
          lesson_structure: parsed.lesson_structure || {},
          materials: parsed.materials || [],
          assessment_notes: parsed.assessment_notes || '',
          raw_response: rawContent,
        }

        setGeneratedPlan(plan)
        return { plan, error: null }
      } catch (e: any) {
        const msg = e.message || 'Dars reja yaratishda xatolik'
        setError(msg)
        return { plan: null, error: msg }
      } finally {
        setLoading(false)
      }
    },
    [user, session, supabaseUrl]
  )

  // Save the generated plan to the lesson_plans table
  const savePlan = useCallback(
    async (
      params: LessonPlanParams,
      plan?: GeneratedLessonPlan
    ) => {
      const planToSave = plan || generatedPlan
      if (!planToSave) {
        setError('Saqlash uchun dars reja topilmadi')
        return { data: null, error: 'No plan to save' }
      }
      if (!user) {
        setError('Tizimga kiring')
        return { data: null, error: 'Not authenticated' }
      }

      try {
        const { data, error: err } = await supabase
          .from('lesson_plans')
          .insert({
            teacher_id: user.id,
            class_id: params.classId,
            subject_id: params.subjectId,
            title: planToSave.title,
            planning_model: planToSave.planning_model,
            bloom_level: planToSave.bloom_level || null,
            duration_minutes: planToSave.duration,
            learning_objectives: planToSave.objectives,
            lesson_structure: planToSave.lesson_structure,
            resources: planToSave.materials,
            assessment_rubric: { notes: planToSave.assessment_notes },
            is_ai_generated: true,
            status: 'draft',
          })
          .select()
          .single()

        if (err) {
          setError(err.message)
          return { data: null, error: err.message }
        }

        return { data, error: null }
      } catch (e: any) {
        const msg = e.message || 'Saqlashda xatolik'
        setError(msg)
        return { data: null, error: msg }
      }
    },
    [user, generatedPlan]
  )

  return {
    generatePlan,
    savePlan,
    loading,
    generatedPlan,
    error,
  }
}
