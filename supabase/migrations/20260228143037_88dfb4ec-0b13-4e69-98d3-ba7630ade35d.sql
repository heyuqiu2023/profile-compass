
-- Create saved_cvs table
CREATE TABLE public.saved_cvs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  template TEXT NOT NULL DEFAULT 'modern',
  visibility JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_cvs ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own saved CVs"
ON public.saved_cvs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved CVs"
ON public.saved_cvs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved CVs"
ON public.saved_cvs FOR DELETE
USING (auth.uid() = user_id);
