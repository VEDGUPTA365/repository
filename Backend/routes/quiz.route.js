import express from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/verifyToken.js";
import {
  createQuizController,
  createQuizUsingAI,
  getAllQuizController,
  getQuizByTitleController,
  getQuizByIdController,
  getQuizTitlesController,
  deleteQuizController,
} from "../controllers/quiz.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ==== Share link (by ID, NOT PROTECTED so friends can play) ====
router.get("/shared/:id", getQuizByIdController);

// ==== Get all quiz titles ====
router.get("/getquiztitle", verifyToken, getQuizTitlesController);

// ==== Get quiz by title ====
router.get("/getquizbytitle/:title", verifyToken, getQuizByTitleController);

// ==== Get ALL quizzes ====
router.get("/getallquiz", verifyToken, getAllQuizController);

// ==== Create quiz manually ====
router.post("/createquiz", verifyToken, createQuizController);

// ==== Create quiz using Gemini AI ====
router.post("/createquizusingai", verifyToken, upload.single("pdf"), createQuizUsingAI);

// ==== Delete a quiz ====
router.delete("/deletequiz/:id", verifyToken, deleteQuizController);

export default router;