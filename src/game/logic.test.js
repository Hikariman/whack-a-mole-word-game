import { describe, expect, it } from 'vitest';
import { createDistractorBag, pickHole, shouldSpawnTarget, shuffle } from './logic.js';
import { FIRST_SPAWN_DELAY_MS, FIRST_TARGET_DEADLINE_MS, LEVELS, MAX_SCORE, SPAWN_INTERVAL_MS } from './config.js';

describe('shuffle', () => {
  it('keeps every item', () => {
    expect(shuffle([1, 2, 3, 4]).sort()).toEqual([1, 2, 3, 4]);
  });
});

describe('distractor bag', () => {
  it('uses every word once before repeating', () => {
    const words = LEVELS[0].distractors;
    const bag = createDistractorBag(words);
    const drawn = words.map(() => bag.draw());
    expect([...drawn].sort()).toEqual([...words].sort());
  });

  it('never returns a word that is already on screen', () => {
    const bag = createDistractorBag(['a', 'b', 'c']);
    for (let i = 0; i < 30; i += 1) expect(['a', 'b']).not.toContain(bag.draw(['a', 'b']));
  });
});

describe('target scheduling', () => {
  it('never shows two targets at once', () => {
    expect(shouldSpawnTarget({ targetVisible: true, spawnIndex: 0, firstTargetSpawn: 0, spawnsSinceTarget: 9 })).toBe(false);
  });

  it('forces the first target on its scheduled spawn', () => {
    expect(shouldSpawnTarget({ targetVisible: false, spawnIndex: 1, firstTargetSpawn: 1, spawnsSinceTarget: 1 }, () => 0.99)).toBe(true);
  });

  it('forces a target after too many distractors', () => {
    expect(shouldSpawnTarget({ targetVisible: false, spawnIndex: 8, firstTargetSpawn: 0, spawnsSinceTarget: 3 }, () => 0.99)).toBe(true);
  });

  it('schedules the first target within three seconds', () => {
    // firstTargetSpawn is 0 or 1 in HuntScreen
    expect(FIRST_SPAWN_DELAY_MS + SPAWN_INTERVAL_MS).toBeLessThan(FIRST_TARGET_DEADLINE_MS);
  });
});

describe('pickHole', () => {
  it('only picks empty holes', () => {
    const holes = [{}, null, {}, {}, {}, {}];
    expect(pickHole(holes, -1)).toBe(1);
  });

  it('returns -1 when the garden is full', () => {
    expect(pickHole([{}, {}, {}, {}, {}, {}], -1)).toBe(-1);
  });
});

describe('levels', () => {
  it('never lists the target word as a distractor', () => {
    LEVELS.forEach((level) => expect(level.distractors).not.toContain(level.word));
  });

  it('has a maximum score of 90 (3 levels x 3 hits x 10)', () => {
    expect(MAX_SCORE).toBe(90);
  });
});
