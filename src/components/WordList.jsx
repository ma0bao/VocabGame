import { useMemo, useState } from 'react';
import { words } from '../data/words';
import { families, glossary, rootToFamily } from '../data/parts';
import { wordState, MASTERED_AT, isFamilyUnlocked } from '../lib/game';
import { PartChips } from './Lesson';

export default function WordList({ progress, onLesson }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all'); // all | seen | mastered | unseen

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return words.filter((w) => {
      const st = wordState(progress, w.w);
      if (filter === 'seen' && st.n === 0) return false;
      if (filter === 'mastered' && st.s < MASTERED_AT) return false;
      if (filter === 'unseen' && st.n > 0) return false;
      if (!needle) return true;
      return (
        w.w.includes(needle) ||
        w.d.toLowerCase().includes(needle) ||
        w.syn.some((s) => s.includes(needle)) ||
        w.p.some((p) => glossary[p].form.includes(needle) || glossary[p].meaning.includes(needle))
      );
    });
  }, [q, filter, progress]);

  return (
    <div className="wrap">
      <h1 style={{ fontSize: '1.6rem' }}>All {words.length} words</h1>
      <p className="muted" style={{ margin: '4px 0 10px' }}>Search by word, meaning, synonym, or part. Tap a word to study its root.</p>
      <input
        id="word-search"
        className="search"
        type="search"
        placeholder="Search, e.g. “circum” or “brave”"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="chips" role="tablist">
        {[['all', 'All'], ['seen', 'Met'], ['mastered', 'Mastered'], ['unseen', 'Not yet']].map(([k, label]) => (
          <button key={k} className={`chip ${filter === k ? 'on' : ''}`} onClick={() => setFilter(k)} role="tab" aria-selected={filter === k}>{label}</button>
        ))}
        <span className="muted" style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: 700 }}>{list.length}</span>
      </div>

      <div className="word-list" style={{ marginTop: 12 }}>
        {list.slice(0, 120).map((w) => {
          const st = wordState(progress, w.w);
          const fam = families.find((f) => f.id === rootToFamily[w.r]);
          const locked = !isFamilyUnlocked(progress, fam.id);
          return (
            <button className="word-row as-btn" key={w.w} onClick={() => !locked && onLesson(w.r)} disabled={locked}>
              <div className="row">
                <span className="w">{w.w}</span>
                <span className="pos">{w.pos}</span>
                <span className="spacer" />
                {locked ? (
                  <span className="muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{fam.name} (locked)</span>
                ) : (
                  <span className="mastery-pips" aria-label={`score ${st.s} of ${MASTERED_AT}`}>
                    {[0, 1, 2].map((i) => <i key={i} className={`pip ${st.s > i ? 'on' : ''}`} />)}
                  </span>
                )}
              </div>
              <div>{w.d}</div>
              <PartChips ids={w.p} highlight={w.r} />
            </button>
          );
        })}
        {list.length > 120 && <p className="muted">Showing the first 120. Narrow the search to see more.</p>}
        {list.length === 0 && <p className="muted">No words match. Try a shorter search.</p>}
      </div>
    </div>
  );
}
