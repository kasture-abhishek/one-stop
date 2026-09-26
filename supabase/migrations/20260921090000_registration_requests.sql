CREATE TYPE public.registration_request_type AS ENUM ('kitchen', 'vehicle', 'pg');
CREATE TYPE public.registration_request_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'needs_changes');

CREATE TABLE public.registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  request_type public.registration_request_type NOT NULL,
  status public.registration_request_status NOT NULL DEFAULT 'pending',
  submitted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  document_urls TEXT[] NOT NULL DEFAULT '{}',
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.registration_requests TO authenticated;
GRANT UPDATE ON public.registration_requests TO authenticated;
CREATE TRIGGER trg_registration_requests_updated BEFORE UPDATE ON public.registration_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "registration_requests_read_own_or_admin" ON public.registration_requests FOR SELECT TO authenticated USING (requester_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "registration_requests_insert_own" ON public.registration_requests FOR INSERT TO authenticated WITH CHECK (requester_id = auth.uid());
CREATE POLICY "registration_requests_admin_update" ON public.registration_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));