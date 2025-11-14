"use strict";
/**
 * adaptiveSelector.ts
 * Picks candidate questions prioritizing weak skills and difficulty.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickAdaptiveQuestions = pickAdaptiveQuestions;
const inMemoryDB_1 = require("../store/inMemoryDB");
const inMemoryDB_2 = require("../store/inMemoryDB");
function pickAdaptiveQuestions(userId, num = 5) {
    const all = (0, inMemoryDB_1.getAllQuestions)();
    const scored = all.map(q => {
        const skill = Array.isArray(q.skills) && q.skills.length ? q.skills[0] : 'general';
        const record = (0, inMemoryDB_2.getUserSkillRecord)(userId, skill) || { score: 0.4 };
        const skillScore = record.score ?? 0.4;
        const priority = (1 - skillScore) + ((q.difficulty ?? 0.5) * 0.2);
        return { q, priority };
    });
    scored.sort((a, b) => b.priority - a.priority);
    return scored.slice(0, num).map(s => s.q);
}
