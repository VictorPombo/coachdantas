-- Migration: Create Admin Notes Table
-- Description: Creates a table to store notes for administrators

CREATE TABLE IF NOT EXISTS public.admin_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT DEFAULT '',
    content TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Only the user who created the note can view it
CREATE POLICY "Users can view their own notes" 
ON public.admin_notes FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Only the user who created the note can insert it
CREATE POLICY "Users can insert their own notes" 
ON public.admin_notes FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Only the user who created the note can update it
CREATE POLICY "Users can update their own notes" 
ON public.admin_notes FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only the user who created the note can delete it
CREATE POLICY "Users can delete their own notes" 
ON public.admin_notes FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the handle_updated_at function
CREATE TRIGGER set_admin_notes_updated_at
BEFORE UPDATE ON public.admin_notes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
