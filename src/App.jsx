import { useCallback, useState } from 'react';
import { useProgress } from './hooks/useProgress';
import { emptyProgress, todayKey, yesterdayKey } from './lib/progress';
import { levelFromXp, unlockedFamilies } from './lib/game';
import Home from './components/Home';
import Lesson from './components/Lesson';
import Play from './components/Play';
import Summary from './components/Summary';
import Account from './components/Account';

export default function App() {
  const { progress, update, user, syncState } = useProgress();
  const [screen, setScreen] = useState({ name: 'home' });
  const [roundKey, setRoundKey] = useState(0);

  const goHome = () => setScreen({ name: 'home' });
  const goLesson = (rootId) => setScreen({ name: 'lesson', rootId });
  const goAccount = () => setScreen({ name: 'account' });
  const goPlay = (familyId) => {
    setRoundKey((k) => k + 1);
    setScreen({
      name: 'play',
      familyId,
      before: { level: levelFromXp(progress.xp), unlocked: unlockedFamilies(progress).length },
    });
  };

  const markLearned = useCallback(
    (rootId) => {
      if (progress.roots?.[rootId]?.learned) return;
      update((p) => ({ ...p, roots: { ...p.roots, [rootId]: { learned: true } } }));
    },
    [progress.roots, update]
  );

  function onAnswer(target, correct, gained) {
    update((p) => {
      const today = todayKey();
      let streak = p.streak;
      if (p.lastPlay !== today) streak = p.lastPlay === yesterdayKey() ? streak + 1 : 1;
      const st = p.words[target.w] || { s: 0, n: 0, c: 0 };
      const words = {
        ...p.words,
        [target.w]: { s: Math.max(0, Math.min(5, st.s + (correct ? 1 : -1))), n: st.n + 1, c: st.c + (correct ? 1 : 0) },
      };
      return {
        ...p,
        xp: p.xp + gained,
        streak,
        bestStreak: Math.max(p.bestStreak || 0, streak),
        lastPlay: today,
        answered: (p.answered || 0) + 1,
        correct: (p.correct || 0) + (correct ? 1 : 0),
        words,
      };
    });
  }

  function onFinish(round) {
    const after = { level: levelFromXp(progress.xp), unlocked: unlockedFamilies(progress) };
    const newlyUnlocked = after.unlocked.length > screen.before.unlocked ? after.unlocked[after.unlocked.length - 1] : null;
    setScreen({ name: 'summary', round, familyId: screen.familyId, newlyUnlocked, leveledUp: after.level > screen.before.level });
  }

  function reset() {
    update(() => emptyProgress());
    goHome();
  }

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
            <button className="avatar-btn" onClick={goAccount} aria-label="Account and sync">
              {user ? user.email[0].toUpperCase() : '☁'}
            </button>
          </div>
        </div>
      </header>

      {screen.name === 'home' && (
        <Home progress={progress} onPlay={goPlay} onLesson={goLesson} onAccount={goAccount} user={user} syncState={syncState} />
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
          onPlayAgain={() => goPlay(screen.familyId)}
          onHome={goHome}
        />
      )}
      {screen.name === 'account' && (
        <Account user={user} progress={progress} syncState={syncState} onBack={goHome} onReset={reset} />
      )}
    </div>
  );
}
