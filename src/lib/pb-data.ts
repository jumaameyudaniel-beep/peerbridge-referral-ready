import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type Mentorship = Tables<"mentorships">;
export type Referral = Tables<"endorsements_and_referrals">;

export const TRACKS = ["Software Engineering", "Finance & Accounting", "Healthcare & Public Health"] as const;

const c = (n: number) => `11111111-0000-4000-8000-00000000000${n}`;
const m = (n: number) => `22222222-0000-4000-8000-00000000000${n}`;
const ms = (n: number) => `33333333-0000-4000-8000-00000000000${n}`;

export const SAMPLE_AMINA = c(1);
export const SAMPLE_DAVID = c(2);

const SEED_PROFILES = [
  { id: c(1), full_name: "Amina Hassan", role: "candidate", headline: "Displaced Software Engineer", track: "Software Engineering", origin_country: "Sudan", years_experience: 6, languages: ["Arabic", "English"], skills: ["React", "Node.js", "PostgreSQL"], bio: "Full-stack engineer who led a fintech team in Khartoum before relocating to Nairobi." },
  { id: c(2), full_name: "David Osei", role: "candidate", headline: "Cross-Border Financial Analyst", track: "Finance & Accounting", origin_country: "Ghana", years_experience: 5, languages: ["English", "Twi"], skills: ["IFRS", "Financial Modelling", "Excel"], bio: "Chartered analyst with West African banking experience." },
  { id: c(3), full_name: "Grace Nyiramana", role: "candidate", headline: "Public Health Officer", track: "Healthcare & Public Health", origin_country: "Rwanda", target_location: "Kampala, Uganda", years_experience: 4, languages: ["Kinyarwanda", "French", "English"], skills: ["Epidemiology", "DHIS2", "Community Outreach"], bio: "Led immunisation campaigns across rural Rwanda." },
  { id: c(4), full_name: "Yusuf Abdi", role: "candidate", headline: "Backend Developer", track: "Software Engineering", origin_country: "Somalia", years_experience: 3, languages: ["Somali", "English"], skills: ["Python", "Django", "AWS"], bio: "Self-taught backend developer with remote freelance experience." },
  { id: m(1), full_name: "Wanjiru Kamau", role: "mentor", headline: "Senior Engineering Manager", track: "Software Engineering", origin_country: "Kenya", company: "Safaricom", years_experience: 12, languages: ["English", "Swahili", "Arabic"], skills: ["React", "Node.js", "M-Pesa APIs", "Leadership"], bio: "Builds M-Pesa platform teams; has mentored 40+ engineers into Nairobi tech roles." },
  { id: m(2), full_name: "Brian Otieno", role: "mentor", headline: "Staff Software Engineer", track: "Software Engineering", origin_country: "Kenya", company: "Andela", years_experience: 9, languages: ["English", "Swahili", "Luo"], skills: ["PostgreSQL", "Python", "System Design"], bio: "Hiring panel lead at Andela, passionate about inclusive technical interviews." },
  { id: m(3), full_name: "Fatuma Ali", role: "mentor", headline: "Tech Lead", track: "Software Engineering", origin_country: "Kenya", target_location: "Mombasa, Kenya", company: "Twiga Foods", years_experience: 7, languages: ["English", "Swahili", "Somali"], skills: ["AWS", "Django", "React"], bio: "Leads logistics engineering at Twiga; mentors newcomers from the Horn of Africa." },
  { id: m(4), full_name: "Peter Mwangi", role: "mentor", headline: "Head of Financial Planning", track: "Finance & Accounting", origin_country: "Kenya", company: "Equity Group", years_experience: 14, languages: ["English", "Swahili"], skills: ["IFRS", "Financial Modelling", "KRA Compliance"], bio: "Oversees FP&A at Equity Bank and sits on the ICPAK mentorship committee." },
  { id: m(5), full_name: "Achieng Odhiambo", role: "mentor", headline: "Audit Senior Manager", track: "Finance & Accounting", origin_country: "Kenya", company: "KPMG East Africa", years_experience: 10, languages: ["English", "Swahili", "Twi"], skills: ["IFRS", "Audit", "Excel"], bio: "Guides cross-border accountants through ICPAK equivalency." },
  { id: m(6), full_name: "Dr. Samuel Kiprono", role: "mentor", headline: "Programme Director", track: "Healthcare & Public Health", origin_country: "Kenya", company: "AMREF Health Africa", years_experience: 15, languages: ["English", "Swahili", "French"], skills: ["Epidemiology", "DHIS2", "Program Management"], bio: "Runs regional disease surveillance programmes across East Africa." },
  { id: m(7), full_name: "Sarah Nakato", role: "mentor", headline: "Public Health Advisor", track: "Healthcare & Public Health", origin_country: "Uganda", target_location: "Kampala, Uganda", company: "Makerere University Hospital", years_experience: 11, languages: ["English", "Luganda", "Kinyarwanda"], skills: ["Community Outreach", "Epidemiology", "Policy"], bio: "Bridges NGO and government public-health hiring in Uganda." },
];

