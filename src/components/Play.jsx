import { useEffect, useMemo, useRef, useState } from 'react';
import { glossary } from '../data/parts';
import { buildRound, MODE_META, XP_CORRECT, XP_COMBO, XP_HARD, normalizeAnswer } from '../lib/game';
import { PartChips } from './Lesson';

const KEYS = ['A', 'B', 'C', 'D'];

function Sentence({ text, word, reveal, mark }) {
  return (
    <p className="q-sentence">
      {text.split('___').map((chunk, k, arr) => (
        <span key={k}>
          {chunk}
          {k < arr.length - 1 && (
            mark ? <mark className="q-mark">{word}</mark> : <span className="blank">{reveal ? word : ' '}</span>
          )}
        </span>
      ))}
    </p>
  );
}

function LearnCard({ target, index, total, onNext }) {
  return (
    <div className="q-card learn" key={target.w}>
      <span className="q-mode" style={{ background: 'var(--mint)' }}>New word {index} of {total}</span>
      <div className="q-word">{target.w}<small className="pos-tag">{target.pos}</small></div>
      <PartChips ids={target.p} highlight={target.r} big />
      <p className="learn-def">{target.d}</p>
      <p className="muted" style={{ margin: '4px 0 0' }}>“{target.s.replace('___', target.w)}”</p>
      {target.syn.length > 0 && (
        <p className="muted" style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>
          Similar: <b>{target.syn.join(', ')}</b>{target.ant.length > 0 && <> · Opposite: <b>{target.ant[0]}</b></>}
        </p>
      )}
      <button className="btn block mint" style={{ marginTop: 16 }} onClick={onNext} autoFocus>Got it</button>
    </div>
  );
}

