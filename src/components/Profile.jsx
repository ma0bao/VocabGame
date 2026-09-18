import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { words } from '../data/words';
import { families } from '../data/parts';
import { masteredCount, seenCount, levelProgress, levelTitle, BADGES, MODE_META, WEEKLY_GOAL, weekXp, familyMastery } from '../lib/game';

export default function Profile({ user, progress, syncState, onReset, onSetName, onSignOut }) {
  const [name, setName] = useState(progress.name || '');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const lp = levelProgress(progress.xp);
  const accuracy = progress.answered ? Math.round((progress.correct / progress.answered) * 100) : 0;
  const wk = weekXp(progress);
  const badges = progress.badges || {};
  const earned = BADGES.filter((b) => badges[b.id]);
  const modes = Object.entries(progress.modeStats || {}).filter(([, s]) => s.n >= 3);

  async function sendLink(e) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: window.location.origin } });
    setBusy(false);
    setStatus(error ? { ok: false, msg: error.message } : { ok: true, msg: `Check ${email.trim()} for your sign-in link. Your guest progress comes with you.` });
  }

  return (
    <div className="wrap">
      <section className="card lift">
        <div className="row">
          <div className="avatar big-avatar" aria-hidden="true">{(progress.name || user?.email || 'G')[0].toUpperCase()}</div>
          <div>
            <h1 style={{ fontSize: '1.5rem' }}>{progress.name || (user ? user.email.split('@')[0] : 'Guest')}</h1>
            <div className="muted">Level {lp.level}, {levelTitle(lp.level)} · {progress.xp} XP</div>
          </div>
        </div>
        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); onSetName(name.trim()); setStatus({ ok: true, msg: 'Name saved.' }); }}>
          <input id="display-name" placeholder="Display name" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} />
          <button className="btn ghost sm" type="submit" disabled={name.trim() === (progress.name || '')}>Save name</button>
        </form>
      </section>

      <section className="card">
        <div className="eyebrow">This week</div>
        <div className="row" style={{ marginTop: 6 }}>
          <b style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>{wk} / {WEEKLY_GOAL} XP</b>
          <span className="spacer" />
          <span className="muted">{wk >= WEEKLY_GOAL ? 'Goal hit!' : `${WEEKLY_GOAL - wk} to go, resets Monday`}</span>
        </div>
        <div className={`bar ${wk >= WEEKLY_GOAL ? 'mint' : ''}`} style={{ marginTop: 8 }} aria-hidden="true"><i style={{ width: `${Math.min(100, (wk / WEEKLY_GOAL) * 100)}%` }} /></div>
      </section>

      <section className="card">
        <div className="eyebrow">Your numbers</div>
        <div className="summary-grid">
          <div className="tile"><b>{masteredCount(progress)}/{words.length}</b><span>mastered</span></div>
          <div className="tile"><b>{seenCount(progress)}</b><span>words met</span></div>
          <div className="tile"><b>{accuracy}%</b><span>accuracy</span></div>
          <div className="tile"><b>{progress.streak}</b><span>day streak</span></div>
          <div className="tile"><b>{progress.bestStreak}</b><span>best streak</span></div>
          <div className="tile"><b>{progress.rounds || 0}</b><span>rounds</span></div>
        </div>
        {modes.length > 0 && (
          <>
            <div className="eyebrow" style={{ marginTop: 14 }}>Accuracy by question type</div>
            <div className="mode-stats">
              {modes.map(([m, s]) => (
                <div key={m} className="mode-stat">
                  <span className="dot" style={{ background: MODE_META[m]?.color }} />
                  <span>{MODE_META[m]?.label || m}</span>
                  <span className="spacer" />
                  <b>{Math.round((s.c / s.n) * 100)}%</b>
                  <span className="muted" style={{ fontSize: '0.8rem' }}>({s.n})</span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="card">
        <div className="eyebrow">Branches</div>
        <div className="branch-bars">
          {families.map((f) => {
            const m = familyMastery(progress, f.id);
            return (
              <div key={f.id} className="branch-bar">
                <span>{f.name}</span>
                <div className={`bar ${f.color}`}><i style={{ width: `${m * 100}%` }} /></div>
                <b>{Math.round(m * 100)}%</b>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Badges · {earned.length} of {BADGES.length}</div>
        <div className="badges">
          {BADGES.map((b) => {
            const on = !!badges[b.id];
            return (
              <div key={b.id} className={`badge ${on ? 'on' : ''}`} title={b.desc}>
                <div className="badge-icon" aria-hidden="true">{on ? '★' : '·'}</div>
                <div>
                  <div className="badge-name">{b.name}</div>
                  <div className="muted" style={{ fontSize: '0.8rem' }}>{b.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Account</div>
        {!supabase && <p className="muted">Accounts are off in this build. Progress is saved on this device only.</p>}
        {supabase && user && (
          <>
            <p style={{ margin: '8px 0' }}>
              Signed in as <b>{user.email}</b>.{' '}
              <span className="muted">{syncState === 'synced' ? 'Progress is synced to your account.' : syncState === 'syncing' ? 'Syncing…' : ''}</span>
            </p>
            <button className="btn ghost sm" onClick={onSignOut}>Sign out</button>
          </>
        )}
        {supabase && !user && (
          <>
            <p className="muted" style={{ margin: '6px 0 0' }}>You're playing as a guest on this device. Add your email to keep this progress and continue on your phone or another computer.</p>
            <form className="auth-form" onSubmit={sendLink}>
              <input id="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send sign-in link'}</button>
            </form>
          </>
        )}
        {status && <div className={`notice ${status.ok ? 'good' : 'bad'}`}>{status.msg}</div>}
      </section>

      <section className="card">
        <div className="eyebrow">Start over</div>
        <p className="muted" style={{ margin: '6px 0 10px' }}>Wipes every word, badge and streak for this account. Your name stays.</p>
        <button className="btn coral sm" onClick={() => { if (window.confirm('Reset all progress? This cannot be undone.')) onReset(); }}>Reset progress</button>
      </section>
    </div>
  );
}
