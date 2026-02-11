import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
    getQuizzes,
    getRandomQuizQuestions
} from "../controllers/quizController";

const router = express.Router();

const noCacheMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
};

router.get("/", noCacheMiddleware, getQuizzes);
router.get("/:type/:category/:difficulty", noCacheMiddleware, authMiddleware, getRandomQuizQuestions);

export default router;