const SEED_MENTORSHIPS = [
  { id: ms(1), candidate_id: c(3), mentor_id: m(6), match_score: 94, session_1_completed: true, session_1_notes: "Reframe district role as County Health Officer equivalent.", session_2_completed: true, session_2_notes: "Strong situational judgement.", session_3_completed: true, session_3_notes: "Ready for AMREF referral." },
  { id: ms(2), candidate_id: c(4), mentor_id: m(2), match_score: 88, session_1_completed: true, session_1_notes: "Add Kenyan phone and Nairobi location to CV." },
];

const SEED_REFERRALS = [
  { mentorship_id: ms(1), candidate_id: c(3), mentor_id: m(6), strength_tags: ["Local Compliance Ready", "High Team Adaptability"], endorsement_quote: "Grace understands community health systems better than most local hires. I vouch for her without hesitation.", partner_company: "AMREF Health Africa" },
];

async function insertSeed() {
  // Bulk inserts null out keys missing from some rows, so every row carries the full shape.
  const p = await supabase.from("profiles").insert(SEED_PROFILES.map((x) => ({ target_location: "Nairobi, Kenya", company: null, ...x })));
  if (p.error) throw p.error;
  const mm = await supabase.from("mentorships").insert(SEED_MENTORSHIPS.map((x) => ({ session_2_completed: false, session_2_notes: null, session_3_completed: false, session_3_notes: null, ...x })));
  if (mm.error) throw mm.error;
  const r = await supabase.from("endorsements_and_referrals").insert(SEED_REFERRALS);
  if (r.error) throw r.error;
}

export async function seedIfEmpty() {
  const { count, error } = await supabase.from("profiles").select("id", { count: "exact", head: true });
  if (error) throw error;
  if (!count) await insertSeed();
}

const NIL = "00000000-0000-0000-0000-000000000000";
export async function resetDemo() {
  for (const t of ["endorsements_and_referrals", "mentorships", "profiles"] as const) {
    const { error } = await supabase.from(t).delete().neq("id", NIL);
    if (error) throw error;
  }
  await insertSeed();
}

export type AppData = { profiles: Profile[]; mentorships: Mentorship[]; referrals: Referral[] };

export async function fetchAll(): Promise<AppData> {
  await seedIfEmpty();
  const [p, mm, r] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at"),
    supabase.from("mentorships").select("*").order("created_at"),
    supabase.from("endorsements_and_referrals").select("*").order("created_at", { ascending: false }),
  ]);
  if (p.error || mm.error || r.error) throw p.error ?? mm.error ?? r.error;
  return { profiles: p.data, mentorships: mm.data, referrals: r.data };
}

export function sessionsDone(x: Mentorship) {
  return [x.session_1_completed, x.session_2_completed, x.session_3_completed].filter(Boolean).length;
}
export function readiness(x?: Mentorship | null) {
  if (!x) return 0;
  return [0, 33, 67, 100][sessionsDone(x)]!;
}

/** Match score: same track is the base; shared skills and languages add points. Capped at 98. */
export function matchScore(cand: Pick<Profile, "track" | "skills" | "languages">, mentor: Profile) {
  const skills = new Set((cand.skills ?? []).map((s) => s.toLowerCase()));
  const langs = new Set(cand.languages ?? []);
  const sharedSkills = (mentor.skills ?? []).filter((s) => skills.has(s.toLowerCase())).length;
  const sharedLangs = (mentor.languages ?? []).filter((l) => langs.has(l)).length;
  let s = (cand.track === mentor.track ? 70 : 35) + sharedSkills * 8 + Math.max(0, sharedLangs - 1) * 4 + Math.min(mentor.years_experience ?? 0, 15) * 0.4;
  return Math.min(98, Math.round(s));
}

export function verifyCode(id: string) {
  const n = parseInt(id.replace(/-/g, "").slice(-6), 16) % 1000;
  return `PB-NBO-2026-${String(n).padStart(3, "0")}`;
}
