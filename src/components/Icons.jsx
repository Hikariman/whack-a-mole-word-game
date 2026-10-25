export function SpeakerIcon({ size = 24, muted = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
      {muted ? (
        <path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      ) : (
        <>
          <path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  );
}

export function MusicIcon({ size = 24, muted = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 17V5l11-2v12" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
      <circle cx="6.5" cy="17.5" r="3" fill="currentColor" />
      <circle cx="17.5" cy="15.5" r="3" fill="currentColor" />
      {muted && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />}
    </svg>
  );
}

export function CheckIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="22" fill="#2fb34a" stroke="#fff" strokeWidth="3" />
      <path d="M13 25l7 7 15-16" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function CrossIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="22" fill="#e5484d" stroke="#fff" strokeWidth="3" />
      <path d="M16 16l16 16M32 16L16 32" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function StarIcon({ size = 28, filled = true }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17.1l-5.9 3.2 1.3-6.5-4.9-4.5 6.6-.8z"
        fill={filled ? '#ffc93c' : 'rgba(255,255,255,0.55)'}
        stroke={filled ? '#e09b00' : '#b9a27a'}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClockIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="13" r="8.5" fill="#fff" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 8.5V13l3 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M9.5 2.5h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
