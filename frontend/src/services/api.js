const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : 'http://localhost:4000/api';

export async function generateQuiz(payload) {
  const r = await fetch(`${API}/generate-quiz`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error('generate failed');
  return r.json();
}

export async function submitAnswer(payload) {
  const r = await fetch(`${API}/submit-answer`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error('submit failed');
  return r.json();
}

export async function requestPractice(payload) {
  const r = await fetch(`${API}/request-practice`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error('request practice failed');
  return r.json();
}

export async function userSkills(userId) {
  const r = await fetch(`${API}/user-skills/${encodeURIComponent(userId)}`);
  if (!r.ok) throw new Error('user skills failed');
  return r.json();
}
