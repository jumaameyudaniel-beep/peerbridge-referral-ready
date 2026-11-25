import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-xl border border-border bg-card p-5 shadow-card", className)}>{children}</div>;
}
export function GoldPill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-0.5 text-xs font-bold text-navy", className)}>{children}</span>;
}
export function ReadyBar({ value, label = true }: { value: number; label?: boolean }) {
  return (
    <div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-ice">
        <div className="h-full rounded-full bg-ready transition-all duration-700" style={{ width: `${value}%` }} />
      </div>
      {label && <div className="mt-1 text-right text-xs font-semibold text-muted-foreground">{value}% referral ready</div>}
    </div>
  );
}
