
-- 1. Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL DEFAULT '',
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  grade TEXT DEFAULT '',
  coursework TEXT DEFAULT '',
  thesis_title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own education" ON public.education FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own education" ON public.education FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own education" ON public.education FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own education" ON public.education FOR DELETE USING (auth.uid() = user_id);

-- 2. Create languages table
CREATE TABLE public.languages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  language TEXT NOT NULL,
  proficiency TEXT NOT NULL DEFAULT 'Conversational',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own languages" ON public.languages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own languages" ON public.languages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own languages" ON public.languages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own languages" ON public.languages FOR DELETE USING (auth.uid() = user_id);

-- 3. Add structured experience columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS portfolio_url TEXT DEFAULT '';

-- Note: experiences table doesn't exist yet in supabase, structured fields are in-context only for now
