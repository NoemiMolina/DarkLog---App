import express from "express";
import {
    getAllTVShows,
    getTVShowById,
    getSeasonByNumber,
    getEpisodeByNumber,
    addRatingToEpisode
} from "../controllers/tvShowController.js";

const router = express.Router();

router.get("/", getAllTVShows);
router.get("/:tvShowId", getTVShowById);
router.get("/:tvShowId/seasons/:seasonNumber", getSeasonByNumber);
router.get("/:tvShowId/seasons/:seasonNumber/episodes/:episodeNumber", getEpisodeByNumber);
router.post("/:tvShowId/seasons/:seasonNumber/episodes/:episodeNumber/rating", addRatingToEpisode);

export default router;
