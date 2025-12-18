import { Trophy, RotateCcw, CheckCircle2, XCircle, Eye, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import type { Question } from '../data/quizData';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  answers: boolean[];
  questions: Question[];
  onRestart: () => void;
  onShowHistory: () => void;
}

export function QuizResults({
  score,
  totalQuestions,
  answers,
  questions,
  onRestart,
  onShowHistory,
}: QuizResultsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const percentage = Math.round((score / totalQuestions) * 100);

  const getResultMessage = () => {
    if (percentage >= 90) return { title: 'Doskonale!', message: 'Jesteś ekspertem od UWSB Merito!', color: 'text-green-600' };
    if (percentage >= 70) return { title: 'Bardzo dobrze!', message: 'Znasz uczelnię naprawdę dobrze!', color: 'text-blue-600' };
    if (percentage >= 50) return { title: 'Niezłe!', message: 'Nie jest źle, ale jest przestrzeń do nauki.', color: 'text-yellow-600' };
    return { title: 'Spróbuj ponownie!', message: 'Poznaj lepiej naszą uczelnię.', color: 'text-orange-600' };
  };

  const result = getResultMessage();

  return (
    <div className="h-full flex flex-col" style={{ padding: 'clamp(0.75rem, 2vh, 1.5rem) clamp(0.75rem, 3vw, 1.5rem)' }}>
      <LayoutGroup>
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="popLayout">
            {!showDetails && (
              <motion.div 
                className="text-center flex-shrink-0" 
                style={{ marginBottom: 'clamp(0.75rem, 2vh, 1.25rem)' }}
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div className="flex justify-center" style={{ marginBottom: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl" style={{ padding: 'clamp(0.5rem, 1.5vh, 1rem)' }}>
                    <Trophy style={{ width: 'clamp(2rem, 8vw, 3.5rem)', height: 'clamp(2rem, 8vw, 3.5rem)' }} className="text-white" />
                  </div>
                </div>
                
                <h1 className={result.color} style={{ fontSize: 'clamp(1.1rem, 4.5vw, 1.5rem)', marginBottom: 'clamp(0.3rem, 1vh, 0.6rem)' }}>{result.title}</h1>
                <p className="text-gray-600 px-4" style={{ fontSize: 'clamp(0.75rem, 3vw, 0.95rem)', marginBottom: 'clamp(0.75rem, 2vh, 1.25rem)' }}>{result.message}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl flex-shrink-0" 
            style={{ padding: 'clamp(0.75rem, 2vh, 1.25rem)', marginBottom: 'clamp(0.75rem, 2vh, 1.25rem)' }}
            layout
            transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
          >
            <div className="text-center">
              <div className="text-blue-100" style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)', marginBottom: 'clamp(0.2rem, 0.5vh, 0.4rem)' }}>Twój wynik</div>
              <div className="text-white" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.25rem)', marginBottom: 'clamp(0.3rem, 1vh, 0.6rem)' }}>
                {score} / {totalQuestions}
              </div>
              <div className="text-white" style={{ fontSize: 'clamp(0.75rem, 3vw, 0.95rem)', marginBottom: 'clamp(0.3rem, 1vh, 0.6rem)' }}>poprawnych odpowiedzi</div>
              <div className="bg-white/20 rounded-full inline-block" style={{ padding: 'clamp(0.2rem, 0.5vh, 0.3rem) clamp(0.75rem, 3vw, 1.25rem)' }}>
                <div className="text-white" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>{percentage}%</div>
              </div>
            </div>
          </motion.div>

          {!showDetails ? (
            <button
              onClick={() => setShowDetails(true)}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 flex-shrink-0"
              style={{ padding: 'clamp(0.75rem, 2vh, 1.25rem) 0', fontSize: 'clamp(0.85rem, 3.5vw, 1.05rem)', marginBottom: 'clamp(0.75rem, 2vh, 1.25rem)' }}
            >
              <Eye style={{ width: 'clamp(1rem, 4vw, 1.5rem)', height: 'clamp(1rem, 4vw, 1.5rem)' }} />
              <span>Sprawdź odpowiedzi</span>
            </button>
          ) : (
            <motion.div 
              className="flex-1 flex flex-col overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <motion.div 
                className="flex items-center justify-between flex-shrink-0" 
                style={{ marginBottom: 'clamp(0.5rem, 1.5vh, 1rem)' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <h3 className="text-gray-900" style={{ fontSize: 'clamp(0.95rem, 4vw, 1.2rem)' }}>Szczegóły odpowiedzi:</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-blue-600 underline"
                  style={{ fontSize: 'clamp(0.85rem, 3.5vw, 1rem)' }}
                >
                  Zwiń
                </button>
              </motion.div>
              <div className="flex-1 overflow-y-auto hide-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem, 1.2vh, 0.8rem)' }}>
                {questions.map((question, index) => (
                  <motion.div
                    key={index}
                    className={`rounded-xl border-2 ${
                      answers[index]
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                    style={{ padding: 'clamp(0.75rem, 1.8vh, 1.2rem)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.4 + (index * 0.1),
                      ease: "easeOut"
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0">
                        {answers[index] ? (
                          <CheckCircle2 style={{ width: 'clamp(1.1rem, 4.5vw, 1.5rem)', height: 'clamp(1.1rem, 4.5vw, 1.5rem)' }} className="text-green-600" />
                        ) : (
                          <XCircle style={{ width: 'clamp(1.1rem, 4.5vw, 1.5rem)', height: 'clamp(1.1rem, 4.5vw, 1.5rem)' }} className="text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900" style={{ fontSize: 'clamp(0.9rem, 3.6vw, 1.1rem)', marginBottom: 'clamp(0.3rem, 0.8vh, 0.5rem)' }}>
                          <span className="text-gray-500" style={{ fontSize: 'clamp(0.75rem, 3vw, 0.9rem)' }}>Pytanie {index + 1}:</span>
                          <br />
                          {question.question}
                        </p>
                        <p className="text-gray-600 bg-white/50 rounded" style={{ fontSize: 'clamp(0.8rem, 3.2vw, 1rem)', padding: 'clamp(0.4rem, 1.2vh, 0.7rem)' }}>
                          <span className="text-green-600">✓ Poprawna odpowiedź:</span><br />
                          {
                            Array.isArray(question.correctAnswer)
                              ? question.correctAnswer.map(i => question.answers[i]).join(', ')
                              : question.answers[question.correctAnswer]
                          }
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom buttons - only shown when details are hidden */}
        {!showDetails && (
          <div className="flex-shrink-0" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.4rem, 1vh, 0.6rem)' }}>
            <button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
              style={{ padding: 'clamp(0.75rem, 2vh, 1.25rem) 0', fontSize: 'clamp(0.85rem, 3.5vw, 1.05rem)' }}
            >
              <RotateCcw style={{ width: 'clamp(1rem, 4vw, 1.5rem)', height: 'clamp(1rem, 4vw, 1.5rem)' }} />
              <span>Rozpocznij quiz ponownie</span>
            </button>
            <button
              onClick={onShowHistory}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
              style={{ padding: 'clamp(0.75rem, 2vh, 1.25rem) 0', fontSize: 'clamp(0.85rem, 3.5vw, 1.05rem)' }}
            >
              <BarChart3 style={{ width: 'clamp(1rem, 4vw, 1.5rem)', height: 'clamp(1rem, 4vw, 1.5rem)' }} />
              <span>Historia quizów</span>
            </button>
          </div>
        )}

        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          
          .hide-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `}</style>
      </LayoutGroup>
    </div>
  );
}