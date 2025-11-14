"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuestions = generateQuestions;
function diffValue(difficulty) {
    if (difficulty === 'easy')
        return 0.25;
    if (difficulty === 'hard')
        return 0.8;
    return 0.5;
}
async function generateQuestions(params) {
    const { category = 'General', difficulty = 'easy', num = 5 } = params;
    const dv = diffValue(difficulty);
    const qs = [];
    for (let i = 0; i < num; i++) {
        const isMcq = i % 2 === 0;
        const id = `q_${Date.now()}_${i}_${Math.floor(Math.random() * 10000)}`;
        const skillKey = `${category.toLowerCase().replace(/\s+/g, '_')}_skill`;
        const q = {
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
