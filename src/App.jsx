import { useCallback, useState } from 'react';
import Garden from './components/Garden.jsx';
import StartScreen from './components/StartScreen.jsx';
import HowToPlay from './components/HowToPlay.jsx';
import ListenScreen from './components/ListenScreen.jsx';
import HuntScreen from './components/HuntScreen.jsx';
import LevelComplete from './components/LevelComplete.jsx';
import TimeUp from './components/TimeUp.jsx';
import EndScreen from './components/EndScreen.jsx';
import SoundControls from './components/SoundControls.jsx';
import { audio } from './audio/audioEngine.js';
import { speak, stopSpeaking } from './audio/speech.js';
import { LEVELS } from './game/config.js';

// Screens: start -> listen -> hunt -> levelComplete -> listen (next level) ... -> end
//                              \-> timeUp -> hunt (replay) | listen (listen again)

export default function App() {
  const [screen, setScreen] = useState('start');
  const [showHowTo, setShowHowTo] = useState(false);
  const [levelIndex, setLevelIndex] = useState(0);
  const [completedScore, setCompletedScore] = useState(0); // points from finished levels only
  const [lastLevelScore, setLastLevelScore] = useState(0);
  const [timeUpHits, setTimeUpHits] = useState(0);
  const [attempt, setAttempt] = useState(0); // remounts HuntScreen for a clean replay
  const [musicOn, setMusicOn] = useState(false); // music is off until the pupil turns it on
  const [sfxOn, setSfxOn] = useState(true);

  const sound = {
    musicOn,
    sfxOn,
    onToggleMusic: () => {
      audio.unlock();
      audio.setMusic(!musicOn);
      setMusicOn(!musicOn);
    },
    onToggleSfx: () => {
      audio.unlock();
      audio.setSfx(!sfxOn);
      setSfxOn(!sfxOn);
    },
  };

  const level = LEVELS[levelIndex];
  const sayTarget = useCallback(() => speak(level.word), [level.word]);

  const goListen = () => {
    stopSpeaking();
    setScreen('listen');
  };

  const play = () => {
    audio.unlock();
    setLevelIndex(0);
    setCompletedScore(0);
    goListen();
  };

  const startHunt = () => {
    audio.unlock();
    setAttempt((a) => a + 1);
    setScreen('hunt');
    sayTarget(); // inside the click handler, so browsers allow the speech
  };

  const handleComplete = (levelScore) => {
    setLastLevelScore(levelScore);
    setCompletedScore((s) => s + levelScore);
    setScreen('levelComplete');
  };

  const handleTimeUp = (hits) => {
    // this attempt's points are discarded; completed levels keep theirs
    setTimeUpHits(hits);
    stopSpeaking();
    setScreen('timeUp');
  };

  const nextLevel = () => {
    if (levelIndex + 1 >= LEVELS.length) {
      stopSpeaking();
      setScreen('end');
      return;
    }
    setLevelIndex(levelIndex + 1);
    goListen();
  };

  const playAgain = () => {
    stopSpeaking();
    setLevelIndex(0);
    setCompletedScore(0);
    setScreen('start');
  };

  const showTopBar = screen !== 'start' && screen !== 'hunt';

  return (
    <div className={`app ${showTopBar ? 'has-top-bar' : ''}`}>
      <Garden />

      {showTopBar && (
        <div className="top-bar">
          <button type="button" className="btn btn-ghost btn-sm" onClick={playAgain}>
            Home
          </button>
          <SoundControls {...sound} />
        </div>
      )}

      {screen === 'start' && <StartScreen onPlay={play} onHowTo={() => setShowHowTo(true)} sound={sound} />}

      {screen === 'listen' && (
        <ListenScreen key={`listen-${levelIndex}-${attempt}`} levelIndex={levelIndex} onListen={sayTarget} onStart={startHunt} />
      )}

      {screen === 'hunt' && (
        <HuntScreen
          key={`hunt-${levelIndex}-${attempt}`}
          levelIndex={levelIndex}
          baseScore={completedScore}
          onComplete={handleComplete}
          onTimeUp={handleTimeUp}
          onHearWord={sayTarget}
          sound={sound}
        />
      )}

      {screen === 'levelComplete' && (
        <LevelComplete
          levelIndex={levelIndex}
          levelScore={lastLevelScore}
          totalScore={completedScore}
          onNext={nextLevel}
          onHearWord={sayTarget}
        />
      )}

      {screen === 'timeUp' && (
        <TimeUp
          hits={timeUpHits}
          onReplay={startHunt}
          onListenAgain={() => {
            setAttempt((a) => a + 1);
            goListen();
          }}
        />
      )}

      {screen === 'end' && <EndScreen totalScore={completedScore} onPlayAgain={playAgain} />}

      {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
    </div>
  );
}
