// Player progress: shape, per-account local cache, merge, and Supabase sync.
import { supabase } from './supabase';

const KEY_PREFIX = 'rootquest-progress-v2:';
const GUEST = 'guest';

export function emptyProgress() {
  return {
    name: '',
    xp: 0,
    streak: 0,
    bestStreak: 0,
    bestCombo: 0,
    lastPlay: null, // 'YYYY-MM-DD'
    answered: 0,
    correct: 0,
    rounds: 0,
    perfectRounds: 0,
    reviews: 0,
    recalls: 0,
    weeklyGoalsHit: 0,
    week: { key: null, xp: 0 },
    modeStats: {}, // mode -> { n, c }
    words: {}, // word -> { s, n, c, iv, due }
    roots: {}, // rootId -> { learned: true }
    badges: {}, // badgeId -> ISO date
    updatedAt: 0,
  };
}

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayKey(d);
}

const keyFor = (uid) => KEY_PREFIX + (uid || GUEST);

export function loadLocal(uid) {
  try {
    const raw = localStorage.getItem(keyFor(uid));
    if (raw) return { ...emptyProgress(), ...JSON.parse(raw) };
    // migrate the v1 single-slot cache into the guest slot once
    if (!uid) {
      const old = localStorage.getItem('rootquest-progress-v1');
      if (old) {
        const p = { ...emptyProgress(), ...JSON.parse(old) };
        localStorage.removeItem('rootquest-progress-v1');
        saveLocal(uid, p);
        return p;
      }
    }
  } catch {
    /* storage unavailable */
  }
  return emptyProgress();
}

export function saveLocal(uid, p) {
  try {
    localStorage.setItem(keyFor(uid), JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function clearLocal(uid) {
  try {
    localStorage.removeItem(keyFor(uid));
  } catch {
    /* ignore */
  }
}

export function hasGuestProgress() {
  const g = loadLocal(null);
  return g.answered > 0;
}

// Merge two progress objects so that no learning is lost from either device.
export function mergeProgress(a, b) {
  if (!a) return b;
  if (!b) return a;
  const newer = a.updatedAt >= b.updatedAt ? a : b;
  const words = { ...a.words };
  for (const [w, st] of Object.entries(b.words || {})) {
    const cur = words[w];
    if (!cur || st.n > cur.n || (st.n === cur.n && st.s > cur.s)) words[w] = st;
  }
  const max = (k) => Math.max(a[k] || 0, b[k] || 0);
  return {
    ...newer,
    name: newer.name || a.name || b.name || '',
    xp: max('xp'),
    bestStreak: max('bestStreak'),
    bestCombo: max('bestCombo'),
    answered: max('answered'),
    correct: max('correct'),
    rounds: max('rounds'),
    perfectRounds: max('perfectRounds'),
    reviews: max('reviews'),
    recalls: max('recalls'),
    weeklyGoalsHit: max('weeklyGoalsHit'),
    words,
    roots: { ...(a.roots || {}), ...(b.roots || {}) },
    badges: { ...(a.badges || {}), ...(b.badges || {}) },
  };
}

export async function fetchRemote(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('progress').select('data').eq('user_id', userId).maybeSingle();
  if (error) {
    console.warn('progress fetch failed', error.message);
    return null;
  }
  return data ? { ...emptyProgress(), ...data.data } : null;
}

export async function pushRemote(userId, p) {
  if (!supabase) return;
  const { error } = await supabase
    .from('progress')
    .upsert({ user_id: userId, data: p, updated_at: new Date().toISOString() });
  if (error) console.warn('progress save failed', error.message);
}
