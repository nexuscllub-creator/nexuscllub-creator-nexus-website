'use client';

export function CornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden
    >
      {/* outer L */}
      <path d="M2 30 V2 H30" />
      <path d="M6 26 V6 H26" opacity="0.7" />
      {/* diamond */}
      <path d="M6 6 l4 -4 l4 4 l-4 4 z" fill="currentColor" opacity="0.9" />
      {/* curling vine */}
      <path d="M30 2 C40 4, 44 10, 38 18 S 24 30, 28 38" />
      <path d="M2 30 C 4 40, 10 44, 18 38 S 30 24, 38 28" />
      {/* leaves */}
      <path d="M38 18 q 6 -2 8 -8" />
      <path d="M18 38 q -2 6 -8 8" />
      {/* small dots */}
      <circle cx="46" cy="10" r="1.2" fill="currentColor" />
      <circle cx="10" cy="46" r="1.2" fill="currentColor" />
      <circle cx="34" cy="34" r="1.4" fill="currentColor" />
      {/* flourish curl */}
      <path d="M28 38 q 4 4 10 4 q 4 0 6 -4" />
      <path d="M38 28 q 4 4 4 10 q 0 4 -4 6" />
    </svg>
  );
}

export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 16" className={className} fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <path d="M2 8 H80" />
      <path d="M120 8 H198" />
      <path d="M88 8 l6 -6 l6 6 l-6 6 z" fill="currentColor" />
      <path d="M100 8 l6 -6 l6 6 l-6 6 z" fill="currentColor" opacity="0.6" />
      <circle cx="84" cy="8" r="1.5" fill="currentColor" />
      <circle cx="116" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function OrnateBorder() {
  return (
    <>
      <CornerOrnament className="pointer-events-none absolute -top-1 -left-1 h-9 w-9 text-gold" />
      <CornerOrnament className="pointer-events-none absolute -top-1 -right-1 h-9 w-9 text-gold scale-x-[-1]" />
      <CornerOrnament className="pointer-events-none absolute -bottom-1 -left-1 h-9 w-9 text-gold scale-y-[-1]" />
      <CornerOrnament className="pointer-events-none absolute -bottom-1 -right-1 h-9 w-9 text-gold scale-x-[-1] scale-y-[-1]" />
    </>
  );
}
