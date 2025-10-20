import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import { Types } from "mongoose";
import TVShow from "../models/TVShow.js";

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { UserName, UserPseudo, UserMail, UserPassword, UserLocation, UserAge } = req.body;

        const existingUser = await User.findOne({ UserMail });
        if (existingUser) return res.status(400).json({ message: "This email already exists" });

        const hashedPassword = await bcrypt.hash(UserPassword, 10);

        const newUser = new User({
            UserName,
            UserPseudo,
            UserMail,
            UserPassword: hashedPassword,
            UserLocation,
            UserAge,
        });

        await newUser.save();
        res.status(201).json({ message: "User successfully created", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "Subscribing error", error: err });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { UserMail, UserPassword } = req.body;
        const user = await User.findOne({ UserMail });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(UserPassword, user.UserPassword);
        if (!isMatch) return res.status(401).json({ message: "Oops, wrong password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secretKey", { expiresIn: "2h" });

        res.status(200).json({ message: "User successfully connected", token, user });
    } catch (err) {
        res.status(500).json({ message: "Error while connecting", error: err });
    }
};

export const addAFriend = async (req: Request, res: Response) => {
    try {
        const { userId, friendId } = req.params;
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) return res.status(404).json({ message: "User request not found" });

        if (!user.Friends.includes(friend._id as Types.ObjectId)) {
            user.Friends.push(friend._id as Types.ObjectId);
            await user.save();
        }

        res.status(200).json({ message: "User successfully added", user });
    } catch (err) {
        res.status(500).json({ message: "Could not add this friend", error: err });
    }
}

export const deleteAFriend = async (req: Request, res: Response) => {
    try {
        const { userId, friendId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.Friends = user.Friends.filter(id => id.toString() !== friendId);
        await user.save();

        res.status(200).json({ message: "User successfully deleted", user });
    } catch (err) {
        res.status(500).json({ message: "Error while deleting a friend", error: err });
    }
}

export const blockAnUser = async (req: Request, res: Response) => {
    try {
        const { userId, blockedUserId } = req.params;
        const user = await User.findById(userId);
        const blockedUser = await User.findById(blockedUserId);

        if (!user || !blockedUser) return res.status(404).json({ message: "user not found" });

        if (!user.BlockedUsers.includes(blockedUser._id as Types.ObjectId)) {
            user.BlockedUsers.push(blockedUser._id as Types.ObjectId);
            await user.save();
        }

        res.status(200).json({ message: "User successfully blocked", user });
    } catch (err) {
        res.status(500).json({ message: "Error while blocking", error: err });
    }
}

export const addAMovieToWatchlist = async (req: Request, res: Response) => {
    try {
        const { userId, movieId } = req.params;
        const user = await User.findById(userId);
        const movie = await Movie.findById(movieId);

        if (!user || !movie) return res.status(404).json({ message: "User or movie not found" });

        if (!user.MovieWatchlist.includes(movie._id as Types.ObjectId)) {
            user.MovieWatchlist.push(movie._id as Types.ObjectId);
            await user.save();
        }

        res.status(200).json({ message: "Movie added to your watchlist", user });
    } catch (err) {
        res.status(500).json({ message: "Error while adding a movie to your watchlist", error: err });
    }
}

export const addATvShowToWatchlist = async (req: Request, res: Response) => {
    try {
        const { userId, tvShowId } = req.params;
        const user = await User.findById(userId);
        const tvShow = await TVShow.findById(tvShowId);

        if (!user || !tvShow) return res.status(404).json({ message: "User or tV Show not found" });

        if (!user.TvShowWatchlist.includes(tvShow._id as Types.ObjectId)) {
            user.TvShowWatchlist.push(tvShow._id as Types.ObjectId);
            await user.save();
        }

        res.status(200).json({ message: "TV Show added to your watchlist", user });
    } catch (err) {
        res.status(500).json({ message: "Error while adding a TV Show to your watchlist", error: err });
    }
}

export const deleteAMovieFromWatchlist = async (req: Request, res: Response) => {
    try {
        const { userId, movieId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.MovieWatchlist = user.MovieWatchlist.filter(id => id.toString() !== movieId);
        await user.save();

        res.status(200).json({ message: "Movie deleted from your watchlist", user });
    } catch (err) {
        res.status(500).json({ message: "Error while deleting a movie from your watchlist", error: err });
    }
}

export const deleteATvShowFromWatchlist = async (req: Request, res: Response) => {
    try {
        const { userId, tvShowId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.TvShowWatchlist = user.TvShowWatchlist.filter(id => id.toString() !== tvShowId);
        await user.save();

        res.status(200).json({ message: "TV Show deleted from your watchlist", user });
    } catch (err) {
        res.status(500).json({ message: "Error while deleting a TV Show from your watchlist", error: err });
    }
}

