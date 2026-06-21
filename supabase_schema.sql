-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    grade INT,
    suggested_path TEXT,
    career_pressure TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    xp INT DEFAULT 0,
    achievements JSONB DEFAULT '[]'::jsonb,
    interests JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create career_dna table
CREATE TABLE IF NOT EXISTS public.career_dna (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    analytical INT DEFAULT 0,
    creativity INT DEFAULT 0,
    collaboration INT DEFAULT 0,
    risk_tolerance INT DEFAULT 0,
    archetype TEXT DEFAULT 'Explorer',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.career_dna ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own DNA" ON public.career_dna
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update/insert own DNA" ON public.career_dna
    FOR ALL USING (auth.uid() = user_id);

-- Create simulations table
CREATE TABLE IF NOT EXISTS public.simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    career_name TEXT NOT NULL,
    choices_made JSONB DEFAULT '{}'::jsonb NOT NULL,
    completion_status TEXT NOT NULL DEFAULT 'not_started',
    ending_unlocked TEXT,
    reflection_interest INT,
    reflection_confidence INT,
    current_step TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, career_name)
);

ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own simulations" ON public.simulations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own simulations" ON public.simulations
    FOR ALL USING (auth.uid() = user_id);

-- Create journal table
CREATE TABLE IF NOT EXISTS public.journal (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    reflection_text TEXT NOT NULL,
    career_reference TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.journal ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journal" ON public.journal
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own journal" ON public.journal
    FOR ALL USING (auth.uid() = user_id);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    career_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, career_name)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own bookmarks" ON public.bookmarks
    FOR ALL USING (auth.uid() = user_id);

-- Create ai_mentor_memory table
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

-- Trigger to automatically create a profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, onboarding_completed, xp, achievements, interests)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'first_name', ''),
        FALSE,
        0,
        '[]'::jsonb,
        '[]'::jsonb
    )
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO public.career_dna (user_id, analytical, creativity, collaboration, risk_tolerance, archetype)
    VALUES (new.id, 0, 0, 0, 0, 'Explorer')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
