import { useState } from 'react';
import { SpeakerIcon } from './Icons.jsx';
import { MoleFace } from './Mole.jsx';
import { speechSupported } from '../audio/speech.js';
import { LEVELS } from '../game/config.js';

// Listening phase: the pupil must press Listen at least once before hunting.
// The target word is never shown here.
export default function ListenScreen({ levelIndex, onListen, onStart }) {
  const [heard, setHeard] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const listen = async () => {
    setHeard(true);
    setSpeaking(true);
    await onListen();
    setSpeaking(false);
  };

  return (
    <main className="screen listen-screen">
      <div className="card listen-card">
        <p className="level-badge">
          Level {levelIndex + 1} of {LEVELS.length}
        </p>
        <h2 className="listen-title">Listen carefully!</h2>

        <button
          type="button"
          className={`big-speaker ${speaking ? 'speaking' : ''}`}
          onClick={listen}
          aria-label={heard ? 'Listen again to the word' : 'Listen to the word'}
        >
          <SpeakerIcon size={96} />
          <span className="sound-waves" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <div className="button-row">
          <button type="button" className="btn btn-secondary btn-lg" onClick={listen}>
            <SpeakerIcon size={26} /> {heard ? 'Listen Again' : 'Listen'}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onStart}
            disabled={!heard}
            aria-describedby={heard ? undefined : 'listen-first'}
          >
            Start Hunting!
          </button>
        </div>

        <p id="listen-first" className="hint" aria-live="polite">
          {heard ? 'Remember the word, then find it in the garden!' : 'Press Listen to hear the secret word first.'}
        </p>
        {!speechSupported && (
          <p className="warning" role="alert">
            Your browser cannot speak words aloud. Please ask your teacher to say the word, or try Chrome, Edge or Safari.
          </p>
        )}
      </div>
      <div className="listen-mole" aria-hidden="true">
        <MoleFace mood={speaking ? 'happy' : 'normal'} />
      </div>
    </main>
  );
}
