-- ============================================
-- FIX: Yangi foydalanuvchi ro'yxatdan o'tganda profil avtomatik yaratilsin
-- Supabase Dashboard > SQL Editor da ishga tushiring
-- ============================================

-- 1. handle_new_user funksiyasi
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, language, is_active, settings)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Foydalanuvchi'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'teacher'),
    'uz',
    true,
    '{}'::jsonb
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    email = COALESCE(EXCLUDED.email, profiles.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger yaratish
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Profiles jadvaliga INSERT ruxsati (yangi foydalanuvchi o'z profilini yaratolsin)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Profiles jadvaliga SELECT ruxsati
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 5. Profiles jadvaliga UPDATE ruxsati
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. Service role uchun to'liq ruxsat (Edge Functions uchun)
DROP POLICY IF EXISTS "Service role full access profiles" ON profiles;
CREATE POLICY "Service role full access profiles" ON profiles
  FOR ALL USING (auth.role() = 'service_role');

-- 7. MUHIM: Email tasdiqlashni o'chirish (ixtiyoriy)
-- Supabase Dashboard > Authentication > Providers > Email
-- "Confirm email" ni O'CHIRING (toggle off)
-- Bu SQL bilan qilish mumkin emas, Dashboard dan qiling!
