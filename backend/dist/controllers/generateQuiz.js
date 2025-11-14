"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuiz = generateQuiz;
const extractorMock_1 = require("../services/extractorMock");
const llmMock_1 = require("../services/llmMock");
const inMemoryDB_1 = require("../store/inMemoryDB");
const validators_1 = require("../utils/validators");
/**
 * Normalize a looser object returned by an LLM / mock into our strict Question type.
 * Ensures `type` is exactly 'mcq' | 'short' and provides safe defaults for other fields.
 */
function normalizeToQuestion(raw) {
    const rawType = String(raw?.type ?? '').toLowerCase();
    // normalize type to discriminated union
    let type = null;
    if (rawType === 'mcq' || rawType === 'multiple-choice' || rawType === 'multiple_choice')
        type = 'mcq';
    else if (rawType === 'short' || rawType === 'short-answer' || rawType === 'short_answer')
        type = 'short';
    else {
        // fallback heuristic: if choices exist, prefer mcq, otherwise short
        if (Array.isArray(raw?.choices) && raw.choices.length > 0)
            type = 'mcq';
        else
            type = 'short';
    }
    const choices = Array.isArray(raw?.choices) ? raw.choices.map((c) => String(c)) : (type === 'mcq' ? ['A', 'B', 'C', 'D'] : []);
    const q = {
        id: String(raw?.id ?? `q_${Date.now()}_${Math.floor(Math.random() * 10000)}`),
        prompt: String(raw?.prompt ?? '').trim(),
        type,
        choices,
        answer: raw?.answer != null ? String(raw.answer) : '',
        explanation: raw?.explanation != null ? String(raw.explanation) : '',
        skills: Array.isArray(raw?.skills) ? raw.skills.map((s) => String(s)) : [],
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
async function generateQuiz(req, res) {
    try {
        const payload = req.body ?? {};
        const valid = (0, validators_1.validateGeneratePayload)(payload);
        if (!valid.ok) {
            return res.status(400).json({ error: valid.error });
        }
        const userId = String(payload.userId ?? 'anon');
        const category = String(payload.category ?? 'General');
        const difficulty = String(payload.difficulty ?? 'easy');
        const numQuestions = Number(payload.numQuestions ?? 5);
        const context = payload.context ?? null;
        // optional: extract text from provided context (pdf/url/youtube/content)
        let extractedText = '';
        if (context && typeof context === 'object' && context.type) {
            try {
                extractedText = await (0, extractorMock_1.extractText)(context);
            }
            catch (ex) {
                console.warn('extractText failed, continuing without context:', ex);
                extractedText = '';
            }
        }
        // call LLM / generator (mock or real implementation)
        const rawQuestions = await (0, llmMock_1.generateQuestions)({
            category,
            difficulty: difficulty,
            num: numQuestions,
            contextText: extractedText
        });
        // normalize each raw question into strict Question type
        const questions = Array.isArray(rawQuestions)
            ? rawQuestions.map((r) => normalizeToQuestion(r))
            : [];
        // quick sanity: ensure at least one question was produced
        if (!questions.length) {
            return res.status(500).json({ error: 'No questions generated' });
        }
        // save quiz (in-memory DB) and return
        const quiz = (0, inMemoryDB_1.saveQuiz)(userId, category, difficulty, questions);
        return res.json({ quizId: quiz.id, questions });
    }
    catch (err) {
        console.error('generateQuiz error:', err);
        return res.status(500).json({ error: 'generate failed' });
    }
}
