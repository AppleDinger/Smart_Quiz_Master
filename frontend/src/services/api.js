// Get the backend URL from the environment variable
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * A helper for making API requests
 */
async function apiFetch(endpoint, options = {}) {
  const { body, ...restOptions } = options;
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const config = {
    method: body ? 'POST' : 'GET',
    headers,
    ...restOptions,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'API request failed');
  }

  return response.json();
}

/**
 * Calls the backend to generate a new quiz.
 */
export function generateQuiz(options) {
  // The backend route is /api/generate
  return apiFetch('/api/generate', {
    body: {
      userId: options.userId || 'anon',
      category: options.category || 'general',
      difficulty: options.difficulty || 'medium',
      numQuestions: options.numQuestions || 5,
    },
  });
}

/**
 * Submits an answer to the backend.
 */
export function submitAnswer(options) {
  // The backend route is /api/submit
  return apiFetch('/api/submit', {
    body: {
      userId: options.userId || 'anon',
      quizId: options.quizId,
      questionId: options.questionId,
      userAnswer: options.userAnswer,
    },
  });
}

/**
 * Fetches the user's skill dashboard.
 */
export function getUserSkills(userId = 'anon') {
  // The backend route is /api/user-skills/:userId
  return apiFetch(`/api/user-skills/${userId}`);
}