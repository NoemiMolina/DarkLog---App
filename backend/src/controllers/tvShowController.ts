import type { Request, Response } from "express";
import TVShow from "../models/TVShow.js";
import { Types } from "mongoose";

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
    const seasonNumber = Number(req.params.seasonNumber);
    const episodeNumber = Number(req.params.episodeNumber);

    try {

        if (isNaN(seasonNumber) || isNaN(episodeNumber)) {
            return res.status(400).json({ message: "Invalid season or episode number" });
        }
        const { tvShowId } = req.params;
        const { userId, rating } = req.body;

        const tvShow = await TVShow.findById(tvShowId);
        if (!tvShow) return res.status(404).json({ message: "TV show not found" });

        const season = tvShow.seasons.find(s => s.season_number === seasonNumber);
        if (!season) return res.status(404).json({ message: "Season not found" });

        const episode = season.episodes.find(e => e.episode_number === episodeNumber);
        if (!episode) return res.status(404).json({ message: "Episode not found" });

        const existingRating = episode.ratings.find(r => r.userId?.toString() === userId);
        if (existingRating) {
            existingRating.value = rating;
        } else {
            episode.ratings.push({ userId: new Types.ObjectId(userId), value: rating });
        }

        await tvShow.save();
        res.status(200).json({ message: "Rating added", episode });
    } catch (err) {
        res.status(500).json({ message: "Error adding rating", error: err });
    }
};
