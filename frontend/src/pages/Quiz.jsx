import React, { useState, useEffect } from 'react';
import QuestionCard from '../components/QuestionCard';
import { submitAnswer, userSkills } from '../services/api';

export default function Quiz({ quiz: initialQuiz, onBack }) {
  const [quiz, setQuiz] = useState(initialQuiz);
  const [index, setIndex] = useState(0);
  const [lastResponse, setLastResponse] = useState(null);
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuiz(initialQuiz);
    setIndex(0);
    setLastResponse(null);
    if (initialQuiz?.userId) fetchSkills(initialQuiz.userId);
    // eslint-disable-next-line
  }, [initialQuiz]);

  async function fetchSkills(userId) {
    try {
      const res = await userSkills(userId);
      setSkills(res.skills || {});
    } catch (e) {
      console.warn('fetchSkills failed', e);
    }
  }

  if (!quiz) {
    return (
      <section>
        <div>No quiz loaded. <button onClick={onBack}>Back</button></div>
      </section>
    );
  }

  const q = quiz.questions[index];

  async function handleSubmit(questionId, userAnswer) {
    setLoading(true);
    try {
      const resp = await submitAnswer({ userId: quiz.userId, questionId, userAnswer });
      setLastResponse(resp);
      // merge recommendations
      if (resp.recommendations && resp.recommendations.length) {
        const before = quiz.questions.slice(0, index + 1);
        const after = quiz.questions.slice(index + 1);
        const merged = before.concat(resp.recommendations).concat(after);
        setQuiz(prev => ({ ...prev, questions: merged }));
      }
      if (resp.userSkills) setSkills(resp.userSkills);
      else if (quiz.userId) fetchSkills(quiz.userId);
      // advance index
      setIndex(i => Math.min(i + 1, quiz.questions.length - 1));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Quiz</h2>
        <div>
          <button onClick={onBack} className="secondary">End quiz</button>
        </div>
      </div>

      <div className="small">Quiz ID: {quiz.quizId} — Progress: {index + 1} / {quiz.questions.length}</div>

      <QuestionCard q={q} onSubmit={handleSubmit} disabled={loading} />

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setIndex(i => Math.max(0, i - 1))} className="secondary">Prev</button>
        <button onClick={() => setIndex(i => Math.min(quiz.questions.length - 1, i + 1))} className="secondary" style={{ marginLeft: 8 }}>Next</button>
      </div>

      <section style={{ marginTop: 12 }}>
        <h3>Mastery snapshot</h3>
        {Object.keys(skills).length === 0 ? <div className="small">No skill data</div> :
          Object.entries(skills).map(([k, v]) => (
            <div key={k}><strong>{k}</strong> — {Math.round((v.score || 0) * 100)}% (next: {new Date(v.nextReview || Date.now()).toLocaleString()})</div>
          ))}
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Last response</h3>
        <pre>{lastResponse ? JSON.stringify(lastResponse, null, 2) : '—'}</pre>
      </section>
    </section>
  );
}
