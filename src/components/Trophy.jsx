export default function Trophy() {
  return (
    <svg className="trophy" viewBox="0 0 160 170" role="img" aria-label="Gold trophy">
      <defs>
        <linearGradient id="gold" x1="0" x2="1">
          <stop offset="0" stopColor="#ffcf3f" />
          <stop offset="0.5" stopColor="#fff09a" />
          <stop offset="1" stopColor="#f2a900" />
        </linearGradient>
      </defs>
      <path d="M40 30 H18 Q10 30 12 44 Q16 74 46 80" stroke="#e0a400" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M120 30 H142 Q150 30 148 44 Q144 74 114 80" stroke="#e0a400" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M36 18 H124 V52 Q124 98 80 104 Q36 98 36 52 Z" fill="url(#gold)" stroke="#d99a00" strokeWidth="4" />
      <rect x="70" y="102" width="20" height="22" fill="#f2b705" stroke="#d99a00" strokeWidth="3" />
      <rect x="46" y="122" width="68" height="16" rx="5" fill="url(#gold)" stroke="#d99a00" strokeWidth="3" />
      <rect x="36" y="136" width="88" height="24" rx="7" fill="#8a5a3b" stroke="#5c3a22" strokeWidth="3" />
      <path d="M80 34 l6 12 13 2 -9.5 9 2.3 13 -11.8 -6.2 -11.8 6.2 2.3 -13 -9.5 -9 13 -2 z" fill="#fff8d6" stroke="#d99a00" strokeWidth="2" />
      <path d="M48 26 Q46 60 60 80" stroke="#fff" strokeWidth="5" opacity="0.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
