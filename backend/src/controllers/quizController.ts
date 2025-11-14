// trivia api is nice but cannot filter only for horror movies/tv shows, so let's make our own quiz questions for that
import type { Request, Response } from "express";
import Quiz from "../models/Quiz";

export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const { category, difficulty, type } = req.query;
    const filters: any = {};

    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (type) filters.type = type;

    const quizzes = await Quiz.find(filters);

    if (quizzes.length === 0) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching quiz", error: err });
  }
};
