import type { Request, Response } from "express";
import Movie from "../models/Movie.js";

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