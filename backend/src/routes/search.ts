import express, { Request, Response } from "express";
import Movie from "../models/Movie";
import TvShow from "../models/TVShow";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
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
