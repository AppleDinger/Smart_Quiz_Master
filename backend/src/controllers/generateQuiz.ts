import { Request, Response } from 'express';
import { extractText } from '../services/extractorMock';
import { generateQuestions } from '../services/llmMock';
import { saveQuiz } from '../store/inMemoryDB';
import { validateGeneratePayload } from '../utils/validators';

export async function generateQuiz(req: Request, res: Response) {
  try {
    const payload = req.body || {};
    const valid = validateGeneratePayload(payload);
    if (!valid.ok) return res.status(400).json({ error: valid.error });

    const { userId = 'anon', category = 'General', difficulty = 'easy', numQuestions = 5, context } = payload;

    // optional: extract text (mock) if context provided
    let extracted = '';
    if (context && context.type) {
      extracted = await extractText(context);
    }

    // generate questions (mock LLM). Pass extracted context if present.
    const questions = await generateQuestions({ category, difficulty, num: Number(numQuestions), contextText: extracted });

    // save to in-memory store
    const quiz = saveQuiz(userId, category, difficulty, questions);

    return res.json({ quizId: quiz.id, questions: questions });
  } catch (err) {
    console.error('generateQuiz error', err);
    return res.status(500).json({ error: 'generate failed' });
  }
}
