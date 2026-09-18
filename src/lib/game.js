// Game rules: mastery, unlocks, levels, and question generation.
import { words } from '../data/words';
import { families, glossary, rootToFamily } from '../data/parts';

export const MASTERED_AT = 3; // word score at which it counts as mastered (max 5)
export const UNLOCK_AT = 0.5; // family mastery needed to open the next family
export const ROUND_LENGTH = 10;
export const XP_CORRECT = 10;
export const XP_COMBO = 5; // bonus per correct answer while on a 3+ combo

export const wordsByRoot = {};
export const wordsByFamily = {};
for (const w of words) {
  (wordsByRoot[w.r] ||= []).push(w);
  (wordsByFamily[rootToFamily[w.r]] ||= []).push(w);
}
export const wordIndex = Object.fromEntries(words.map((w) => [w.w, w]));

export function wordScore(progress, w) {
  return progress.words[w]?.s ?? 0;
}

function masteryOf(list, progress) {
  if (!list.length) return 0;
  const total = list.reduce((acc, w) => acc + Math.min(wordScore(progress, w.w), MASTERED_AT) / MASTERED_AT, 0);
  return total / list.length;
}

export function rootMastery(progress, rootId) {
  return masteryOf(wordsByRoot[rootId] || [], progress);
}

export function familyMastery(progress, familyId) {
  return masteryOf(wordsByFamily[familyId] || [], progress);
}

export function isFamilyUnlocked(progress, familyId) {
  const idx = families.findIndex((f) => f.id === familyId);
  if (idx <= 0) return true;
  return familyMastery(progress, families[idx - 1].id) >= UNLOCK_AT;
}

export function unlockedFamilies(progress) {
  return families.filter((f) => isFamilyUnlocked(progress, f.id));
}

export function masteredCount(progress) {
  return words.filter((w) => wordScore(progress, w.w) >= MASTERED_AT).length;
}

// ----- Levels -----
// XP needed to reach level n (n >= 1): 0, 60, 180, 360, 600, ... = 60 * n(n-1)/2
export function xpForLevel(n) {
  return 60 * ((n * (n - 1)) / 2);
}
export function levelFromXp(xp) {
  let n = 1;
  while (xpForLevel(n + 1) <= xp) n++;
  return n;
}
export function levelProgress(xp) {
  const lvl = levelFromXp(xp);
  const lo = xpForLevel(lvl);
  const hi = xpForLevel(lvl + 1);
  return { level: lvl, into: xp - lo, span: hi - lo, next: hi };
}

export const LEVEL_TITLES = [
  'Word Sprout',
  'Root Digger',
  'Prefix Pilot',
  'Suffix Sleuth',
  'Lexicon Explorer',
  'Etymology Ace',
  'Vocab Virtuoso',
  'Word Wizard',
  'Grand Logophile',
  'SAT Legend',
];
export function levelTitle(level) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

// ----- Question generation -----
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pick(arr, n, exclude = () => false) {
  return shuffle(arr.filter((x) => !exclude(x))).slice(0, n);
}

// Weighted pick: unseen and low-score words come up more often.
function chooseWords(pool, progress, n) {
  const weighted = pool.map((w) => {
    const st = progress.words[w.w];
    const s = st?.s ?? 0;
    const weight = st ? Math.max(1, 6 - s) : 8;
    return { w, weight };
  });
  const out = [];
  const remaining = [...weighted];
  while (out.length < n && remaining.length) {
    const total = remaining.reduce((a, x) => a + x.weight, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (; idx < remaining.length; idx++) {
      r -= remaining[idx].weight;
      if (r <= 0) break;
    }
    const [chosen] = remaining.splice(Math.min(idx, remaining.length - 1), 1);
    out.push(chosen.w);
  }
  return out;
}

const otherWords = (target, pool, samePos = true) =>
  pool.filter((x) => x.w !== target.w && (!samePos || x.pos === target.pos));

function fillFrom(primary, fallback, n, target, samePos) {
  let picks = pick(otherWords(target, primary, samePos), n);
  if (picks.length < n) {
    const have = new Set(picks.map((x) => x.w));
    picks = picks.concat(pick(otherWords(target, fallback, samePos), n - picks.length, (x) => have.has(x.w)));
  }
  if (picks.length < n) {
    const have = new Set(picks.map((x) => x.w));
    picks = picks.concat(pick(otherWords(target, fallback, false), n - picks.length, (x) => have.has(x.w)));
  }
  return picks;
}

export function makeQuestion(target, familyPool, mode) {
  const family = familyPool;
  const all = words;
  if (mode === 'define') {
    const distractors = fillFrom(family, all, 3, target, true);
    const options = shuffle([target, ...distractors]).map((x) => ({ label: x.d, word: x.w }));
    return { mode, target, prompt: target.w, options, answer: target.w };
  }
  if (mode === 'sentence') {
    const distractors = fillFrom(family, all, 3, target, true);
    const options = shuffle([target, ...distractors]).map((x) => ({ label: x.w, word: x.w }));
    return { mode, target, prompt: target.s, options, answer: target.w };
  }
  if (mode === 'decode') {
    // Different roots so the root chip is a real clue.
    const differentRoot = (x) => x.r !== target.r;
    let distractors = pick(family.filter((x) => x.w !== target.w && differentRoot(x)), 3);
    if (distractors.length < 3) {
      const have = new Set(distractors.map((x) => x.w));
      distractors = distractors.concat(
        pick(all.filter((x) => x.w !== target.w && differentRoot(x) && !have.has(x.w)), 3 - distractors.length)
      );
    }
    const options = shuffle([target, ...distractors]).map((x) => ({ label: x.w, word: x.w }));
    const parts = target.p.map((id) => ({ id, ...glossary[id] }));
    return { mode, target, parts, options, answer: target.w };
  }
  // 'root': which meaning does the root carry?
  const root = glossary[target.r];
  const otherRoots = Object.keys(rootToFamily).filter((r) => r !== target.r && glossary[r].meaning !== root.meaning);
  const distractors = pick(otherRoots, 3).map((r) => ({ label: glossary[r].meaning, word: r }));
  const options = shuffle([{ label: root.meaning, word: target.r }, ...distractors]);
  return { mode, target, rootId: target.r, rootForm: root.form, options, answer: target.r };
}

const MODE_WEIGHTS = [
  ['define', 3],
  ['sentence', 3],
  ['decode', 3],
  ['root', 1],
];
function pickMode(prev) {
  const total = MODE_WEIGHTS.reduce((a, [, w]) => a + w, 0);
  let r = Math.random() * total;
  for (const [m, w] of MODE_WEIGHTS) {
    r -= w;
    if (r <= 0) return m === prev ? pickMode(prev === 'define' ? 'sentence' : 'define') : m;
  }
  return 'define';
}

export function buildRound(progress, familyId) {
  const pool = familyId === 'mix'
    ? unlockedFamilies(progress).flatMap((f) => wordsByFamily[f.id])
    : wordsByFamily[familyId];
  const targets = chooseWords(pool, progress, Math.min(ROUND_LENGTH, pool.length));
  let prev = null;
  return targets.map((t) => {
    const mode = pickMode(prev);
    prev = mode;
    return makeQuestion(t, pool, mode);
  });
}

export function breakdownText(w) {
  return w.p.map((id) => glossary[id].meaning.split(',')[0]).join(' + ');
}
