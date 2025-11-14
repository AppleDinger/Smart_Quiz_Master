import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { submitAnswer } from '../services/api';
import QuestionCard from '../components/QuestionCard'; // Assuming this component exists

function Quiz() {
  const location = useLocation();
  const quizData = location.state?.quizData;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);

  // If the user lands on this page directly without quiz data, send them home.
  if (!quizData) {
    return <Navigate to="/" replace />;
  }

  const { quizId, questions } = quizData;
  const currentQuestion = questions[currentQIndex];

  const handleAnswerSubmit = async (answer) => {
    const questionId = currentQuestion.id;

    // Store the user's answer
    setUserAnswers({ ...userAnswers, [questionId]: answer });

    try {
      // Send the answer to the backend
      const result = await submitAnswer({
        quizId,
        questionId,
        userAnswer: answer,
      });
      
      // Show feedback
      setFeedback(result);

    } catch (error) {
      console.error('Failed to submit answer:', error);
      setFeedback({ error: error.message });
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null); // Clear old feedback
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Quiz is over!
      alert('Quiz complete! Check the dashboard to see your skills.');
      // You could navigate to the dashboard here
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quiz: {quizData.category}</h1>
      
      {/* Pass the question data to your card component */}
      <QuestionCard 
        question={currentQuestion}
        onAnswerSubmit={handleAnswerSubmit}
        disabled={!!feedback} // Disable card after an answer is submitted
      />

      {feedback && (
        <div className={`mt-4 p-4 rounded-lg ${feedback.score > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
          <h2 className="font-bold text-lg">
            {feedback.score > 0 ? 'Correct!' : 'Incorrect'} (Score: {feedback.score})
          </h2>
          <p className="mt-2">{feedback.feedback}</p>
          <button
            onClick={handleNextQuestion}
            className="mt-4 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700"
          >
            {currentQIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;