-- Murabbiyona Full Database Initialization Script
-- Run this in your Supabase SQL Editor

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('teacher', 'admin', 'parent', 'student');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language_code') THEN
        CREATE TYPE language_code AS ENUM ('uz', 'ru', 'en');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_type') THEN
        CREATE TYPE status_type AS ENUM ('draft', 'active', 'completed', 'archived');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grade_type') THEN
        CREATE TYPE grade_type AS ENUM ('formative', 'summative', 'daily', 'homework', 'project', 'exam');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assessment_type') THEN
        CREATE TYPE assessment_type AS ENUM ('formative', 'summative', 'diagnostic', 'quiz', 'homework', 'project');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assessment_method') THEN
        CREATE TYPE assessment_method AS ENUM ('qr_code', 'rf_remote', 'telegram_bot', 'live_kahoot', 'ocr_answer_sheet', 'manual', 'ai_auto');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Core Tables

-- Schools Table
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Profiles Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    role user_role DEFAULT 'teacher',
    school_id UUID REFERENCES public.schools(id),
    telegram_id BIGINT,
    language language_code DEFAULT 'uz',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_uz TEXT NOT NULL,
    name_ru TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    grade_level INTEGER NOT NULL,
    academic_year TEXT NOT NULL DEFAULT '2025-2026',
    color TEXT DEFAULT '#10b981',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    journal_number INTEGER,
    birth_date DATE,
    gender TEXT,
    qr_code TEXT UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Academic Features

-- Lesson Plans Table
CREATE TABLE IF NOT EXISTS public.lesson_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INTEGER DEFAULT 45,
    status status_type DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    lesson_plan_id UUID REFERENCES public.lesson_plans(id),
    title TEXT NOT NULL,
    assessment_type assessment_type DEFAULT 'quiz',
    method assessment_method DEFAULT 'manual',
    max_score INTEGER DEFAULT 5,
    status status_type DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Grades Table (The heart of Pult Mode)
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES public.assessments(id),
    score DECIMAL NOT NULL,
    max_score DECIMAL DEFAULT 5,
    grade_type grade_type DEFAULT 'daily',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status attendance_status DEFAULT 'present',
    check_time TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Voice Grades Table (For AI scanning)
CREATE TABLE IF NOT EXISTS public.voice_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    transcript TEXT NOT NULL,
    detected_student_name TEXT,
    detected_score INTEGER,
    student_id UUID REFERENCES public.students(id),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_grades ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Teachers see/manage their own data)

-- Profile Policies
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Class/Student Policies
CREATE POLICY "Read Classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Insert Classes" ON public.classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Read Students" ON public.students FOR SELECT USING (true);

-- Academic Policies (Simplified for the demo)
CREATE POLICY "Manage Lessons" ON public.lesson_plans FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Manage Assessments" ON public.assessments FOR ALL USING (auth.uid() = teacher_id);
CREATE POLICY "Manage Grades" ON public.grades FOR ALL USING (auth.uid() = teacher_id OR true); -- Allowing public for demo
CREATE POLICY "Manage Attendance" ON public.attendance FOR ALL USING (auth.uid() = teacher_id OR true);

-- 7. Auto Profile Hook
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'Yangi Ustoz'), new.email, 'teacher');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Add Initial Data
INSERT INTO public.schools (name) 
SELECT 'Murabbiyona Demo School'
WHERE NOT EXISTS (SELECT 1 FROM public.schools WHERE name = 'Murabbiyona Demo School');

INSERT INTO public.subjects (name_uz, color) VALUES 
('Matematika', '#3b82f6'),
('Algebra', '#3b82f6'),
('Geometriya', '#3b82f6'),
('Ona tili', '#f59e0b'),
('Rus tili', '#ef4444'),
('English', '#ef4444'),
('Fizika', '#8b5cf6')
ON CONFLICT DO NOTHING;
