// A small, soft toy hammer.
export default function Hammer({ className = '' }) {
  return (
    <svg className={`hammer ${className}`} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      <rect x="35" y="26" width="10" height="50" rx="5" fill="#ffb347" stroke="#c97a1a" strokeWidth="2.5" />
      <rect x="8" y="6" width="64" height="28" rx="12" fill="#ff6b6b" stroke="#c43d3d" strokeWidth="3" />
      <rect x="8" y="6" width="12" height="28" rx="6" fill="#ffd166" stroke="#c43d3d" strokeWidth="3" />
      <rect x="60" y="6" width="12" height="28" rx="6" fill="#ffd166" stroke="#c43d3d" strokeWidth="3" />
      <rect x="24" y="11" width="30" height="6" rx="3" fill="#fff" opacity="0.5" />
    </svg>
  );
}
