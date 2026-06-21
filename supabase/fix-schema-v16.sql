-- ALTER TABLE statements to upgrade existing database schema to V16 without dropping tables.

-- 1. Upgrade public.profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 3;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'Novice';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS personality_signals TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suggested_path TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS career_pressure TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Upgrade public.career_dna table
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS risk_tolerance INTEGER DEFAULT 50;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS risk INTEGER DEFAULT 50;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS archetype TEXT DEFAULT 'Explorer';
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS work_style TEXT DEFAULT 'Balanced';
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS learning_style TEXT DEFAULT 'Visual';
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS communication_score INTEGER DEFAULT 50;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS creativity_score INTEGER DEFAULT 50;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS leadership_score INTEGER DEFAULT 50;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS analytical_score INTEGER DEFAULT 50;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 75;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS communication INTEGER DEFAULT 50;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS empathy INTEGER DEFAULT 50;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS leadership INTEGER DEFAULT 50;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS confidence INTEGER DEFAULT 75;
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS decision_patterns TEXT[] DEFAULT '{}';
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS strength_clusters TEXT[] DEFAULT '{}';
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS growth_history JSONB DEFAULT '[]';
ALTER TABLE public.career_dna ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Upgrade public.simulations table
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS career_name TEXT;
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS completion_status TEXT DEFAULT 'in_progress';
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS current_scene_index INTEGER DEFAULT 0;
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS choices JSONB DEFAULT '{}';
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS choices_made JSONB DEFAULT '{}';
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS ending_unlocked TEXT;
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS reflection_interest INTEGER;
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS reflection_confidence INTEGER;
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS current_step TEXT;
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.simulations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure unique constraint exists on simulations
ALTER TABLE public.simulations DROP CONSTRAINT IF EXISTS simulations_user_id_career_id_key;
ALTER TABLE public.simulations ADD CONSTRAINT simulations_user_id_career_id_key UNIQUE (user_id, career_id);

-- 4. Create or upgrade public.journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  career_id TEXT NOT NULL,
  excited TEXT,
  difficult TEXT,
  surprised TEXT,
  feeling INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Upgrade journal_entries
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS reflection_text TEXT;
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS career_reference TEXT;
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS mood TEXT;
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Upgrade public.bookmarks table
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS career_name TEXT;
ALTER TABLE public.bookmarks ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure unique constraint on bookmarks
ALTER TABLE public.bookmarks DROP CONSTRAINT IF EXISTS bookmarks_user_id_career_id_key;
ALTER TABLE public.bookmarks ADD CONSTRAINT bookmarks_user_id_career_id_key UNIQUE (user_id, career_id);

-- 6. Upgrade public.quest_progress table
ALTER TABLE public.quest_progress ADD COLUMN IF NOT EXISTS progress JSONB DEFAULT '{}';
ALTER TABLE public.quest_progress ADD COLUMN IF NOT EXISTS claimed_milestones TEXT[] DEFAULT '{}';
ALTER TABLE public.quest_progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 7. Upgrade public.skill_progress table
ALTER TABLE public.skill_progress ADD COLUMN IF NOT EXISTS claimed_skills TEXT[] DEFAULT '{}';
ALTER TABLE public.skill_progress ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 8. Create AI mentor memory table if missing
CREATE TABLE IF NOT EXISTS public.ai_mentor_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mentor_type TEXT NOT NULL,
    conversation_history JSONB DEFAULT '[]'::jsonb NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, mentor_type)
);

-- 9. Force reload the schema cache for the PostgREST API
NOTIFY pgrst, 'reload schema';
