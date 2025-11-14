import React, { useState, useEffect } from 'react';
import { userSkills } from '../services/api';

export default function Dashboard() {
  const [userId, setUserId] = useState('demo_user');
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSkills(); }, []); // eslint-disable-line

  async function fetchSkills() {
    setLoading(true);
    try {
      const res = await userSkills(userId);
      setSkills(res.skills || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Dashboard</h2>
      <div style={{ marginBottom: 10 }}>
        <label>User:
          <input value={userId} onChange={e => setUserId(e.target.value)} style={{ marginLeft: 8 }} />
        </label>
        <button onClick={fetchSkills} style={{ marginLeft: 8 }}>Load</button>
      </div>

      {loading && <div className="small">Loading…</div>}

      <div>
        {Object.keys(skills).length === 0 ? <div className="small">No skill data yet</div> :
          Object.entries(skills).map(([k, v]) => (
            <div key={k} style={{ marginBottom: 8 }}>
              <strong>{k}</strong> — mastery {Math.round((v.score || 0) * 100)}%
              <div className="small">next review: {new Date(v.nextReview || Date.now()).toLocaleString()}</div>
            </div>
          ))}
      </div>
    </section>
  );
}
