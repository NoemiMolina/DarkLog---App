// import express from "express";
// import { findMovieByDescription } from "../controllers/reaiperController.js";

// const router = express.Router();

// router.post("/find-movie", findMovieByDescription);

// export default router;
// src/routes/reaiper.ts
import express from "express";
import { getAIRecommendation } from "../controllers/reaiperController.js";

const router = express.Router();

router.post("/recommend", getAIRecommendation);

export default router;
