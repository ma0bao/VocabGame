import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { words } from '../data/words';
import { PartChips } from './Lesson';
import { wordIndex } from '../lib/game';

// First screen for anyone not signed in: create an account, sign in, or play as a guest.
export default function Welcome({ onGuest, hasGuest }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const demo = wordIndex['circumspect'];

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
    setStatus(error ? { ok: false, msg: error.message } : { ok: true, msg: `Sent. Open the link in the email we just sent to ${email.trim()} and you're in.` });
  }

  return (
    <div className="wrap welcome">
      <section className="card lift">
        <h1 style={{ fontSize: '2rem' }}>Learn {words.length} SAT words by learning how they're built.</h1>
        <p className="muted" style={{ margin: '8px 0 14px' }}>
          Every hard word is small parts snapped together. Master 60 roots and prefixes and you can decode thousands of words you've never seen, including the ones on test day.
        </p>
        <div className="featured" style={{ marginTop: 0 }}>
          <div className="word">{demo.w}<small>{demo.pos}</small></div>
          <PartChips ids={demo.p} big />
          <p style={{ margin: '10px 0 0' }}>{demo.d}</p>
        </div>
      </section>

      <section className="card">
        <h2 style={{ fontSize: '1.3rem' }}>Create an account or sign in</h2>
        <p className="muted" style={{ margin: '6px 0 0' }}>
          Just your email. We send a sign-in link; there's no password. Your progress follows you to any device.
        </p>
        {supabase ? (
          <form className="auth-form" onSubmit={sendLink}>
            <input id="welcome-email" type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send sign-in link'}</button>
          </form>
        ) : (
          <p className="notice bad">Accounts are off in this build (no Supabase keys). You can still play as a guest.</p>
        )}
        {status && <div className={`notice ${status.ok ? 'good' : 'bad'}`}>{status.msg}</div>}
        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn ghost" onClick={onGuest}>{hasGuest ? 'Continue as guest' : 'Play as guest'}</button>
          <span className="muted" style={{ fontSize: '0.85rem' }}>Guest progress stays on this device and joins your account when you sign in later.</span>
        </div>
      </section>
    </div>
  );
}
