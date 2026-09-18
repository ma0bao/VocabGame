import { useEffect, useState } from 'react';
import { families } from '../data/parts';
import { wordIndex, levelProgress, levelTitle } from '../lib/game';
import { PartChips } from './Lesson';

function Confetti() {
  const colors = ['#6c3fe0', '#21c99b', '#ff5c7a', '#ffb627', '#3da9fc'];
  const bits = Array.from({ length: 70 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    dur: 2 + Math.random() * 1.5,
    color: colors[i % colors.length],
  }));
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <i key={i} style={{ left: `${b.left}%`, background: b.color, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }} />
      ))}
    </div>
  );
}

export default function Summary({ round, progress, familyId, newlyUnlocked, leveledUp, onPlayAgain, onHome }) {
  const right = round.results.filter((r) => r.correct).length;
  const missed = round.results.filter((r) => !r.correct);
  const lp = levelProgress(progress.xp);
  const perfect = right === round.total;
  const [confetti, setConfetti] = useState(perfect || newlyUnlocked || leveledUp);
  useEffect(() => {
    const t = setTimeout(() => setConfetti(false), 3500);
    return () => clearTimeout(t);
  }, []);

  const fam = familyId === 'mix' ? null : families.find((f) => f.id === familyId);

  return (
    <div className="wrap">
      {confetti && <Confetti />}
      <section className="card summary">
        <div className="eyebrow">{fam ? fam.name : 'Mixed round'} · complete</div>
        <div className="score">{right}/{round.total}</div>
        <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
          {perfect ? 'Perfect round!' : right >= round.total * 0.7 ? 'Strong work.' : 'Every miss is a word you now know better.'}
        </div>
        <div className="summary-grid">
          <div className="tile"><b>+{round.xp}</b><span>XP earned</span></div>
          <div className="tile"><b>{progress.streak}🔥</b><span>day streak</span></div>
          <div className="tile"><b>{lp.level}</b><span>{levelTitle(lp.level)}</span></div>
        </div>
        {leveledUp && <div className="unlock-banner">⬆ Level up! You're now a {levelTitle(lp.level)}.</div>}
        {newlyUnlocked && <div className="unlock-banner">🔓 New branch unlocked: {newlyUnlocked.name}!</div>}
        <div className="row" style={{ marginTop: 16, justifyContent: 'center' }}>
          <button className="btn mint" onClick={onPlayAgain}>▶ Play again</button>
          <button className="btn ghost" onClick={onHome}>Root tree</button>
        </div>
      </section>

      {missed.length > 0 && (
        <section className="card missed">
          <div className="eyebrow">Review the ones you missed</div>
          <div className="word-list">
            {missed.map((m) => {
              const w = wordIndex[m.word];
              return (
                <div className="word-row" key={m.word}>
                  <div className="row"><span className="w">{w.w}</span><span className="pos">{w.pos}</span></div>
                  <div>{w.d}</div>
                  <PartChips ids={w.p} highlight={w.r} />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
