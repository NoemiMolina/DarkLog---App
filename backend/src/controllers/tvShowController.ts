import type { Request, Response } from "express";
import TVShow from "../models/TVShow";
import { Types } from "mongoose";
import User from "../models/User";

export const getAllTVShows = async (req: Request, res: Response) => {
    try {
        const tvShows = await TVShow.find();
        res.status(200).json(tvShows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching TV shows", error: err });
    }
};

export const getTVShowById = async (req: Request, res: Response) => {
    try {
        const { tvShowId } = req.params;
        const tvShow = await TVShow.findById(tvShowId);
        if (!tvShow) return res.status(404).json({ message: "TV show not found" });
        res.status(200).json(tvShow);
    } catch (err) {
        res.status(500).json({ message: "Error fetching TV show", error: err });
    }
};

export const getSeasonByNumber = async (req: Request, res: Response) => {
    try {
        const seasonNumber = Number(req.params.seasonNumber);
        const { tvShowId } = req.params;
        const tvShow = await TVShow.findById(tvShowId);
        if (!tvShow) return res.status(404).json({ message: "TV show not found" });

        const season = tvShow.seasons.find(s => s.season_number === seasonNumber);
        if (!season) return res.status(404).json({ message: "Season not found" });

        res.status(200).json(season);
    } catch (err) {
        res.status(500).json({ message: "Error fetching season", error: err });
    }
};

export const getEpisodeByNumber = async (req: Request, res: Response) => {
    try {
        const seasonNumber = Number(req.params.seasonNumber);
        const episodeNumber = Number(req.params.episodeNumber);
        const { tvShowId } = req.params;
        const tvShow = await TVShow.findById(tvShowId);
        if (!tvShow) return res.status(404).json({ message: "TV show not found" });

        const season = tvShow.seasons.find(s => s.season_number === seasonNumber);
        if (!season) return res.status(404).json({ message: "Season not found" });

        const episode = season.episodes.find(e => e.episode_number === (episodeNumber));
        if (!episode) return res.status(404).json({ message: "Episode not found" });

        res.status(200).json(episode);
    } catch (err) {
        res.status(500).json({ message: "Error fetching episode", error: err });
    }
};

export const addRatingToEpisode = async (req: Request, res: Response) => {
    try {
        const { tvShowId, seasonNumber, episodeNumber } = req.params;
        const { userId, rating } = req.body;

        if (!userId || typeof rating !== "number") {
            return res.status(400).json({ message: "UserId and numeric rating are required" });
        }

        const seasonNum = Number(seasonNumber);
        const episodeNum = Number(episodeNumber);

        if (isNaN(seasonNum) || isNaN(episodeNum)) {
            return res.status(400).json({ message: "Invalid season or episode number" });
        }

        const tvShow = await TVShow.findById(tvShowId);
        if (!tvShow) return res.status(404).json({ message: "TV show not found" });

        const season = tvShow.seasons.find(s => s.season_number === seasonNum);
        if (!season) return res.status(404).json({ message: "Season not found" });

        const episode = season.episodes.find(e => e.episode_number === episodeNum);
        if (!episode) return res.status(404).json({ message: "Episode not found" });

        const existingRating = episode.ratings.find(
            r => r.userId?.toString() === userId
        );

        if (existingRating) {
            existingRating.value = rating;
        } else {
            episode.ratings.push({ userId: new Types.ObjectId(userId), value: rating });
        }

        const validRatings = episode.ratings
            .filter(r => r.userId && typeof r.value === "number")
            .map(r => r.value as number);

        const episodeAverage = validRatings.reduce((a, b) => a + b, 0) / validRatings.length;

        episode.vote_average = episodeAverage;

        await tvShow.save();

        const user = await User.findById(userId);
        if (user) {
            const allUserRatings = tvShow.seasons
                .flatMap(s => s.episodes)
                .flatMap(e => e.ratings)
                .filter(r => r.userId?.toString() === userId && typeof r.value === "number")
                .map(r => r.value as number);

            if (allUserRatings.length > 0) {
                user.AverageTvShowRating = allUserRatings.reduce((a, b) => a + b, 0) / allUserRatings.length;
                await user.save();
            }
        }

        res.status(200).json({ message: "Rating added/updated", episode, episodeAverage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding rating", error: err });
    }
};

export const getRandomTVShow = async (req: Request, res: Response) => {
    try {
        const count = await TVShow.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomTVShow = await TVShow.findOne().skip(randomIndex);
        if (!randomTVShow) return res.status(404).json({ message: "TV show not found" });
        res.status(200).json(randomTVShow);
    } catch (err) {
        res.status(500).json({ message: "Error fetching random TV show", error: err });
    }   
};

export const searchTVShow = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;
        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }
        const tvShows = await TVShow.find({
            title: { $regex: query, $options: "i" }
        });
        res.status(200).json(tvShows);
    } catch (err) {
        res.status(500).json({ message: "Error searching TV shows", error: err });
    }       
};

export const getTVShowsByStyle = async (req: Request, res: Response) => {
    try {
        const style = req.params.style.toLowerCase();
        const tvShows = await TVShow.find({
            keywords: { $regex: style, $options: "i" }
        });
        res.status(200).json(tvShows);
    } catch (err) {
        res.status(500).json({ message: "Error fetching TV shows by style", error: err });
    }
};