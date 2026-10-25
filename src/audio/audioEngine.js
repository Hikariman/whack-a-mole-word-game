// All game sounds are generated with the Web Audio API, so there are no
// audio files to download or break. The AudioContext is only created after a
// user gesture (button press) to respect browser autoplay rules.

const MUSIC_VOLUME = 0.05;
const MUSIC_DUCKED_VOLUME = 0.012;
const SFX_VOLUME = 0.22;

// A gentle pentatonic garden tune (note, beats). null = rest.
const MELODY = [
  ['C5', 1], ['E5', 1], ['G5', 1], ['E5', 1], ['D5', 1], ['C5', 1], ['A4', 2],
  ['G4', 1], ['A4', 1], ['C5', 1], ['D5', 1], ['E5', 2], [null, 2],
  ['E5', 1], ['G5', 1], ['A5', 1], ['G5', 1], ['E5', 1], ['D5', 1], ['C5', 2],
  ['D5', 1], ['E5', 1], ['D5', 1], ['A4', 1], ['C5', 2], [null, 2],
];
const BASS = ['C3', 'A2', 'F2', 'G2'];
const BEAT_SECONDS = 0.42;

const NOTE_INDEX = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
function noteToHz(note) {
  const name = note[0];
  const octave = Number(note.slice(1));
  return 440 * 2 ** ((NOTE_INDEX[name] + (octave - 4) * 12) / 12);
}

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.sfxOn = true;
    this.musicOn = false;
    this.ducked = false;
    this.musicTimer = null;
    this.nextNoteTime = 0;
    this.noteIndex = 0;
    this.barIndex = 0;
  }

  // Call from inside a click/tap handler.
  unlock() {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 1;
      this.master.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = SFX_VOLUME;
      this.sfxGain.connect(this.master);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0;
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 1800;
      this.musicGain.connect(lowpass);
      lowpass.connect(this.master);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  setSfx(on) {
    this.sfxOn = on;
  }

  setMusic(on) {
    this.musicOn = on;
    if (on) {
      this.unlock();
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  // Lower the music while the word is spoken so it is always clear.
  duck(on) {
    this.ducked = on;
    if (!this.ctx || !this.musicOn) return;
    const target = on ? MUSIC_DUCKED_VOLUME : MUSIC_VOLUME;
    this.musicGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.15);
  }

  tone({ freq, endFreq, start = 0, duration = 0.15, type = 'sine', volume = 1, out }) {
    const ctx = this.ctx;
    const t = ctx.currentTime + start;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(out ?? this.sfxGain);
    osc.start(t);
    osc.stop(t + duration + 0.05);
    return osc;
  }

  canPlaySfx() {
    if (!this.sfxOn) return false;
    this.unlock();
    return Boolean(this.ctx);
  }

  // Cheerful rising arpeggio with a sparkle.
  correct() {
    if (!this.canPlaySfx()) return;
    ['C5', 'E5', 'G5', 'C6'].forEach((note, i) => {
      this.tone({ freq: noteToHz(note), start: i * 0.08, duration: 0.22, type: 'triangle', volume: 0.8 });
    });
    this.tone({ freq: noteToHz('E6'), start: 0.34, duration: 0.35, type: 'sine', volume: 0.35 });
    this.tone({ freq: noteToHz('G6'), start: 0.4, duration: 0.35, type: 'sine', volume: 0.25 });
  }

  // Gentle, silly "boing-oing" that slides down. Soft, never scary.
  wrong() {
    if (!this.canPlaySfx()) return;
    const osc = this.tone({ freq: 420, endFreq: 190, duration: 0.5, type: 'sine', volume: 0.7 });
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 14;
    lfoGain.gain.value = 18;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();
    lfo.stop(this.ctx.currentTime + 0.55);
    this.tone({ freq: 160, endFreq: 140, start: 0.05, duration: 0.3, type: 'triangle', volume: 0.3 });
  }

  // Soft toy-hammer "bonk".
  whack() {
    if (!this.canPlaySfx()) return;
    this.tone({ freq: 260, endFreq: 90, duration: 0.12, type: 'square', volume: 0.12 });
    this.tone({ freq: 700, endFreq: 300, duration: 0.06, type: 'triangle', volume: 0.25 });
  }

  // Little fanfare for level complete.
  fanfare() {
    if (!this.canPlaySfx()) return;
    [['G4', 0], ['C5', 0.14], ['E5', 0.28], ['G5', 0.42], ['E5', 0.6], ['G5', 0.72]].forEach(([note, start], i) => {
      this.tone({ freq: noteToHz(note), start, duration: i === 5 ? 0.6 : 0.2, type: 'triangle', volume: 0.7 });
    });
  }

  // Soft descending notes for time up. Encouraging, not sad.
  timeUp() {
    if (!this.canPlaySfx()) return;
    [['E5', 0], ['D5', 0.18], ['C5', 0.36]].forEach(([note, start]) => {
      this.tone({ freq: noteToHz(note), start, duration: 0.3, type: 'triangle', volume: 0.5 });
    });
  }

  startMusic() {
    if (!this.ctx || this.musicTimer) return;
    this.musicGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicGain.gain.setTargetAtTime(this.ducked ? MUSIC_DUCKED_VOLUME : MUSIC_VOLUME, this.ctx.currentTime, 0.5);
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.musicTimer = window.setInterval(() => this.scheduleMusic(), 100);
  }

  stopMusic() {
    if (this.musicTimer) window.clearInterval(this.musicTimer);
    this.musicTimer = null;
    if (this.ctx) this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
  }

  scheduleMusic() {
    const ctx = this.ctx;
    while (this.nextNoteTime < ctx.currentTime + 0.4) {
      const [note, beats] = MELODY[this.noteIndex];
      const length = beats * BEAT_SECONDS;
      const start = this.nextNoteTime - ctx.currentTime;
      if (note) {
        this.tone({ freq: noteToHz(note), start, duration: length * 0.95, type: 'triangle', volume: 0.6, out: this.musicGain });
      }
      // a soft bass note at the start of every 4 beats
      const beatPosition = MELODY.slice(0, this.noteIndex).reduce((sum, [, b]) => sum + b, 0);
      if (beatPosition % 4 === 0) {
        const bass = BASS[this.barIndex % BASS.length];
        this.barIndex += 1;
        this.tone({ freq: noteToHz(bass), start, duration: BEAT_SECONDS * 3.8, type: 'sine', volume: 0.7, out: this.musicGain });
      }
      this.nextNoteTime += length;
      this.noteIndex = (this.noteIndex + 1) % MELODY.length;
    }
  }
}

export const audio = new AudioEngine();
