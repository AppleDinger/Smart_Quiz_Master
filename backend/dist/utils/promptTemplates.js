"use strict";
/**
 * promptTemplates.ts
 * Store prompt templates (strings). For demo we just keep sample templates.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVALUATOR_PROMPT = exports.GENERATOR_PROMPT = void 0;
exports.GENERATOR_PROMPT = `
You are a quiz generator. Produce {{num}} questions for category "{{category}}" and difficulty "{{difficulty}}".
Return JSON array of objects with fields:
{id, prompt, type (mcq|short), choices (if mcq), answer, explanation, skills (array), difficulty (0-1)}
`;
exports.EVALUATOR_PROMPT = `
You are a strict grader. Use the canonical answer and the user's answer to produce a JSON:
{score: number (0-1), feedback: string, skills_shown: [], skills_missing: []}
`;
