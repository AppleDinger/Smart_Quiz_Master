import { Request, Response } from 'express';
import { getQuestionById } from '../store/inMemoryDB';
import { updateSkill } from '../services/skillModel';
import { pickAdaptiveQuestions } from '../services/adaptiveSelector';
import { validateSubmitPayload } from '../utils/validators';

export async function submitAnswer(req: Request, res: Response) {
  try {
    const payload = req.body || {};
    const valid = validateSubmitPayload(payload);
    if (!valid.ok) return res.status(400).json({ error: valid.error });

    const { userId = 'anon', questionId, userAnswer } = payload;
    const q = getQuestionById(questionId);
    if (!q) return res.status(404).json({ error: 'question not found' });

    // simple grader
    let score = 0;
    if (q.type === 'mcq') {
      const ua = (userAnswer || '').toString().trim().toUpperCase();
      const ca = (q.answer || '').toString().trim().toUpperCase();
      score = ua === ca ? 1 : 0;
    } else {
      // very small heuristic for short answers (demo)
      const ua = (userAnswer || '').toString().trim().toLowerCase();
      const ca = (q.answer || '').toString().trim().toLowerCase();
      if (!ua) score = 0;
      else if (ca.includes(ua) || ua.includes(ca)) score = 1;
      else if (ua.length > 10 && ca.split(' ').slice(0, 2).some(w => ua.includes(w))) score = 0.5;
      else score = 0;
    }

    // update skills for each tagged skill on the question
    const touched = q.skills?.length ? q.skills : ['general'];
    const updates = touched.map(skill => {
      const updated = updateSkill(userId, skill, score, q.difficulty ?? 0.5);
      return { skill, updated };
    });

    // pick recommendations (adaptive)
    const recommendations = pickAdaptiveQuestions(userId, 5);

    return res.json({
      questionId: q.id,
      score,
      maxScore: q.max_score ?? 1,
      feedback: q.explanation ?? '',
      updatedSkills: updates,
      recommendations,
      userSkills: (await import('../store/inMemoryDB')).then(m => m.getUserSkills(userId)).catch(() => ({}))
    });
  } catch (err) {
    console.error('submitAnswer error', err);
    return res.status(500).json({ error: 'submit failed' });
  }
}
