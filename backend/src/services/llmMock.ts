import type { Question } from '../types';


/**
 * llmMock.ts
 * Returns a properly-typed array of Question objects.
 * Replace with real LLM call later if needed.
 */

type GenParams = {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  num?: number;
  contextText?: string;
};

function diffValue(difficulty?: string): number {
  if (difficulty === 'easy') return 0.25;
  if (difficulty === 'hard') return 0.8;
  return 0.5;
}

export async function generateQuestions(params: GenParams): Promise<Question[]> {
  const { category = 'General', difficulty = 'easy', num = 5 } = params;
  const dv = diffValue(difficulty);
  const qs: Question[] = [];

  for (let i = 0; i < num; i++) {
    const isMcq = i % 2 === 0;
    const id = `q_${Date.now()}_${i}_${Math.floor(Math.random() * 10000)}`;
    const skillKey = `${category.toLowerCase().replace(/\s+/g, '_')}_skill`;

    const q: Question = {
      id,
      prompt: `${category} sample ${isMcq ? 'MCQ' : 'short'} question #${i + 1}`,
      type: isMcq ? 'mcq' : 'short',
      choices: isMcq ? ['A', 'B', 'C', 'D'] : undefined,
      answer: isMcq ? 'A' : `model answer ${i + 1}`,
      explanation: `One-line explanation for question ${i + 1}.`,
      skills: [skillKey],
      difficulty: dv,
      max_score: 1
    };

    qs.push(q);
  }

  return qs;
}