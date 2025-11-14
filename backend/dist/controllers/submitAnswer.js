"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitAnswer = submitAnswer;
const inMemoryDB_1 = require("../store/inMemoryDB");
const skillModel_1 = require("../services/skillModel");
const adaptiveSelector_1 = require("../services/adaptiveSelector");
const validators_1 = require("../utils/validators");
async function submitAnswer(req, res) {
    try {
        const payload = req.body || {};
        const valid = (0, validators_1.validateSubmitPayload)(payload);
        if (!valid.ok)
            return res.status(400).json({ error: valid.error });
        const { userId = 'anon', questionId, userAnswer } = payload;
        const q = (0, inMemoryDB_1.getQuestionById)(questionId);
        if (!q)
            return res.status(404).json({ error: 'question not found' });
        // simple grader
        let score = 0;
        if (q.type === 'mcq') {
            const ua = (userAnswer || '').toString().trim().toUpperCase();
            const ca = (q.answer || '').toString().trim().toUpperCase();
            score = ua === ca ? 1 : 0;
        }
        else {
            // very small heuristic for short answers (demo)
            const ua = (userAnswer || '').toString().trim().toLowerCase();
            const ca = (q.answer || '').toString().trim().toLowerCase();
            if (!ua)
                score = 0;
            else if (ca.includes(ua) || ua.includes(ca))
                score = 1;
            else if (ua.length > 10 && ca.split(' ').slice(0, 2).some(w => ua.includes(w)))
                score = 0.5;
            else
                score = 0;
        }
        // update skills for each tagged skill on the question
        const touched = q.skills?.length ? q.skills : ['general'];
        const updates = touched.map(skill => {
            const updated = (0, skillModel_1.updateSkill)(userId, skill, score, q.difficulty ?? 0.5);
            return { skill, updated };
        });
        // pick recommendations (adaptive)
        const recommendations = (0, adaptiveSelector_1.pickAdaptiveQuestions)(userId, 5);
        return res.json({
            questionId: q.id,
            score,
            maxScore: q.max_score ?? 1,
            feedback: q.explanation ?? '',
            updatedSkills: updates,
            recommendations,
            // This line has been corrected from the original:
            userSkills: (await Promise.resolve().then(() => __importStar(require('../store/inMemoryDB')))).getUserSkills(userId)
        });
    }
    catch (err) {
        console.error('submitAnswer error', err);
        return res.status(500).json({ error: 'submit failed' });
    }
}
