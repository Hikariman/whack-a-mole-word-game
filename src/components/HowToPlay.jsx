import { useEffect, useRef } from 'react';
import { CheckIcon, ClockIcon, CrossIcon, SpeakerIcon } from './Icons.jsx';
import { MoleFace } from './Mole.jsx';
import { HITS_TO_PASS, LEVEL_TIME_SECONDS, LEVELS, POINTS_PER_HIT } from '../game/config.js';

export default function HowToPlay({ onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="card modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="howto-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="howto-title">How to Play</h2>
        <ul className="howto-list">
          <li>
            <span className="howto-icon speaker-badge">
              <SpeakerIcon size={26} />
            </span>
            <span>
              <strong>Listen</strong> to the secret word. You can listen again as many times as you like.
            </span>
          </li>
          <li>
            <span className="howto-icon mini-mole">
              <MoleFace />
            </span>
            <span>
              <strong>Look</strong> at the word signs the moles are holding.
            </span>
          </li>
          <li>
            <span className="howto-icon">
              <CheckIcon size={32} />
            </span>
            <span>
              <strong>Tap</strong> the mole with the word you heard. You get {POINTS_PER_HIT} points!
            </span>
          </li>
          <li>
            <span className="howto-icon">
              <CrossIcon size={32} />
            </span>
            <span>
              Wrong word? No problem. <strong>Try again!</strong> You never lose points.
            </span>
          </li>
          <li>
            <span className="howto-icon clock-badge">
              <ClockIcon size={30} />
            </span>
            <span>
              Find the word <strong>{HITS_TO_PASS} times</strong> in {LEVEL_TIME_SECONDS} seconds to finish a level. There are{' '}
              {LEVELS.length} levels.
            </span>
          </li>
        </ul>
        <p className="howto-tip">Tip: some words have silent letters. Listen carefully!</p>
        <button ref={closeRef} type="button" className="btn btn-primary btn-lg" onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  );
}
