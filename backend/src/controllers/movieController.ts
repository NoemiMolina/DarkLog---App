import type { Request, Response } from "express";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import { Types } from "mongoose";

interface GenreParams {
    genre: string;
}

export const getAllMovies = async (req: Request, res: Response) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des films", error: err });
    }
}

export const getMovieById = async (req: Request, res: Response) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: "Film non trouvé" });
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération du film", error: err });
    }
}

export const addRatingToMovie = async (req: Request, res: Response) => {
    try {
        const { movieId } = req.params;
        const { userId, rating } = req.body;

        if (typeof rating !== "number") return res.status(400).json({ message: "Invalid rating" });

        const movie = await Movie.findById(movieId);
        const user = await User.findById(userId);
        if (!movie || !user) return res.status(404).json({ message: "Movie or user not found" });

        const existingRating = movie.ratings.find(r => r.userId?.toString() === userId);
        if (existingRating) {
            existingRating.value = rating;
        } else {
            movie.ratings.push({ userId: new Types.ObjectId(userId), value: rating });
        }

        await movie.save();

        const allRatings: number[] = movie.ratings
            .filter(r => r.userId?.toString() === userId && r.value != null)
            .map(r => r.value as number);

        if (allRatings.length > 0) {
            user.AverageMovieRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
            await user.save();
        }

        res.status(200).json({ message: "Rating added", movie, userAverage: user.AverageMovieRating });
    } catch (err) {
        res.status(500).json({ message: "Error adding rating", error: err });
    }
};

// probably useless but you never know lol
export const getMovieByGenre = async (req: Request, res: Response) => {
    try {
        const genre = req.params.genre;
        const movies = await Movie.find({ genre });

        if (movies.length === 0) return res.status(404).json({ message: "Aucun film trouvé pour ce genre" });

        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors du filtrage par genre", error: err });
    }
}

export const getRandomMovie = async (req: Request, res: Response) => {
    try {
        const count = await Movie.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomMovie = await Movie.findOne().skip(randomIndex);
        if (!randomMovie) return res.status(404).json({ message: "Movie not found" });
        res.status(200).json(randomMovie);
    } catch (err) {
        res.status(500).json({ message: "Error fetching random movie", error: err });
    }
}

export const searchMovies = async (req: Request, res: Response) => {
    try {
        const query = req.query.query as string;
        if (!query) return res.status(400).json({ message: "Query parameter is required" });
        const movies = await Movie.find({ title: { $regex: query, $options: "i" } });
        res.status(200).json(movies);
    } catch (err) {
        res.status(500).json({ message: "Error searching movies", error: err });
    }   
}
