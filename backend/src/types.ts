// This is the definition for a single question
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

// This is the type we expect the LLM to generate
export type GeneratedQuiz = {
  category: string;
  difficulty: string;
  questions: Question[];
};

// This is for your database
export type Quiz = {
  id: string;
  userId: string;
  category: string;
  difficulty: string;
  questions: string[]; // array of question ids
  createdAt: string;
};

// This is for the skill model
export type UserSkillRecord = {
  score: number;
  intervalDays?: number;
  nextReview?: string;
};