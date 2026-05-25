-- Success Pulse: pulse_data schema alignment for Act 1 onboarding persistence
-- Date: 2026-05-25
--
-- Manual execution guidance (Supabase SQL Editor):
-- 1) Run this file in a safe environment (staging first).
-- 2) Validate application read/write for onboarding completion.
-- 3) Apply to production during a controlled deployment window.
--
-- This migration is intentionally additive only.
-- It does NOT drop or rename existing columns.

BEGIN;

-- -----------------------------------------------------------------------------
-- Required/additive columns for onboarding persistence compatibility
-- -----------------------------------------------------------------------------
ALTER TABLE public.pulse_data
  ADD COLUMN IF NOT EXISTS "selectedNeedLevel" integer;

ALTER TABLE public.pulse_data
  ADD COLUMN IF NOT EXISTS contract jsonb DEFAULT '{}'::jsonb;

ALTER TABLE public.pulse_data
  ADD COLUMN IF NOT EXISTS life_profile jsonb DEFAULT '{}'::jsonb;

ALTER TABLE public.pulse_data
  ADD COLUMN IF NOT EXISTS apex_bps jsonb DEFAULT '{}'::jsonb;

ALTER TABLE public.pulse_data
  ADD COLUMN IF NOT EXISTS profile_source text;

COMMENT ON COLUMN public.pulse_data."selectedNeedLevel" IS
  'Act 1 selected need level (camelCase kept for current App.js compatibility).';

COMMENT ON COLUMN public.pulse_data.contract IS
  'Contract payload (status/signature/signed_at/source/version/journey snapshot).';

COMMENT ON COLUMN public.pulse_data.life_profile IS
  'Life profile payload (sleep/wake/notes/goals) for unified pulse profile direction.';

COMMENT ON COLUMN public.pulse_data.apex_bps IS
  'Apex BPS structured payload reserved for unified profile architecture.';

COMMENT ON COLUMN public.pulse_data.profile_source IS
  'Optional provenance marker for last profile update route (e.g., act1, mylab, counselor, ai_patch).';

-- Optional: backfill NULL jsonb cells to {} for legacy rows
UPDATE public.pulse_data
SET
  contract = COALESCE(contract, '{}'::jsonb),
  life_profile = COALESCE(life_profile, '{}'::jsonb),
  apex_bps = COALESCE(apex_bps, '{}'::jsonb)
WHERE
  contract IS NULL
  OR life_profile IS NULL
  OR apex_bps IS NULL;

COMMIT;

-- =============================================================================
-- OPTIONAL RLS HARDENING (review before running)
-- =============================================================================
-- NOTE:
-- - Keep these statements separate for manual review.
-- - If policies already exist, adjust names and avoid duplication conflicts.

-- ALTER TABLE public.pulse_data ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "pulse_data_select_own"
--   ON public.pulse_data
--   FOR SELECT
--   USING (user_id = auth.uid());

-- CREATE POLICY "pulse_data_insert_own"
--   ON public.pulse_data
--   FOR INSERT
--   WITH CHECK (user_id = auth.uid());

-- CREATE POLICY "pulse_data_update_own"
--   ON public.pulse_data
--   FOR UPDATE
--   USING (user_id = auth.uid())
--   WITH CHECK (user_id = auth.uid());

-- CREATE POLICY "pulse_data_delete_own"
--   ON public.pulse_data
--   FOR DELETE
--   USING (user_id = auth.uid());

-- Future normalization note:
-- - Consider adding selected_need_level (snake_case) in a later migration.
-- - Use phased dual-write + backfill before deprecating "selectedNeedLevel".
