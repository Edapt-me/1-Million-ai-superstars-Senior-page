-- Migration to add ai_tools table

CREATE TABLE public.ai_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name text NOT NULL,
  tool_logo text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;

-- Grant access to anon for SELECT if published
GRANT SELECT ON public.ai_tools TO anon;
GRANT SELECT ON public.ai_tools TO authenticated;

-- Policies
CREATE POLICY "Allow public read access to published tools"
ON public.ai_tools
FOR SELECT
TO public
USING (published = true);

CREATE POLICY "Allow full access for authenticated admins"
ON public.ai_tools
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Add updated_at trigger (assuming set_updated_at() function already exists from previous migrations)
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON public.ai_tools
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
