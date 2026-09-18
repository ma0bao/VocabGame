import { dueWords, weakWords, seenCount, masteredCount, wordState } from '../lib/game';
import { words } from '../data/words';
import { PartChips } from './Lesson';

function dueLabel(ms) {
  const d = ms - Date.now();
  if (d <= 0) return 'due now';
  if (d < 3600000) return `in ${Math.max(1, Math.round(d / 60000))} min`;
  const h = Math.round(d / 3600000);
  if (h < 24) return `in ${h}h`;
  return `in ${Math.round(h / 24)}d`;
}

export default function Review({ progress, onPlay, onLesson }) {
  const due = dueWords(progress);
  const weak = weakWords(progress, 6);
  const seen = seenCount(progress);
  const upcoming = words
    .map((w) => ({ w, st: wordState(progress, w.w) }))
    .filter((x) => x.st.n > 0 && x.st.due > Date.now())
    .sort((a, b) => a.st.due - b.st.due)
    .slice(0, 5);

  return (
    <div className="wrap">
      <section className="card lift">
        <h1 style={{ fontSize: '1.7rem' }}>
          {due.length === 0 ? 'Nothing is due right now.' : `${due.length} ${due.length === 1 ? 'word is' : 'words are'} due for review.`}
        </h1>
        <p className="muted" style={{ margin: '6px 0 12px' }}>
          Words come back on a schedule: 1 day, then 2, then 5, stretching out each time you get them right. A miss brings the word back within minutes. This is the part that makes words stick for test day.
        </p>
        {due.length > 0 ? (
          <button className="btn mint" onClick={() => onPlay('review')}>Review {Math.min(due.length, 10)} words</button>
        ) : seen === 0 ? (
          <p className="muted" style={{ margin: 0 }}>Play a branch on the tree to start meeting words.</p>
        ) : (
          <p className="muted" style={{ margin: 0 }}>You're caught up. {upcoming.length > 0 && `Next word is due ${dueLabel(upcoming[0].st.due)}.`}</p>
        )}
      </section>

      <section className="card">
        <div className="eyebrow">Where you stand</div>
        <div className="summary-grid">
          <div className="tile"><b>{seen}</b><span>words met</span></div>
          <div className="tile"><b>{masteredCount(progress)}</b><span>mastered</span></div>
          <div className="tile"><b>{words.length - seen}</b><span>still to meet</span></div>
        </div>
      </section>

      {weak.length > 0 && (
        <section className="card">
          <div className="eyebrow">Words that keep slipping</div>
          <p className="muted" style={{ margin: '4px 0 10px' }}>Lowest accuracy among words you've seen at least twice. Tap to study the root.</p>
          <div className="word-list">
            {weak.map(({ w, acc, n }) => (
              <button className="word-row as-btn" key={w.w} onClick={() => onLesson(w.r)}>
                <div className="row">
                  <span className="w">{w.w}</span>
                  <span className="pos">{w.pos}</span>
                  <span className="spacer" />
                  <span className="muted" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{Math.round(acc * 100)}% of {n}</span>
                </div>
                <div>{w.d}</div>
                <PartChips ids={w.p} highlight={w.r} />
              </button>
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="card">
          <div className="eyebrow">Coming up</div>
          <div className="upcoming">
            {upcoming.map(({ w, st }) => (
              <div key={w.w} className="row upcoming-row">
                <span style={{ fontWeight: 800 }}>{w.w}</span>
                <span className="spacer" />
                <span className="muted">{dueLabel(st.due)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
