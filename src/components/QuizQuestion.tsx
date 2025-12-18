import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Question } from '../data/quizData';

interface UserAnswer {
  selectedAnswer: number | number[];
  isCorrect: boolean;
}

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedAnswer: number | number[], isCorrect: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  previousAnswer: UserAnswer | null;
  hasUnansweredQuestions: boolean;
  unansweredQuestions: number[];
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  previousAnswer,
  hasUnansweredQuestions,
  unansweredQuestions,
}: QuizQuestionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Załaduj poprzednią odpowiedź jeśli wracamy do pytania
  useEffect(() => {
    if (previousAnswer) {
      const prevAnswer = previousAnswer.selectedAnswer;
      setSelectedAnswers(Array.isArray(prevAnswer) ? prevAnswer : [prevAnswer]);
      setShowResult(true);
      setIsChecked(true);
    } else {
      setSelectedAnswers([]);
      setShowResult(false);
      setIsChecked(false);
    }
  }, [previousAnswer, questionNumber]);

  const handleSelectAnswer = (index: number) => {
    if (isChecked) return;
    
    if (question.type === 'single') {
      // Dla pytań pojedynczego wyboru - możliwość zmiany
      setSelectedAnswers([index]);
    } else {
      // Dla pytań wielokrotnego wyboru - toggle
      if (selectedAnswers.includes(index)) {
        setSelectedAnswers(selectedAnswers.filter(i => i !== index));
      } else {
        setSelectedAnswers([...selectedAnswers, index]);
      }
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswers.length === 0) return;
    
    setShowResult(true);
    setIsChecked(true);
    
    if (question.type === 'single') {
      const isCorrect = selectedAnswers[0] === question.correctAnswer;
      onAnswer(selectedAnswers[0], isCorrect);
    } else {
      const correctAnswers = question.correctAnswer as number[];
      const isCorrect = 
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every(ans => correctAnswers.includes(ans));
      
      onAnswer(selectedAnswers, isCorrect);
    }
  };

  const handleNextClick = () => {
    // Jeśli jeszcze nie sprawdzono odpowiedzi
    if (!isChecked) {
      handleCheckAnswer();
      return;
    }
    
    // Jeśli już sprawdzono, przechodzimy dalej
    if (canGoNext) {
      onNext();
    } else if (hasUnansweredQuestions) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 5000);
    } else {
      // Wszystkie pytania zostały odpowiedziane - zakończ quiz
      onNext();
    }
  };

  const getNextButtonText = () => {
    if (!isChecked) {
      // Przed sprawdzeniem
      if (question.type === 'multiple') {
        return `Sprawdź odpowiedzi (${selectedAnswers.length})`;
      }
      return 'Sprawdź odpowiedź';
    }
    // Po sprawdzeniu
    return canGoNext ? 'Następne' : 'Zakończ';
  };

  const getNextButtonColor = () => {
    if (!isChecked) {
      return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700';
    }
    return 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700';
  };

  const getAnswerClassName = (index: number) => {
    const isSelected = selectedAnswers.includes(index);
    
    if (!showResult) {
      if (question.type === 'multiple') {
        return isSelected
          ? 'bg-blue-100 border-blue-500'
          : 'bg-white hover:bg-gray-50 border-gray-200';
      }
      return isSelected
        ? 'bg-blue-100 border-blue-500'
        : 'bg-white hover:bg-gray-50 border-gray-200';
    }
    
    const correctAnswers = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer 
      : [question.correctAnswer];
    
    const isCorrect = correctAnswers.includes(index);
    
    // Dla pytań wielokrotnego wyboru
    if (question.type === 'multiple') {
      if (isCorrect && isSelected) {
        // Poprawnie zaznaczona odpowiedź - zielony
        return 'bg-green-100 border-green-500';
      }
      if (isCorrect && !isSelected) {
        // Poprawna odpowiedź, która nie została zaznaczona - żółty
        return 'bg-yellow-100 border-yellow-500';
      }
      if (!isCorrect && isSelected) {
        // Błędnie zaznaczona odpowiedź - czerwony
        return 'bg-red-100 border-red-500';
      }
      // Niepoprawna odpowiedź, która nie została zaznaczona - biały
      return 'bg-white border-gray-200';
    }
    
    // Dla pytań pojedynczego wyboru (stara logika)
    if (isCorrect) {
      return 'bg-green-100 border-green-500';
    }
    
    if (isSelected && !isCorrect) {
      return 'bg-red-100 border-red-500';
    }
    
    return 'bg-white border-gray-200';
  };

  const getAnswerIcon = (index: number) => {
    if (!showResult) {
      if (question.type === 'multiple' && selectedAnswers.includes(index)) {
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      }
      return null;
    }
    
    const correctAnswers = Array.isArray(question.correctAnswer) 
      ? question.correctAnswer 
      : [question.correctAnswer];
    
    const isCorrect = correctAnswers.includes(index);
    const isSelected = selectedAnswers.includes(index);
    
    // Dla pytań wielokrotnego wyboru
    if (question.type === 'multiple') {
      if (isCorrect && isSelected) {
        // Poprawnie zaznaczona - zielona ikonka
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      }
      if (isCorrect && !isSelected) {
        // Pominięta poprawna odpowiedź - żółta ikonka
        return <CheckCircle2 className="w-5 h-5 text-yellow-600" />;
      }
      if (!isCorrect && isSelected) {
        // Błędnie zaznaczona - czerwony X
        return <XCircle className="w-5 h-5 text-red-600" />;
      }
      return null;
    }
    
    // Dla pytań pojedynczego wyboru (stara logika)
    if (isCorrect) {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    
    if (isSelected && !isCorrect) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    
    return null;
  };

  return (
    <div className="h-full flex flex-col" style={{ padding: 'clamp(2rem, 4vh, 3rem) clamp(0.75rem, 3vw, 1.5rem) clamp(0.5rem, 1.5vh, 1rem)' }}>
      <div className="flex-shrink-0" style={{ marginBottom: 'clamp(0.5rem, 1.5vh, 0.75rem)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'clamp(0.3rem, 0.8vh, 0.5rem)' }}>
          <span className="text-gray-600" style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)' }}>
            Pytanie {questionNumber} / {totalQuestions}
          </span>
          <span className="text-blue-600" style={{ fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)' }}>
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="bg-gray-200 rounded-full overflow-hidden" style={{ height: 'clamp(0.5rem, 1.2vh, 0.7rem)' }}>
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white rounded-2xl shadow-xl flex-shrink-0" style={{ padding: 'clamp(1rem, 2.5vh, 1.5rem)', marginBottom: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full" style={{ padding: 'clamp(0.2rem, 0.6vh, 0.4rem) clamp(0.6rem, 2.5vw, 1rem)', fontSize: 'clamp(0.8rem, 3.2vw, 1rem)' }}>
              {question.category}
            </div>
            {question.type === 'multiple' && (
              <div className="inline-block bg-orange-500 text-white rounded-full" style={{ padding: 'clamp(0.2rem, 0.6vh, 0.4rem) clamp(0.6rem, 2.5vw, 1rem)', fontSize: 'clamp(0.8rem, 3.2vw, 1rem)' }}>
                Wielokrotny wybór
              </div>
            )}
          </div>
          <h2 className="text-gray-900 leading-snug" style={{ fontSize: 'clamp(1.05rem, 4.5vw, 1.4rem)' }}>{question.question}</h2>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1.2vh, 0.75rem)', marginBottom: 'clamp(0.5rem, 1vh, 0.6rem)' }}>
            {question.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={isChecked}
                className={`w-full rounded-xl border-2 transition-all text-left flex items-center justify-between active:scale-95 ${getAnswerClassName(
                  index
                )} ${!isChecked ? 'cursor-pointer' : 'cursor-default'}`}
                style={{ padding: 'clamp(0.9rem, 2vh, 1.3rem)' }}
              >
                <span className="text-gray-900 pr-2" style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>{answer}</span>
                {getAnswerIcon(index) && (
                  <div style={{ width: 'clamp(1.3rem, 5vw, 1.8rem)', height: 'clamp(1.3rem, 5vw, 1.8rem)', flexShrink: 0 }}>
                    {getAnswerIcon(index)}
                  </div>
                )}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0" style={{ padding: 'clamp(0.8rem, 2vh, 1.2rem)', marginBottom: 'clamp(0.5rem, 1vh, 0.6rem)' }}>
              <p className="text-gray-700" style={{ fontSize: 'clamp(0.95rem, 3.8vw, 1.15rem)' }}>{question.explanation}</p>
            </div>
          )}

          {showWarning && (
            <div className="rounded-xl bg-red-50 border-2 border-red-300 animate-pulse flex-shrink-0" style={{ padding: 'clamp(0.8rem, 2vh, 1.2rem)', marginBottom: 'clamp(0.5rem, 1vh, 0.6rem)' }}>
              <p className="text-red-700" style={{ fontSize: 'clamp(0.95rem, 3.8vw, 1.15rem)', marginBottom: 'clamp(0.3rem, 0.8vh, 0.5rem)' }}>
                ⚠️ Nie odpowiedziałeś na wszystkie pytania!
              </p>
              <p className="text-red-600" style={{ fontSize: 'clamp(0.85rem, 3.2vw, 1rem)' }}>
                Brakujące pytania: {unansweredQuestions.map(q => q + 1).join(', ')}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-shrink-0" style={{ gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`flex-1 bg-white border-2 border-gray-300 text-gray-700 rounded-xl flex items-center justify-center ${
              canGoPrevious ? 'active:scale-95' : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ padding: 'clamp(1rem, 2.5vh, 1.5rem) 0', gap: 'clamp(0.4rem, 1.5vw, 0.7rem)' }}
          >
            <ChevronLeft style={{ width: 'clamp(1.3rem, 5vw, 1.8rem)', height: 'clamp(1.3rem, 5vw, 1.8rem)' }} />
            <span style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>Poprzednie</span>
          </button>
          
          <button
            onClick={handleNextClick}
            disabled={!isChecked && selectedAnswers.length === 0}
            className={`flex-1 ${getNextButtonColor()} text-white rounded-xl flex items-center justify-center ${
              !isChecked && selectedAnswers.length === 0 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
            }`}
            style={{ padding: 'clamp(1rem, 2.5vh, 1.5rem) 0', gap: 'clamp(0.4rem, 1.5vw, 0.7rem)' }}
          >
            <span style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>{getNextButtonText()}</span>
            <ChevronRight style={{ width: 'clamp(1.3rem, 5vw, 1.8rem)', height: 'clamp(1.3rem, 5vw, 1.8rem)' }} />
          </button>
        </div>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
    </div>
  );
}