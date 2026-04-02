// Murabbiyona Database Types
// Auto-generated structure matching Supabase schema

export type UserRole = 'teacher' | 'admin' | 'parent' | 'student'
export type Language = 'uz' | 'ru' | 'en'
export type GradeType = 'formative' | 'summative' | 'daily' | 'homework' | 'project' | 'exam'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type PlanningModel = '5e' | 'smart' | 'backward_design' | 'direct_instruction' | 'inquiry_based' | 'project_based' | 'flipped' | 'custom'
export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'
export type AssessmentType = 'formative' | 'summative' | 'diagnostic' | 'quiz' | 'homework' | 'project'
export type AssessmentMethod = 'qr_code' | 'rf_remote' | 'telegram_bot' | 'live_kahoot' | 'ocr_answer_sheet' | 'manual' | 'ai_auto'

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  email: string | null
  avatar_url: string | null
  role: UserRole
  school_id: string | null
  telegram_id: number | null
  language: Language
  settings: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface School {
  id: string
  name: string
  region: string | null
  district: string | null
  address: string | null
  phone: string | null
  logo_url: string | null
  settings: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name_uz: string
  name_ru: string | null
  name_en: string | null
  icon: string | null
  color: string | null
  created_at: string
}

export interface Class {
  id: string
  school_id: string
  name: string
  grade_level: number
  section: string | null
  academic_year: string
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  school_id: string
  class_id: string
  profile_id: string | null
  first_name: string
  last_name: string
  journal_number: number | null
  birth_date: string | null
  gender: 'male' | 'female' | null
  photo_url: string | null
  qr_code: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TeacherAssignment {
  id: string
  teacher_id: string
  class_id: string
  subject_id: string
  is_class_teacher: boolean
  academic_year: string
  created_at: string
}

export interface Curriculum {
  id: string
  teacher_id: string
  subject_id: string
  class_id: string
  textbook_id: string | null
  title: string
  quarter: number | null
  file_url: string | null
  file_type: string | null
  total_hours: number | null
  ai_analysis: Record<string, unknown> | null
  status: 'draft' | 'active' | 'completed'
  academic_year: string
  created_at: string
  updated_at: string
}

export interface LessonPlan {
  id: string
  teacher_id: string
  curriculum_id: string | null
  topic_id: string | null
  class_id: string
  subject_id: string
  title: string
  date: string
  duration_minutes: number
  planning_model: PlanningModel
  bloom_level: BloomLevel | null
  lesson_structure: Record<string, unknown>
  learning_objectives: string[]
  resources: Record<string, unknown>[]
  interactive_tools: Record<string, unknown>[]
  assessment_rubric: Record<string, unknown>
  is_ai_generated: boolean
  ai_model_used: string | null
  ai_conversation_id: string | null
  status: 'draft' | 'ready' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export interface Assessment {
  id: string
  teacher_id: string
  class_id: string
  subject_id: string
  lesson_plan_id: string | null
  title: string
  description: string | null
  assessment_type: AssessmentType
  method: AssessmentMethod
  bloom_level: BloomLevel | null
  time_limit_seconds: number | null
  scheduled_date: string | null
  total_points: number
  passing_score: number
  shuffle_questions: boolean
  show_answers_after: boolean
  status: 'draft' | 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export interface Grade {
  id: string
  student_id: string
  class_id: string
  subject_id: string
  teacher_id: string
  assessment_id: string | null
  score: number
  max_score: number
  percentage: number | null
  grade_type: GradeType
  quarter: number | null
  academic_year: string | null
  date: string
  comment: string | null
  created_at: string
  updated_at: string
}

export interface Attendance {
  id: string
  student_id: string
  class_id: string
  teacher_id: string
  date: string
  period_number: number | null
  status: AttendanceStatus
  check_method: 'qr_scan' | 'face_id' | 'manual' | 'auto' | null
  check_time: string | null
  note: string | null
  created_at: string
}

export interface StudentReward {
  id: string
  student_id: string
  teacher_id: string
  category_id: string
  class_id: string
  points: number
  note: string | null
  date: string
  created_at: string
}

export interface RewardCategory {
  id: string
  school_id: string | null
  name_uz: string
  name_ru: string | null
  name_en: string | null
  icon: string
  color: string
  points: number
  is_positive: boolean
  is_default: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan_id: string
  status: 'active' | 'expired' | 'cancelled' | 'trial'
  starts_at: string
  expires_at: string
  payment_method: string | null
  payment_ref: string | null
  amount_paid: number | null
  created_at: string
}

export interface AiCredits {
  id: string
  user_id: string
  balance: number
  total_purchased: number
  total_used: number
  updated_at: string
}

export interface ChatMessage {
  id: string
  room_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'report'
  attachment_url: string | null
  is_read: boolean
  created_at: string
}

// Supabase Database type for client
export interface Database {
  public: {
    Tables: {
      schools: { Row: School; Insert: Partial<School> & Pick<School, 'name'>; Update: Partial<School> }
      profiles: { Row: Profile; Insert: Partial<Profile> & Pick<Profile, 'id' | 'full_name' | 'role'>; Update: Partial<Profile> }
      subjects: { Row: Subject; Insert: Partial<Subject> & Pick<Subject, 'name_uz'>; Update: Partial<Subject> }
      classes: { Row: Class; Insert: Partial<Class> & Pick<Class, 'school_id' | 'name' | 'grade_level' | 'academic_year'>; Update: Partial<Class> }
      students: { Row: Student; Insert: Partial<Student> & Pick<Student, 'school_id' | 'class_id' | 'first_name' | 'last_name'>; Update: Partial<Student> }
      teacher_assignments: { Row: TeacherAssignment; Insert: Partial<TeacherAssignment> & Pick<TeacherAssignment, 'teacher_id' | 'class_id' | 'subject_id' | 'academic_year'>; Update: Partial<TeacherAssignment> }
      curricula: { Row: Curriculum; Insert: Partial<Curriculum> & Pick<Curriculum, 'teacher_id' | 'subject_id' | 'class_id' | 'title' | 'academic_year'>; Update: Partial<Curriculum> }
      lesson_plans: { Row: LessonPlan; Insert: Partial<LessonPlan> & Pick<LessonPlan, 'teacher_id' | 'class_id' | 'subject_id' | 'title' | 'date'>; Update: Partial<LessonPlan> }
      assessments: { Row: Assessment; Insert: Partial<Assessment> & Pick<Assessment, 'teacher_id' | 'class_id' | 'subject_id' | 'title' | 'assessment_type' | 'method'>; Update: Partial<Assessment> }
      grades: { Row: Grade; Insert: Partial<Grade> & Pick<Grade, 'student_id' | 'class_id' | 'subject_id' | 'teacher_id' | 'score' | 'grade_type'>; Update: Partial<Grade> }
      attendance: { Row: Attendance; Insert: Partial<Attendance> & Pick<Attendance, 'student_id' | 'class_id' | 'teacher_id' | 'status'>; Update: Partial<Attendance> }
      student_rewards: { Row: StudentReward; Insert: Partial<StudentReward> & Pick<StudentReward, 'student_id' | 'teacher_id' | 'category_id' | 'class_id' | 'points'>; Update: Partial<StudentReward> }
      reward_categories: { Row: RewardCategory; Insert: Partial<RewardCategory> & Pick<RewardCategory, 'name_uz' | 'icon'>; Update: Partial<RewardCategory> }
      subscriptions: { Row: Subscription; Insert: Partial<Subscription> & Pick<Subscription, 'user_id' | 'plan_id' | 'expires_at'>; Update: Partial<Subscription> }
      ai_credits: { Row: AiCredits; Insert: Partial<AiCredits> & Pick<AiCredits, 'user_id'>; Update: Partial<AiCredits> }
      chat_messages: { Row: ChatMessage; Insert: Partial<ChatMessage> & Pick<ChatMessage, 'room_id' | 'sender_id' | 'content'>; Update: Partial<ChatMessage> }
      voice_grades: { Row: VoiceGrade; Insert: Partial<VoiceGrade> & Pick<VoiceGrade, 'teacher_id' | 'class_id' | 'subject_id' | 'transcript'>; Update: Partial<VoiceGrade> }
    }
  }
}

export interface VoiceGrade {
  id: string
  teacher_id: string
  class_id: string
  subject_id: string
  audio_url: string | null
  transcript: string
  detected_student_name: string | null
  detected_score: number | null
  student_id: string | null
  grade_id: string | null
  confidence: number | null
  status: 'pending' | 'confirmed' | 'rejected' | 'ambiguous'
  candidate_students: Record<string, unknown>[]
  created_at: string
}
