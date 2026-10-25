// Central game settings. Adjust these to tune difficulty.
export const LEVEL_TIME_SECONDS = 60;
export const HITS_TO_PASS = 3;
export const POINTS_PER_HIT = 10;
export const HOLE_COUNT = 6;

// Mole timing (milliseconds)
export const MOLE_RISE_MS = 450; // gentle rise out of the hole
export const MOLE_VISIBLE_MS = 2000; // time fully visible and readable
export const MOLE_HIDE_MS = 400; // gentle sink back into the hole
export const HIT_REACTION_MS = 600; // smile / dizzy face before disappearing
export const SPAWN_INTERVAL_MS = 1000;
export const FIRST_SPAWN_DELAY_MS = 500;
export const MAX_ACTIVE_MOLES = 3;

// Target scheduling
export const TARGET_CHANCE = 0.35; // chance that a normal spawn is the target
export const MAX_SPAWNS_WITHOUT_TARGET = 3; // force the target after this many distractors
export const FIRST_TARGET_DEADLINE_MS = 3000; // a target must appear before this

export const POPUP_MS = 1000;

export const LEVELS = [
  {
    word: 'night',
    silentLabel: 'silent G',
    silentIndexes: [2],
    distractors: ['light', 'right', 'knight', 'nice', 'net', 'nine', 'neat', 'nest'],
  },
  {
    word: 'knee',
    silentLabel: 'silent K',
    silentIndexes: [0],
    distractors: ['know', 'knife', 'key', 'need', 'keen', 'king', 'neck', 'knot'],
  },
  {
    word: 'straight',
    silentLabel: 'silent GH',
    silentIndexes: [5, 6],
    distractors: ['street', 'strength', 'strange', 'stretch', 'string', 'stripe', 'start', 'station'],
  },
];

export const MAX_SCORE = LEVELS.length * HITS_TO_PASS * POINTS_PER_HIT;
