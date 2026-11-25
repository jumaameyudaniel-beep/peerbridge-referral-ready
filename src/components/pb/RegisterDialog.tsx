import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { TRACKS } from "@/lib/pb-data";
import { DATA_KEY } from "./hooks";

export function RegisterDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: (id: string) => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [track, setTrack] = useState<string>(TRACKS[0]);
  const [origin, setOrigin] = useState("");
  const [skills, setSkills] = useState("");
  const submit = async () => {
    const list = skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);
    if (!name.trim() || !origin.trim() || list.length === 0) { toast.error("Fill in name, origin country and at least one skill"); return; }
    const { data, error } = await supabase.from("profiles").insert({ full_name: name.trim(), role: "candidate", track, origin_country: origin.trim(), skills: list, languages: ["English"], headline: `Newcomer ${track} Professional` }).select().single();
    if (error) { toast.error(error.message); return; }
    await qc.invalidateQueries({ queryKey: DATA_KEY });
    toast.success(`${data.full_name} registered — mentors matched`);
    onCreated(data.id); onOpenChange(false); setName(""); setOrigin(""); setSkills("");
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="text-primary">Register New Candidate</DialogTitle><DialogDescription>We'll match you with local mentors instantly.</DialogDescription></DialogHeader>
        <div className="space-y-3">
          <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mariam Tesfaye" /></div>
          <div><Label>Track</Label><Select value={track} onValueChange={setTrack}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TRACKS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Origin country</Label><Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Ethiopia" /></div>
          <div><Label>Top 3 skills (comma separated)</Label><Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Python, AWS" /></div>
        </div>
        <DialogFooter><Button onClick={submit}>Register & match</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
