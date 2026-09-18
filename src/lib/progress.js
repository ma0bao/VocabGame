// Player progress: shape, local cache, merge, and Supabase sync.
import { supabase } from './supabase';

const LOCAL_KEY = 'rootquest-progress-v1';

export function emptyProgress() {
  return {
    xp: 0,
    streak: 0,
    bestStreak: 0,
    lastPlay: null, // 'YYYY-MM-DD'
    answered: 0,
    correct: 0,
    words: {}, // word -> { s: score 0..5, n: times seen, c: times correct }
    roots: {}, // rootId -> { learned: true }
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

export function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return emptyProgress();
    return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch {
    return emptyProgress();
  }
}

export function saveLocal(p) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable; ignore */
  }
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
  const roots = { ...(a.roots || {}), ...(b.roots || {}) };
  return {
    ...newer,
    xp: Math.max(a.xp, b.xp),
    bestStreak: Math.max(a.bestStreak || 0, b.bestStreak || 0),
    answered: Math.max(a.answered || 0, b.answered || 0),
    correct: Math.max(a.correct || 0, b.correct || 0),
    words,
    roots,
  };
}

export async function fetchRemote(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('progress')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();
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
