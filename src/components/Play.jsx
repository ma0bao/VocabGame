import { useEffect, useMemo, useState } from 'react';
import { families, glossary } from '../data/parts';
import { buildRound, XP_CORRECT, XP_COMBO } from '../lib/game';
import { PartChips } from './Lesson';

const MODE_META = {
  define: { label: 'Define it', color: 'var(--grape)', ask: 'What does this word mean?' },
  sentence: { label: 'Fill the blank', color: 'var(--sky)', ask: 'Which word completes the sentence?' },
  decode: { label: 'Decode the parts', color: 'var(--coral)', ask: 'Which word do these parts build?' },
  root: { label: 'Root check', color: 'var(--sun-deep)', ask: 'What does the highlighted root mean?' },
};
const KEYS = ['A', 'B', 'C', 'D'];

export default function Play({ progress, familyId, onAnswer, onFinish, onQuit }) {
  const questions = useMemo(() => buildRound(progress, familyId), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [combo, setCombo] = useState(0);
  const [xp, setXp] = useState(0);
  const [results, setResults] = useState([]);
  const [float, setFloat] = useState(null);

  const q = questions[i];
  const fam = familyId === 'mix' ? null : families.find((f) => f.id === familyId);
  const meta = MODE_META[q.mode];
  const done = picked !== null;

  function choose(opt) {
    if (done) return;
    const correct = opt.word === q.answer;
    const nextCombo = correct ? combo + 1 : 0;
    const gained = correct ? XP_CORRECT + (nextCombo >= 3 ? XP_COMBO : 0) : 0;
    setPicked(opt.word);
    setCombo(nextCombo);
    setXp((x) => x + gained);
    setResults((r) => [...r, { word: q.target.w, correct, mode: q.mode }]);
    if (gained) {
      setFloat(`+${gained} XP${nextCombo >= 3 ? ' 🔥' : ''}`);
      setTimeout(() => setFloat(null), 900);
    }
    onAnswer(q.target, correct, gained);
  }

  function next() {
    if (i + 1 >= questions.length) {
      onFinish({ results, xp, total: questions.length });
      return;
    }
    setI(i + 1);
    setPicked(null);
    window.scrollTo({ top: 0 });
  }

  // Keyboard: A–D / 1–4 to answer, Enter/Space to continue.
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT') return;
      const k = e.key.toUpperCase();
      const idx = KEYS.indexOf(k) >= 0 ? KEYS.indexOf(k) : ['1', '2', '3', '4'].indexOf(k);
      if (!done && idx >= 0 && q.options[idx]) choose(q.options[idx]);
      if (done && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const correct = done && picked === q.answer;

  return (
    <div className="wrap">
      <div className="play-head">
        <button className="back" onClick={onQuit}>✕</button>
        <div className="bar" aria-label={`question ${i + 1} of ${questions.length}`}>
          <i style={{ width: `${((i + (done ? 1 : 0)) / questions.length) * 100}%` }} />
        </div>
        <div className={`combo ${combo >= 3 ? 'hot' : ''}`}>{combo >= 2 ? `🔥 ×${combo}` : `${xp} XP`}</div>
      </div>

      <div className="q-card" key={i}>
        <span className="q-mode" style={{ background: meta.color }}>{meta.label}</span>

        {q.mode === 'define' && <div className="q-word">{q.target.w}</div>}

        {q.mode === 'sentence' && (
          <p className="q-sentence">
            {q.target.s.split('___').map((chunk, k, arr) => (
              <span key={k}>
                {chunk}
                {k < arr.length - 1 && <span className="blank">{done ? q.target.w : ' '}</span>}
              </span>
            ))}
          </p>
        )}

        {q.mode === 'decode' && <PartChips ids={q.target.p} big />}

        {q.mode === 'root' && (
          <>
            <div className="q-word">
              {q.target.w}
            </div>
            <div className="q-parts">
              <span className="part big hl"><b>{q.rootForm}</b><span>means ?</span></span>
            </div>
          </>
        )}

        <div className="q-ask">{meta.ask}</div>

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

        {done && (
          <div className={`feedback ${correct ? 'good' : 'bad'}`}>
            <div className="title">{correct ? (combo >= 3 ? `Combo ×${combo}! ` : 'Nice! ') : 'Not quite. '}
              <span style={{ fontWeight: 600 }}>{q.target.w}</span>
              <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 700 }}> ({q.target.pos})</span>
            </div>
            <div className="def">{q.target.d}</div>
            {q.mode !== 'decode' && <PartChips ids={q.target.p} highlight={q.target.r} />}
            {q.mode !== 'sentence' && (
              <div className="muted" style={{ marginTop: 8, fontSize: '0.9rem' }}>“{q.target.s.replace('___', q.target.w)}”</div>
            )}
            {q.mode === 'root' && (
              <div className="muted" style={{ marginTop: 6, fontSize: '0.9rem' }}>
                {glossary[q.rootId].hint}
              </div>
            )}
            <button className="btn block" style={{ marginTop: 12 }} onClick={next} autoFocus>
              {i + 1 >= questions.length ? 'See results' : 'Continue'}
            </button>
          </div>
        )}
      </div>
      {float && <div className="xp-float" aria-hidden="true">{float}</div>}
    </div>
  );
}
