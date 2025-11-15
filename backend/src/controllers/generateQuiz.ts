import { Request, Response } from 'express';
import { saveQuiz } from '../store/inMemoryDB';
import { validateGeneratePayload } from '../utils/validators';

// --- This is the change ---
// import { llmGenerateQuiz } from '../services/llmMock'; // Remove this line
import { llmGenerateQuiz } from '../services/llmService'; // Add this line
// --------------------------

export async function generateQuiz(req: Request, res: Response) {
  try {
    const payload = req.body || {};
    const valid = validateGeneratePayload(payload);
    if (!valid.ok) return res.status(400).json({ error: valid.error });

    const { 
      userId = 'anon', 
      category = 'general', 
      difficulty = 'medium', 
      numQuestions = 5 
    } = payload;

    // This function now calls your new llmService
    const quizData = await llmGenerateQuiz(category, difficulty, Number(numQuestions));
    
    const saved = saveQuiz(userId, quizData.category, quizData.difficulty, quizData.questions);
    
    return res.json({ 
      quizId: saved.id, 
      category: saved.category,
      difficulty: saved.difficulty,
      questions: quizData.questions 
    });

  } catch (err) {
    console.error('generateQuiz error', err);
    return res.status(500).json({ error: 'failed to generate quiz' });
  }
}