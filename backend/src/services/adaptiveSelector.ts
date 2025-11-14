/**
 * adaptiveSelector.ts
 * Picks candidate questions prioritizing weak skills and difficulty.
 */

import { getAllQuestions } from '../store/inMemoryDB';
import { getUserSkillRecord } from '../store/inMemoryDB';

export function pickAdaptiveQuestions(userId: string, num = 5) {
  const all = getAllQuestions();
  const scored = all.map(q => {
    const skill = Array.isArray(q.skills) && q.skills.length ? q.skills[0] : 'general';
    const record = getUserSkillRecord(userId, skill) || { score: 0.4 };
    const skillScore = record.score ?? 0.4;
    const priority = (1 - skillScore) + ((q.difficulty ?? 0.5) * 0.2);
    return { q, priority };
  });
  scored.sort((a, b) => b.priority - a.priority);
  return scored.slice(0, num).map(s => s.q);
}
