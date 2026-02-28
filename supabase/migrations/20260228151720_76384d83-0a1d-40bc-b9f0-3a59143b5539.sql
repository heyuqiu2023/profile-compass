
-- Create user_featured_badges table
CREATE TABLE public.user_featured_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id text NOT NULL,
  position int NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Unique constraint to prevent duplicates
ALTER TABLE public.user_featured_badges ADD CONSTRAINT uq_user_featured_badge UNIQUE (user_id, badge_id);

-- Index for fast ordered reads
CREATE INDEX idx_user_featured_badges_user_position ON public.user_featured_badges (user_id, position);

-- Enable RLS
ALTER TABLE public.user_featured_badges ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own featured badges"
ON public.user_featured_badges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own featured badges"
ON public.user_featured_badges FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own featured badges"
ON public.user_featured_badges FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own featured badges"
ON public.user_featured_badges FOR DELETE
USING (auth.uid() = user_id);
