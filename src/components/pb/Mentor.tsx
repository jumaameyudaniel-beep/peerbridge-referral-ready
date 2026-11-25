import { useState } from "react";
import { Award, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { readiness, type AppData, type Mentorship, type Profile } from "@/lib/pb-data";
import { useRun } from "./hooks";
import { Card, GoldPill, ReadyBar } from "./ui";

const TAGS = ["Strong Technical Mastery", "Local Compliance Ready", "High Team Adaptability", "Excellent Communicator", "Leadership Potential"];
const PARTNERS = ["Safaricom", "Equity Group", "Andela", "KCB Group", "AMREF Health Africa", "Twiga Foods"];

export function MentorView({ data, mentorId, setMentorId }: { data: AppData; mentorId: string; setMentorId: (id: string) => void }) {
  const mentors = data.profiles.filter((p) => p.role === "mentor");
  const mentor = mentors.find((m) => m.id === mentorId) ?? mentors[0];
  const [target, setTarget] = useState<{ ms: Mentorship; cand: Profile } | null>(null);
  if (!mentor) return null;
  const mine = data.mentorships.filter((x) => x.mentor_id === mentor.id);

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sapphire">Industry mentor dashboard</p>
          <h2 className="text-2xl font-bold text-primary">{mentor.full_name}</h2>
          <p className="text-sm text-muted-foreground">{mentor.headline} · {mentor.company} · {mentor.years_experience} yrs</p>
        </div>
        <Select value={mentor.id} onValueChange={setMentorId}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>{mentors.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name} — {m.company} ({data.mentorships.filter((x) => x.mentor_id === m.id).length})</SelectItem>)}</SelectContent>
        </Select>
      </Card>
      {mine.length === 0 && <Card className="text-center text-muted-foreground">No active mentees yet. Request mentorship from the Candidate view to see them here.</Card>}
      <div className="grid gap-4 md:grid-cols-2">
        {mine.map((ms) => {
          const cand = data.profiles.find((p) => p.id === ms.candidate_id);
          if (!cand) return null;
          const pct = readiness(ms);
          const ref = data.referrals.find((r) => r.mentorship_id === ms.id);
          const notes = [ms.session_1_notes, ms.session_2_notes, ms.session_3_notes].filter(Boolean);
          return (
            <Card key={ms.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div><h4 className="font-bold">{cand.full_name}</h4><p className="text-sm text-muted-foreground">{cand.headline} · {cand.origin_country}</p></div>
                <GoldPill>{ms.match_score}% Match</GoldPill>
              </div>
              <ReadyBar value={pct} />
              {notes.length > 0 && <ul className="space-y-1 rounded-lg bg-ice p-3 text-xs">{notes.map((n, i) => <li key={i}><b className="text-primary">S{i + 1}:</b> {n}</li>)}</ul>}
              {ref ? (
                <p className="flex items-center gap-1 text-sm font-semibold text-success"><Award className="h-4 w-4" /> Referred to {ref.partner_company} · {ref.hiring_status}</p>
              ) : (
                <Button disabled={pct < 100} onClick={() => setTarget({ ms, cand })} className="w-full bg-gold text-navy hover:bg-gold/90">
                  {pct < 100 ? `Unlocks at 100% (now ${pct}%)` : "Issue Official Referral & Endorse to Hiring Partners"}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
      {target && <EndorseDialog mentor={mentor} {...target} onClose={() => setTarget(null)} />}
    </div>
  );
}

function EndorseDialog({ mentor, ms, cand, onClose }: { mentor: Profile; ms: Mentorship; cand: Profile; onClose: () => void }) {
  const run = useRun();
  const [tags, setTags] = useState<string[]>(["Strong Technical Mastery"]);
  const [quote, setQuote] = useState(`${cand.full_name.split(" ")[0]} combines international depth with a clear grasp of how teams work here. I recommend them with confidence.`);
  const [partner, setPartner] = useState(mentor.company && PARTNERS.includes(mentor.company) ? mentor.company : "Safaricom");
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle className="text-primary">Endorse {cand.full_name}</DialogTitle><DialogDescription>Your referral goes straight to the hiring partner portal.</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">{TAGS.map((t) => {
            const on = tags.includes(t);
            return <button key={t} onClick={() => setTags((x) => (on ? x.filter((y) => y !== t) : [...x, t]))} className={`rounded-full border px-3 py-1 text-xs font-semibold ${on ? "border-gold bg-gold text-navy" : "border-border text-primary"}`}>{t}</button>;
          })}</div>
          <Textarea rows={4} value={quote} onChange={(e) => setQuote(e.target.value)} />
          <Select value={partner} onValueChange={setPartner}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PARTNERS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
        </div>
        <DialogFooter>
          <Button disabled={!quote.trim() || tags.length === 0} onClick={async () => {
            if (await run(() => supabase.from("endorsements_and_referrals").insert({ mentorship_id: ms.id, candidate_id: cand.id, mentor_id: mentor.id, strength_tags: tags, endorsement_quote: quote, partner_company: partner }), `Referral dispatched to ${partner}`)) onClose();
          }}><Send className="h-4 w-4" /> Dispatch referral</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
