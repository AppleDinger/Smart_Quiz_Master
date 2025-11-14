import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuiz } from '../services/api';

function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Call the API to generate a quiz
      const quizData = await generateQuiz({
        category: 'General Knowledge',
        difficulty: 'medium',
        numQuestions: 5
      });
      
      // 2. On success, navigate to the Quiz page and pass the
      // quiz data along in the router's state.
      navigate('/quiz', { state: { quizData } });

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Smart Quiz!</h1>
      <p className="text-lg text-gray-700 mb-8">
        Test your knowledge with our adaptive AI-powered quizzes.
      </p>
      
      <button
        onClick={handleStartQuiz}
        disabled={loading}
        className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-xl hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Start a New Quiz'}
      </button>

      {error && (
        <p className="text-red-500 mt-4">
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  );
}

export default Home;