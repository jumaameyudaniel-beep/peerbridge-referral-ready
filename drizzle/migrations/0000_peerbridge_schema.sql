CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'candidate',
  headline text,
  track text NOT NULL DEFAULT 'Software Engineering',
  origin_country text,
  target_location text DEFAULT 'Nairobi, Kenya',
  company text,
  years_experience int DEFAULT 0,
  languages text[] DEFAULT '{}',
  skills text[] DEFAULT '{}',
  bio text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon, authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo open access" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.mentorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  match_score int NOT NULL DEFAULT 80,
  status text NOT NULL DEFAULT 'active',
  session_1_completed boolean NOT NULL DEFAULT false,
  session_1_notes text,
  session_2_completed boolean NOT NULL DEFAULT false,
  session_2_notes text,
  session_3_completed boolean NOT NULL DEFAULT false,
  session_3_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentorships TO anon, authenticated;
GRANT ALL ON public.mentorships TO service_role;
ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo open access" ON public.mentorships FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.endorsements_and_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentorship_id uuid NOT NULL REFERENCES public.mentorships(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  strength_tags text[] DEFAULT '{}',
  endorsement_quote text,
  hiring_status text NOT NULL DEFAULT 'Referred',
  partner_company text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.endorsements_and_referrals TO anon, authenticated;
GRANT ALL ON public.endorsements_and_referrals TO service_role;
ALTER TABLE public.endorsements_and_referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "demo open access" ON public.endorsements_and_referrals FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);