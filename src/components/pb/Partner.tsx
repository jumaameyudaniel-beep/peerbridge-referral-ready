import { useState } from "react";
import { CalendarCheck, CheckCircle2, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TRACKS, matchScore, verifyCode, type AppData } from "@/lib/pb-data";
import { useRun } from "./hooks";
import { Card, GoldPill } from "./ui";

export function PartnerView({ data }: { data: AppData }) {
  const run = useRun();
  const [track, setTrack] = useState<string>("All");
  const rows = data.referrals.map((r) => ({ r, cand: data.profiles.find((p) => p.id === r.candidate_id), mentor: data.profiles.find((p) => p.id === r.mentor_id) }))
    .filter((x) => x.cand && x.mentor && (track === "All" || x.cand.track === track));
  return (
    <div className="space-y-6">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wider text-sapphire">Hiring partner portal · SDG 17</p>
        <h2 className="text-2xl font-bold text-primary">Referral-Backed Candidates</h2>
        <p className="text-sm text-muted-foreground">Every candidate below finished a structured roadmap with a vetted local mentor.</p>
        <div className="mt-4 flex flex-wrap gap-2">{["All", ...TRACKS].map((t) => (
          <button key={t} onClick={() => setTrack(t)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${track === t ? "bg-primary text-primary-foreground" : "bg-ice text-primary hover:bg-gold/30"}`}>{t}</button>
        ))}</div>
      </Card>
      {rows.length === 0 && <Card className="text-center text-muted-foreground">No referrals in this track yet.</Card>}
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map(({ r, cand, mentor }) => {
          const score = matchScore(cand!, mentor!);
          const tech = Math.min(98, score + 2), local = r.strength_tags?.includes("Local Compliance Ready") ? 95 : 82, team = r.strength_tags?.includes("High Team Adaptability") ? 93 : 80;
          const done = r.hiring_status === "Interview Scheduled";
          return (
            <Card key={r.id} className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div><h4 className="font-bold">{cand!.full_name}</h4><p className="text-sm text-muted-foreground">{cand!.headline} · {cand!.track}</p></div>
                <GoldPill><CheckCircle2 className="h-3 w-3" /> 3/3 Roadmap</GoldPill>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase text-sapphire">Skills match breakdown</p>
                {[["Technical", tech], ["Local readiness", local], ["Team fit", team]].map(([l, v]) => (
                  <div key={l as string} className="flex items-center gap-2 text-xs"><span className="w-28 text-muted-foreground">{l}</span><div className="h-2 flex-1 rounded-full bg-ice"><div className="h-full rounded-full bg-ready" style={{ width: `${v}%` }} /></div><span className="w-8 font-semibold">{v}%</span></div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">{r.strength_tags?.map((t) => <span key={t} className="rounded-md bg-ice px-2 py-0.5 text-xs font-medium text-primary">{t}</span>)}</div>
              <blockquote className="rounded-lg border-l-4 border-gold bg-gold/10 p-3 text-sm italic"><Quote className="mb-1 h-4 w-4 text-gold-deep" />{r.endorsement_quote}<footer className="mt-1 text-xs not-italic text-muted-foreground">— {mentor!.full_name}, {mentor!.company}</footer></blockquote>
              <div className="flex items-center justify-between text-xs text-muted-foreground"><span>For {r.partner_company}</span><span className="font-mono">{verifyCode(r.mentorship_id)}</span></div>
              {done ? (
                <p className="flex items-center gap-1 font-semibold text-success"><CalendarCheck className="h-4 w-4" /> Interview Scheduled</p>
              ) : (
                <Button className="w-full" onClick={() => run(() => supabase.from("endorsements_and_referrals").update({ hiring_status: "Interview Scheduled" }).eq("id", r.id), `Interview scheduled with ${cand!.full_name}`)}>Fast-Track to Interview</Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
