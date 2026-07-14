-- Success Pulse: add pace-diagnosis columns for Mental Bank target-date realism
-- Date: 2026-07-14
--
-- Manual execution guidance (Supabase SQL Editor):
-- 1) Run this file in a safe environment (staging first).
-- 2) Validate My Lab loads/saves the pace fields.
-- 3) Apply to production during a controlled deployment window.
--
-- This migration is intentionally additive only.
-- It does NOT drop or rename existing columns.

BEGIN;

-- -----------------------------------------------------------------------------
-- Pace diagnosis inputs (thePulse mental-bank model):
--   daily_commit_hours × weekly_commit_days vs required_hours → target-date
--   realism (case A/B/C via diagnoseTargetDate). target_date reuses the
--   existing column.
-- -----------------------------------------------------------------------------
ALTER TABLE public.pulse_data
  ADD COLUMN IF NOT EXISTS daily_commit_hours numeric;

ALTER TABLE public.pulse_data
  ADD COLUMN IF NOT EXISTS weekly_commit_days integer;

ALTER TABLE public.pulse_data
  ADD COLUMN IF NOT EXISTS required_hours numeric;

COMMENT ON COLUMN public.pulse_data.daily_commit_hours IS
  'Pace diagnosis: hours committed per day.';

COMMENT ON COLUMN public.pulse_data.weekly_commit_days IS
  'Pace diagnosis: practice days per week (0-7).';

COMMENT ON COLUMN public.pulse_data.required_hours IS
  'Pace diagnosis: total hours estimated to reach the goal.';

COMMIT;
