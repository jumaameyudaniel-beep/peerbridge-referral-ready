import { useState, type ReactNode } from "react";
import { Check, Copy, Languages, Lock, MapPin, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { matchScore, readiness, verifyCode, type AppData, type Profile } from "@/lib/pb-data";
import { useRun } from "./hooks";
import type { TablesUpdate } from "@/integrations/supabase/types";
import { Card, GoldPill, ReadyBar } from "./ui";
import { LogoMark } from "./Logo";

const CV: Record<string, { before: string[]; after: string[] }> = {
  "Software Engineering": { before: ["Chief Programmer, Ministry IT Dept.", "References available on request", "Phone: +249 …"], after: ["Senior Software Engineer (Full-Stack)", "Kenyan referee: PeerBridge mentor", "Phone: +254 7xx · Nairobi, Kenya", "M-Pesa / Daraja API familiarity"] },
  "Finance & Accounting": { before: ["Chartered Accountant (ICAG)", "Bank Officer Grade II", "Salary expectations in GHS"], after: ["CPA (pursuing ICPAK equivalency)", "Financial Analyst – Corporate Banking", "Expectations in KES, KRA PIN applied", "IFRS 9 & CBK prudential guidelines"] },
  "Healthcare & Public Health": { before: ["District Health Supervisor", "Ministry of Health (home country)", "Certificates in French"], after: ["County Public Health Officer equivalent", "KMPDC / KNQA verification in progress", "Certified English translations", "DHIS2 Kenya reporting experience"] },
};

const QUIZ = [
  { q: "Your team lead asks for a quick fix that skips a compliance step before a Friday release. You…", opts: ["Ship it quietly to meet the deadline", "Flag the risk politely and propose a safe alternative timeline", "Refuse and escalate straight to HR"], a: 1, why: "East African employers value respectful, solution-oriented candour over silent compliance." },
  { q: "In your first week, a colleague invites you to a team 'harambee' fundraiser. You…", opts: ["Decline — it's not work-related", "Join and contribute what you comfortably can", "Ask your manager if it's mandatory"], a: 1, why: "Harambee builds trust; showing up matters more than the amount." },
];

export function CandidateView({ data, candidate }: { data: AppData; candidate: Profile | null }) {
  const run = useRun();
  if (!candidate) return <Card className="text-center text-muted-foreground">Load a sample candidate or register a new one above to begin.</Card>;
  const mentors = data.profiles.filter((p) => p.role === "mentor");
  const top = mentors.map((m) => ({ m, s: matchScore(candidate, m) })).sort((a, b) => b.s - a.s).slice(0, 3);
  const mship = data.mentorships.find((x) => x.candidate_id === candidate.id) ?? null;
  const mentor = mship ? mentors.find((m) => m.id === mship.mentor_id) : null;
  const pct = readiness(mship);

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sapphire">Candidate workspace</p>
          <h2 className="text-2xl font-bold text-primary">{candidate.full_name}</h2>
          <p className="text-sm text-muted-foreground">{candidate.headline} · from {candidate.origin_country} → {candidate.target_location}</p>
          <div className="mt-2 flex flex-wrap gap-1">{candidate.skills?.map((s) => <span key={s} className="rounded-md bg-ice px-2 py-0.5 text-xs font-medium text-primary">{s}</span>)}</div>
        </div>
        <div className="w-full max-w-xs"><ReadyBar value={pct} /></div>
      </Card>

      {!mship && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-primary"><Sparkles className="h-5 w-5 text-gold-deep" /> Smart Mentor Pairing</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {top.map(({ m, s }) => (
              <Card key={m.id} className="flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display font-bold text-primary-foreground">{m.full_name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
                  <GoldPill>{s}% Match</GoldPill>
                </div>
                <h4 className="mt-3 font-bold">{m.full_name}</h4>
                <p className="text-sm text-sapphire">{m.headline} · {m.company}</p>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{m.bio}</p>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {m.target_location} · {m.years_experience} yrs local experience</p>
                  <p className="flex items-center gap-1"><Languages className="h-3 w-3" /> {m.languages?.join(", ")}</p>
                </div>
                <Button className="mt-4" onClick={() => run(() => supabase.from("mentorships").insert({ candidate_id: candidate.id, mentor_id: m.id, match_score: s }), `Mentorship requested with ${m.full_name}`)}>Request Mentorship</Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {mship && mentor && <Roadmap key={mship.id} candidate={candidate} mentor={mentor} mship={mship} pct={pct} referred={data.referrals.some((r) => r.mentorship_id === mship.id)} />}
    </div>
  );
}

function Roadmap({ candidate, mentor, mship, pct, referred }: { candidate: Profile; mentor: Profile; mship: AppData["mentorships"][number]; pct: number; referred: boolean }) {
  const run = useRun();
  const [after, setAfter] = useState(true);
  const [n1, setN1] = useState(mship.session_1_notes ?? "");
  const [answers, setAnswers] = useState<(number | null)[]>([null, null]);
  const [checks, setChecks] = useState([mship.session_3_completed, mship.session_3_completed, mship.session_3_completed]);
  const cv = CV[candidate.track] ?? CV["Software Engineering"]!;
  const quizOk = answers.every((a, i) => a === QUIZ[i]!.a);
  const upd = (patch: TablesUpdate<"mentorships">, msg: string) => run(() => supabase.from("mentorships").update(patch).eq("id", mship.id), msg);
  const code = verifyCode(mship.id);

  const step = (n: number, title: string, done: boolean, locked: boolean, body: ReactNode) => (
    <Card className={locked ? "opacity-60" : ""}>
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full font-bold ${done ? "bg-success text-primary-foreground" : "bg-primary text-primary-foreground"}`}>{done ? <Check className="h-5 w-5" /> : locked ? <Lock className="h-4 w-4" /> : n}</div>
        <div><p className="text-xs font-semibold uppercase text-sapphire">Session {n}</p><h4 className="font-bold">{title}</h4></div>
        {done && <span className="ml-auto text-xs font-semibold text-success">Completed</span>}
      </div>
      {!locked && body}
    </Card>
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-primary">3-Session Referral Readiness Roadmap</h3>
        <span className="text-sm text-muted-foreground">Mentor: <b className="text-foreground">{mentor.full_name}</b> ({mentor.company}) · <GoldPill>{mship.match_score}% Match</GoldPill></span>
      </div>
      <ReadyBar value={pct} />

      {step(1, "Local Market & CV Localization", mship.session_1_completed, false, (
        <div className="space-y-3">
          <div className="inline-flex rounded-full bg-ice p-1 text-sm">
            {["Before", "After (Local)"].map((l, i) => (
              <button key={l} onClick={() => setAfter(i === 1)} className={`rounded-full px-4 py-1 font-semibold ${after === (i === 1) ? "bg-primary text-primary-foreground" : "text-primary"}`}>{l}</button>
            ))}
          </div>
          <ul className={`space-y-1 rounded-lg border p-4 text-sm ${after ? "border-gold bg-gold/10" : "border-border bg-muted"}`}>
            {(after ? cv.after : cv.before).map((l) => <li key={l} className="flex gap-2">{after ? <Check className="h-4 w-4 text-gold-deep" /> : <span className="w-4 text-muted-foreground">–</span>}{l}</li>)}
          </ul>
          <Textarea placeholder="Save your mentor's tips…" value={n1} onChange={(e) => setN1(e.target.value)} />
          <Button disabled={mship.session_1_completed} onClick={() => upd({ session_1_completed: true, session_1_notes: n1 || "CV localized to Kenyan standards." }, "Session 1 complete — 33% ready")}>{mship.session_1_completed ? "Completed" : "Save notes & complete Session 1"}</Button>
        </div>
      ))}

      {step(2, "Mock Interview & Workplace Simulation", mship.session_2_completed, !mship.session_1_completed, (
        <div className="space-y-4">
          {QUIZ.map((q, qi) => (
            <div key={qi}>
              <p className="mb-2 text-sm font-semibold">{qi + 1}. {q.q}</p>
              <div className="grid gap-2">
                {q.opts.map((o, oi) => {
                  const picked = answers[qi] === oi;
                  const tone = picked ? (oi === q.a ? "border-success bg-success/10" : "border-destructive bg-destructive/10") : "border-border hover:border-sapphire";
                  return <button key={oi} disabled={mship.session_2_completed} onClick={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))} className={`rounded-lg border px-3 py-2 text-left text-sm ${tone}`}>{o}</button>;
                })}
              </div>
              {answers[qi] != null && <p className={`mt-1 text-xs ${answers[qi] === q.a ? "text-success" : "text-destructive"}`}>{answers[qi] === q.a ? "Correct! " : "Not quite. "}{q.why}</p>}
            </div>
          ))}
          <Button disabled={mship.session_2_completed || !quizOk} onClick={() => upd({ session_2_completed: true, session_2_notes: "Passed workplace simulation quiz 2/2." }, "Session 2 complete — 67% ready")}>{mship.session_2_completed ? "Completed" : quizOk ? "Complete Session 2" : "Answer both correctly to continue"}</Button>
        </div>
      ))}

      {step(3, "Portfolio Audit & Referral Sign-Off", mship.session_3_completed, !mship.session_2_completed, (
        <div className="space-y-3">
          {["LinkedIn / GitHub profile verified", "Local regulatory brief reviewed", "Availability confirmed"].map((l, i) => (
            <label key={l} className="flex items-center gap-2 text-sm"><Checkbox checked={!!checks[i]} disabled={mship.session_3_completed} onCheckedChange={(v) => setChecks((c) => c.map((x, j) => (j === i ? !!v : x)))} />{l}</label>
          ))}
          <Button variant="secondary" className="bg-gold text-navy hover:bg-gold/90" disabled={mship.session_3_completed || !checks.every(Boolean)} onClick={async () => {
            if (await upd({ session_3_completed: true, session_3_notes: "Portfolio audited; ready for referral." }, "Endorsement requested — 100% referral ready!")) confetti({ particleCount: 140, spread: 80, colors: ["#FACC15", "#2563EB", "#1E3A8A"] });
          }}>{mship.session_3_completed ? "Endorsement requested" : "Request Mentor Endorsement"}</Button>
        </div>
      ))}

      {pct === 100 && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-gold bg-primary p-6 text-primary-foreground shadow-card">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20" />
          <div className="flex items-center gap-3"><LogoMark className="h-12 w-12" /><div><p className="text-xs uppercase tracking-widest text-gold">Verified PeerBridge Referral Card</p><h4 className="text-xl font-bold">{candidate.full_name}</h4></div></div>
          <p className="mt-3 text-sm opacity-90">Completed the 3-Session Readiness Roadmap with {mentor.full_name} ({mentor.company}). {referred ? "Endorsement dispatched to hiring partners." : "Awaiting mentor endorsement."}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-gold px-3 py-1 font-mono font-bold text-navy">{code}</span>
            <Button size="sm" variant="outline" className="border-gold bg-transparent text-primary-foreground hover:bg-gold hover:text-navy" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/?verify=${code}`); import("sonner").then(({ toast }) => toast.success("Referral link copied")); }}><Copy className="h-4 w-4" /> Copy Referral Link</Button>
          </div>
        </div>
      )}
    </section>
  );
}
