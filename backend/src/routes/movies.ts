import express from "express";
import {
    getAllMovies,
    getMovieById,
    getMovieByGenre,
    addRatingToMovie
} from "../controllers/movieController.js"

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.get("/genre/:genre", getMovieByGenre)
router.post("/:id/rating", addRatingToMovie); // not tested yet

export default router;