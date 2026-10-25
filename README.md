# SILENT LETTER MOLE HUNT!

A listening and word-recognition whack-a-mole game for **Year 4 English** pupils (ages 9–10).
Pupils **listen** to a secret word, then tap the mole holding the matching word sign.
The game supports the pronunciation focus of the *My Cat* lesson plan (silent letters in *night*, *knee* and *straight*).

| Level | Target word | Silent letter(s) |
| ----- | ----------- | ---------------- |
| 1     | NIGHT       | silent G         |
| 2     | KNEE        | silent K         |
| 3     | STRAIGHT    | silent GH        |

## How the game works

1. **Start screen**: title, mole with a toy hammer, *Play Game*, *How to Play*, and the Music / Effects switches.
2. **Listening phase** (before every level): a big speaker button and the instruction *Listen carefully!*
   The word is spoken only when the pupil presses **Listen**, and **Listen Again** can be pressed as often as needed.
   **Start Hunting!** unlocks only after the pupil has listened at least once. The word is never shown as text here.
3. **Hunt**: six holes (two rows of three). Moles rise gently, show a word sign for 2 seconds, then sink back.
   - The target always appears within the first 3 seconds and then regularly (never two copies at once, and no duplicate words on screen).
   - Distractors come from a shuffled pool, so every distractor is used before any repeats.
   - Correct tap: cheerful sound, green tick, *Congratulations!* popup with confetti, **+10 points**, and the mole smiles and disappears.
   - Wrong tap: a gentle "boing" sound, red X, *Try Again!* popup. No points are lost and the answer is not revealed.
   - Each mole can only be scored once. A **Hear the Word** button replays the word at any time.
4. **Level rules**: 60 seconds and **3 correct hits** per level. The HUD shows the level, a countdown, progress (e.g. 2/3) and the score.
   - Success: *Great Job! Level Complete!* reveals the word with its silent letters highlighted, then **Next Level**.
   - Time up: *Time's Up! Let's Try Again!* with **Replay Level** and **Listen Again**. The points from that attempt are reset, but points from completed levels are kept.
5. **End screen**: *YOU ARE A SILENT LETTER CHAMPION!*, a gold trophy, animated stars, a total score out of **90**
   (3 levels × 3 hits × 10 points), and a recap where each word can be tapped to hear it. **Listen to All Words** and **Play Again** buttons are included.

### Sound

- Words are spoken with the browser's built-in **SpeechSynthesis** (an English voice; British English is preferred when available).
- Sound effects and background music are **generated in code with the Web Audio API**, so there are no audio files to break.
- **Music** is off by default and loops quietly once switched on. **Effects** have their own switch.
  Music fades down automatically while a word is being spoken.
- Audio only starts after a tap or click, following browser autoplay rules (including iOS Safari).

> If a browser has no speech voices installed, the listening screen shows a message so the teacher can say the word aloud instead.
> Chrome, Edge and Safari all include English voices.

## Run it locally

You need [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npm run dev        # open the printed http://localhost:5173 link
```

Other commands:

```bash
npm test           # unit tests for the word and mole scheduling logic
npm run build      # production build in ./dist
npm run preview    # serve the production build locally
```

## Deploy to Vercel

**Option A: dashboard**

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com/new), choose **Add New → Project** and import the repository.
3. Vercel detects **Vite** automatically. Keep the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. You get a link you can open on laptops, tablets and phones.

**Option B: command line**

```bash
npm install -g vercel
vercel          # first deploy (follow the prompts)
vercel --prod   # production deploy
```

The game is a static site, so it also works on Netlify, GitHub Pages, or any static host. Upload the `dist` folder.

## Changing the settings

All the tuning lives in [`src/game/config.js`](src/game/config.js):

- `LEVEL_TIME_SECONDS` (60), `HITS_TO_PASS` (3), `POINTS_PER_HIT` (10)
- `MOLE_VISIBLE_MS` (2000), the rise and hide speeds, the spawn interval and the maximum number of moles at once
- `LEVELS`: target words, distractor lists and which letters are highlighted as silent

The maximum score updates automatically from these values.

## Project structure

```
src/
  App.jsx                 screen flow and score keeping
  game/config.js          levels, words and timings
  game/logic.js           shuffled distractor bag, target scheduling, hole picking
  audio/audioEngine.js    Web Audio sound effects and background music
  audio/speech.js         SpeechSynthesis voice selection and playback
  components/             screens (Start, Listen, Hunt, Level Complete, Time Up, End) and SVG art
  styles.css              all styling and animations (responsive, reduced-motion aware)
```

## Accessibility notes

- Every control is a real `<button>` with a visible focus ring. Moles can be whacked with Enter or Space.
- Large rounded touch targets, with pointer and touch support and no double-tap delay.
- Animations are gentle with no flashing. Users with *reduce motion* enabled get less movement and no confetti.
