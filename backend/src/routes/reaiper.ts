// import express from "express";
// import { findMovieByDescription } from "../controllers/reaiperController.js";

// const router = express.Router();

// router.post("/find-movie", findMovieByDescription);

// export default router;
// src/routes/reaiper.ts

// feature will be implemented at the end since I am too poor to pay openai and test this
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getAIRecommendation } from "../controllers/reaiperController.js";

const router = express.Router();

router.post("/recommend", authMiddleware, getAIRecommendation);

export default router;
