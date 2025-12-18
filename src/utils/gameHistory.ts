export interface GameResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: boolean[];
}

const GAME_HISTORY_KEY = 'quiz_game_history';
const MAX_HISTORY_GAMES = 50; // Przechowuj ostatnie 50 gier

// Funkcja do pobierania historii gier z localStorage
export function getGameHistory(): GameResult[] {
  try {
    const history = localStorage.getItem(GAME_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading game history:', error);
    return [];
  }
}

// Funkcja do zapisywania wyniku gry
export function saveGameResult(score: number, totalQuestions: number, answers: boolean[]): void {
  try {
    const currentHistory = getGameHistory();
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    const newResult: GameResult = {
      id: `game_${Date.now()}`,
      date: new Date().toISOString(),
      score,
      totalQuestions,
      percentage,
      answers
    };
    
    // Dodaj nowy wynik na początek historii
    const updatedHistory = [newResult, ...currentHistory];
    
    // Ogranicz do MAX_HISTORY_GAMES
    const limitedHistory = updatedHistory.slice(0, MAX_HISTORY_GAMES);
    
    localStorage.setItem(GAME_HISTORY_KEY, JSON.stringify(limitedHistory));
    console.log(`Saved game result: ${score}/${totalQuestions} (${percentage}%)`);
  } catch (error) {
    console.error('Error saving game result:', error);
  }
}

// Funkcja do usuwania całej historii
export function clearGameHistory(): void {
  try {
    localStorage.removeItem(GAME_HISTORY_KEY);
    console.log('Game history cleared');
  } catch (error) {
    console.error('Error clearing game history:', error);
  }
}

// Funkcja do obliczania statystyk
export function getGameStats(): {
  totalGames: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  averagePercentage: number;
} {
  const history = getGameHistory();
  
  if (history.length === 0) {
    return {
      totalGames: 0,
      averageScore: 0,
      bestScore: 0,
      worstScore: 0,
      averagePercentage: 0
    };
  }
  
  const totalGames = history.length;
  const averageScore = history.reduce((sum, game) => sum + game.score, 0) / totalGames;
  const bestScore = Math.max(...history.map(game => game.score));
  const worstScore = Math.min(...history.map(game => game.score));
  const averagePercentage = history.reduce((sum, game) => sum + game.percentage, 0) / totalGames;
  
  return {
    totalGames,
    averageScore: Math.round(averageScore * 10) / 10,
    bestScore,
    worstScore,
    averagePercentage: Math.round(averagePercentage)
  };
}