export default function Play({ progress, familyId, onAnswer, onFinish, onQuit }) {
  const round = useMemo(() => buildRound(progress, familyId), []); // eslint-disable-line react-hooks/exhaustive-deps
  const items = round.items;
  const learnTotal = items.filter((x) => x.type === 'learn').length;
  const qTotal = items.length - learnTotal;
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [typed, setTyped] = useState('');
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [results, setResults] = useState([]);
  const [float, setFloat] = useState(null);
  const inputRef = useRef(null);

  const item = items[i];
  const done = picked !== null;
  const answeredSoFar = results.length;

  function grade(correct, chosenWord) {
    const q = item;
    const nextCombo = correct ? combo + 1 : 0;
    const hardBonus = MODE_META[q.mode].hard ? XP_HARD : 0;
    const gained = correct ? XP_CORRECT + hardBonus + (nextCombo >= 3 ? XP_COMBO : 0) : 0;
    setPicked(chosenWord ?? (correct ? q.answer : '__wrong__'));
    setCombo(nextCombo);
    setXp((x) => x + gained);
    setResults((r) => [...r, { word: q.target.w, correct, mode: q.mode }]);
    if (gained) {
      setFloat(`+${gained} XP${nextCombo >= 3 ? ' 🔥' : ''}`);
      setTimeout(() => setFloat(null), 900);
    }
    onAnswer(q.target, correct, gained, { mode: q.mode, combo: nextCombo, isReview: round.isReview });
  }

  function choose(opt) {
    if (done) return;
    grade(opt.word === item.answer, opt.word);
  }

  function submitTyped(e) {
    e?.preventDefault();
    if (done || !typed.trim()) return;
    grade(normalizeAnswer(typed) === normalizeAnswer(item.answer), normalizeAnswer(typed) === normalizeAnswer(item.answer) ? item.answer : '__wrong__');
  }

  function next() {
    if (i + 1 >= items.length) {
      onFinish({ results, xp, total: qTotal, learned: learnTotal, isReview: round.isReview });
      return;
    }
    setI(i + 1);
    setPicked(null);
    setTyped('');
    window.scrollTo({ top: 0 });
  }

  useEffect(() => {
    if (item?.mode === 'recall' && !done) inputRef.current?.focus();
  }, [i, item, done]);

  // Keyboard: A–D / 1–4 to answer, Enter/Space to continue.
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT') return;
      if (item.type === 'learn') {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
        return;
      }
      const k = e.key.toUpperCase();
      const idx = KEYS.indexOf(k) >= 0 ? KEYS.indexOf(k) : ['1', '2', '3', '4'].indexOf(k);
      if (!done && idx >= 0 && item.options[idx]) choose(item.options[idx]);
      if (done && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!item) return null;

  const progressPct = ((answeredSoFar + (done ? 0 : 0)) / qTotal) * 100;

  if (item.type === 'learn') {
    const idx = items.slice(0, i + 1).filter((x) => x.type === 'learn').length;
    return (
      <div className="wrap">
        <div className="play-head">
          <button className="back" onClick={onQuit} aria-label="Quit round">✕</button>
          <div className="bar" aria-hidden="true"><i style={{ width: `${progressPct}%` }} /></div>
          <div className="combo">{xp} XP</div>
        </div>
        <LearnCard target={item.target} index={idx} total={learnTotal} onNext={next} />
      </div>
    );
  }

  const q = item;
  const meta = MODE_META[q.mode];
  const correct = done && picked === q.answer;

  return (
    <div className="wrap">
      <div className="play-head">
        <button className="back" onClick={onQuit} aria-label="Quit round">✕</button>
        <div className="bar" aria-label={`question ${answeredSoFar + 1} of ${qTotal}`}>
          <i style={{ width: `${((answeredSoFar + (done ? 1 : 0)) / qTotal) * 100}%` }} />
        </div>
        <div className={`combo ${combo >= 3 ? 'hot' : ''}`}>{combo >= 2 ? `🔥 ×${combo}` : `${xp} XP`}</div>
      </div>

      <div className="q-card" key={i}>
        <span className="q-mode" style={{ background: meta.color }}>{meta.label}{round.isReview ? ' · review' : ''}</span>

        {q.mode === 'define' && <div className="q-word">{q.target.w}</div>}
        {q.mode === 'sentence' && <Sentence text={q.target.s} word={q.target.w} reveal={done} />}
        {q.mode === 'context' && <Sentence text={q.target.s} word={q.target.w} mark />}
        {q.mode === 'antonym' && <div className="q-word">{q.target.w}</div>}
        {q.mode === 'decode' && <PartChips ids={q.target.p} big />}
        {q.mode === 'recall' && (
          <>
            <p className="q-sentence" style={{ fontWeight: 700 }}>{q.target.d}</p>
            <div className="q-parts"><PartChips ids={q.target.p} /></div>
            <div className="hint-row">
              <span className="pos-tag">{q.target.pos}</span>
              <span className="letters">{q.hint.split('').join(' ')}</span>
            </div>
          </>
        )}
        {q.mode === 'root' && (
          <>
            <div className="q-word">{q.target.w}</div>
            <div className="q-parts">
              <span className="part big hl"><b>{q.rootForm}</b><span>means ?</span></span>
            </div>
          </>
        )}

        <div className="q-ask">{meta.ask}{q.mode === 'context' ? ':' : ''}</div>

        {q.mode === 'recall' ? (
          <form className="recall-form" onSubmit={submitTyped}>
            <input
              id="recall"
              ref={inputRef}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Type the word"
              value={typed}
              disabled={done}
              onChange={(e) => setTyped(e.target.value)}
              className={done ? (correct ? 'right' : 'wrong') : ''}
            />
            {!done && <button className="btn" type="submit" disabled={!typed.trim()}>Check</button>}
          </form>
        ) : (
          <div className="options">
            {q.options.map((opt, k) => {
              let cls = 'opt';
              if (done) {
                if (opt.word === q.answer) cls += ' right';
                else if (opt.word === picked) cls += ' wrong';
                else cls += ' dim';
              }
              return (
                <button key={opt.word + k} className={cls} disabled={done} onClick={() => choose(opt)}>
                  <span className="key">{KEYS[k]}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {done && (
          <div className={`feedback ${correct ? 'good' : 'bad'}`}>
            <div className="title">
              {correct ? (combo >= 3 ? `Combo ×${combo}! ` : 'Nice! ') : 'Not quite. '}
              <span style={{ fontWeight: 600 }}>{q.target.w}</span>
              <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 700 }}> ({q.target.pos})</span>
            </div>
            <div className="def">{q.target.d}</div>
            {q.mode !== 'decode' && <PartChips ids={q.target.p} highlight={q.target.r} />}
            {q.mode !== 'sentence' && q.mode !== 'context' && (
              <div className="muted" style={{ marginTop: 8, fontSize: '0.9rem' }}>“{q.target.s.replace('___', q.target.w)}”</div>
            )}
            {(q.mode === 'context' || q.mode === 'antonym') && (
              <div className="muted" style={{ marginTop: 8, fontSize: '0.9rem' }}>
                Similar: <b>{q.target.syn.join(', ')}</b>{q.target.ant.length > 0 && <> · Opposite: <b>{q.target.ant.join(', ')}</b></>}
              </div>
            )}
            {q.mode === 'antonym' && picked === '__syn__' && (
              <div className="muted" style={{ marginTop: 6, fontSize: '0.9rem' }}>That one was a synonym — the SAT loves that trap.</div>
            )}
            {q.mode === 'root' && <div className="muted" style={{ marginTop: 6, fontSize: '0.9rem' }}>{glossary[q.rootId].hint}</div>}
            <button className="btn block" style={{ marginTop: 12 }} onClick={next} autoFocus>
              {i + 1 >= items.length ? 'See results' : 'Continue'}
            </button>
          </div>
        )}
      </div>
      {float && <div className="xp-float" aria-hidden="true">{float}</div>}
    </div>
  );
}
