export function validateGeneratePayload(body: any) {
  if (!body) return { ok: false, error: 'empty body' };
  if (body.numQuestions !== undefined && (isNaN(Number(body.numQuestions)) || Number(body.numQuestions) < 1)) {
    return { ok: false, error: 'numQuestions must be a positive number' };
  }
  return { ok: true };
}

export function validateSubmitPayload(body: any) {
  if (!body) return { ok: false, error: 'empty body' };
  if (!body.questionId) return { ok: false, error: 'questionId required' };
  return { ok: true };
}

export function validatePracticePayload(body: any) {
  if (!body) return { ok: false, error: 'empty body' };
  if (body.numQuestions !== undefined && (isNaN(Number(body.numQuestions)) || Number(body.numQuestions) < 1)) {
    return { ok: false, error: 'numQuestions must be a positive number' };
  }
  return { ok: true };
}
