import React, { useState } from 'react';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [route, setRoute] = useState('home'); // 'home' | 'quiz' | 'dashboard'
  const [currentQuiz, setCurrentQuiz] = useState(null);

  function onStartQuiz(quiz) {
    setCurrentQuiz(quiz);
    setRoute('quiz');
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Smart Quiz</h1>
        <nav>
          <button onClick={() => setRoute('home')} className="nav-btn">Home</button>
          <button onClick={() => setRoute('quiz')} className="nav-btn" disabled={!currentQuiz}>Quiz</button>
          <button onClick={() => setRoute('dashboard')} className="nav-btn">Dashboard</button>
        </nav>
      </header>

      <main>
        {route === 'home' && <Home onStartQuiz={onStartQuiz} />}
        {route === 'quiz' && <Quiz quiz={currentQuiz} onBack={() => setRoute('home')} />}
        {route === 'dashboard' && <Dashboard />}
      </main>

      <footer style={{ marginTop: 18, color: '#666', fontSize: 13 }}>
        Demo frontend — expects backend at <code>http://localhost:4000/api</code>
      </footer>
    </div>
  );
}
