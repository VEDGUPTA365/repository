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

// ==== Share link (by ID, protected) ====
router.get("/shared/:id", verifyToken, getQuizByIdController);

// ==== Get all quiz titles ====
router.get("/getquiztitle", getQuizTitlesController);

// ==== Get quiz by title ====
router.get("/getquizbytitle/:title", getQuizByTitleController);

// ==== Get ALL quizzes ====
router.get("/getallquiz", getAllQuizController);

// ==== Create quiz manually ====
router.post("/createquiz", createQuizController);

// ==== Create quiz using Gemini AI ====
router.post("/createquizusingai", upload.single("pdf"), createQuizUsingAI);

// ==== Delete a quiz ====
router.delete("/deletequiz/:id", deleteQuizController);

export default router;