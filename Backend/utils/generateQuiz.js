import dotenv, { config } from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai';
import AppError from './AppError.js';

dotenv.config()

// Support multiple API keys separated by commas
const apiKeys = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.split(',').map(key => key.trim()) : [];

export const generateQuizFromGemini = async (topic, level, noOfQuest, pdfText = "") => {
  if (apiKeys.length === 0) {
    throw new AppError("No Gemini API keys found in environment variables.", 500);
  }
  
  // Pick a random API key from the list
  const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
  const genAI = new GoogleGenerativeAI(randomKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `
  Generate a JSON formatted quiz based on the topic or instructions: "${topic}". 
  The difficulty level should be "${level}". 
  ${pdfText ? `Use the following content extracted from a PDF document to generate the questions:\n\n${pdfText.substring(0, 30000)}\n\n` : ''}
  The quiz must contain the following structure: 
  
  - Total number of questions: ${noOfQuest}. 
  - Each question must have four options. 
  - The correct answer index must be unique for each question (i.e., different questions should have different correct answer indices). 
  - Additionally, the options for each question must be shuffled, ensuring that the correct answer does not always appear in the same position.

  The structure should look like this:

  {
    "title": "${topic}",
    "questions": [
      {
        "question": "Quest1",
        "options": [
          "option1",
          "option2",
          "option3",
          "option4"
        ],
        "answer": 0  // Index of the correct answer
      },
      {
        "question": "Quest2",
        "options": [
          "option1",
          "option2",
          "option3",
          "option4"
        ],
        "answer": 1  // Index of the correct answer 
      }
      // Add more questions as needed
    ]
  }`;

  try {
    const quiz = await model.generateContent(prompt);
    const cleanedResponse = quiz.response.text().replace(/```json|```/g, '').trim(); 
    const quizData = JSON.parse(cleanedResponse);
    return quizData;
  } catch (error) {
    throw new AppError(error.message || "Quiz generation failed", 500);
  }
}




