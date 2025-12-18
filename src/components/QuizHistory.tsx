import { ArrowLeft, Trophy, TrendingUp, Calendar, BarChart3, Trash2 } from 'lucide-react';
import { getGameHistory, getGameStats, clearGameHistory, type GameResult } from '../utils/gameHistory';
import { useState } from 'react';

interface QuizHistoryProps {
  onBack: () => void;
}

export function QuizHistory({ onBack }: QuizHistoryProps) {
  const [history, setHistory] = useState<GameResult[]>(getGameHistory());
  const stats = getGameStats();

  const handleClearHistory = () => {
    if (confirm('Czy na pewno chcesz usunąć całą historię gier? Tej operacji nie można cofnąć.')) {
      clearGameHistory();
      setHistory([]);
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = date.toLocaleDateString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const timeStr = date.toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (date.toDateString() === today.toDateString()) {
      return `Dziś, ${timeStr}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Wczoraj, ${timeStr}`;
    } else {
      return `${dateStr}, ${timeStr}`;
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100';
    if (percentage >= 60) return 'bg-blue-100';
    if (percentage >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="h-full flex flex-col p-4 py-6">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-3 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-base">Powrót</span>
        </button>
        
        <div className="flex items-center justify-between">
          <h1 className="text-gray-900 text-2xl flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-purple-600" />
            Historia Gier
          </h1>
          
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Wyczyść historię"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 text-white shadow-lg">
            <div className="flex items-center gap-1.5 mb-0.5 opacity-90">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">Rozegranych gier</span>
            </div>
            <p className="text-2xl">{stats.totalGames}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-3 text-white shadow-lg">
            <div className="flex items-center gap-1.5 mb-0.5 opacity-90">
              <Trophy className="w-3 h-3" />
              <span className="text-xs">Najlepszy wynik</span>
            </div>
            <p className="text-2xl">{stats.bestScore}/10</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-3 text-white shadow-lg">
            <div className="flex items-center gap-1.5 mb-0.5 opacity-90">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">Średni wynik</span>
            </div>
            <p className="text-2xl">{stats.averageScore}/10</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-3 text-white shadow-lg">
            <div className="flex items-center gap-1.5 mb-0.5 opacity-90">
              <BarChart3 className="w-3 h-3" />
              <span className="text-xs">Średnia %</span>
            </div>
            <p className="text-2xl">{stats.averagePercentage}%</p>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-6 text-center flex-1 flex flex-col justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-gray-900 text-xl mb-2">Brak historii gier</h2>
          <p className="text-gray-600 text-sm mb-4">
            Rozegraj swój pierwszy quiz, aby zobaczyć tutaj wyniki!
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-2xl text-base hover:shadow-lg transition-all mx-auto"
          >
            Rozpocznij Quiz
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <h2 className="text-gray-700 text-base mb-2 flex-shrink-0">Ostatnie {history.length} gier</h2>
          
          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-2">
            {history.map((game, index) => (
              <div
                key={game.id}
                className="bg-white rounded-2xl shadow-md p-3 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-xl ${getScoreBgColor(game.percentage)} flex items-center justify-center`}>
                      <span className={`text-base ${getScoreColor(game.percentage)}`}>
                        #{index + 1}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-gray-900 text-base">
                        <span className={getScoreColor(game.percentage)}>
                          {game.score}/{game.totalQuestions}
                        </span>
                        <span className="text-gray-500 text-sm ml-1.5">
                          ({game.percentage}%)
                        </span>
                      </p>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(game.date)}
                      </p>
                    </div>
                  </div>

                  {game.percentage >= 80 && (
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  )}
                </div>

                {/* Mini progress bar for answered questions */}
                <div className="flex gap-1 mt-2">
                  {game.answers.map((isCorrect, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 flex-1 rounded-full ${
                        isCorrect ? 'bg-green-500' : 'bg-red-400'
                      }`}
                      title={`Pytanie ${idx + 1}: ${isCorrect ? 'Poprawne' : 'Niepoprawne'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
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