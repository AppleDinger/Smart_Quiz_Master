// inMemoryDB.ts
// Simple in-memory storage for quizzes, questions, attempts and user skills.

export type Question = {
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

export type Quiz = {
  id: string;
  userId: string;
  category: string;
  difficulty: string;
  questions: string[]; // question ids
  createdAt: string;
};

export type UserSkillRecord = {
  score: number;
  intervalDays?: number;
  nextReview?: string;
};

const quizzes: Record<string, Quiz> = {};
const questions: Record<string, Question> = {};
const userSkills: Record<string, Record<string, UserSkillRecord>> = {};
const attempts: Array<Record<string, any>> = [];

// quiz helpers
export function saveQuiz(userId: string, category: string, difficulty: string, qArr: Question[]): Quiz {
  const quizId = `quiz_${Date.now()}`;
  const quiz: Quiz = {
    id: quizId,
    userId,
    category,
    difficulty,
    questions: qArr.map(q => q.id),
    createdAt: new Date().toISOString(),
  };
  quizzes[quizId] = quiz;

  // store/overwrite questions by id
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

export function saveAttempt(attempt: Record<string, any>) {
  attempts.push(attempt);
  return attempt;
}

// user skills
export function getUserSkills(userId: string): Record<string, UserSkillRecord> {
  return userSkills[userId] || {};
}

export function getUserSkillRecord(userId: string, skillKey: string): UserSkillRecord | undefined {
  if (!userSkills[userId]) return undefined;
  return userSkills[userId][skillKey];
}

export function setUserSkillRecord(userId: string, skillKey: string, record: UserSkillRecord): UserSkillRecord {
  if (!userSkills[userId]) userSkills[userId] = {};
  userSkills[userId][skillKey] = record;
  return record;
}

export function getQuestionStoreSize(): number {
  return Object.keys(questions).length;
}