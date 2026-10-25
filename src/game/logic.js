import { MAX_SPAWNS_WITHOUT_TARGET, TARGET_CHANCE } from './config.js';

export function shuffle(list, random = Math.random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A shuffled "bag" of distractors: every word is used once before the bag is
// refilled, so pupils see a fair mix without an obvious pattern.
export function createDistractorBag(words, random = Math.random) {
  let bag = [];
  return {
    draw(exclude = []) {
      for (let attempt = 0; attempt < words.length * 2; attempt += 1) {
        if (bag.length === 0) bag = shuffle(words, random);
        const index = bag.findIndex((word) => !exclude.includes(word));
        if (index !== -1) return bag.splice(index, 1)[0];
        bag = [];
      }
      return words.find((word) => !exclude.includes(word)) ?? words[0];
    },
  };
}

// Decide whether the next mole should carry the target word.
// - never two target moles at the same time
// - the very first target is forced early (see firstTargetSpawn)
// - otherwise random, but forced after too many distractors in a row
export function shouldSpawnTarget({ targetVisible, spawnIndex, firstTargetSpawn, spawnsSinceTarget }, random = Math.random) {
  if (targetVisible) return false;
  if (spawnIndex === firstTargetSpawn) return true;
  if (spawnIndex < firstTargetSpawn) return false;
  if (spawnsSinceTarget >= MAX_SPAWNS_WITHOUT_TARGET) return true;
  return random() < TARGET_CHANCE;
}

export function pickHole(holes, lastHole, random = Math.random) {
  const empty = holes.map((mole, index) => (mole ? -1 : index)).filter((index) => index !== -1);
  if (empty.length === 0) return -1;
  const preferred = empty.length > 1 ? empty.filter((index) => index !== lastHole) : empty;
  return preferred[Math.floor(random() * preferred.length)];
}
