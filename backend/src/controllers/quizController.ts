// trivia api is nice but cannot filter only for horror movies/tv shows, so let's make our own quiz questions for that
import type { Request, Response } from "express";
import Quiz from "../models/Quiz";
import fs from "fs";
import path from "path";

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

export const getRandomQuizQuestions = async (req: Request, res: Response) => {
  try {
    const { type, category, difficulty } = req.params;

    const validTypes = ["movies", "tvshows"];
    const validCategories = ["culture", "dumbDescription"];
    const validDifficulties = ["easy", "medium", "hard"];

    if (
      !validTypes.includes(type) ||
      !validCategories.includes(category) ||
      !validDifficulties.includes(difficulty)
    ) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const folderName =
      type === "movies" ? "moviesHomemadeQuiz" : "tvShowsHomemadeQuiz";
    const fileName = `quiz_${type}_${category}_${difficulty}.json`;

    const possiblePaths = [
      path.join(
        __dirname,
        "../../homemade_quiz",
        folderName,
        category,
        fileName,
      ),
      path.join(process.cwd(), "homemade_quiz", folderName, category, fileName),
      path.join(
        process.cwd(),
        "backend",
        "homemade_quiz",
        folderName,
        category,
        fileName,
      ),
    ];

    let filePath = "";
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }

    if (!filePath) {
      console.error(`❌ Quiz file not found. Tried paths:`, possiblePaths);
      return res
        .status(404)
        .json({ message: "Quiz file not found", paths: possiblePaths });
    }

    console.log(`📂 Loaded quiz file from: ${filePath}`);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const allQuestions = JSON.parse(fileContent);

    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 6);

    res.status(200).json({ questions: selectedQuestions });
  } catch (err) {
    console.error("Error fetching quiz questions:", err);
    res
      .status(500)
      .json({ message: "Error fetching quiz questions", error: String(err) });
  }
};
