import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratedQuiz, Question } from '../types';
import dotenv from 'dotenv';

dotenv.config();

// 1. Initialize the Generative AI client
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in your .env file");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generates a quiz by calling the Gemini LLM.
 */
export async function llmGenerateQuiz(
  category: string, 
  difficulty: string, 
  numQuestions: number
): Promise<GeneratedQuiz> {
  
  console.log(`Real LLM generating ${numQuestions} questions for ${category} ${difficulty}...`);

  // 2. Create a prompt for the AI
  const prompt = `
    You are a helpful quiz generation assistant.
    Generate a ${numQuestions}-question quiz about "${category}" with a ${difficulty} difficulty.
    
    Respond with ONLY a valid JSON object in the following format:
    {
      "category": "${category}",
      "difficulty": "${difficulty}",
      "questions": [
        {
          "id": "q1",
          "prompt": "Question prompt here...",
          "type": "mcq",
          "choices": ["A", "B", "C", "D"],
          "answer": "The correct answer",
          "explanation": "A brief explanation of the answer.",
          "skills": ["skill1", "skill2"],
          "difficulty": 0.5
        }
      ]
    }
  `;

  try {
    // 3. Call the AI model
    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // -----------------------------------------------------------
    // ***** NEW LOGGING ADDED HERE *****
    // This will show us exactly what the AI sent back.
    console.log("--- RAW AI RESPONSE START ---");
    console.log(text);
    console.log("--- RAW AI RESPONSE END ---");
    // -----------------------------------------------------------

    // 4. Clean and parse the AI's response
    // The AI might wrap the JSON in ```json ... ```
    text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
    
    const quizData = JSON.parse(text);

    // Ensure IDs are unique
    quizData.questions.forEach((q: Question, index: number) => {
      q.id = `llm_${Date.now()}_${index + 1}`;
    });

    return quizData as GeneratedQuiz;

  } catch (error) {
    // This will now log the specific JSON parse error
    console.error('Error in llmService:', error);
    throw new Error('Failed to generate quiz from LLM');
  }
}