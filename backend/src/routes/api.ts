import { Router } from 'express';
import { generateQuiz } from '../controllers/generateQuiz';
import { submitAnswer } from '../controllers/submitAnswer';
import { requestPractice } from '../controllers/requestPractice';
import { getUserSkills } from '../controllers/requestPractice';

const router = Router();

router.post('/generate-quiz', generateQuiz);
router.post('/submit-answer', submitAnswer);
router.post('/request-practice', requestPractice);
router.get('/user-skills/:userId', getUserSkills);

export default router;
