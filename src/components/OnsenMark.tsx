/** The Onsen mark: rising steam over shared water — reused by the app bar and favicon. */
export function OnsenMark({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="15" fill="var(--color-primary)" />
      <path
        d="M8 20c1.5-2 2.5-4 2.5-6s-1-4-2.5-6M16 20c1.5-2 2.5-4 2.5-6s-1-4-2.5-6M24 20c1.5-2 2.5-4 2.5-6s-1-4-2.5-6"
        stroke="#eaf4f3"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
