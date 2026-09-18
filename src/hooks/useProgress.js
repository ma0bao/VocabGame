import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { loadLocal, saveLocal, mergeProgress, fetchRemote, pushRemote } from '../lib/progress';

// Owns player progress: local cache always, Supabase sync when signed in.
export function useProgress() {
  const [progress, setProgress] = useState(() => loadLocal());
  const [user, setUser] = useState(null);
  const [syncState, setSyncState] = useState(supabase ? 'local' : 'offline'); // local | syncing | synced | offline
  const pushTimer = useRef(null);
  const latest = useRef(progress);
  latest.current = progress;

  // Auth session
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // On sign-in: merge remote with local, then push the merged result.
  useEffect(() => {
    if (!user) {
      if (supabase) setSyncState('local');
      return;
    }
    let cancelled = false;
    setSyncState('syncing');
    fetchRemote(user.id).then(async (remote) => {
      if (cancelled) return;
      const merged = mergeProgress(latest.current, remote);
      setProgress(merged);
      saveLocal(merged);
      await pushRemote(user.id, merged);
      if (!cancelled) setSyncState('synced');
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const update = useCallback(
    (fn) => {
      setProgress((prev) => {
        const next = { ...fn(prev), updatedAt: Date.now() };
        saveLocal(next);
        if (user) {
          setSyncState('syncing');
          clearTimeout(pushTimer.current);
          pushTimer.current = setTimeout(async () => {
            await pushRemote(user.id, next);
            setSyncState('synced');
          }, 1500);
        }
        return next;
      });
    },
    [user]
  );

  // Flush a pending push when the tab is hidden.
  useEffect(() => {
    const flush = () => {
      if (user && pushTimer.current) {
        clearTimeout(pushTimer.current);
        pushTimer.current = null;
        pushRemote(user.id, latest.current);
      }
    };
    document.addEventListener('visibilitychange', flush);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', flush);
      window.removeEventListener('pagehide', flush);
    };
  }, [user]);

  return { progress, update, user, syncState };
}
