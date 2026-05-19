-- Migration: Add target_date to admin_notes
-- Description: Adds a target_date column to allow linking notes to specific days in the Agenda

ALTER TABLE public.admin_notes ADD COLUMN IF NOT EXISTS target_date DATE;

-- Optional: Create an index for faster queries by target_date in the Agenda
CREATE INDEX IF NOT EXISTS idx_admin_notes_target_date ON public.admin_notes(target_date);
