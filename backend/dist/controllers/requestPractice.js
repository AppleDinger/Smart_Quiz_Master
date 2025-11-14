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
exports.requestPractice = requestPractice;
exports.getUserSkills = getUserSkills;
const adaptiveSelector_1 = require("../services/adaptiveSelector");
const validators_1 = require("../utils/validators");
// Removed: import { getUserSkills } from '../store/inMemoryDB'; 
async function requestPractice(req, res) {
    try {
        const payload = req.body || {};
        const valid = (0, validators_1.validatePracticePayload)(payload);
        if (!valid.ok)
            return res.status(400).json({ error: valid.error });
        const { userId = 'anon', numQuestions = 5 } = payload;
        const questions = (0, adaptiveSelector_1.pickAdaptiveQuestions)(userId, Number(numQuestions));
        return res.json({ quizId: `adaptive_${Date.now()}`, questions });
    }
    catch (err) {
        console.error('requestPractice error', err);
        return res.status(500).json({ error: 'request practice failed' });
    }
}
// also provide GET /user-skills/:userId by re-exporting from DB
async function getUserSkills(req, res) {
    try {
        const userId = req.params.userId || 'anon';
        // FIX: Awaited dynamic import resolves to the module object, use dot access.
        const skills = (await Promise.resolve().then(() => __importStar(require('../store/inMemoryDB')))).getUserSkills(userId);
        return res.json({ userId, skills });
    }
    catch (err) {
        console.error('getUserSkills error', err);
        return res.status(500).json({ error: 'failed to get skills' });
    }
}
