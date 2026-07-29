-- Migration to add Website Settings, Curriculum, and FAQs tables

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. website_settings table (singleton)
CREATE TABLE public.website_settings (
  id integer PRIMARY KEY DEFAULT 1,
  
  -- Hero
  hero_title text NOT NULL DEFAULT '',
  hero_subtitle text NOT NULL DEFAULT '',
  hero_badge text NOT NULL DEFAULT '',
  hero_image text NOT NULL DEFAULT '',
  hero_primary_button_text text NOT NULL DEFAULT '',
  hero_secondary_button_text text NOT NULL DEFAULT '',
  hero_trust_counter text NOT NULL DEFAULT '',
  
  -- Course
  course_batch_name text NOT NULL DEFAULT '',
  course_start_date text NOT NULL DEFAULT '',
  course_duration text NOT NULL DEFAULT '',
  course_registration_link text NOT NULL DEFAULT '',
  course_fee text NOT NULL DEFAULT '',
  course_offer_price text NOT NULL DEFAULT '',
  
  -- Contact
  contact_email text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  contact_whatsapp text NOT NULL DEFAULT '',
  
  -- Social Links
  social_facebook text NOT NULL DEFAULT '',
  social_instagram text NOT NULL DEFAULT '',
  social_youtube text NOT NULL DEFAULT '',
  social_linkedin text NOT NULL DEFAULT '',
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Ensure only one row exists
  CONSTRAINT single_row CHECK (id = 1)
);

GRANT SELECT ON public.website_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.website_settings TO authenticated;
GRANT ALL ON public.website_settings TO service_role;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are readable by everyone" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON public.website_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert settings" ON public.website_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- 2. curriculum table
CREATE TABLE public.curriculum (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  week_number integer NOT NULL DEFAULT 1,
  order_index integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.curriculum TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.curriculum TO authenticated;
GRANT ALL ON public.curriculum TO service_role;
ALTER TABLE public.curriculum ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published curriculum readable by everyone" ON public.curriculum FOR SELECT USING (published = true);
CREATE POLICY "Admins can read all curriculum" ON public.curriculum FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert curriculum" ON public.curriculum FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update curriculum" ON public.curriculum FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete curriculum" ON public.curriculum FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));


-- 3. faqs table
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published faqs readable by everyone" ON public.faqs FOR SELECT USING (published = true);
CREATE POLICY "Admins can read all faqs" ON public.faqs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert faqs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update faqs" ON public.faqs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete faqs" ON public.faqs FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));


-- Setup triggers for updated_at
CREATE TRIGGER website_settings_set_updated_at BEFORE UPDATE ON public.website_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER curriculum_set_updated_at BEFORE UPDATE ON public.curriculum FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER faqs_set_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Add published column to projects (it was missing from previous schema, only had status text).
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT false;

-- Initial data for website_settings
INSERT INTO public.website_settings (
  id,
  hero_title, hero_subtitle, hero_badge, hero_image, hero_primary_button_text, hero_secondary_button_text, hero_trust_counter,
  course_batch_name, course_start_date, course_duration, course_registration_link, course_fee, course_offer_price,
  contact_email, contact_phone, contact_whatsapp,
  social_facebook, social_instagram, social_youtube, social_linkedin
) VALUES (
  1,
  'Learn Artificial Intelligence in Simple Malayalam',
  'Whether you are an employee, business owner, teacher, homemaker or beginner, this program helps you confidently use AI in your daily life and work.',
  '10 Live Sessions · Malayalam · Certificate',
  '',
  'Register Now',
  'View Curriculum',
  '5000+ Students are part of the program',
  'Batch 8',
  '8 August 2026',
  '10 sessions',
  'https://learn.edapt.me/web/checkout/6a1ff9235736ad4a98d25b84',
  '749',
  '+ GST',
  '1millionaisuperstars2026@gmail.com',
  '+91 81380 10166',
  '918138010166',
  'https://www.facebook.com/1Millon.AI.Superstars/',
  'https://www.instagram.com/1m_ai_superstars/',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;
