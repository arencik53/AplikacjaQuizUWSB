import { allQuestions } from '../data/quizData';
import { projectId, publicAnonKey } from './supabase/info';

// Funkcja do zainicjowania pytań w bazie danych
export async function initializeQuestionsInDatabase(): Promise<boolean> {
  try {
    console.log('Initializing questions in database...');
    
    // Dodaj ID do każdego pytania
    const questionsWithIds = allQuestions.map((q, index) => ({
      id: `q${index + 1}`,
      ...q
    }));
    
    console.log(`Prepared ${questionsWithIds.length} questions for initialization`);
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-1bd2a132/questions/init`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ questions: questionsWithIds })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to initialize questions:', error);
      console.error('Response status:', response.status);
      return false;
    }
    
    const result = await response.json();
    console.log('Questions initialized successfully:', result);
    return true;
  } catch (error) {
    console.error('Error initializing questions:', error);
    return false;
  }
}

// Funkcja do sprawdzenia czy pytania są już w bazie
export async function checkQuestionsInDatabase(): Promise<number> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-1bd2a132/questions`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      }
    );
    
    if (!response.ok) {
      return 0;
    }
    
    const result = await response.json();
    return result.count || 0;
  } catch (error) {
    console.error('Error checking questions:', error);
    return 0;
  }
}