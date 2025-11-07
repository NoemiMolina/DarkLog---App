import express from "express";
import Movie from "../models/Movie.js";
import TvShow from "../models/TVShow.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const query = req.query.query || "";

        const movies = await Movie.find({
            title: { $regex: query, $options: "i" },
        }).lean();

        const tvshows = await TvShow.find({
            name: { $regex: query, $options: "i" },
        }).lean();

        const moviesWithType = movies.map((m) => ({ ...m, type: "movie" }));
        const tvshowsWithType = tvshows.map((t) => ({ ...t, type: "tvshow" }));

        res.json([...moviesWithType, ...tvshowsWithType]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la recherche" });
    }
});

export default router;
