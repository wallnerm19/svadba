/** Jemný ozdobný oddeľovač – tenké zlaté linky s lístkom uprostred. */
export function Ornament({ className = '', light = false }: { className?: string; light?: boolean }) {
  const color = light ? 'text-champagne/80' : 'text-gold';
  return (
    <div className={`flex items-center justify-center gap-4 ${color} ${className}`} aria-hidden="true">
      <span className="h-px w-12 bg-current opacity-60 sm:w-20" />
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M14 1c3 3 3 9 0 12-3-3-3-9 0-12Z" />
        <path d="M14 7c4-4 9-4 13 0-4 4-9 4-13 0ZM14 7C10 3 5 3 1 7c4 4 9 4 13 0Z" opacity="0.7" />
      </svg>
      <span className="h-px w-12 bg-current opacity-60 sm:w-20" />
    </div>
  );
}
