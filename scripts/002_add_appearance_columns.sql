-- Add appearance columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS button_style TEXT DEFAULT 'rounded';

-- Update existing profiles to have default button_style
UPDATE public.profiles
SET button_style = 'rounded'
WHERE button_style IS NULL;

