-- CareerVerse schema compatibility migration
-- Run this once in Supabase Dashboard > SQL Editor.
-- It is safe to run repeatedly.

BEGIN;

-- Existing tables created by an older CareerVerse version are not changed by
-- CREATE TABLE IF NOT EXISTS, so add every currently required column explicitly.
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS grade INT,
  ADD COLUMN IF NOT EXISTS suggested_path TEXT,
  ADD COLUMN IF NOT EXISTS career_pressure TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS interests JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE IF EXISTS public.career_dna
  ADD COLUMN IF NOT EXISTS analytical INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS creativity INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS collaboration INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS risk_tolerance INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS archetype TEXT DEFAULT 'Explorer',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Preserve values from legacy "*_score" columns when those columns exist.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'career_dna'
      AND column_name = 'analytical_score'
  ) THEN
    EXECUTE 'UPDATE public.career_dna
             SET analytical = COALESCE(analytical_score, analytical, 0)';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'career_dna'
      AND column_name = 'creativity_score'
  ) THEN
    EXECUTE 'UPDATE public.career_dna
             SET creativity = COALESCE(creativity_score, creativity, 0)';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'career_dna'
      AND column_name = 'collaboration_score'
  ) THEN
    EXECUTE 'UPDATE public.career_dna
             SET collaboration = COALESCE(collaboration_score, collaboration, 0)';
  END IF;
END $$;

ALTER TABLE IF EXISTS public.simulations
  ADD COLUMN IF NOT EXISTS career_name TEXT,
  ADD COLUMN IF NOT EXISTS choices_made JSONB DEFAULT '{}'::jsonb NOT NULL,
  ADD COLUMN IF NOT EXISTS completion_status TEXT NOT NULL DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS ending_unlocked TEXT,
  ADD COLUMN IF NOT EXISTS reflection_interest INT,
  ADD COLUMN IF NOT EXISTS reflection_confidence INT,
  ADD COLUMN IF NOT EXISTS current_step TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS simulations_user_career_unique
  ON public.simulations (user_id, career_name);

-- Some older builds use journal_entries while the current app uses journal.
-- Add both timestamp names to the legacy table so either build can read it.
ALTER TABLE IF EXISTS public.journal_entries
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  ADD COLUMN IF NOT EXISTS "timestamp" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE IF EXISTS public.journal
  ADD COLUMN IF NOT EXISTS reflection_text TEXT,
  ADD COLUMN IF NOT EXISTS career_reference TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Ask PostgREST to reload its schema cache immediately.
NOTIFY pgrst, 'reload schema';

COMMIT;
