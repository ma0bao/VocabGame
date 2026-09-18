import { useEffect } from 'react';
import { families, glossary, rootToFamily } from '../data/parts';
import { wordsByRoot, wordScore, MASTERED_AT } from '../lib/game';

export function PartChips({ ids, highlight, big, huge }) {
  return (
    <div className={`parts ${big ? 'q-parts' : ''}`}>
      {ids.map((id, i) => {
        const g = glossary[id];
        return (
          <span key={id + i} className="tile-group">
            {i > 0 && <span className="plus">+</span>}
            <span className={`part ${g.kind} ${highlight === id ? 'hl' : ''} ${huge ? 'huge' : big ? 'big' : ''}`}>
              <b>{g.form.split(' /')[0]}</b>
              <span>{g.meaning}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function Lesson({ rootId, progress, onBack, onPlay, onLesson, markLearned }) {
  const g = glossary[rootId];
  const famId = rootToFamily[rootId];
  const fam = families.find((f) => f.id === famId);
  const list = wordsByRoot[rootId];
  const idx = fam.roots.indexOf(rootId);
  const next = fam.roots[idx + 1];
  const prev = fam.roots[idx - 1];

  useEffect(() => {
    markLearned(rootId);
    window.scrollTo({ top: 0 });
  }, [rootId, markLearned]);

  return (
    <div className="wrap">
      <button className="back" onClick={onBack}>Back to the tree</button>
      <section className="card">
        <div className="eyebrow">{fam.name}, root {idx + 1} of {fam.roots.length}</div>
        <div className="root-hero" style={{ marginTop: 6 }}>
          <div className="big">{g.form}</div>
          <div className="meaning">= {g.meaning}</div>
          <div className="muted">{g.hint || ''} From {g.origin}.</div>
        </div>
      </section>

      <section className="card">
        <div className="eyebrow">Words built on {g.form.split(' /')[0]}</div>
        <div className="word-list">
          {list.map((w) => {
            const s = wordScore(progress, w.w);
            return (
              <div className="word-row" key={w.w}>
                <div className="row">
                  <span className="w">{w.w}</span>
                  <span className="pos">{w.pos}</span>
                  <span className="mastery-pips" aria-label={`score ${s} of ${MASTERED_AT}`}>
                    {[0, 1, 2].map((i) => <i key={i} className={`pip ${s > i ? 'on' : ''}`} />)}
                  </span>
                </div>
                <div>{w.d}</div>
                <PartChips ids={w.p} highlight={rootId} />
                {w.syn.length > 0 && <div className="muted" style={{ marginTop: 6, fontSize: '0.85rem' }}>Similar: {w.syn.join(', ')}{w.ant.length > 0 && ` · Opposite: ${w.ant[0]}`}</div>}
                <div className="muted" style={{ marginTop: 6, fontSize: '0.9rem' }}>
                  “{w.s.replace('___', w.w)}”
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="row" style={{ marginTop: 14 }}>
        {prev && <button className="btn ghost sm" onClick={() => onLesson(prev)}>Previous: {glossary[prev].form.split(' /')[0]}</button>}
        <span className="spacer" />
        {next ? (
          <button className="btn sm" onClick={() => onLesson(next)}>Next root: {glossary[next].form.split(' /')[0]}</button>
        ) : (
          <button className={`btn sm ${fam.color === 'grape' ? '' : fam.color}`} onClick={() => onPlay(famId)}>Play {fam.name}</button>
        )}
      </div>
    </div>
  );
}
