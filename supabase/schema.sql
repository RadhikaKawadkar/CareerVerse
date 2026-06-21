-- CAREERVERSE PRODUCTION DATABASE SCHEMA
-- Copy and execute this in the Supabase SQL Editor to initialize all tables.

-- 1. PROFILES Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  grade INTEGER,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 3,
  rank TEXT DEFAULT 'Novice',
  badges TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  personality_signals TEXT[] DEFAULT '{}',
  suggested_path TEXT,
  career_pressure TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 2. CAREER DNA Table
CREATE TABLE IF NOT EXISTS public.career_dna (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  analytical INTEGER DEFAULT 50,
  creativity INTEGER DEFAULT 50,
  collaboration INTEGER DEFAULT 50,
  risk INTEGER DEFAULT 50,
  risk_tolerance INTEGER DEFAULT 50,
  archetype TEXT DEFAULT 'Explorer',
  work_style TEXT DEFAULT 'Balanced',
  learning_style TEXT DEFAULT 'Visual',
  communication_score INTEGER DEFAULT 50,
  creativity_score INTEGER DEFAULT 50,
  leadership_score INTEGER DEFAULT 50,
  analytical_score INTEGER DEFAULT 50,
  confidence_score INTEGER DEFAULT 75,
  communication INTEGER DEFAULT 50,
  empathy INTEGER DEFAULT 50,
  leadership INTEGER DEFAULT 50,
  confidence INTEGER DEFAULT 75,
  decision_patterns TEXT[] DEFAULT '{}',
  strength_clusters TEXT[] DEFAULT '{}',
  growth_history JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.career_dna ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own DNA" 
  ON public.career_dna FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own DNA" 
  ON public.career_dna FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own DNA" 
  ON public.career_dna FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 3. SIMULATIONS Table
CREATE TABLE IF NOT EXISTS public.simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL,
  career_name TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completion_status TEXT DEFAULT 'in_progress',
  current_scene_index INTEGER DEFAULT 0,
  choices JSONB DEFAULT '{}',
  choices_made JSONB DEFAULT '{}',
  ending_unlocked TEXT,
  reflection_interest INTEGER,
  reflection_confidence INTEGER,
  current_step TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, career_id)
);

ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sims" 
  ON public.simulations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own sims" 
  ON public.simulations FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. JOURNAL ENTRIES Table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL,
  excited TEXT,
  difficult TEXT,
  surprised TEXT,
  feeling INTEGER,
  reflection_text TEXT,
  career_reference TEXT,
  title TEXT,
  content TEXT,
  mood TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own journals" 
  ON public.journal_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own journals" 
  ON public.journal_entries FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. BOOKMARKS Table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL,
  career_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, career_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookmarks" 
  ON public.bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own bookmarks" 
  ON public.bookmarks FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. MENTOR CHATS Table
CREATE TABLE IF NOT EXISTS public.mentor_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id TEXT,
  mentor_name TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mentor_name)
);

ALTER TABLE public.mentor_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chats" 
  ON public.mentor_chats FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chats" 
  ON public.mentor_chats FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. ACHIEVEMENTS Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT,
  badge_name TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_name)
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own achievements" 
  ON public.achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own achievements" 
  ON public.achievements FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 8. QUEST PROGRESS Table
CREATE TABLE IF NOT EXISTS public.quest_progress (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  active TEXT[] DEFAULT '{}',
  completed TEXT[] DEFAULT '{}',
  milestones TEXT[] DEFAULT '{}',
  progress JSONB DEFAULT '{}',
  claimed_milestones TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quest progress" 
  ON public.quest_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own quest progress" 
  ON public.quest_progress FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 9. SKILL PROGRESS Table
CREATE TABLE IF NOT EXISTS public.skill_progress (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  unlocked_skills TEXT[] DEFAULT '{}',
  claimed_skills TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.skill_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own skill progress" 
  ON public.skill_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own skill progress" 
  ON public.skill_progress FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 10. AI MENTOR MEMORY Table
CREATE TABLE IF NOT EXISTS public.ai_mentor_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mentor_type TEXT NOT NULL,
  conversation_history JSONB DEFAULT '[]'::jsonb NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, mentor_type)
);

ALTER TABLE public.ai_mentor_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI mentor memory" ON public.ai_mentor_memory
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own AI mentor memory" ON public.ai_mentor_memory
  FOR ALL USING (auth.uid() = user_id);

-- Trigger to automatically create profile and DNA on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_name TEXT;
BEGIN
    IF new.raw_user_meta_data IS NOT NULL THEN
        user_name := COALESCE(
            new.raw_user_meta_data->>'name', 
            new.raw_user_meta_data->>'first_name', 
            ''
        );
    ELSE
        user_name := '';
    END IF;

    INSERT INTO public.profiles (id, email, name, onboarding_completed, xp, achievements)
    VALUES (
        new.id,
        new.email,
        user_name,
        FALSE,
        0,
        '[]'::jsonb
    )
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.career_dna (user_id, analytical, creativity, collaboration, risk, risk_tolerance, archetype)
    VALUES (new.id, 50, 50, 50, 50, 50, 'Explorer')
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.quest_progress (user_id, active, completed, milestones)
    VALUES (new.id, '{}', '{}', '{}')
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.skill_progress (user_id, unlocked_skills)
    VALUES (new.id, '{}')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
