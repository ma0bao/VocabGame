import { families, glossary } from '../data/parts';
import { words } from '../data/words';
import {
  familyMastery, rootMastery, isFamilyUnlocked, levelProgress, levelTitle,
  masteredCount, wordsByFamily, wordScore, UNLOCK_AT, MASTERED_AT,
} from '../lib/game';
import { todayKey } from '../lib/progress';
import { PartChips } from './Lesson';

const FAMILY_GLYPHS = { F1: 'Aa', F2: '→', F3: '♥', F4: '⇕', F5: '⏱', F6: '♛', F7: '±', F8: '◎' };

// The branch the player is working on: the highest unlocked one that isn't done yet.
function currentFamily(progress) {
  const open = families.filter((f) => isFamilyUnlocked(progress, f.id));
  return open.find((f) => familyMastery(progress, f.id) < 1) || open[open.length - 1];
}

// A featured word from the current branch, stable for the day, preferring words not yet mastered.
function featuredWord(progress, fam) {
  const pool = wordsByFamily[fam.id];
  const fresh = pool.filter((w) => wordScore(progress, w.w) < MASTERED_AT);
  const list = fresh.length ? fresh : pool;
  let h = 0;
  for (const ch of todayKey()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return list[h % list.length];
}

export default function Home({ progress, onPlay, onLesson, onAccount, user, syncState }) {
  const lp = levelProgress(progress.xp);
  const mastered = masteredCount(progress);
  const pct = Math.round((lp.into / lp.span) * 100);
  const cur = currentFamily(progress);
  const feat = featuredWord(progress, cur);
  const firstTime = progress.answered === 0;

  return (
    <div className="wrap">
      <section className="card lift">
        <div className="level-line">
          <span>Level {lp.level}, {levelTitle(lp.level)}</span>
          <div className="bar" aria-label={`${pct}% to next level`}><i style={{ width: `${pct}%` }} /></div>
          <span>{lp.next - progress.xp} XP to go</span>
        </div>
        <h1 style={{ marginTop: 10 }}>
          {firstTime ? 'Every big word is small parts snapped together.' : `${mastered} of ${words.length} words mastered.`}
        </h1>
        <div className="featured">
          <div className="eyebrow">{firstTime ? 'Try one' : `Today's word from ${cur.name}`}</div>
          <div className="word">{feat.w}<small>{feat.pos}</small></div>
          <PartChips ids={feat.p} big />
          <p style={{ margin: '10px 0 0' }}>{feat.d}</p>
          <div className="tile-legend">
            <span><i style={{ background: 'var(--coral)' }} />prefix</span>
            <span><i style={{ background: 'var(--grape)' }} />root</span>
            <span><i style={{ background: 'var(--sun)' }} />suffix</span>
          </div>
        </div>
        <div className="quick">
          <button className="btn mint" onClick={() => onPlay(firstTime ? cur.id : 'mix')}>
            {firstTime ? `Play ${cur.name}` : 'Play a mixed round'}
          </button>
          <button className="btn ghost" onClick={onAccount}>
            {user ? (syncState === 'synced' ? 'Synced' : syncState === 'syncing' ? 'Syncing…' : 'Account') : 'Sign in to sync'}
          </button>
        </div>
      </section>

      <h2 style={{ margin: '24px 0 4px', fontSize: '1.4rem' }}>The root tree</h2>
      <p className="muted" style={{ margin: '0 0 10px' }}>
        Get a branch to {Math.round(UNLOCK_AT * 100)}% to open the next one. Tap a root to study it.
      </p>

      <div className="tree">
        {families.map((f, idx) => {
          const unlocked = isFamilyUnlocked(progress, f.id);
          const m = familyMastery(progress, f.id);
          const isCurrent = f.id === cur.id;
          const prev = idx > 0 ? families[idx - 1] : null;
          return (
            <div className="family" key={f.id}>
              <div className="spine">
                <div className={`node ${unlocked ? 'bg-' + f.color : 'locked'}`} aria-hidden="true">
                  {unlocked ? FAMILY_GLYPHS[f.id] : ''}
                </div>
                <div className={`line ${m >= UNLOCK_AT ? 'done' : ''}`} />
              </div>
              <div className="body">
                <div className={`fam-card ${unlocked ? '' : 'locked'} ${isCurrent ? 'current' : ''}`}>
                  <div className="fam-head">
                    <div>
                      <h3>{f.name}</h3>
                      {unlocked && <div className="muted" style={{ fontSize: '0.85rem' }}>{f.tag}. {wordsByFamily[f.id].length} words.</div>}
                    </div>
                    <div className="pct">{Math.round(m * 100)}%</div>
                  </div>
                  {unlocked && (
                    <div className={`bar ${f.color}`} style={{ marginTop: 10 }} aria-hidden="true"><i style={{ width: `${m * 100}%` }} /></div>
                  )}
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
                        <button className={`btn sm ${f.color === 'grape' ? '' : f.color}`} onClick={() => onPlay(f.id)}>Play {f.name}</button>
                        <button className="btn sm ghost" onClick={() => onLesson(f.roots[0])}>Study the roots</button>
                      </div>
                    </>
                  ) : (
                    <div className="muted" style={{ fontSize: '0.85rem' }}>
                      Opens when {prev.name} reaches {Math.round(UNLOCK_AT * 100)}%.
                    </div>
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
