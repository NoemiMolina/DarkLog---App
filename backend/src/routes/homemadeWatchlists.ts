import express from "express";
import {
  getAllWatchlists,
  getWatchlistById,
  addWatchlistToUser,
  rateWatchlist,
  commentWatchlist,
  markMovieAsWatched,
} from "../controllers/homemadeWatchlistsController";

const router = express.Router();

router.get("/", getAllWatchlists);
router.get("/:watchlistId", getWatchlistById);
router.post("/add", addWatchlistToUser);
router.post("/rate", rateWatchlist);
router.post("/comment", commentWatchlist);
router.post("/mark-watched", markMovieAsWatched);

export default router;
