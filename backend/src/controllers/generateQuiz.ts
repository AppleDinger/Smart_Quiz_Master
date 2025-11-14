// backend/src/controllers/generateQuiz.ts
import type { Question } from '../types';
import { Request, Response } from 'express';
import { extractText } from '../services/extractorMock';
import { generateQuestions as llmGenerate } from '../services/llmMock';
import { saveQuiz } from '../store/inMemoryDB';
import { validateGeneratePayload } from '../utils/validators';

/**
 * Normalize a looser object returned by an LLM / mock into our strict Question type.
 * Ensures `type` is exactly 'mcq' | 'short' and provides safe defaults for other fields.
 */
function normalizeToQuestion(raw: any): Question {
  const rawType = String(raw?.type ?? '').toLowerCase();

  // normalize type to discriminated union
  let type: Question['type'] | null = null;
  if (rawType === 'mcq' || rawType === 'multiple-choice' || rawType === 'multiple_choice') type = 'mcq';
  else if (rawType === 'short' || rawType === 'short-answer' || rawType === 'short_answer') type = 'short';
  else {
    // fallback heuristic: if choices exist, prefer mcq, otherwise short
    if (Array.isArray(raw?.choices) && raw.choices.length > 0) type = 'mcq';
    else type = 'short';
  }

  const choices = Array.isArray(raw?.choices) ? raw.choices.map((c: any) => String(c)) : (type === 'mcq' ? ['A', 'B', 'C', 'D'] : []);

  const q: Question = {
    id: String(raw?.id ?? `q_${Date.now()}_${Math.floor(Math.random() * 10000)}`),
    prompt: String(raw?.prompt ?? '').trim(),
    type,
    choices,
    answer: raw?.answer != null ? String(raw.answer) : '',
    explanation: raw?.explanation != null ? String(raw.explanation) : '',
    skills: Array.isArray(raw?.skills) ? raw.skills.map((s: any) => String(s)) : [],
    difficulty: typeof raw?.difficulty === 'number' ? raw.difficulty : 0.5,
    max_score: typeof raw?.max_score === 'number' ? raw.max_score : 1
  };

  return q;
}

/**
 * Controller: generateQuiz
 * - validates payload
 * - optionally extracts context text
 * - calls LLM mock (or real generator)
 * - normalizes output to Question[]
 * - saves quiz and returns id + questions
 */
export async function generateQuiz(req: Request, res: Response) {
  try {
    const payload = req.body ?? {};
    const valid = validateGeneratePayload(payload);
    if (!valid.ok) {
      return res.status(400).json({ error: valid.error });
    }

    const userId: string = String(payload.userId ?? 'anon');
    const category: string = String(payload.category ?? 'General');
    const difficulty: string = String(payload.difficulty ?? 'easy');
    const numQuestions: number = Number(payload.numQuestions ?? 5);
    const context = payload.context ?? null;

    // optional: extract text from provided context (pdf/url/youtube/content)
    let extractedText = '';
    if (context && typeof context === 'object' && context.type) {
      try {
        extractedText = await extractText(context);
      } catch (ex) {
        console.warn('extractText failed, continuing without context:', ex);
        extractedText = '';
      }
    }

    // call LLM / generator (mock or real implementation)
    const rawQuestions = await llmGenerate({
      category,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      num: numQuestions,
      contextText: extractedText
    });

    // normalize each raw question into strict Question type
    const questions: Question[] = Array.isArray(rawQuestions)
      ? rawQuestions.map((r: any) => normalizeToQuestion(r))
      : [];

    // quick sanity: ensure at least one question was produced
    if (!questions.length) {
      return res.status(500).json({ error: 'No questions generated' });
    }

    // save quiz (in-memory DB) and return
    const quiz = saveQuiz(userId, category, difficulty, questions);

    return res.json({ quizId: quiz.id, questions });
  } catch (err) {
    console.error('generateQuiz error:', err);
    return res.status(500).json({ error: 'generate failed' });
  }
}