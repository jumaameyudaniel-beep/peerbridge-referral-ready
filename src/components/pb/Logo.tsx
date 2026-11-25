export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M8 34 Q24 6 40 34" fill="none" stroke="#FACC15" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M8 34 H40" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
      {[16, 24, 32].map((x) => (
        <line key={x} x1={x} y1={34} x2={x} y2={x === 24 ? 20 : 24} stroke="#FACC15" strokeWidth="2" />
      ))}
      <circle cx="8" cy="34" r="6" fill="#2563EB" />
      <circle cx="40" cy="34" r="6" fill="#2563EB" />
      <circle cx="8" cy="32" r="2" fill="#FFFFFF" />
      <circle cx="40" cy="32" r="2" fill="#FFFFFF" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark />
      <span className="font-display text-xl font-extrabold tracking-tight">
        <span className={light ? "text-primary-foreground" : "text-primary"}>Peer</span>
        <span className="text-gold-deep">Bridge</span>
      </span>
    </span>
  );
}
