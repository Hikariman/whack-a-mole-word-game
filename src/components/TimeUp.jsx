import { SpeakerIcon } from './Icons.jsx';
import { MoleFace } from './Mole.jsx';
import { HITS_TO_PASS } from '../game/config.js';

export default function TimeUp({ hits, onReplay, onListenAgain }) {
  return (
    <main className="screen result-screen">
      <div className="card result-card">
        <div className="timeup-mole" aria-hidden="true">
          <MoleFace mood="normal" />
        </div>
        <h2>
          Time&apos;s Up!
          <br />
          Let&apos;s Try Again!
        </h2>
        <p className="score-line">
          You found the word {hits} of {HITS_TO_PASS} times. You can do it!
        </p>
        <div className="button-row">
          <button type="button" className="btn btn-primary btn-lg" onClick={onReplay} autoFocus>
            Replay Level
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={onListenAgain}>
            <SpeakerIcon size={26} /> Listen Again
          </button>
        </div>
      </div>
    </main>
  );
}
