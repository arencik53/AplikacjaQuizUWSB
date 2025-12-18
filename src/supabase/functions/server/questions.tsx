import * as kv from "./kv_store.tsx";

export interface Question {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number | number[];
  type: 'single' | 'multiple';
  category: string;
  explanation: string;
}

const QUESTIONS_PREFIX = 'quiz_question_';

// Funkcja pomocnicza do generowania ID pytania
function getQuestionKey(id: string): string {
  return `${QUESTIONS_PREFIX}${id}`;
}

// Pobierz wszystkie pytania
export async function getAllQuestions(): Promise<Question[]> {
  try {
    const questions = await kv.getByPrefix(QUESTIONS_PREFIX);
    // getByPrefix już zwraca same wartości (bez kluczy)
    return questions as Question[];
  } catch (error) {
    console.error('Error fetching questions from database:', error);
    return [];
  }
}

// Pobierz pytanie po ID
export async function getQuestionById(id: string): Promise<Question | null> {
  try {
    const question = await kv.get(getQuestionKey(id));
    return question as Question | null;
  } catch (error) {
    console.error(`Error fetching question ${id}:`, error);
    return null;
  }
}

// Zapisz pytanie
export async function saveQuestion(question: Question): Promise<void> {
  try {
    await kv.set(getQuestionKey(question.id), question);
  } catch (error) {
    console.error(`Error saving question ${question.id}:`, error);
    throw error;
  }
}

// Zapisz wiele pytań
export async function saveQuestions(questions: Question[]): Promise<void> {
  try {
    const keys: string[] = [];
    const values: any[] = [];
    
    for (const question of questions) {
      keys.push(getQuestionKey(question.id));
      values.push(question);
    }
    
    await kv.mset(keys, values);
  } catch (error) {
    console.error('Error saving questions:', error);
    throw error;
  }
}

// Usuń pytanie
export async function deleteQuestion(id: string): Promise<void> {
  try {
    await kv.del(getQuestionKey(id));
  } catch (error) {
    console.error(`Error deleting question ${id}:`, error);
    throw error;
  }
}

// Pobierz losowe pytania (używane przez API)
export async function getRandomQuestions(singleCount: number = 8, multipleCount: number = 2): Promise<Question[]> {
  try {
    const allQuestions = await getAllQuestions();
    
    const singleQuestions = allQuestions.filter(q => q.type === 'single');
    const multipleQuestions = allQuestions.filter(q => q.type === 'multiple');
    
    // Losuj pytania pojedynczego wyboru
    const shuffledSingle = singleQuestions.sort(() => Math.random() - 0.5);
    const selectedSingle = shuffledSingle.slice(0, singleCount);
    
    // Losuj pytania wielokrotnego wyboru
    const shuffledMultiple = multipleQuestions.sort(() => Math.random() - 0.5);
    const selectedMultiple = shuffledMultiple.slice(0, multipleCount);
    
    // Połącz i ponownie przetasuj
    const allSelected = [...selectedSingle, ...selectedMultiple];
    return allSelected.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error getting random questions:', error);
    return [];
  }
}

// Pobierz losowe pytania z wagami (unikanie ostatnio używanych pytań)
export async function getRandomQuestionsWeighted(
  singleCount: number = 8,
  multipleCount: number = 2,
  recentQuestionIds: string[] = []
): Promise<Question[]> {
  try {
    const allQuestions = await getAllQuestions();
    
    const singleQuestions = allQuestions.filter(q => q.type === 'single');
    const multipleQuestions = allQuestions.filter(q => q.type === 'multiple');
    
    // Funkcja ważonego losowania
    const weightedRandomSelect = (questions: Question[], count: number): Question[] => {
      const selected: Question[] = [];
      const available = [...questions];
      
      for (let i = 0; i < count && available.length > 0; i++) {
        // Oblicz wagi: pytania z historii mają wagę 0.1, nieużywane wagę 1.0
        const weights = available.map(q => 
          recentQuestionIds.includes(q.id) ? 0.1 : 1.0
        );
        
        // Oblicz sumę wag
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        
        // Losuj z wagami
        let random = Math.random() * totalWeight;
        let selectedIndex = 0;
        
        for (let j = 0; j < weights.length; j++) {
          random -= weights[j];
          if (random <= 0) {
            selectedIndex = j;
            break;
          }
        }
        
        // Dodaj wylosowane pytanie i usuń z dostępnych
        selected.push(available[selectedIndex]);
        available.splice(selectedIndex, 1);
      }
      
      return selected;
    };
    
    // Losuj pytania z wagami
    const selectedSingle = weightedRandomSelect(singleQuestions, singleCount);
    const selectedMultiple = weightedRandomSelect(multipleQuestions, multipleCount);
    
    // Połącz i ponownie przetasuj
    const allSelected = [...selectedSingle, ...selectedMultiple];
    return allSelected.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error getting weighted random questions:', error);
    return [];
  }
}