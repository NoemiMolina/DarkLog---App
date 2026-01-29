import type { Request, Response } from "express";
import HomemadeWatchlist from "../models/HomemadeWatchlists";
import User from "../models/User";
import Movie from "../models/Movie";
import { Types } from "mongoose";

export const getAllWatchlists = async (req: Request, res: Response) => {
    try {
        const watchlists = await HomemadeWatchlist.find().populate("movies");
        res.status(200).json(watchlists);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching watchlists",
            error: err,
        });
    }
};

export const getWatchlistById = async (req: Request, res: Response) => {
    try {
        const { watchlistId } = req.params;
        const watchlist = await HomemadeWatchlist.findById(watchlistId).populate("movies");

        if (!watchlist) {
            return res.status(404).json({ message: "Watchlist not found" });
        }

        res.status(200).json(watchlist);
    } catch (err) {
        res.status(500).json({
            message: "Error fetching watchlist",
            error: err,
        });
    }
};

export const addWatchlistToUser = async (req: Request, res: Response) => {
    try {
        const { userId, watchlistId } = req.body;

        if (!userId || !watchlistId) {
            return res.status(400).json({
                message: "userId and watchlistId are required",
            });
        }

        const user = await User.findById(userId);
        const watchlist = await HomemadeWatchlist.findById(watchlistId).populate("movies");

        if (!user || !watchlist) {
            return res.status(404).json({
                message: "User or watchlist not found",
            });
        }
        
        const watchlistObjectId = new Types.ObjectId(watchlistId);
        if (user.SavedHomemadeWatchlists.some(w => w.toString() === watchlistId)) {
            return res.status(400).json({
                message: "This watchlist is already in your collection",
            });
        }

        user.SavedHomemadeWatchlists.push(watchlistObjectId);
        let totalRuntime = 0;
        watchlist.movies.forEach((movie: any) => {
            if (movie.runtime) {
                totalRuntime += movie.runtime;
            }
        });
        
        user.TotalWatchTimeFromWatchlists += totalRuntime;
        user.NumberOfWatchedMovies += watchlist.movies.length;
        user.WatchedMoviesInWatchlists.push({
            watchlistId: watchlistObjectId,
            movieIds: watchlist.movies.map((m: any) => m._id)
        });
        
        await user.save();

        res.status(200).json({
            message: "Watchlist added to your collection",
            totalRuntime,
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error adding watchlist",
            error: err,
        });
    }
};

export const rateWatchlist = async (req: Request, res: Response) => {
    try {
        const { userId, watchlistId, rating } = req.body;

        if (!userId || !watchlistId || typeof rating !== "number") {
            return res.status(400).json({
                message: "userId, watchlistId, and rating (number) are required",
            });
        }

        if (rating < 0 || rating > 10) {
            return res.status(400).json({
                message: "Rating must be between 0 and 5",
            });
        }

        const user = await User.findById(userId);
        const watchlist = await HomemadeWatchlist.findById(watchlistId).populate("movies");

        if (!user || !watchlist) {
            return res.status(404).json({
                message: "User or watchlist not found",
            });
        }
        
        let totalRuntime = 0;
        watchlist.movies.forEach((movie: any) => {
            if (movie.runtime) {
                totalRuntime += movie.runtime;
            }
        });
        user.TotalWatchTimeFromWatchlists += totalRuntime;
        user.NumberOfWatchedMovies += watchlist.movies.length;
        user.NumberOfGivenReviews += 1;
        // Calculer la nouvelle moyenne
        if (!user.AverageMovieRating || isNaN(user.AverageMovieRating)) user.AverageMovieRating = 0;
        if (!user.RatedMovies) user.RatedMovies = [];
        user.RatedMovies.push({
            tmdbMovieId: 0,
            movieTitle: watchlist.title,
            rating,
            createdAt: new Date(),
            runtime: totalRuntime
        });
        const ratings = user.RatedMovies.map(r => r.rating).filter(r => typeof r === 'number');
        if (ratings.length > 0) {
            user.AverageMovieRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        }
        // Retirer la watchlist des SavedHomemadeWatchlists si elle y est
        if (user.SavedHomemadeWatchlists && user.SavedHomemadeWatchlists.length > 0) {
            user.SavedHomemadeWatchlists = user.SavedHomemadeWatchlists.filter(
                (id) => id.toString() !== watchlistId
            );
        }
        await user.save();

        res.status(200).json({
            message: "Watchlist rated successfully",
            rating,
            totalRuntime,
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error rating watchlist",
            error: err,
        });
    }
};

export const commentWatchlist = async (req: Request, res: Response) => {
    try {
        const { userId, watchlistId, comment } = req.body;

        if (!userId || !watchlistId || !comment) {
            return res.status(400).json({
                message: "userId, watchlistId, and comment are required",
            });
        }

        const user = await User.findById(userId);
        const watchlist = await HomemadeWatchlist.findById(watchlistId).populate("movies");

        if (!user || !watchlist) {
            return res.status(404).json({
                message: "User or watchlist not found",
            });
        }

        let totalRuntime = 0;
        watchlist.movies.forEach((movie: any) => {
            if (movie.runtime) {
                totalRuntime += movie.runtime;
            }
        });
        user.TotalWatchTimeFromWatchlists += totalRuntime;
        user.NumberOfWatchedMovies += watchlist.movies.length;
        user.NumberOfGivenReviews += 1;
        if (user.SavedHomemadeWatchlists && user.SavedHomemadeWatchlists.length > 0) {
            user.SavedHomemadeWatchlists = user.SavedHomemadeWatchlists.filter(
                (id) => id.toString() !== watchlistId
            );
        }
        await user.save();

        res.status(200).json({
            message: "Comment added successfully",
            totalRuntime,
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error adding comment",
            error: err,
        });
    }
};

export const markMovieAsWatched = async (req: Request, res: Response) => {
    try {
        const { userId, watchlistId, movieId } = req.body;

        if (!userId || !watchlistId || !movieId) {
            return res.status(400).json({
                message: "userId, watchlistId, and movieId are required",
            });
        }

        const user = await User.findById(userId);
        const watchlist = await HomemadeWatchlist.findById(watchlistId);
        const movie = await Movie.findById(movieId);

        if (!user || !watchlist || !movie) {
            return res.status(404).json({
                message: "User, watchlist, or movie not found",
            });
        }

        if (!watchlist.movies.includes(new Types.ObjectId(movieId))) {
            return res.status(400).json({
                message: "This movie does not belong to this watchlist",
            });
        }

        const ratedMovieEntry = {
            tmdbMovieId: Math.random(), 
            movieTitle: (movie as any).title,
            rating: 0, 
            createdAt: new Date(),
            runtime: (movie as any).runtime || 0,
        };

        user.RatedMovies.push(ratedMovieEntry);
        user.NumberOfWatchedMovies += 1;
        const movieRuntime = (movie as any).runtime || 0;
        if (movieRuntime > 0) {
            user.TotalWatchTimeFromWatchlists += movieRuntime;
        }

        await user.save();

        res.status(200).json({
            message: "Movie marked as watched",
            movieTitle: (movie as any).title,
            runtime: (movie as any).runtime,
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error marking movie as watched",
            error: err,
        });
    }
};
