-- ============================================
-- FAZA 4: Telegram Integration + Assessments
-- Supabase Dashboard > SQL Editor da ishga tushiring
-- ============================================

-- 1. telegram_links jadvali (bot ulash uchun)
CREATE TABLE IF NOT EXISTS telegram_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  used BOOLEAN DEFAULT false,
  telegram_chat_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. profiles jadvaliga telegram_id ustuni
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'telegram_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN telegram_id BIGINT;
  END IF;
END $$;

-- 3. telegram_links uchun RLS
ALTER TABLE telegram_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own links" ON telegram_links;
CREATE POLICY "Users can insert own links" ON telegram_links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own links" ON telegram_links;
CREATE POLICY "Users can view own links" ON telegram_links
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access telegram_links" ON telegram_links;
CREATE POLICY "Service role full access telegram_links" ON telegram_links
  FOR ALL USING (true) WITH CHECK (true);

-- 4. assessments jadvali (baholash sessiyalari)
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL,
  subject_id UUID,
  lesson_plan_id UUID,
  title TEXT NOT NULL,
  assessment_type TEXT DEFAULT 'formative',
  method TEXT DEFAULT 'manual',
  total_points INTEGER DEFAULT 100,
  passing_score INTEGER DEFAULT 56,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers manage own assessments" ON assessments;
CREATE POLICY "Teachers manage own assessments" ON assessments
  FOR ALL USING (auth.uid() = teacher_id) WITH CHECK (auth.uid() = teacher_id);
