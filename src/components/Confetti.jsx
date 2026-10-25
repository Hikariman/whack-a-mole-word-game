import { useMemo } from 'react';

const COLORS = ['#ff6b6b', '#ffd166', '#06d6a0', '#4cc9f0', '#b38cff', '#ff9f43'];

// Lightweight CSS confetti. Pieces are generated once per mount.
export default function Confetti({ count = 24, className = '' }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.25,
        duration: 0.9 + Math.random() * 0.6,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 80,
        round: i % 3 === 0,
      })),
    [count],
  );
  return (
    <div className={`confetti ${className}`} aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`confetti-piece ${p.round ? 'round' : ''}`}
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--rot': `${p.rotate}deg`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
