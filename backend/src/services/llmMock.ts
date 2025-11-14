/**
 * llmMock.ts
 * Simple deterministic question generator. Replace with real LLM call (OpenAI, etc.)
 */

type GenParams = {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  num?: number;
  contextText?: string;
};

function diffValue(difficulty?: string) {
  return difficulty === 'easy' ? 0.25 : difficulty === 'hard' ? 0.8 : 0.5;
}

export async function generateQuestions(params: GenParams) {
  const { category = 'General', difficulty = 'easy', num = 5 } = params;
  const qs = [];
  const dv = diffValue(difficulty);
  for (let i = 0; i < num; i++) {
    const id = `q_${Date.now()}_${i}_${Math.floor(Math.random() * 1000)}`;
    const isMcq = i % 2 === 0;
    const skillKey = `${category.toLowerCase().replace(/\s+/g, '_')}_skill`;
    qs.push({
      id,
      prompt: `${category} sample ${isMcq ? 'MCQ' : 'short'} question #${i + 1}`,
      type: isMcq ? 'mcq' : 'short',
      choices: isMcq ? ['A', 'B', 'C', 'D'] : [],
      answer: isMcq ? ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] : `model answer ${i + 1}`,
      explanation: `One-line explanation for question ${i + 1}.`,
      skills: [skillKey],
      difficulty: dv,
      max_score: 1
    });
  }
  return qs;
}
