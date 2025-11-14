// backend/src/store/inMemoryDB.ts
import type { Question, Quiz } from '../types';

/**
 * inMemoryDB.ts
 * Typed in-memory storage for questions, quizzes, attempts and user skills.
 */

const quizzes: Record<string, Quiz> = {};
const questions: Record<string, Question> = {};
const userSkills: Record<string, Record<string, { score: number; intervalDays?: number; nextReview?: string }>> = {};
const attempts: any[] = [];

/* Quiz helpers */
export function saveQuiz(userId: string, category: string, difficulty: string, qArr: Question[]) {
  const quizId = `quiz_${Date.now()}`;
  const quiz: Quiz = {
    id: quizId,
    userId,
    category,
    difficulty,
    questions: qArr.map(q => q.id),
    createdAt: new Date().toISOString()
  };
  quizzes[quizId] = quiz;

  // save questions into question store (overwrite if exists)
  qArr.forEach(q => {
    questions[q.id] = q;
  });

  return quiz;
}

export function getAllQuestions(): Question[] {
  return Object.values(questions);
}

export function getQuestionById(id: string): Question | undefined {
  return questions[id];
}

export function saveAttempt(attempt: any) {
  attempts.push(attempt);
  return attempt;
}

/* User skills helpers */
export function getUserSkills(userId: string) {
  return userSkills[userId] || {};
}

export function getUserSkillRecord(userId: string, skillKey: string) {
  if (!userSkills[userId]) return undefined;
  return userSkills[userId][skillKey];
}

export function setUserSkillRecord(userId: string, skillKey: string, record: { score: number; intervalDays?: number; nextReview?: string }) {
  if (!userSkills[userId]) userSkills[userId] = {};
  userSkills[userId][skillKey] = record;
  return record;
}

/* Utility */
export function getQuestionStoreSize(): number {
  return Object.keys(questions).length;
}

/* Re-exports (compatible names expected elsewhere) */
export { getQuestionById as getQuestionById, saveQuiz as saveQuiz, getUserSkills as getUserSkills, getUserSkillRecord, setUserSkillRecord };