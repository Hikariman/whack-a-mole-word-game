import { useEffect, useState } from 'react';
import Confetti from './Confetti.jsx';
import Trophy from './Trophy.jsx';
import WordReveal from './WordReveal.jsx';
import { SpeakerIcon, StarIcon } from './Icons.jsx';
import { speak, speakSequence, stopSpeaking } from '../audio/speech.js';
import { LEVELS, MAX_SCORE } from '../game/config.js';

export default function EndScreen({ totalScore, onPlayAgain }) {
  const [active, setActive] = useState(-1);

  useEffect(() => () => stopSpeaking(), []);

  const hearOne = async (index) => {
    setActive(index);
    await speak(LEVELS[index].word);
    setActive((cur) => (cur === index ? -1 : cur));
  };

  const hearAll = () => {
    speakSequence(
      LEVELS.map((l) => l.word),
      (i) => setActive(i),
    );
  };

  return (
    <main className="screen end-screen">
      <Confetti count={50} className="screen-confetti slow" />
      <div className="floating-stars" aria-hidden="true">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="floating-star" style={{ '--i': i }}>
            <StarIcon size={28 + (i % 3) * 8} />
          </span>
        ))}
      </div>
      <div className="card end-card">
        <Trophy />
        <h1 className="champion-title">
          You are a <span>Silent Letter Champion!</span>
        </h1>
        <p className="final-score">
          Total score: <strong>{totalScore}</strong> / {MAX_SCORE}
        </p>

        <h2 className="recap-title">Tap a word to hear it:</h2>
        <ul className="recap-list">
          {LEVELS.map((level, i) => (
            <li key={level.word}>
              <button
                type="button"
                className={`recap-word ${active === i ? 'active' : ''}`}
                onClick={() => hearOne(i)}
                aria-label={`Hear ${level.word}, ${level.silentLabel}`}
              >
                <SpeakerIcon size={24} />
                <WordReveal level={level} />
                <span className="recap-dash">—</span>
                <span className="silent-chip">{level.silentLabel}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="button-row">
          <button type="button" className="btn btn-secondary btn-lg" onClick={hearAll}>
            <SpeakerIcon size={26} /> Listen to All Words
          </button>
          <button type="button" className="btn btn-primary btn-lg" onClick={onPlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    </main>
  );
}
