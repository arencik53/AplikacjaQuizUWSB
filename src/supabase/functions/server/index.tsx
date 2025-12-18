import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as questions from "./questions.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-1bd2a132/health", (c) => {
  return c.json({ status: "ok" });
});

// Get random quiz questions
app.get("/make-server-1bd2a132/questions/random", async (c) => {
  try {
    const singleCount = parseInt(c.req.query('single') || '8');
    const multipleCount = parseInt(c.req.query('multiple') || '2');
    const recentIds = c.req.query('recent') || '';
    
    // Parsuj historię pytań (oddzielone przecinkami)
    const recentQuestionIds = recentIds ? recentIds.split(',').filter(id => id.length > 0) : [];
    
    // Użyj ważonego losowania jeśli jest historia
    const randomQuestions = recentQuestionIds.length > 0
      ? await questions.getRandomQuestionsWeighted(singleCount, multipleCount, recentQuestionIds)
      : await questions.getRandomQuestions(singleCount, multipleCount);
    
    if (randomQuestions.length === 0) {
      return c.json({ error: "No questions found in database. Please initialize the questions first." }, 404);
    }
    
    return c.json({ questions: randomQuestions });
  } catch (error) {
    console.error('Error fetching random questions:', error);
    return c.json({ error: "Failed to fetch questions" }, 500);
  }
});

// Get all questions
app.get("/make-server-1bd2a132/questions", async (c) => {
  try {
    const allQuestions = await questions.getAllQuestions();
    return c.json({ questions: allQuestions, count: allQuestions.length });
  } catch (error) {
    console.error('Error fetching all questions:', error);
    return c.json({ error: "Failed to fetch questions" }, 500);
  }
});

// Initialize questions (bulk insert)
app.post("/make-server-1bd2a132/questions/init", async (c) => {
  try {
    const body = await c.req.json();
    const { questions: questionsToSave } = body;
    
    if (!Array.isArray(questionsToSave)) {
      return c.json({ error: "Invalid request body. Expected 'questions' array." }, 400);
    }
    
    console.log(`Attempting to save ${questionsToSave.length} questions to database...`);
    
    await questions.saveQuestions(questionsToSave);
    
    console.log(`Successfully saved ${questionsToSave.length} questions`);
    
    return c.json({ 
      success: true, 
      message: `Successfully initialized ${questionsToSave.length} questions` 
    });
  } catch (error) {
    console.error('Error initializing questions:', error);
    return c.json({ 
      error: "Failed to initialize questions",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

Deno.serve(app.fetch);