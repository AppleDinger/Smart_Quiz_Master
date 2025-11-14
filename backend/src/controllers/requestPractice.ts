import { Request, Response } from 'express';
import { pickAdaptiveQuestions } from '../services/adaptiveSelector';
import { validatePracticePayload } from '../utils/validators';
// Removed: import { getUserSkills } from '../store/inMemoryDB'; 

export async function requestPractice(req: Request, res: Response) { //
  try {
    const payload = req.body || {};
    const valid = validatePracticePayload(payload);
    if (!valid.ok) return res.status(400).json({ error: valid.error });

    const { userId = 'anon', numQuestions = 5 } = payload;
    const questions = pickAdaptiveQuestions(userId, Number(numQuestions));
    return res.json({ quizId: `adaptive_${Date.now()}`, questions });
  } catch (err) {
    console.error('requestPractice error', err);
    return res.status(500).json({ error: 'request practice failed' });
  }
}

// also provide GET /user-skills/:userId by re-exporting from DB
export async function getUserSkills(req: Request, res: Response) { //
  try {
    const userId = req.params.userId || 'anon';
    // FIX: Awaited dynamic import resolves to the module object, use dot access.
    const skills = (await import('../store/inMemoryDB')).getUserSkills(userId); 
    return res.json({ userId, skills });
  } catch (err) {
    console.error('getUserSkills error', err);
    return res.status(500).json({ error: 'failed to get skills' });
  }
}