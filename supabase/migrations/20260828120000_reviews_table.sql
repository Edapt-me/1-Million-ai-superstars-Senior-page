-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    review_text TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    profile_image_url TEXT,
    review_image_url TEXT,
    video_url TEXT,
    source TEXT DEFAULT 'manual', -- 'manual', 'google', etc.
    source_review_id TEXT, -- ID from external source (e.g. Google Places review ID)
    review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint for source_review_id (except nulls)
CREATE UNIQUE INDEX IF NOT EXISTS reviews_source_review_id_idx ON public.reviews (source_review_id) WHERE source_review_id IS NOT NULL;

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read published reviews
CREATE POLICY "Public can view published reviews" 
ON public.reviews FOR SELECT 
USING (is_published = true);

-- Policy: Admins can do everything
CREATE POLICY "Admins have full access to reviews" 
ON public.reviews FOR ALL
USING (
  (SELECT role::text FROM public.user_roles WHERE user_roles.user_id = auth.uid()) = 'admin'
);

-- Auto-update updated_at on change
CREATE OR REPLACE FUNCTION update_reviews_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_reviews_updated_at_column();
