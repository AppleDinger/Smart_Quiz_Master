/**
 * inMemoryDB.ts
 * Simple in-memory storage for quizzes, questions, attempts and user skills.
 */

type Question = {
  id: string;
  prompt: string;
  type: 'mcq' | 'short';
  choices?: string[];
  answer?: string;
  explanation?: string;
  skills?: string[];
  difficulty?: number;
  max_score?: number;
};

type Quiz = {
  id: string;
  userId: string;
  category: string;
  difficulty: string;
  questions: string[]; // question ids
  createdAt: string;
};

const quizzes: Record<string, Quiz> = {};
const questions: Record<string, Question> = {};
const userSkills: Record<string, Record<string, { score: number; intervalDays?: number; nextReview?: string }>> = {};
const attempts: any[] = [];

// quiz helpers
export function saveQuiz(userId: string, category: string, difficulty: string, qArr: Question[]) {
  const quizId = `quiz_${Date.now()}`;
  quizzes[quizId] = { id: quizId, userId, category, difficulty, questions: qArr.map(q => q.id), createdAt: new Date().toISOString() };
  qArr.forEach(q => (questions[q.id] = q));
  return quizzes[quizId];
}

export function getAllQuestions() {
  return Object.values(questions);
}

export function getQuestionById(id: string) {
  return questions[id];
}

export function saveAttempt(attempt: any) {
  attempts.push(attempt);
  return attempt;
}

// user skills
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

export function getQuestionStoreSize() {
  return Object.keys(questions).length;
}

// re-exports with names used elsewhere
export { getQuestionById as getQuestionById, saveQuiz as saveQuiz, getUserSkills as getUserSkills, getUserSkillRecord, setUserSkillRecord };
