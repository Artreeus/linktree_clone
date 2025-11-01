-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  profile_image_url TEXT,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table for tracking link clicks
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_public" ON public.profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Links RLS Policies
CREATE POLICY "links_select_own" ON public.links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "links_select_public" ON public.links
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "links_insert_own" ON public.links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "links_update_own" ON public.links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "links_delete_own" ON public.links
  FOR DELETE USING (auth.uid() = user_id);

-- Analytics RLS Policies
CREATE POLICY "analytics_insert_public" ON public.analytics
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "analytics_select_own" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id);

-- Create trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'username', new.email),
    COALESCE(new.raw_user_meta_data ->> 'display_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
