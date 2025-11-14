import React from 'react';
import SkillBadge from './SkillBadge';

export default function QuestionCard({ q, onSubmit, disabled }) {
  if (!q) return <div className="qcard"><em>No question</em></div>;

  return (
    <div className="qcard" aria-live="polite">
      <div style={{ marginBottom: 8 }}>
        <strong>Q:</strong>
        <div style={{ marginTop: 6 }}>{q.prompt}</div>
      </div>

      {q.skills && q.skills.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {q.skills.map(s => <SkillBadge key={s} label={s} />)}
        </div>
      )}

      {q.type === 'mcq' ? (
        <div className="choices">
          {q.choices.map(ch => (
            <button key={ch} onClick={() => onSubmit(q.id, ch)} disabled={disabled}>{ch}</button>
          ))}
        </div>
      ) : (
        <ShortAnswer q={q} onSubmit={onSubmit} disabled={disabled} />
      )}
    </div>
  );
}

function ShortAnswer({ q, onSubmit, disabled }) {
  const [val, setVal] = React.useState('');
  return (
    <div>
      <input value={val} onChange={e => setVal(e.target.value)} placeholder="Type your answer" style={{ padding: 8, width: '70%', marginRight: 8 }} />
      <button onClick={() => { onSubmit(q.id, val); setVal(''); }} disabled={disabled}>Submit</button>
    </div>
  );
}
