export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-navy">
      <svg width={compact ? 34 : 40} height={compact ? 34 : 40} viewBox="0 0 40 40" aria-hidden>
        <rect width="40" height="40" rx="4" fill="#0a3558" />
        <path
          d="M18.2 8h3.6v8.2H30v3.6h-8.2V28h-3.6v-8.2H10v-3.6h8.2V8z"
          fill="#ffffff"
        />
        <circle cx="20" cy="20" r="11.5" fill="none" stroke="#1aa394" strokeWidth="1.4" />
      </svg>
      <span className="leading-tight">
        <span className="block font-serif text-[1.15rem] font-semibold tracking-tight">Neha</span>
        <span className="-mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-teal">
          Hospitals
        </span>
      </span>
    </span>
  );
}
