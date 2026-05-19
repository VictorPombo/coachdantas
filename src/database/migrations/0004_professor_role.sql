-- Migration: Add 'professor' role
-- Description: Adds 'professor' to user_role ENUM and sets up RLS policies.

-- Add the new value to the ENUM
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'professor';

-- Grant full access to professor on all system tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'profiles', 'modalities', 'plans', 'subscriptions',
      'classes', 'class_enrollments', 'checkins',
      'exercises', 'workouts', 'workout_exercises',
      'assessments', 'achievements', 'profile_achievements',
      'store_products', 'store_orders', 'whatsapp_templates'
    ])
  LOOP
    EXECUTE format(
      'CREATE POLICY professor_full_access ON %I FOR ALL USING (public.user_role() = ''professor'') WITH CHECK (public.user_role() = ''professor'')',
      tbl
    );
  END LOOP;
END $$;
