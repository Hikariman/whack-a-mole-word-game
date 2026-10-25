import { useCallback, useEffect, useRef, useState } from 'react';
import { MoleFace, Paw } from './Mole.jsx';
import Hammer from './Hammer.jsx';
import Confetti from './Confetti.jsx';
import SoundControls from './SoundControls.jsx';
import { CheckIcon, ClockIcon, CrossIcon, SpeakerIcon, StarIcon } from './Icons.jsx';
import { audio } from '../audio/audioEngine.js';
import { createDistractorBag, pickHole, shouldSpawnTarget } from '../game/logic.js';
import {
  FIRST_SPAWN_DELAY_MS,
  HIT_REACTION_MS,
  HITS_TO_PASS,
  HOLE_COUNT,
  LEVEL_TIME_SECONDS,
  LEVELS,
  MAX_ACTIVE_MOLES,
  MOLE_HIDE_MS,
  MOLE_RISE_MS,
  MOLE_VISIBLE_MS,
  POINTS_PER_HIT,
  POPUP_MS,
  SPAWN_INTERVAL_MS,
} from '../game/config.js';

// Mole states: 'up' (can be whacked) -> 'hit' (reacting) -> 'hiding' -> removed
//                                   \-> 'hiding' (timed out) -> removed

export default function HuntScreen({ levelIndex, baseScore, onComplete, onTimeUp, onHearWord, sound }) {
  const level = LEVELS[levelIndex];

  const [holes, setHoles] = useState(() => Array(HOLE_COUNT).fill(null));
  const [timeLeft, setTimeLeft] = useState(LEVEL_TIME_SECONDS);
  const [hits, setHits] = useState(0);
  const [popup, setPopup] = useState(null); // { kind: 'correct' | 'wrong', key }
  const [hammer, setHammer] = useState(null); // { hole, key }
  const [finished, setFinished] = useState(false);

  // Mutable game data lives in refs so timers always see fresh values.
  const holesRef = useRef(holes);
  const hitsRef = useRef(0);
  const doneRef = useRef(false);
  const timeoutsRef = useRef(new Set());
  const intervalsRef = useRef([]);
  const popupTimeoutRef = useRef(null);
  const game = useRef({
    nextId: 1,
    spawnIndex: 0,
    spawnsSinceTarget: 0,
    lastHole: -1,
    // first target is the 1st or 2nd mole: always inside the first 3 seconds
    firstTargetSpawn: Math.random() < 0.5 ? 0 : 1,
    bag: createDistractorBag(level.distractors),
  });

  const callbacks = useRef({ onComplete, onTimeUp });
  callbacks.current = { onComplete, onTimeUp };

  const updateHoles = useCallback((fn) => {
    holesRef.current = fn(holesRef.current);
    setHoles(holesRef.current);
  }, []);

  const later = useCallback((fn, ms) => {
    const id = window.setTimeout(() => {
      timeoutsRef.current.delete(id);
      fn();
    }, ms);
    timeoutsRef.current.add(id);
    return id;
  }, []);

  const setMoleState = useCallback(
    (index, id, state) => {
      updateHoles((current) => {
        const mole = current[index];
        if (!mole || mole.id !== id) return current;
        const next = [...current];
        next[index] = { ...mole, state };
        return next;
      });
    },
    [updateHoles],
  );

  const removeMole = useCallback(
    (index, id) => {
      updateHoles((current) => {
        if (!current[index] || current[index].id !== id) return current;
        const next = [...current];
        next[index] = null;
        return next;
      });
    },
    [updateHoles],
  );

  const hideMole = useCallback(
    (index, id) => {
      setMoleState(index, id, 'hiding');
      later(() => removeMole(index, id), MOLE_HIDE_MS);
    },
    [later, removeMole, setMoleState],
  );

  const stopAllTimers = useCallback(() => {
    intervalsRef.current.forEach((id) => window.clearInterval(id));
    intervalsRef.current = [];
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current.clear();
  }, []);

  const showPopup = useCallback((kind) => {
    window.clearTimeout(popupTimeoutRef.current);
    setPopup({ kind, key: Date.now() });
    popupTimeoutRef.current = window.setTimeout(() => setPopup(null), POPUP_MS);
  }, []);

  const spawn = useCallback(() => {
    if (doneRef.current) return;
    const current = holesRef.current;
    const g = game.current;
    if (current.filter(Boolean).length >= MAX_ACTIVE_MOLES) return;
    const hole = pickHole(current, g.lastHole);
    if (hole === -1) return;

    const targetVisible = current.some((m) => m && m.correct && m.state !== 'hiding');
    const correct = shouldSpawnTarget({
      targetVisible,
      spawnIndex: g.spawnIndex,
      firstTargetSpawn: g.firstTargetSpawn,
      spawnsSinceTarget: g.spawnsSinceTarget,
    });
    const onScreen = current.filter(Boolean).map((m) => m.word);
    const word = correct ? level.word : g.bag.draw(onScreen);

    g.spawnIndex += 1;
    g.spawnsSinceTarget = correct ? 0 : g.spawnsSinceTarget + 1;
    g.lastHole = hole;

    const mole = { id: g.nextId++, word, correct, state: 'up' };
    updateHoles((cur) => {
      const next = [...cur];
      next[hole] = mole;
      return next;
    });
    later(() => {
      const m = holesRef.current[hole];
      if (m && m.id === mole.id && m.state === 'up') hideMole(hole, mole.id);
    }, MOLE_RISE_MS + MOLE_VISIBLE_MS);
  }, [hideMole, later, level.word, updateHoles]);

  const endLevel = useCallback(
    (won) => {
      if (doneRef.current) return;
      doneRef.current = true;
      setFinished(true);
      stopAllTimers();
      if (won) {
        // let the "Congratulations!" popup be seen before the success screen
        later(() => callbacks.current.onComplete(hitsRef.current * POINTS_PER_HIT), POPUP_MS + 200);
      } else {
        audio.timeUp();
        updateHoles((cur) => cur.map((m) => (m ? { ...m, state: 'hiding' } : m)));
        later(() => callbacks.current.onTimeUp(hitsRef.current), 900);
      }
    },
    [later, stopAllTimers, updateHoles],
  );

  // Start the round: spawner + countdown. Everything is cleared on unmount.
  useEffect(() => {
    doneRef.current = false; // React StrictMode re-runs effects in development
    const endAt = Date.now() + LEVEL_TIME_SECONDS * 1000;
    later(() => {
      spawn();
      intervalsRef.current.push(window.setInterval(spawn, SPAWN_INTERVAL_MS));
    }, FIRST_SPAWN_DELAY_MS);

    intervalsRef.current.push(
      window.setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining <= 0) endLevel(false);
      }, 200),
    );

    return () => {
      doneRef.current = true;
      stopAllTimers();
      window.clearTimeout(popupTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const whack = (index) => {
    if (doneRef.current) return;
    const mole = holesRef.current[index];
    if (!mole || mole.state !== 'up') return; // ignore repeat taps on the same mole

    audio.whack();
    setHammer({ hole: index, key: mole.id });
    updateHoles((cur) => {
      const next = [...cur];
      next[index] = { ...mole, state: 'hit' };
      return next;
    });

    if (mole.correct) {
      audio.correct();
      hitsRef.current += 1;
      setHits(hitsRef.current);
      showPopup('correct');
      if (hitsRef.current >= HITS_TO_PASS) {
        audio.fanfare();
        endLevel(true);
        return;
      }
    } else {
      audio.wrong();
      showPopup('wrong');
    }
    later(() => hideMole(index, mole.id), HIT_REACTION_MS);
  };

  const levelScore = hits * POINTS_PER_HIT;
  const lowTime = timeLeft <= 10;

  return (
    <main className="screen hunt-screen">
      <header className="hud" aria-label="Game status">
        <div className="hud-item">
          <span className="hud-label">Level</span>
          <span className="hud-value">
            {levelIndex + 1}/{LEVELS.length}
          </span>
        </div>
        <div className={`hud-item timer ${lowTime ? 'low' : ''}`} role="timer" aria-live="off">
          <span className="hud-label">Time</span>
          <span className="hud-value">
            <ClockIcon size={20} /> {timeLeft}s
          </span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Found</span>
          <span className="hud-value stars" aria-label={`${hits} of ${HITS_TO_PASS} found`}>
            {Array.from({ length: HITS_TO_PASS }, (_, i) => (
              <StarIcon key={i} size={22} filled={i < hits} />
            ))}
            <span className="progress-text">
              {hits}/{HITS_TO_PASS}
            </span>
          </span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Score</span>
          <span className="hud-value">{baseScore + levelScore}</span>
        </div>
      </header>

      <div className="hunt-tools">
        <button type="button" className="btn btn-secondary btn-md hear-btn" onClick={onHearWord}>
          <SpeakerIcon size={24} /> Hear the Word
        </button>
        <SoundControls {...sound} />
      </div>

      <div className={`board ${finished ? 'finished' : ''}`}>
        {holes.map((mole, index) => (
          <div className="hole-cell" key={index}>
            <div className="hole-back" />
            <div className="mole-window">
              {mole && (
                <button
                  key={mole.id}
                  type="button"
                  className={`mole state-${mole.state} ${mole.state === 'hit' ? (mole.correct ? 'was-correct' : 'was-wrong') : ''}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    whack(index);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      whack(index);
                    }
                  }}
                  aria-label={`Mole holding the word ${mole.word}`}
                  aria-disabled={mole.state !== 'up'}
                  style={{ '--rise': `${MOLE_RISE_MS}ms`, '--hide': `${MOLE_HIDE_MS}ms` }}
                >
                  <MoleFace mood={mole.state === 'hit' ? (mole.correct ? 'happy' : 'dizzy') : 'normal'} />
                  <span className="sign">
                    <span className="sign-text">{mole.word}</span>
                    <Paw side="left" />
                    <Paw side="right" />
                  </span>
                </button>
              )}
            </div>
            <div className="hole-front" />
            {mole?.state === 'hit' && (
              <div className="hit-badge" aria-hidden="true">
                {mole.correct ? <CheckIcon size={44} /> : <CrossIcon size={44} />}
              </div>
            )}
            {hammer?.hole === index && <Hammer key={hammer.key} className="whack" />}
          </div>
        ))}
      </div>

      {popup && (
        <div key={popup.key} className={`popup popup-${popup.kind}`} role="status" aria-live="assertive">
          {popup.kind === 'correct' && <Confetti count={28} />}
          <div className="popup-card">
            {popup.kind === 'correct' ? <CheckIcon size={64} /> : <CrossIcon size={64} />}
            <span className="popup-text">{popup.kind === 'correct' ? 'Congratulations!' : 'Try Again!'}</span>
            {popup.kind === 'correct' && (
              <span className="popup-stars" aria-hidden="true">
                <StarIcon size={30} /> <StarIcon size={38} /> <StarIcon size={30} />
              </span>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
