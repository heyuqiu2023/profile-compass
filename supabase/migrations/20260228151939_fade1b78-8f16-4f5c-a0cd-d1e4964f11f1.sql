
-- Create activities table
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'Event',
  activity_date date,
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own activities"
ON public.activities FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activities"
ON public.activities FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
ON public.activities FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
ON public.activities FOR DELETE
USING (auth.uid() = user_id);
