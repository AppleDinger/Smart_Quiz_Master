export type QuestionType = 'mcq' | 'short';

export type Question = {
  id: string;
  prompt: string;
  type: QuestionType;
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
  questions: string[]; // array of question ids
  createdAt: string;
};