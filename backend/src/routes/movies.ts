import express from "express";
import {
    getAllMovies,
    getMovieById,
    getMovieByGenre
} from "../controllers/movieController.js"

const router = express.Router();

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.get("/genre/:genre", getMovieByGenre)

export default router;