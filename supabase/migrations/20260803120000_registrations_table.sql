-- Migration to add Registrations table

CREATE TABLE IF NOT EXISTS public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  city text,
  status text NOT NULL DEFAULT 'pending',
  payment_id text,
  amount numeric(10,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all registrations" ON public.registrations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update registrations" ON public.registrations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete registrations" ON public.registrations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- Allow anyone to insert (e.g. from a public form)
CREATE POLICY "Anyone can insert registrations" ON public.registrations FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated users can insert registrations" ON public.registrations FOR INSERT TO authenticated WITH CHECK (true);

-- Setup trigger for updated_at
DROP TRIGGER IF EXISTS registrations_set_updated_at ON public.registrations;
CREATE TRIGGER registrations_set_updated_at BEFORE UPDATE ON public.registrations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
