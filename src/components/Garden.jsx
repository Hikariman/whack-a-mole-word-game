// The cartoon garden behind every screen. Pure SVG/CSS, no image files.

function Flower({ x, y, color, scale = 1, delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0 Q2 18 0 34" stroke="#3f9a32" strokeWidth="3" fill="none" />
      <path d="M0 22 Q-10 16 -12 22 Q-6 28 0 24" fill="#4fb33d" />
      <g className="flower-head" style={{ animationDelay: `${delay}s` }}>
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cx="0" cy="-7" rx="5" ry="7.5" fill={color} transform={`rotate(${angle})`} />
        ))}
        <circle r="4.5" fill="#ffd23f" />
      </g>
    </g>
  );
}

const FLOWERS = [
  { x: 40, y: 330, color: '#ff7aa8', scale: 1.1 },
  { x: 120, y: 350, color: '#ffffff', scale: 0.9, delay: 0.6 },
  { x: 220, y: 335, color: '#b38cff', scale: 1, delay: 1.2 },
  { x: 780, y: 340, color: '#ff9f43', scale: 1, delay: 0.3 },
  { x: 860, y: 325, color: '#ff7aa8', scale: 1.2, delay: 0.9 },
  { x: 950, y: 352, color: '#ffffff', scale: 0.9, delay: 1.5 },
  { x: 1040, y: 335, color: '#b38cff', scale: 1.05, delay: 0.4 },
  { x: 1150, y: 345, color: '#ff9f43', scale: 0.95, delay: 1.1 },
  { x: 330, y: 355, color: '#ff9f43', scale: 0.85, delay: 0.8 },
  { x: 660, y: 352, color: '#ff7aa8', scale: 0.85, delay: 0.2 },
];

export default function Garden() {
  return (
    <div className="garden" aria-hidden="true">
      <div className="sun" />
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <svg className="hills" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice">
        <path d="M0 210 Q200 120 420 190 T820 170 T1200 180 V400 H0z" fill="#9fdc6f" />
        <path d="M0 260 Q300 190 600 250 T1200 240 V400 H0z" fill="#7ccf5a" />
        <path d="M0 300 Q250 270 500 300 T1000 295 T1200 300 V400 H0z" fill="#63bd47" />
        {FLOWERS.map((f, i) => (
          <Flower key={i} {...f} />
        ))}
      </svg>
    </div>
  );
}
