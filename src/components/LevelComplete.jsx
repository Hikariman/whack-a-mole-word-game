import Confetti from './Confetti.jsx';
import WordReveal from './WordReveal.jsx';
import { SpeakerIcon, StarIcon } from './Icons.jsx';
import { MoleFace } from './Mole.jsx';
import { LEVELS } from '../game/config.js';

export default function LevelComplete({ levelIndex, levelScore, totalScore, onNext, onHearWord }) {
  const level = LEVELS[levelIndex];
  const isLast = levelIndex === LEVELS.length - 1;
  return (
    <main className="screen result-screen">
      <Confetti count={40} className="screen-confetti" />
      <div className="card result-card success">
        <div className="result-stars" aria-hidden="true">
          <StarIcon size={44} /> <StarIcon size={60} /> <StarIcon size={44} />
        </div>
        <h2>
          Great Job!
          <br />
          Level Complete!
        </h2>
        <p className="reveal-intro">The word was:</p>
        <button type="button" className="reveal-button" onClick={onHearWord} aria-label={`Hear the word ${level.word}`}>
          <WordReveal level={level} />
          <SpeakerIcon size={30} />
        </button>
        <p className="silent-note">
          <span className="silent-chip">{level.silentLabel}</span>
        </p>
        <p className="score-line">
          +{levelScore} points &nbsp;·&nbsp; Total score: <strong>{totalScore}</strong>
        </p>
        <button type="button" className="btn btn-primary btn-xl" onClick={onNext} autoFocus>
          {isLast ? 'See My Trophy!' : 'Next Level'}
        </button>
      </div>
      <div className="corner-mole" aria-hidden="true">
        <MoleFace mood="happy" />
      </div>
    </main>
  );
}
