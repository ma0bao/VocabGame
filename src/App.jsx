import { useCallback, useEffect, useState } from 'react';
import { useProgress } from './hooks/useProgress';
import { supabase } from './lib/supabase';
import { todayKey, yesterdayKey, hasGuestProgress } from './lib/progress';
import { levelFromXp, unlockedFamilies, nextSchedule, newlyEarnedBadges, weekKey, WEEKLY_GOAL, dueWords } from './lib/game';
import Home from './components/Home';
import Lesson from './components/Lesson';
import Play from './components/Play';
import Summary from './components/Summary';
import Profile from './components/Profile';
import Welcome from './components/Welcome';
import Review from './components/Review';
import WordList from './components/WordList';

const NAV = [
  ['home', 'Tree', 'M4 20h16M12 20V4m0 0 5 5M12 4 7 9'],
  ['review', 'Review', 'M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5'],
  ['words', 'Words', 'M4 6h16M4 12h10M4 18h13'],
  ['profile', 'Me', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0'],
];

export default function App() {
  const { progress, update, resetAll, user, syncState } = useProgress();
  const [screen, setScreen] = useState({ name: 'home' });
  const [roundKey, setRoundKey] = useState(0);
  const [guest, setGuest] = useState(() => {
    try { return sessionStorage.getItem('rq-guest') === '1'; } catch { return false; }
  });

  const goHome = () => setScreen({ name: 'home' });
  const goLesson = (rootId) => setScreen({ name: 'lesson', rootId });
  const goTab = (name) => setScreen({ name });
  const goPlay = (familyId) => {
    setRoundKey((k) => k + 1);
    setScreen({
      name: 'play',
      familyId,
      before: { level: levelFromXp(progress.xp), unlocked: unlockedFamilies(progress).length, badges: Object.keys(progress.badges || {}) },
    });
  };

  useEffect(() => { window.scrollTo({ top: 0 }); }, [screen.name]);

  const markLearned = useCallback((rootId) => {
    if (progress.roots?.[rootId]?.learned) return;
    update((p) => ({ ...p, roots: { ...p.roots, [rootId]: { learned: true } } }));
  }, [progress.roots, update]);

  function onAnswer(target, correct, gained, { mode, combo, isReview }) {
    update((p) => {
      const today = todayKey();
      let streak = p.streak;
      if (p.lastPlay !== today) streak = p.lastPlay === yesterdayKey() ? streak + 1 : 1;
      const st = p.words[target.w] || { s: 0, n: 0, c: 0, iv: 0, due: 0 };
      const sched = nextSchedule(st, correct);
      const words = {
        ...p.words,
        [target.w]: { s: Math.max(0, Math.min(5, st.s + (correct ? 1 : -1))), n: st.n + 1, c: st.c + (correct ? 1 : 0), ...sched },
      };
      const wk = weekKey();
      const week = p.week?.key === wk ? { key: wk, xp: p.week.xp + gained } : { key: wk, xp: gained };
      const crossedWeekly = week.xp >= WEEKLY_GOAL && (p.week?.key !== wk || p.week.xp < WEEKLY_GOAL);
      const ms = p.modeStats?.[mode] || { n: 0, c: 0 };
      const next = {
        ...p,
        xp: p.xp + gained,
        streak,
        bestStreak: Math.max(p.bestStreak || 0, streak),
        bestCombo: Math.max(p.bestCombo || 0, combo),
        lastPlay: today,
        answered: (p.answered || 0) + 1,
        correct: (p.correct || 0) + (correct ? 1 : 0),
        reviews: (p.reviews || 0) + (isReview ? 1 : 0),
        recalls: (p.recalls || 0) + (mode === 'recall' && correct ? 1 : 0),
        weeklyGoalsHit: (p.weeklyGoalsHit || 0) + (crossedWeekly ? 1 : 0),
        week,
        modeStats: { ...p.modeStats, [mode]: { n: ms.n + 1, c: ms.c + (correct ? 1 : 0) } },
        words,
      };
      return next;
    });
  }

  function onFinish(round) {
    const perfect = round.results.length > 0 && round.results.every((r) => r.correct);
    // `progress` already reflects the last answer (the player clicked Continue after it rendered).
    const bumped = { ...progress, rounds: (progress.rounds || 0) + 1, perfectRounds: (progress.perfectRounds || 0) + (perfect ? 1 : 0) };
    const earned = newlyEarnedBadges(bumped);
    const badges = { ...bumped.badges };
    const now = new Date().toISOString();
    for (const b of earned) badges[b.id] = now;
    update((p) => ({ ...p, rounds: bumped.rounds, perfectRounds: bumped.perfectRounds, badges: { ...p.badges, ...badges } }));
    const after = { level: levelFromXp(progress.xp), unlocked: unlockedFamilies(progress) };
    const newlyUnlocked = after.unlocked.length > screen.before.unlocked ? after.unlocked[after.unlocked.length - 1] : null;
    setScreen({ name: 'summary', round, familyId: screen.familyId, newlyUnlocked, leveledUp: after.level > screen.before.level, newBadges: earned.map((b) => b.id) });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setGuest(false);
    try { sessionStorage.removeItem('rq-guest'); } catch { /* ignore */ }
    goHome();
  }
  function playAsGuest() {
    setGuest(true);
    try { sessionStorage.setItem('rq-guest', '1'); } catch { /* ignore */ }
  }

  if (user === undefined) return <div className="app"><div className="wrap muted">Loading…</div></div>;
  if (!user && !guest && supabase) return <Welcome onGuest={playAsGuest} hasGuest={hasGuestProgress()} />;

  const inRound = screen.name === 'play';
  const due = dueWords(progress).length;
  const tab = screen.name === 'lesson' || screen.name === 'summary' ? 'home' : screen.name;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" onClick={goHome} aria-label="RootQuest home">
            <span className="logo">Rq</span>RootQuest
          </button>
          <div className="stats">
            <span className="stat streak" title="Day streak">🔥 {progress.streak}</span>
            <span className="stat xp" title="Total XP">★ {progress.xp}</span>
            <button className="avatar-btn" onClick={() => goTab('profile')} aria-label="Profile">
              {(progress.name || user?.email || 'G')[0].toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {screen.name === 'home' && (
          <Home progress={progress} onPlay={goPlay} onLesson={goLesson} onReview={() => goTab('review')} due={due} />
        )}
        {screen.name === 'lesson' && (
          <Lesson rootId={screen.rootId} progress={progress} onBack={goHome} onPlay={goPlay} onLesson={goLesson} markLearned={markLearned} />
        )}
        {screen.name === 'play' && (
          <Play key={roundKey} progress={progress} familyId={screen.familyId} onAnswer={onAnswer} onFinish={onFinish} onQuit={goHome} />
        )}
        {screen.name === 'summary' && (
          <Summary
            round={screen.round}
            progress={progress}
            familyId={screen.familyId}
            newlyUnlocked={screen.newlyUnlocked}
            leveledUp={screen.leveledUp}
            newBadges={screen.newBadges || []}
            onPlayAgain={() => goPlay(screen.familyId)}
            onReview={() => goPlay('review')}
            onHome={goHome}
          />
        )}
        {screen.name === 'review' && <Review progress={progress} onPlay={goPlay} onLesson={goLesson} />}
        {screen.name === 'words' && <WordList progress={progress} onLesson={goLesson} />}
        {screen.name === 'profile' && (
          <Profile
            user={user}
            progress={progress}
            syncState={syncState}
            onReset={() => { resetAll(); goHome(); }}
            onSetName={(name) => update((p) => ({ ...p, name }))}
            onSignOut={signOut}
          />
        )}
      </main>

      {!inRound && (
        <nav className="bottom-nav" aria-label="Main">
          {NAV.map(([id, label, d]) => (
            <button key={id} className={`nav-btn ${tab === id ? 'on' : ''}`} onClick={() => goTab(id)} aria-current={tab === id ? 'page' : undefined}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
              <span>{label}</span>
              {id === 'review' && due > 0 && <i className="nav-badge">{due > 99 ? '99+' : due}</i>}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
