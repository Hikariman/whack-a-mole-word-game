import { MoleFace } from './Mole.jsx';
import Hammer from './Hammer.jsx';
import SoundControls from './SoundControls.jsx';

export function InstructionList() {
  return (
    <ol className="instruction-list">
      <li>
        <span className="step-num">1</span> Listen to the word.
      </li>
      <li>
        <span className="step-num">2</span> Find the matching word.
      </li>
      <li>
        <span className="step-num">3</span> Tap the correct mole!
      </li>
    </ol>
  );
}

export default function StartScreen({ onPlay, onHowTo, sound }) {
  return (
    <main className="screen start-screen">
      <h1 className="game-title">
        <span className="title-line">Silent Letter</span>
        <span className="title-line big">Mole Hunt!</span>
      </h1>

      <div className="hero-mole" aria-hidden="true">
        <div className="hero-mole-body">
          <MoleFace mood="happy" />
        </div>
        <Hammer className="hero-hammer" />
        <div className="hero-hole" />
      </div>

      <div className="card start-card">
        <InstructionList />
        <div className="button-row">
          <button type="button" className="btn btn-primary btn-xl" onClick={onPlay}>
            Play Game
          </button>
          <button type="button" className="btn btn-secondary btn-xl" onClick={onHowTo}>
            How to Play
          </button>
        </div>
        <SoundControls {...sound} large />
      </div>
    </main>
  );
}
