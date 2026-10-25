// Friendly cartoon mole face. mood: 'normal' | 'happy' | 'dizzy'

function Eyes({ mood }) {
  if (mood === 'happy') {
    return (
      <g stroke="#2b1a10" strokeWidth="4.5" strokeLinecap="round" fill="none">
        <path d="M30 46 Q37 38 44 46" />
        <path d="M56 46 Q63 38 70 46" />
      </g>
    );
  }
  if (mood === 'dizzy') {
    return (
      <g stroke="#2b1a10" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M37 44 m-6 0 a6 6 0 1 0 6 -6 a3.5 3.5 0 1 0 3 3" />
        <path d="M63 44 m-6 0 a6 6 0 1 0 6 -6 a3.5 3.5 0 1 0 3 3" />
      </g>
    );
  }
  return (
    <g>
      <ellipse cx="37" cy="44" rx="5.5" ry="6.5" fill="#2b1a10" />
      <ellipse cx="63" cy="44" rx="5.5" ry="6.5" fill="#2b1a10" />
      <circle cx="39" cy="41.5" r="2" fill="#fff" />
      <circle cx="65" cy="41.5" r="2" fill="#fff" />
    </g>
  );
}

function Mouth({ mood }) {
  if (mood === 'happy') {
    return <path d="M38 66 Q50 82 62 66 Z" fill="#7a2e2e" stroke="#2b1a10" strokeWidth="2.5" strokeLinejoin="round" />;
  }
  if (mood === 'dizzy') {
    return <path d="M40 70 q5 -5 10 0 t10 0" stroke="#2b1a10" strokeWidth="3" fill="none" strokeLinecap="round" />;
  }
  return <path d="M41 66 Q50 74 59 66" stroke="#2b1a10" strokeWidth="3" fill="none" strokeLinecap="round" />;
}

export function MoleFace({ mood = 'normal' }) {
  return (
    <svg className="mole-face" viewBox="0 0 100 92" aria-hidden="true" focusable="false">
      {/* ears */}
      <circle cx="18" cy="26" r="10" fill="#7a4a2c" />
      <circle cx="82" cy="26" r="10" fill="#7a4a2c" />
      <circle cx="18" cy="26" r="5" fill="#e9a8a0" />
      <circle cx="82" cy="26" r="5" fill="#e9a8a0" />
      {/* head */}
      <path d="M8 92 V52 Q8 8 50 8 Q92 8 92 52 V92 Z" fill="#8a5a3b" />
      <path d="M22 92 V64 Q22 40 50 40 Q78 40 78 64 V92 Z" fill="#e7c39b" />
      {/* cheeks */}
      <ellipse cx="26" cy="58" rx="7" ry="4.5" fill="#f4a3a8" opacity="0.75" />
      <ellipse cx="74" cy="58" rx="7" ry="4.5" fill="#f4a3a8" opacity="0.75" />
      <Eyes mood={mood} />
      {/* nose */}
      <ellipse cx="50" cy="56" rx="8" ry="6" fill="#f07a98" />
      <ellipse cx="48" cy="54" rx="2.6" ry="1.8" fill="#ffd0dc" />
      <Mouth mood={mood} />
      {/* whiskers */}
      <g stroke="#5a3a24" strokeWidth="1.6" strokeLinecap="round">
        <path d="M30 60 L14 57" />
        <path d="M30 63 L15 65" />
        <path d="M70 60 L86 57" />
        <path d="M70 63 L85 65" />
      </g>
      {/* teeth */}
      {mood !== 'happy' && <rect x="46" y="68" width="8" height="5" rx="1.5" fill="#fff" stroke="#2b1a10" strokeWidth="1" />}
    </svg>
  );
}

export function Paw({ side }) {
  return (
    <svg className={`mole-paw paw-${side}`} viewBox="0 0 30 22" aria-hidden="true" focusable="false">
      <ellipse cx="15" cy="12" rx="13" ry="9" fill="#e7c39b" stroke="#8a5a3b" strokeWidth="2" />
      <path d="M9 8 v6 M15 7 v7 M21 8 v6" stroke="#b8865f" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
