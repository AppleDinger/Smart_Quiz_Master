import React, { useState } from 'react';
import { generateQuiz, requestPractice } from '../services/api';

export default function Home({ onStartQuiz }) {
  const [userId, setUserId] = useState('demo_user');
  const [category, setCategory] = useState('Math');
  const [difficulty, setDifficulty] = useState('easy');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function handleGenerate() {
    setErr(null);
    setLoading(true);
    try {
      const res = await generateQuiz({ userId, category, difficulty, numQuestions });
      // backend returns { quizId, questions }
      onStartQuiz({ quizId: res.quizId, questions: res.questions, userId });
    } catch (e) {
      console.error(e);
      setErr('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  }

  async function handlePractice() {
    setErr(null);
    setLoading(true);
    try {
      const res = await requestPractice({ userId, numQuestions });
      onStartQuiz({ quizId: res.quizId, questions: res.questions, userId });
    } catch (e) {
      console.error(e);
      setErr('Failed to request practice');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Generate Quiz</h2>
      <div className="form-row">
        <label>User:
          <input value={userId} onChange={e => setUserId(e.target.value)} />
        </label>
        <label>Category:
          <input value={category} onChange={e => setCategory(e.target.value)} />
        </label>
        <label>Difficulty:
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </label>
        <label># Questions:
          <input type="number" min="1" max="50" value={numQuestions} onChange={e => setNumQuestions(e.target.value)} />
        </label>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={handleGenerate} disabled={loading}>Generate</button>
        <button onClick={handlePractice} disabled={loading} style={{ marginLeft: 8 }}>Adaptive Practice</button>
      </div>

      {err && <div className="error">{err}</div>}
      {loading && <div className="small">Loading…</div>}
    </section>
  );
}
