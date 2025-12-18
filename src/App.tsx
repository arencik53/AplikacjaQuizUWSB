import { useState } from 'react';
import { QuizStart } from './components/QuizStart';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { QuizHistory } from './components/QuizHistory';
import { getRandomQuestions, saveQuestionHistory, type Question } from './data/quizData';
import { saveGameResult } from './utils/gameHistory';
import { initializeQuestionsInDatabase, checkQuestionsInDatabase } from './utils/initQuestions';

interface UserAnswer {
  selectedAnswer: number | number[];
  isCorrect: boolean;
}

export default function App() {
  const [quizState, setQuizState] = useState<'start' | 'playing' | 'results' | 'loading' | 'history'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(UserAnswer | null)[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [dbInitialized, setDbInitialized] = useState(false);

  const handleStart = async () => {
    setQuizState('loading');
    
    // Sprawdź czy baza danych jest zainicjalizowana
    if (!dbInitialized) {
      const count = await checkQuestionsInDatabase();
      console.log(`Questions in database: ${count}`);
      
      if (count === 0) {
        console.log('Initializing database with questions...');
        await initializeQuestionsInDatabase();
      }
      setDbInitialized(true);
    }
    
    // Pobierz losowe pytania
    const randomQuestions = await getRandomQuestions();
    setQuizQuestions(randomQuestions);
    setQuizState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers(new Array(10).fill(null));
  };

  const handleAnswer = (selectedAnswer: number | number[], isCorrect: boolean) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = { selectedAnswer, isCorrect };
    setUserAnswers(newUserAnswers);
    
    // Przelicz wynik na podstawie wszystkich odpowiedzi
    const newScore = newUserAnswers.filter(ans => ans?.isCorrect).length;
    setScore(newScore);
  };

  const handleNext = () => {
    const unanswered = userAnswers
      .map((ans, idx) => (ans === null ? idx : -1))
      .filter(idx => idx !== -1);

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (unanswered.length === 0) {
      // Zapisz pytania do historii przed przejściem do wyników
      const questionIds = quizQuestions
        .map(q => q.id)
        .filter((id): id is string => id !== undefined);
      
      if (questionIds.length > 0) {
        saveQuestionHistory(questionIds);
      }
      
      // Zapisz wynik gry do historii
      const answersArray = getAnswersArray();
      saveGameResult(score, quizQuestions.length, answersArray);
      
      setQuizState('results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setQuizState('start');
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
    setQuizQuestions([]);
  };

  const getAnswersArray = () => {
    return userAnswers.map(ans => ans?.isCorrect || false);
  };

  const getUnansweredQuestions = () => {
    return userAnswers
      .map((ans, idx) => (ans === null ? idx : -1))
      .filter(idx => idx !== -1);
  };

  const handleShowHistory = () => {
    setQuizState('history');
  };

  const handleBackFromHistory = () => {
    setQuizState('start');
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-md mx-auto h-full">
        {quizState === 'start' && (
          <QuizStart 
            onStart={handleStart}
            onShowHistory={handleShowHistory}
          />
        )}
        
        {quizState === 'history' && (
          <QuizHistory onBack={handleBackFromHistory} />
        )}
        
        {quizState === 'playing' && quizQuestions.length > 0 && (
          <QuizQuestion
            question={quizQuestions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            totalQuestions={quizQuestions.length}
            onAnswer={handleAnswer}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoPrevious={currentQuestion > 0}
            canGoNext={currentQuestion + 1 < quizQuestions.length}
            previousAnswer={userAnswers[currentQuestion]}
            hasUnansweredQuestions={getUnansweredQuestions().length > 0}
            unansweredQuestions={getUnansweredQuestions()}
          />
        )}
        
        {quizState === 'results' && (
          <QuizResults
            score={score}
            totalQuestions={quizQuestions.length}
            answers={getAnswersArray()}
            questions={quizQuestions}
            onRestart={handleRestart}
            onShowHistory={handleShowHistory}
          />
        )}
        
        {quizState === 'loading' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
              <h2 className="text-gray-900 text-2xl mb-2">Ładowanie pytań...</h2>
              <p className="text-gray-600 text-base">Przygotowujemy quiz dla Ciebie</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}