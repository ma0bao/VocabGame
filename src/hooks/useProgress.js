import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  loadLocal, saveLocal, clearLocal, mergeProgress, fetchRemote, pushRemote, emptyProgress,
} from '../lib/progress';

// Owns player progress: a local cache per account (guest or user id) plus Supabase sync when signed in.
export function useProgress() {
  const [user, setUser] = useState(undefined); // undefined = unknown yet, null = signed out
  const [progress, setProgress] = useState(() => loadLocal(null));
  const [syncState, setSyncState] = useState(supabase ? 'local' : 'offline'); // local | syncing | synced | offline
  const pushTimer = useRef(null);
  const latest = useRef(progress);
  latest.current = progress;
  const uidRef = useRef(null);

  // Auth session
  useEffect(() => {
    if (!supabase) {
      setUser(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // When the signed-in account changes: swap to that account's cache, merge with remote.
  useEffect(() => {
    if (user === undefined) return;
    const uid = user?.id ?? null;
    uidRef.current = uid;
    if (!uid) {
      setProgress(loadLocal(null));
      if (supabase) setSyncState('local');
      return;
    }
    let cancelled = false;
    setSyncState('syncing');
    const local = loadLocal(uid);
    fetchRemote(uid).then(async (remote) => {
      if (cancelled) return;
      let merged = mergeProgress(local, remote);
      // First sign-in on this device with nothing on the account: bring guest progress along.
      if (!remote && local.answered === 0) {
        const guest = loadLocal(null);
        if (guest.answered > 0) {
          merged = mergeProgress(merged, guest);
          clearLocal(null);
        }
      }
      merged.updatedAt = Date.now();
      setProgress(merged);
      saveLocal(uid, merged);
      await pushRemote(uid, merged);
      if (!cancelled) setSyncState('synced');
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const update = useCallback((fn) => {
    setProgress((prev) => {
      const next = { ...fn(prev), updatedAt: Date.now() };
      const uid = uidRef.current;
      saveLocal(uid, next);
      if (uid) {
        setSyncState('syncing');
        clearTimeout(pushTimer.current);
        pushTimer.current = setTimeout(async () => {
          pushTimer.current = null;
          await pushRemote(uid, next);
          setSyncState('synced');
        }, 1500);
      }
      return next;
    });
  }, []);

  const resetAll = useCallback(async () => {
    const uid = uidRef.current;
    const fresh = { ...emptyProgress(), name: latest.current.name, updatedAt: Date.now() };
    setProgress(fresh);
    saveLocal(uid, fresh);
    if (uid) await pushRemote(uid, fresh);
  }, []);

  // Flush a pending push when the tab is hidden.
  useEffect(() => {
    const flush = () => {
      const uid = uidRef.current;
      if (uid && pushTimer.current) {
        clearTimeout(pushTimer.current);
        pushTimer.current = null;
        pushRemote(uid, latest.current);
      }
    };
    document.addEventListener('visibilitychange', flush);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', flush);
      window.removeEventListener('pagehide', flush);
    };
  }, []);

  return { progress, update, resetAll, user, syncState };
}
