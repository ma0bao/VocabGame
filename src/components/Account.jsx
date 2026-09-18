import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { words } from '../data/words';
import { masteredCount } from '../lib/game';

export default function Account({ user, progress, syncState, onBack, onReset }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  async function sendLink(e) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setStatus(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    setStatus(error ? { ok: false, msg: error.message } : { ok: true, msg: `Check ${email.trim()} for your sign-in link.` });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setStatus({ ok: true, msg: 'Signed out. Progress stays saved on this device.' });
  }

  const accuracy = progress.answered ? Math.round((progress.correct / progress.answered) * 100) : 0;

  return (
    <div className="wrap">
      <button className="back" onClick={onBack}>Back</button>

      <section className="card">
        <div className="eyebrow">Your stats</div>
        <div className="summary-grid">
          <div className="tile"><b>{progress.xp}</b><span>total XP</span></div>
          <div className="tile"><b>{masteredCount(progress)}/{words.length}</b><span>mastered</span></div>
          <div className="tile"><b>{accuracy}%</b><span>accuracy</span></div>
          <div className="tile"><b>{progress.streak}</b><span>day streak</span></div>
          <div className="tile"><b>{progress.bestStreak}</b><span>best streak</span></div>
          <div className="tile"><b>{progress.answered}</b><span>answered</span></div>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Sync across devices</div>
        {!supabase && (
          <p className="muted">Sync is off: this build has no Supabase keys. Progress is saved on this device only.</p>
        )}
        {supabase && user && (
          <>
            <p style={{ margin: '8px 0' }}>
              Signed in as <b>{user.email}</b>.{' '}
              <span className="muted">{syncState === 'synced' ? 'Progress is synced.' : syncState === 'syncing' ? 'Syncing…' : ''}</span>
            </p>
            <button className="btn ghost sm" onClick={signOut}>Sign out</button>
          </>
        )}
        {supabase && !user && (
          <>
            <p className="muted" style={{ margin: '6px 0 0' }}>
              Enter your email and we'll send a magic link — no password. Your progress from this device comes with you.
            </p>
            <form className="auth-form" onSubmit={sendLink}>
              <input id="email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send link'}</button>
            </form>
          </>
        )}
        {status && <div className={`notice ${status.ok ? 'good' : 'bad'}`}>{status.msg}</div>}
      </section>

      <section className="card">
        <div className="eyebrow">Start over</div>
        <p className="muted" style={{ margin: '6px 0 10px' }}>Wipe all progress on this account and start from the first branch.</p>
        <button className="btn coral sm" onClick={() => { if (window.confirm('Reset all progress? This cannot be undone.')) onReset(); }}>Reset progress</button>
      </section>
    </div>
  );
}
