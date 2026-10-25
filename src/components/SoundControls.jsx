import { MusicIcon, SpeakerIcon } from './Icons.jsx';

export default function SoundControls({ musicOn, sfxOn, onToggleMusic, onToggleSfx, large = false }) {
  return (
    <div className={`sound-controls ${large ? 'large' : ''}`} role="group" aria-label="Sound settings">
      <button
        type="button"
        className={`toggle ${musicOn ? 'on' : 'off'}`}
        onClick={onToggleMusic}
        aria-pressed={musicOn}
        title={musicOn ? 'Turn music off' : 'Turn music on'}
      >
        <MusicIcon size={large ? 26 : 22} muted={!musicOn} />
        <span className="toggle-label">Music {musicOn ? 'On' : 'Off'}</span>
      </button>
      <button
        type="button"
        className={`toggle ${sfxOn ? 'on' : 'off'}`}
        onClick={onToggleSfx}
        aria-pressed={sfxOn}
        title={sfxOn ? 'Turn sound effects off' : 'Turn sound effects on'}
      >
        <SpeakerIcon size={large ? 26 : 22} muted={!sfxOn} />
        <span className="toggle-label">Effects {sfxOn ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}
