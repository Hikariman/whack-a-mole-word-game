import { audio } from './audioEngine.js';

// Text-to-speech for the target words using the browser's SpeechSynthesis.

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
let cachedVoice = null;

export const speechSupported = Boolean(synth && typeof window.SpeechSynthesisUtterance !== 'undefined');

function pickVoice() {
  if (!speechSupported) return null;
  const voices = synth.getVoices();
  if (voices.length === 0) return null;
  const english = voices.filter((v) => /^en([-_]|$)/i.test(v.lang));
  const score = (v) => {
    let s = 0;
    if (/en[-_]GB/i.test(v.lang)) s += 4;
    else if (/en[-_](US|AU|IE|NZ)/i.test(v.lang)) s += 3;
    if (/google|natural|enhanced|premium|neural/i.test(v.name)) s += 2;
    if (v.localService) s += 1;
    if (/novelty|whisper|bells|bubbles|bad news|good news|zarvox|trinoids|cellos|organ|jester|boing/i.test(v.name)) s -= 10;
    return s;
  };
  return english.sort((a, b) => score(b) - score(a))[0] ?? null;
}

if (speechSupported) {
  cachedVoice = pickVoice();
  synth.addEventListener?.('voiceschanged', () => {
    cachedVoice = pickVoice();
  });
}

let speakToken = 0;
let sequenceToken = 0;

function speakRaw(text, rate) {
  if (!speechSupported) return Promise.resolve(false);
  speakToken += 1;
  const token = speakToken;
  synth.cancel();
  return new Promise((resolve) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.voice = cachedVoice ?? pickVoice();
    utterance.lang = utterance.voice?.lang ?? 'en-GB';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      if (token === speakToken) audio.duck(false);
      resolve(true);
    };
    utterance.onend = done;
    utterance.onerror = done;
    // Safety net: some browsers never fire onend.
    window.setTimeout(done, 4000);
    audio.duck(true);
    synth.speak(utterance);
    if (synth.paused) synth.resume();
  });
}

// Speak a single word (stops anything already being spoken).
// Call from a click/tap handler so it works on iOS and with autoplay rules.
export function speak(text, { rate = 0.8 } = {}) {
  sequenceToken += 1;
  return speakRaw(text, rate);
}

const wait = (ms) => new Promise((r) => window.setTimeout(r, ms));

// Speak several words one after another with a short pause between them.
// onWord(index) is called as each word starts, and onWord(-1) at the end.
export async function speakSequence(words, onWord) {
  sequenceToken += 1;
  const token = sequenceToken;
  for (let i = 0; i < words.length; i += 1) {
    if (token !== sequenceToken) return;
    onWord?.(i);
    await speakRaw(words[i], 0.8);
    if (token !== sequenceToken) return;
    await wait(600);
  }
  if (token === sequenceToken) onWord?.(-1);
}

export function stopSpeaking() {
  sequenceToken += 1;
  speakToken += 1;
  if (speechSupported) synth.cancel();
  audio.duck(false);
}
