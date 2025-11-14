/**
 * skillModel.ts
 * Simple in-memory Elo-like skill updater.
 */

import { getUserSkillRecord, setUserSkillRecord } from '../store/inMemoryDB';

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export function updateSkill(userId: string, skillKey: string, observed: number /* 0..1 */, difficulty: number) {
  const record = getUserSkillRecord(userId, skillKey) || { score: 0.4, intervalDays: 1, nextReview: new Date().toISOString() };

  const expected = sigmoid(record.score - difficulty);
  const K = 0.12;
  const newScore = Math.max(0, Math.min(1, record.score + K * (observed - expected)));

  // update simple spaced repetition interval
  let interval = record.intervalDays || 1;
  if (observed >= 0.75) interval = Math.min(90, Math.max(1, interval * 2.5));
  else interval = Math.max(0.5, interval * 0.7);

  const nextReview = new Date(Date.now() + interval * 24 * 3600 * 1000).toISOString();

  const updated = { score: newScore, intervalDays: interval, nextReview };
  setUserSkillRecord(userId, skillKey, updated);
  return updated;
}
