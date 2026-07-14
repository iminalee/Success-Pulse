-- Success Pulse: add recent_summary column for Apex AI long-term memory
-- Date: 2026-07-14
--
-- Manual execution guidance (Supabase SQL Editor):
-- 1) Run this file in a safe environment (staging first).
-- 2) Validate Apex chat still loads/saves normally.
-- 3) Apply to production during a controlled deployment window.
--
-- This migration is intentionally additive only.
-- It does NOT drop or rename existing columns.

BEGIN;

-- -----------------------------------------------------------------------------
-- Apex AI long-term memory summary.
-- Injected into Dify chat context (inputs.recent_summary) so Apex can recall
-- the user's longer-term situation across sessions. Populated by a later ticket
-- (conversation summarization); safe to remain NULL/empty until then.
-- -----------------------------------------------------------------------------
ALTER TABLE public.pulse_data
  ADD COLUMN IF NOT EXISTS recent_summary text;

COMMENT ON COLUMN public.pulse_data.recent_summary IS
  'Apex AI long-term memory summary, injected into Dify chat context (inputs.recent_summary).';

COMMIT;
