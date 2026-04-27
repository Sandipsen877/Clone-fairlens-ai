export default function Logo({ gradId = 'g1' }) {
  return (
    <span className="logo-mark">
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke={`url(#${gradId})`} strokeWidth="1.5" />
        <path d="M6 16h20M16 6v20" stroke={`url(#${gradId})`} strokeWidth="1.5" />
        <circle cx="16" cy="16" r="4" fill={`url(#${gradId})`} />
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="#7df9ff" />
            <stop offset="1" stopColor="#a16bff" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}
