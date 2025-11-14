"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGeneratePayload = validateGeneratePayload;
exports.validateSubmitPayload = validateSubmitPayload;
exports.validatePracticePayload = validatePracticePayload;
function validateGeneratePayload(body) {
    if (!body)
        return { ok: false, error: 'empty body' };
    if (body.numQuestions !== undefined && (isNaN(Number(body.numQuestions)) || Number(body.numQuestions) < 1)) {
        return { ok: false, error: 'numQuestions must be a positive number' };
    }
    return { ok: true };
}
function validateSubmitPayload(body) {
    if (!body)
        return { ok: false, error: 'empty body' };
    if (!body.questionId)
        return { ok: false, error: 'questionId required' };
    return { ok: true };
}
function validatePracticePayload(body) {
    if (!body)
        return { ok: false, error: 'empty body' };
    if (body.numQuestions !== undefined && (isNaN(Number(body.numQuestions)) || Number(body.numQuestions) < 1)) {
        return { ok: false, error: 'numQuestions must be a positive number' };
    }
    return { ok: true };
}
