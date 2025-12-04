import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    getQuizzes,
    getRandomQuizQuestions
} from "../controllers/quizController";

const router = express.Router();

router.get("/", getQuizzes);
router.get("/:type/:category/:difficulty", authMiddleware,getRandomQuizQuestions);

export default router;
