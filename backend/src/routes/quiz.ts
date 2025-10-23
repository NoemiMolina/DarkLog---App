import express from "express";
import { getQuizzes } from "../controllers/quizController.js";

const router = express.Router();

router.get("/", getQuizzes);

export default router;
