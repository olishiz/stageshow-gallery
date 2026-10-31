export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" fill="#0a0a0a" />
      <rect x="6" y="6" width="11" height="20" rx="3" fill="#fafafa" />
      <rect x="19" y="6" width="7" height="9" rx="2.5" fill="#38bdf8" />
      <rect x="19" y="17" width="7" height="9" rx="2.5" fill="#52525b" />
    </svg>
  );
}
