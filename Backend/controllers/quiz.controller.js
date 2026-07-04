import fs from "fs";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { Quiz } from "../models/quiz.model.js";
import { generateQuizFromGemini } from "../utils/generateQuiz.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// GET /getquizbytitle/:title
export const getQuizByTitleController = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findOne({ where: { title: req.params.title, userId: req.userId } });
  if (!quiz) return next(new AppError("Quiz not found", 404));
  return res.status(200).json({ msg: "Quiz found", quiz });
});

// GET /shared/:token  (public – uses unguessable UUID shareToken, NOT sequential id)
export const getQuizByIdController = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findOne({ where: { shareToken: req.params.id } });
  if (!quiz) return next(new AppError("Quiz not found", 404));
  return res.status(200).json({ msg: "Quiz found", quiz });
});

// GET /getquiztitle
export const getQuizTitlesController = asyncHandler(async (req, res, next) => {
  const quizzes = await Quiz.findAll({ attributes: ["title"], where: { userId: req.userId } });
  res.status(200).json({ msg: "All quiz titles", titles: quizzes.map((q) => q.title) });
});

// GET /getallquiz
export const getAllQuizController = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findAll({ where: { userId: req.userId } });
  return res.status(200).json({ msg: "All quizzes", noOfQuiz: quiz.length, quiz });
});

// POST /createquiz
export const createQuizController = asyncHandler(async (req, res, next) => {
  const { title, questions } = req.body;
  const quiz = await Quiz.create({ title, questions, userId: req.userId });
  return res.status(201).json({ msg: "Quiz created successfully", noOfQuestions: questions.length, quiz });
});

// POST /createquizusingai
export const createQuizUsingAI = asyncHandler(async (req, res, next) => {
  const { title, level, noOfQuest } = req.body;
  if (!title || !noOfQuest) return next(new AppError("title and noOfQuest are required", 400));

  let pdfText = "";
  if (req.file) {
    const data = await pdfParse(fs.readFileSync(req.file.path));
    pdfText = data.text;
    fs.unlinkSync(req.file.path);
  }

  const quizData = await generateQuizFromGemini(title, level, noOfQuest, pdfText);
  const questions = quizData.questions;
  const quiz = await Quiz.create({ title, questions, userId: req.userId });
  return res.status(201).json({ msg: "Quiz created successfully", noOfQuestions: questions.length, quiz });
});

// DELETE /deletequiz/:id
export const deleteQuizController = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findOne({ where: { title: req.params.id, userId: req.userId } });
  if (!quiz) return next(new AppError("Quiz not found", 404));
  await quiz.destroy();
  return res.status(200).json({ msg: "Quiz deleted successfully" });
});
