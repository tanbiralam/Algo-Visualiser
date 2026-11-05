/** The brand mark: a vermilion seal with a brushed circle. */
export function Mark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={`shrink-0 -rotate-3 ${className}`}>
      <rect width="32" height="32" rx="3" className="fill-shu" />
      <path
        d="M21.5 8.8C17 6.4 10.6 8 8.8 13.6c-1.7 5.4 2.4 10 7.6 9.6 5-.4 7.6-4.6 6.8-8.6-.5-2.4-1.9-3.8-3.6-4.4"
        fill="none"
        stroke="#FBF8F2"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
