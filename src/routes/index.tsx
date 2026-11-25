import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Briefcase, CalendarCheck, ChevronDown, Compass, Gauge, Handshake, Loader2, Plus, RotateCcw, Users } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/pb/Logo";
import { useAppData, DATA_KEY } from "@/components/pb/hooks";
import { CandidateView } from "@/components/pb/Candidate";
import { MentorView } from "@/components/pb/Mentor";
import { PartnerView } from "@/components/pb/Partner";
import { RegisterDialog } from "@/components/pb/RegisterDialog";
import { readiness, resetDemo, SAMPLE_AMINA, SAMPLE_DAVID } from "@/lib/pb-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PeerBridge — Mentorship & Referral Readiness for Newcomer Talent" },
      { name: "description", content: "Pair displaced and newcomer professionals with Kenyan industry mentors through a 3-session roadmap that unlocks verified referrals." },
      { property: "og:title", content: "PeerBridge — Turn Global Talent into Local Hires" },
      { property: "og:description", content: "Structured mentorship and verified referrals for newcomer professionals in East Africa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Role = "candidate" | "mentor" | "partner";
const ROLES: { id: Role; label: string; icon: typeof Users }[] = [
  { id: "candidate", label: "Candidate / Mentee", icon: Users },
  { id: "mentor", label: "Industry Mentor", icon: Handshake },
  { id: "partner", label: "Hiring Partner", icon: Briefcase },
];

function Index() {
  const { data, isLoading, error } = useAppData();
  const qc = useQueryClient();
  const [role, setRole] = useState<Role>("candidate");
  const [candId, setCandId] = useState<string>(SAMPLE_AMINA);
  const [mentorId, setMentorId] = useState<string>("");
  const [reg, setReg] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (data && !mentorId) {
      const withMentee = data.mentorships.find((m) => m.candidate_id === candId);
      setMentorId(withMentee?.mentor_id ?? data.profiles.find((p) => p.role === "mentor")?.id ?? "");
    }
  }, [data, mentorId, candId]);

  const doReset = async () => {
    setResetting(true);
    try { await resetDemo(); await qc.invalidateQueries({ queryKey: DATA_KEY }); setCandId(SAMPLE_AMINA); setMentorId(""); setRole("candidate"); toast.success("Demo data restored"); }
    catch (e) { toast.error((e as Error).message); } finally { setResetting(false); }
  };

  const ms = data?.mentorships ?? [];
  const kpis = [
    { label: "Active Mentorship Matches", value: ms.length, icon: Users },
    { label: "Referral Readiness Rate", value: `${ms.length ? Math.round(ms.reduce((a, m) => a + readiness(m), 0) / ms.length) : 0}%`, icon: Gauge },
    { label: "Verified Partner Referrals Issued", value: data?.referrals.length ?? 0, icon: Handshake },
    { label: "Fast-Tracked Interviews (SDG 8 & 10)", value: data?.referrals.filter((r) => r.hiring_status === "Interview Scheduled").length ?? 0, icon: CalendarCheck },
  ];
  const candidate = data?.profiles.find((p) => p.id === candId && p.role === "candidate") ?? null;
  const goCandidate = (id: string) => { setCandId(id); setRole("candidate"); const mm = data?.mentorships.find((m) => m.candidate_id === id); if (mm) setMentorId(mm.mentor_id); };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Logo />
          <nav className="flex rounded-full bg-ice p-1" aria-label="Demo role switcher">
            {ROLES.map((r) => (
              <button key={r.id} onClick={() => setRole(r.id)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${role === r.id ? "bg-primary text-primary-foreground shadow-card" : "text-primary hover:bg-gold/30"}`}>
                <r.icon className={`h-4 w-4 ${role === r.id ? "text-gold" : ""}`} />{r.label}
              </button>
            ))}
          </nav>
          <Button variant="outline" size="sm" onClick={doReset} disabled={resetting}>{resetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />} Reset Demo Data</Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 pt-5 md:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border border-t-4 border-t-sapphire bg-card p-4 shadow-card">
            <div className="flex items-center justify-between"><span className="font-display text-3xl font-extrabold text-primary">{k.value}</span><span className="rounded-lg bg-gold p-2 text-navy"><k.icon className="h-4 w-4" /></span></div>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <section className="relative mx-auto mt-5 max-w-6xl overflow-hidden rounded-none bg-primary px-6 py-10 text-primary-foreground md:rounded-2xl">
        <svg className="pointer-events-none absolute -bottom-6 right-0 h-48 w-[520px] opacity-25" viewBox="0 0 520 200" aria-hidden="true">
          {[0, 1, 2].map((i) => <path key={i} d={`M${20 + i * 40} 200 Q260 ${10 + i * 40} ${500 - i * 40} 200`} fill="none" stroke="currentColor" strokeWidth="3" className="text-gold" />)}
        </svg>
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">SDG 8 · SDG 10 · SDG 17</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">Turn Global Talent into Local Hires Through Structured Mentorship.</h1>
        <p className="mt-3 max-w-xl opacity-90">Newcomer and displaced professionals in Kenya & East Africa pair with local mentors, finish a 3-session readiness roadmap, and earn verified referrals to hiring partners.</p>
        <div className="relative mt-6 flex flex-wrap gap-3">
          <Button onClick={() => goCandidate(SAMPLE_AMINA)} variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">Amina Hassan — Displaced Software Engineer</Button>
          <Button onClick={() => goCandidate(SAMPLE_DAVID)} variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">David Osei — Cross-Border Financial Analyst</Button>
          <Button onClick={() => setReg(true)} className="bg-gold font-bold text-navy hover:bg-gold/90"><Plus className="h-4 w-4" /> Register New Candidate</Button>
        </div>
      </section>

      <main className="mx-auto mt-6 max-w-6xl px-4">
        {isLoading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-sapphire" /></div>}
        {error && <p className="text-destructive">Couldn't load data: {(error as Error).message}</p>}
        {data && role === "candidate" && <CandidateView data={data} candidate={candidate} />}
        {data && role === "mentor" && <MentorView data={data} mentorId={mentorId} setMentorId={setMentorId} />}
        {data && role === "partner" && <PartnerView data={data} />}
      </main>

      <RegisterDialog open={reg} onOpenChange={setReg} onCreated={goCandidate} />
      <JudgeGuide />
    </div>
  );
}

function JudgeGuide() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs">
      {open && (
        <div className="mb-2 rounded-xl border-2 border-gold bg-card p-4 text-sm shadow-card">
          <ol className="list-decimal space-y-2 pl-4">
            <li><b>Candidate:</b> load Amina, request a mentor, complete all 3 sessions.</li>
            <li><b>Mentor:</b> switch role, then issue & endorse the referral.</li>
            <li><b>Hiring Partner:</b> switch role and Fast-Track to Interview.</li>
          </ol>
          <p className="mt-2 text-xs text-muted-foreground">Watch the KPI strip update live. Use Reset Demo Data between runs.</p>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} className="ml-auto flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-bold text-navy shadow-card">
        <Compass className="h-4 w-4" /> Judge Demo Guide <ChevronDown className={`h-4 w-4 transition ${open ? "" : "rotate-180"}`} />
      </button>
    </div>
  );
}
