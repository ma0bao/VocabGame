// Game rules: mastery, spaced repetition, unlocks, levels, question generation, badges.
import { words } from '../data/words';
import { families, glossary, rootToFamily } from '../data/parts';

export const MASTERED_AT = 3; // word score at which it counts as mastered (max 5)
export const UNLOCK_AT = 0.5; // family mastery needed to open the next family
export const ROUND_LENGTH = 10;
export const NEW_PER_ROUND = 3; // new words introduced (with a learn card) per round
export const XP_CORRECT = 10;
export const XP_COMBO = 5; // bonus per correct answer while on a 3+ combo
export const XP_HARD = 5; // bonus for the harder modes
export const WEEKLY_GOAL = 500;

const DAY = 86400000;

export const wordsByRoot = {};
export const wordsByFamily = {};
for (const w of words) {
  (wordsByRoot[w.r] ||= []).push(w);
  (wordsByFamily[rootToFamily[w.r]] ||= []).push(w);
}
export const wordIndex = Object.fromEntries(words.map((w) => [w.w, w]));

export function wordState(progress, w) {
  return progress.words[w] || { s: 0, n: 0, c: 0, iv: 0, due: 0 };
}
export function wordScore(progress, w) {
  return wordState(progress, w).s;
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
export function seenCount(progress) {
  return words.filter((w) => wordState(progress, w.w).n > 0).length;
}

// ----- Spaced repetition -----
// Each word carries an interval (days) and a due timestamp. Correct answers
// stretch the interval; a miss resets it so the word comes back soon.
export function nextSchedule(prev, correct, now = Date.now()) {
  const iv = prev.iv || 0;
  if (!correct) return { iv: 0, due: now + 10 * 60 * 1000 };
  const nextIv = iv === 0 ? 1 : Math.min(60, Math.round(iv * 2.3));
  return { iv: nextIv, due: now + nextIv * DAY };
}
export function dueWords(progress, now = Date.now()) {
  return words.filter((w) => {
    const st = progress.words[w.w];
    return st && st.n > 0 && (st.due || 0) <= now;
  });
}
export function weakWords(progress, n = 8) {
  return words
    .map((w) => ({ w, st: wordState(progress, w.w) }))
    .filter((x) => x.st.n >= 2)
    .map((x) => ({ w: x.w, acc: x.st.c / x.st.n, n: x.st.n, s: x.st.s }))
    .filter((x) => x.acc < 0.7)
    .sort((a, b) => a.acc - b.acc || a.s - b.s)
    .slice(0, n);
}

// ----- Levels -----
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
  'Word Sprout', 'Root Digger', 'Prefix Pilot', 'Suffix Sleuth', 'Lexicon Explorer',
  'Etymology Ace', 'Vocab Virtuoso', 'Word Wizard', 'Grand Logophile', 'SAT Legend',
];
export function levelTitle(level) {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

// ----- Weekly goal -----
export function weekKey(d = new Date()) {
  // ISO-ish week: Monday-based
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}
export function weekXp(progress) {
  return progress.week?.key === weekKey() ? progress.week.xp : 0;
}

// ----- Badges -----
export const BADGES = [
  { id: 'first-round', name: 'First steps', desc: 'Finish your first round.', test: (p) => (p.rounds || 0) >= 1 },
  { id: 'perfect', name: 'Flawless', desc: 'Get 10 out of 10 in a round.', test: (p) => (p.perfectRounds || 0) >= 1 },
  { id: 'combo5', name: 'On fire', desc: 'Hit a 5-answer combo.', test: (p) => (p.bestCombo || 0) >= 5 },
  { id: 'streak3', name: 'Three-peat', desc: 'Play three days in a row.', test: (p) => (p.bestStreak || 0) >= 3 },
  { id: 'streak7', name: 'Week warrior', desc: 'Play seven days in a row.', test: (p) => (p.bestStreak || 0) >= 7 },
  { id: 'streak30', name: 'Habit formed', desc: 'Play thirty days in a row.', test: (p) => (p.bestStreak || 0) >= 30 },
  { id: 'words25', name: 'Getting going', desc: 'Master 25 words.', test: (p) => masteredCount(p) >= 25 },
  { id: 'words100', name: 'Century', desc: 'Master 100 words.', test: (p) => masteredCount(p) >= 100 },
  { id: 'words200', name: 'Heavyweight', desc: 'Master 200 words.', test: (p) => masteredCount(p) >= 200 },
  { id: 'all-words', name: 'Lexicon complete', desc: `Master all ${words.length} words.`, test: (p) => masteredCount(p) >= words.length },
  { id: 'branch1', name: 'First branch', desc: 'Fully master a branch of the tree.', test: (p) => families.some((f) => familyMastery(p, f.id) >= 1) },
  { id: 'branch-all', name: 'Whole tree', desc: 'Unlock every branch.', test: (p) => unlockedFamilies(p).length === families.length },
  { id: 'review50', name: 'Spaced out', desc: 'Answer 50 review questions.', test: (p) => (p.reviews || 0) >= 50 },
  { id: 'recall10', name: 'Total recall', desc: 'Type 10 words correctly from memory.', test: (p) => (p.recalls || 0) >= 10 },
  { id: 'level5', name: 'Lexicon Explorer', desc: 'Reach level 5.', test: (p) => levelFromXp(p.xp) >= 5 },
  { id: 'level10', name: 'SAT Legend', desc: 'Reach level 10.', test: (p) => levelFromXp(p.xp) >= 10 },
  { id: 'weekly', name: 'Goal getter', desc: `Hit the ${WEEKLY_GOAL} XP weekly goal.`, test: (p) => (p.weeklyGoalsHit || 0) >= 1 },
];
export function newlyEarnedBadges(progress) {
  const have = progress.badges || {};
  return BADGES.filter((b) => !have[b.id] && b.test(progress));
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

export const MODE_META = {
  define: { label: 'Define it', color: 'var(--grape)', ask: 'What does this word mean?', hard: false },
  sentence: { label: 'Fill the blank', color: 'var(--sky)', ask: 'Which word completes the sentence?', hard: false },
  decode: { label: 'Decode the parts', color: 'var(--coral)', ask: 'Which word do these parts build?', hard: false },
  root: { label: 'Root check', color: 'var(--sun-deep)', ask: 'What does the highlighted root mean?', hard: false },
  context: { label: 'Words in context', color: 'var(--grape-deep)', ask: 'As used in the sentence, the word most nearly means', hard: true },
  antonym: { label: 'Opposite', color: 'var(--coral-deep)', ask: 'Which word means the opposite?', hard: true },
  recall: { label: 'Type it', color: 'var(--mint-deep)', ask: 'Type the word that fits this definition.', hard: true },
};

export function makeQuestion(target, familyPool, mode) {
  const family = familyPool;
  const all = words;
  if (mode === 'define') {
    const distractors = fillFrom(family, all, 3, target, true);
    const options = shuffle([target, ...distractors]).map((x) => ({ label: x.d, word: x.w }));
    return { mode, target, options, answer: target.w };
  }
  if (mode === 'sentence') {
    const distractors = fillFrom(family, all, 3, target, true);
    const options = shuffle([target, ...distractors]).map((x) => ({ label: x.w, word: x.w }));
    return { mode, target, options, answer: target.w };
  }
  if (mode === 'decode') {
    const differentRoot = (x) => x.r !== target.r;
    let distractors = pick(family.filter((x) => x.w !== target.w && differentRoot(x)), 3);
    if (distractors.length < 3) {
      const have = new Set(distractors.map((x) => x.w));
      distractors = distractors.concat(
        pick(all.filter((x) => x.w !== target.w && differentRoot(x) && !have.has(x.w)), 3 - distractors.length)
      );
    }
    const options = shuffle([target, ...distractors]).map((x) => ({ label: x.w, word: x.w }));
    return { mode, target, options, answer: target.w };
  }
  if (mode === 'context') {
    // SAT "most nearly means": synonym of target vs synonyms of other words (same part of speech).
    const distractors = fillFrom(family, all, 3, target, true).filter((x) => x.syn[0] !== target.syn[0]);
    const options = shuffle([target, ...distractors.slice(0, 3)]).map((x) => ({ label: x.syn[0], word: x.w }));
    return { mode, target, options, answer: target.w };
  }
  if (mode === 'antonym') {
    // Options are antonyms; the right one is the target's. Distractors: antonyms of other words, plus one synonym trap.
    const others = fillFrom(family.filter((x) => x.ant.length), all.filter((x) => x.ant.length), 2, target, true);
    const trap = { label: target.syn[0], word: '__syn__' };
    const options = shuffle([{ label: target.ant[0], word: target.w }, ...others.map((x) => ({ label: x.ant[0], word: x.w })), trap]);
    return { mode, target, options, answer: target.w };
  }
  if (mode === 'recall') {
    return { mode, target, options: [], answer: target.w, hint: target.w[0] + '_'.repeat(target.w.length - 1) };
  }
  // 'root'
  const root = glossary[target.r];
  const otherRoots = Object.keys(rootToFamily).filter((r) => r !== target.r && glossary[r].meaning !== root.meaning);
  const distractors = pick(otherRoots, 3).map((r) => ({ label: glossary[r].meaning, word: r }));
  const options = shuffle([{ label: root.meaning, word: target.r }, ...distractors]);
  return { mode, target, rootId: target.r, rootForm: root.form, options, answer: target.r };
}

function pickMode(target, st, prev) {
  // New or shaky words: recognition modes. Solid words: SAT-style and recall modes.
  const easy = [['define', 3], ['sentence', 3], ['decode', 3], ['root', 1]];
  const hard = [['context', 4], ['sentence', 2], ['recall', 2], ['decode', 1]];
  if (target.ant.length) hard.push(['antonym', 2]);
  const table = st.s >= 2 ? hard : easy;
  const filtered = table.filter(([m]) => m !== prev);
  const total = filtered.reduce((a, [, w]) => a + w, 0);
  let r = Math.random() * total;
  for (const [m, w] of filtered) {
    r -= w;
    if (r <= 0) return m;
  }
  return filtered[0][0];
}

// Weighted pick: low-score and due words come up more often.
function chooseWords(pool, progress, n, now) {
  const weighted = pool.map((w) => {
    const st = progress.words[w.w];
    let weight;
    if (!st) weight = 0; // unseen words are introduced via learn cards, not picked here
    else if ((st.due || 0) <= now) weight = 8;
    else weight = Math.max(1, 5 - st.s);
    return { w, weight };
  }).filter((x) => x.weight > 0);
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

// Build a round: learn cards for up to NEW_PER_ROUND unseen words, then ROUND_LENGTH questions.
// kind: 'family' (familyId), 'mix' (all unlocked), 'review' (due words only)
export function buildRound(progress, familyId) {
  const now = Date.now();
  let pool;
  let newWords = [];
  if (familyId === 'review') {
    pool = dueWords(progress, now);
    if (pool.length < 4) pool = unlockedFamilies(progress).flatMap((f) => wordsByFamily[f.id]);
  } else {
    pool = familyId === 'mix' ? unlockedFamilies(progress).flatMap((f) => wordsByFamily[f.id]) : wordsByFamily[familyId];
    const unseen = pool.filter((w) => !progress.words[w.w]);
    // Introduce new words in root order so a learner meets a root's words together.
    newWords = unseen.slice(0, NEW_PER_ROUND);
  }
  const questionsNeeded = Math.min(ROUND_LENGTH, pool.length);
  let targets = chooseWords(pool, progress, questionsNeeded - newWords.length, now);
  // Each new word gets asked once (easy mode) at a random spot after its learn card.
  const items = newWords.map((w) => ({ type: 'learn', target: w }));
  let prev = null;
  const qs = [...newWords, ...shuffle(targets)];
  const seenInRound = new Set();
  for (const t of qs) {
    const st = wordState(progress, t.w);
    const mode = st.n === 0 ? pickMode(t, { s: 0 }, prev) : pickMode(t, st, prev);
    prev = mode;
    seenInRound.add(t.w);
    items.push({ type: 'q', ...makeQuestion(t, pool, mode) });
  }
  // Keep learn cards up front, questions after (new words' questions are first so the card is fresh).
  return { items, familyId, isReview: familyId === 'review' };
}

export function breakdownText(w) {
  return w.p.map((id) => glossary[id].meaning.split(',')[0]).join(' + ');
}

export function normalizeAnswer(s) {
  return s.trim().toLowerCase().replace(/[^a-z]/g, '');
}
