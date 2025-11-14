import express from "express";
import {
    getAllTVShows,
    getTVShowById,
    getSeasonByNumber,
    getEpisodeByNumber,
    addRatingToEpisode,
    searchTVShow,
    getRandomTVShow
} from "../controllers/tvShowController";

const router = express.Router();

router.get("/", getAllTVShows);
router.get("/random", getRandomTVShow);
router.get("/search", searchTVShow);
router.get("/:tvShowId", getTVShowById);
router.get("/:tvShowId/seasons/:seasonNumber", getSeasonByNumber);
router.get("/:tvShowId/seasons/:seasonNumber/episodes/:episodeNumber", getEpisodeByNumber);
router.post("/:tvShowId/seasons/:seasonNumber/episodes/:episodeNumber/rating", addRatingToEpisode);


export default router;
