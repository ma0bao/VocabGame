import { families, glossary } from '../data/parts';
import { words } from '../data/words';
import {
  familyMastery, rootMastery, isFamilyUnlocked, levelProgress, levelTitle,
  masteredCount, wordsByFamily, UNLOCK_AT,
} from '../lib/game';

const FAMILY_GLYPHS = { F1: 'Aa', F2: '→', F3: '♥', F4: '⇕', F5: '⏱', F6: '♛', F7: '±', F8: '◎' };

function Pips({ value }) {
  return (
    <span className="mastery-pips" aria-label={`${Math.round(value * 100)}% mastered`}>
      {[0, 1, 2, 3, 4].map((i) => <i key={i} className={`pip ${value * 5 > i ? 'on' : ''}`} />)}
    </span>
  );
}

export default function Home({ progress, onPlay, onLesson, onAccount, user, syncState }) {
  const lp = levelProgress(progress.xp);
  const mastered = masteredCount(progress);
  const pct = Math.round((lp.into / lp.span) * 100);

  return (
    <div className="wrap">
      <section className="card hero">
        <div>
          <div className="eyebrow">Level {lp.level} · {levelTitle(lp.level)}</div>
          <h1>{progress.answered === 0 ? 'Ready to crack some words?' : 'Welcome back, word hunter.'}</h1>
          <p className="muted" style={{ margin: '6px 0 10px' }}>
            {mastered} of {words.length} words mastered · {lp.next - progress.xp} XP to level {lp.level + 1}
          </p>
          <div className="bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
          <div className="quick">
            <button className="btn mint" onClick={() => onPlay('mix')}>▶ Quick round (mix)</button>
            <button className="btn ghost" onClick={onAccount}>
              {user ? (syncState === 'synced' ? '☁ Synced' : syncState === 'syncing' ? '☁ Syncing…' : '☁ Account') : 'Sign in to sync'}
            </button>
          </div>
        </div>
        <div className="level-ring" style={{ '--pct': pct }}>
          <span>{lp.level}</span>
          <small>LVL</small>
        </div>
      </section>

      <h2 style={{ margin: '22px 0 4px', fontSize: '1.4rem' }}>Root tree</h2>
      <p className="muted" style={{ margin: '0 0 8px' }}>
        Master {Math.round(UNLOCK_AT * 100)}% of a branch to unlock the next one. Tap a root to study it.
      </p>

      <div className="tree">
        {families.map((f, idx) => {
          const unlocked = isFamilyUnlocked(progress, f.id);
          const m = familyMastery(progress, f.id);
          const prev = idx > 0 ? families[idx - 1] : null;
          const prevPct = prev ? Math.round(familyMastery(progress, prev.id) * 100) : 100;
          return (
            <div className="family" key={f.id}>
              <div className="spine">
                <div className={`node ${unlocked ? 'bg-' + f.color : 'locked'}`} aria-hidden="true">
                  {unlocked ? FAMILY_GLYPHS[f.id] : '🔒'}
                </div>
                <div className={`line ${m >= UNLOCK_AT ? 'done' : ''}`} />
              </div>
              <div className="body">
                <div className={`fam-card ${unlocked ? '' : 'locked'}`}>
                  <div className="fam-head">
                    <div>
                      <h3>{f.name}</h3>
                      <div className="muted" style={{ fontSize: '0.85rem' }}>{f.tag} · {wordsByFamily[f.id].length} words</div>
                    </div>
                    <div className="pct">{Math.round(m * 100)}%</div>
                  </div>
                  <div className={`bar ${f.color}`} style={{ marginTop: 10 }} aria-hidden="true"><i style={{ width: `${m * 100}%` }} /></div>
                  {unlocked ? (
                    <>
                      <div className="roots">
                        {f.roots.map((r) => {
                          const rm = rootMastery(progress, r);
                          const cls = rm >= 1 ? 'm2' : rm > 0 ? 'm1' : '';
                          return (
                            <button key={r} className={`root-chip ${cls}`} onClick={() => onLesson(r)} title={glossary[r].meaning}>
                              <i className="dot" />{glossary[r].form.split(' /')[0]}
                              <span className="muted" style={{ fontWeight: 600 }}>= {glossary[r].meaning.split(',')[0]}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="fam-actions">
                        <button className={`btn sm ${f.color === 'grape' ? '' : f.color}`} onClick={() => onPlay(f.id)}>▶ Play this branch</button>
                        <button className="btn sm ghost" onClick={() => onLesson(f.roots[0])}>Study roots</button>
                      </div>
                    </>
                  ) : (
                    <p className="muted" style={{ margin: '10px 0 0', fontWeight: 700 }}>
                      Unlocks when {prev.name} reaches {Math.round(UNLOCK_AT * 100)}% ({prevPct}% now).
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { Pips };
