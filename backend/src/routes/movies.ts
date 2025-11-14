import express from "express";
import {
    getAllMovies,
    getMovieById,
    getMovieByGenre,
    addRatingToMovie,
    getRandomMovie,
    searchMovies
} from "../controllers/movieController"

const router = express.Router();

router.get("/", getAllMovies);
router.get("/random", getRandomMovie);
router.get("/search", searchMovies);
router.get("/genre/:genre", getMovieByGenre);
router.get("/:id", getMovieById);
router.post("/:id/rating", addRatingToMovie);


export default router;