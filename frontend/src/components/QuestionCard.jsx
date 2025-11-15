import React, { useState } from 'react';

function QuestionCard({ question, onAnswerSubmit, disabled }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedAnswer) {
      onAnswerSubmit(selectedAnswer);
    }
  };

  if (!question) {
    return <div>Loading question...</div>;
  }

  const { type, prompt, choices } = question;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{prompt}</h2>
      
      <form onSubmit={handleSubmit}>
        {type === 'mcq' && choices && (
          <div className="space-y-3">
            {choices.map((choice, index) => {
              const choiceId = `q_${question.id}_choice_${index}`;
              return (
                <label 
                  key={choiceId} 
                  htmlFor={choiceId}
                  className={`block p-4 rounded-lg border cursor-pointer ${
                    selectedAnswer === choice 
                      ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-300' 
                      : 'border-gray-300 hover:bg-gray-50'
                  } ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    id={choiceId}
                    name={question.id}
                    value={choice}
                    checked={selectedAnswer === choice}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    disabled={disabled}
                    className="mr-3"
                  />
                  {choice}
                </label>
              );
            })}
          </div>
        )}

        {type === 'short' && (
          <div>
            <input
              type="text"
              placeholder="Type your answer..."
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={disabled}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300"
            />
          </div>
        )}

        {!disabled && (
          <button
            type="submit"
            disabled={!selectedAnswer}
            className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Submit Answer
          </button>
        )}
      </form>
    </div>
  );
}

export default QuestionCard;