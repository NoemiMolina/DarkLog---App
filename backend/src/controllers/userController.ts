import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Movie from "../models/Movie";
import { Types } from "mongoose";
import TVShow from "../models/TVShow";


// ------ REGISTER
export const registerUser = async (req: Request, res: Response) => {
    try {
        const {
            UserFirstName,
            UserLastName,
            UserPseudo,
            UserMail,
            UserPassword,
            UserLocation,
            UserAge,
            Top3Movies,
            Top3TvShow
        } = req.body;

        const existingUser = await User.findOne({ UserMail });
        if (existingUser)
            return res.status(400).json({ message: "This email already exists" });

        const hashedPassword = await bcrypt.hash(UserPassword, 10);

        const userCount = await User.countDocuments();
        const rank = userCount + 1;

        let UserBadge = "";
        if (rank === 1) UserBadge = "TOP1 subscriber";
        else if (rank === 2) UserBadge = "TOP2 subscriber";
        else if (rank === 3) UserBadge = "TOP3 subscriber";
        else if (rank >= 4 && rank <= 10) UserBadge = "TOP10 subscriber";
        else if (rank >= 11 && rank <= 50) UserBadge = "TOP50 subscriber";
        else if (rank >= 51 && rank <= 100) UserBadge = "TOP100 subscriber";

        const parsedMovies = Top3Movies ? JSON.parse(Top3Movies) : [];
        const parsedTv = Top3TvShow ? JSON.parse(Top3TvShow) : [];

        const profilePicUrl = req.file ? `uploads/${req.file.filename}` : null;

        const newUser = new User({
            UserFirstName,
            UserLastName,
            UserPseudo,
            UserMail,
            UserPassword: hashedPassword,
            UserLocation,
            UserAge: Number(UserAge),
            UserBadge,
            UserProfilePicture: profilePicUrl,
            Top3Movies: parsedMovies,
            Top3TvShow: parsedTv,
        });

        await newUser.save();

        res.status(201).json({
            message: "User successfully created",
            user: newUser,
        });
    } catch (err) {
        console.error("❌ Error in registerUser:", err);
        res.status(500).json({ message: "Subscribing error", error: err });
    }
};

// ------- LOGIN
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

// ------------- UPDATE PROFILE INFOS
export const updateProfileInfos = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { UserFirstName, UserLastName, UserPseudo, UserLocation, UserAge } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.UserFirstName = UserFirstName || user.UserFirstName;
        user.UserLastName = UserLastName || user.UserLastName;
        user.UserPseudo = UserPseudo || user.UserPseudo;
        user.UserLocation = UserLocation || user.UserLocation;
        user.UserAge = UserAge || user.UserAge;
        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Error while updating profile", error: err });
    }
};

// ------------- UPDATE PASSWORD
export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(oldPassword, user.UserPassword);
        if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.UserPassword = hashedNewPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error while updating password", error: err });
    }
};

// ------------- UPDATE PROFILE PICTURE
export const updateProfilePicture = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const profilePicUrl = req.file ? `uploads/${req.file.filename}` : null;
        user.UserProfilePicture = profilePicUrl || user.UserProfilePicture;
        await user.save();
        res.status(200).json({ message: "Profile picture updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Error while updating profile picture", error: err });
    }
};

// ----------- GETS PROFILE
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        console.log("🔍 Fetching profile for userId:", userId);

        const user = await User.findById(userId)
            .populate('Top3Movies')
            .populate('Top3TvShow')
            .populate('MovieWatchlist')
            .populate('TvShowWatchlist');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ User found:", user.UserPseudo);

        const averageMovieRating = user.RatedMovies && user.RatedMovies.length > 0
            ? user.RatedMovies.reduce((sum, item) => sum + item.rating, 0) / user.RatedMovies.length
            : 0;

        const averageTvShowRating = user.RatedTvShows && user.RatedTvShows.length > 0
            ? user.RatedTvShows.reduce((sum, item) => sum + item.rating, 0) / user.RatedTvShows.length
            : 0;

        const profileData = {
            userProfilePicture: user.UserProfilePicture || null,
            userFirstName: user.UserFirstName || '',
            userLastName: user.UserLastName || '',
            userPseudo: user.UserPseudo || '',
            userMail: user.UserMail || '',
            userPassword: '',
            top3Movies: (user.Top3Movies as any[]).map((movie: any) => ({
                id: movie._id,
                title: movie.title || 'Unknown Movie',
                poster: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : ''
            })),
            top3TvShows: (user.Top3TvShow as any[]).map((show: any) => ({
                id: show._id,
                title: show.name || 'Unknown Show',
                poster: show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : ''
            })),
            movieWatchlist: (user.MovieWatchlist as any[]).map((movie: any) => ({
                id: movie._id,
                title: movie.title || 'Unknown Movie',
                poster: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : ''
            })),
            tvShowWatchlist: (user.TvShowWatchlist as any[]).map((show: any) => ({
                id: show._id,
                title: show.name || 'Unknown Show',
                poster: show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : ''
            })),
            numberOfWatchedMovies: user.NumberOfWatchedMovies || 0,
            numberOfWatchedTvShows: user.NumberOfWatchedTvShows || 0,
            numberOfGivenReviews: user.NumberOfGivenReviews || 0,
            averageMovieRating: Number(averageMovieRating.toFixed(1)),
            averageTvShowRating: Number(averageTvShowRating.toFixed(1)),
            lastWatchedMovie: null
        };

        res.status(200).json(profileData);
    } catch (err) {
        console.error("❌ Error in getUserProfile:", err);
        res.status(500).json({ message: "Error while fetching profile", error: String(err) });
    }
};

// ------------- SEARCH USERS
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;
        
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ message: "Search query is required" });
        }

        const users = await User.find({
            $or: [
                { UserPseudo: { $regex: query, $options: 'i' } },
                { UserMail: { $regex: query, $options: 'i' } }
            ]
        }).select('UserPseudo UserMail UserProfilePicture UserFirstName UserLastName').limit(10);

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error searching users", error: err });
    }
};

// ------------- GET PUBLIC PROFILE
export const getPublicProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
            .populate('Top3Movies')
            .populate('Top3TvShow')
            .select('-UserPassword -MovieWatchlist -TvShowWatchlist -Friends -BlockedUsers');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const averageMovieRating = user.RatedMovies && user.RatedMovies.length > 0
            ? user.RatedMovies.reduce((sum, item) => sum + item.rating, 0) / user.RatedMovies.length
            : 0;

        const averageTvShowRating = user.RatedTvShows && user.RatedTvShows.length > 0
            ? user.RatedTvShows.reduce((sum, item) => sum + item.rating, 0) / user.RatedTvShows.length
            : 0;

        res.status(200).json({
            UserPseudo: user.UserPseudo,
            UserFirstName: user.UserFirstName,
            UserLastName: user.UserLastName,
            UserProfilePicture: user.UserProfilePicture,
            top3Movies: (user.Top3Movies as any[]).map((movie: any) => ({
                id: movie._id,
                title: movie.title || 'Unknown Movie',
                poster: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : ''
            })),
            top3TvShows: (user.Top3TvShow as any[]).map((show: any) => ({
                id: show._id,
                title: show.name || 'Unknown Show',
                poster: show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : ''
            })),
            numberOfWatchedMovies: user.NumberOfWatchedMovies || 0,
            numberOfWatchedTvShows: user.NumberOfWatchedTvShows || 0,
            numberOfGivenReviews: user.NumberOfGivenReviews || 0,
            averageMovieRating: Number(averageMovieRating.toFixed(1)),
            averageTvShowRating: Number(averageTvShowRating.toFixed(1)),
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching public profile", error: err });
    }
};

// ------------- GET USER FRIENDS
export const getFriends = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('Friends', 'UserPseudo UserMail UserProfilePicture UserFirstName UserLastName');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.Friends);
    } catch (err) {
        res.status(500).json({ message: "Error fetching friends", error: err });
    }
};

// -------------- USER ADDS A FRIEND
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

// ------------ USER DELETES A FRIEND
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

// ------------ USER BLOCKS ANOTHER USER
export const blockAnUser = async (req: Request, res: Response) => {
    try {
        const { userId, blockedUserId } = req.params;
        const user = await User.findById(userId);
        const blockedUser = await User.findById(blockedUserId);

        if (!user || !blockedUser) return res.status(404).json({ message: "user not found" });
        user.Friends = user.Friends.filter(id => id.toString() !== blockedUserId);
        if (!user.BlockedUsers.includes(blockedUser._id as Types.ObjectId)) {
            user.BlockedUsers.push(blockedUser._id as Types.ObjectId);
        }
        await user.save();
        res.status(200).json({ message: "User successfully blocked", user });
    } catch (err) {
        res.status(500).json({ message: "Error while blocking", error: err });
    }
};


//------------ USER UNBLOCKS ANOTHER USER
export const unblockAnUser = async (req: Request, res: Response) => {
    try {
        const { userId, blockedUserId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.BlockedUsers = user.BlockedUsers.filter(id => id.toString() !== blockedUserId);
        await user.save();
        res.status(200).json({ message: "User successfully unblocked", user });
    } catch (err) {
        res.status(500).json({ message: "Error while unblocking", error: err });
    }
};

// --------- USER ADDS A MOVIE TO ITS WATCHLIST
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

// ------------- USER ADDS A TVSHOW TO ITS WATCHLIST
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

// ------------- USER DELETES A MOVIE FROM ITS WATCHLIST
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

// ---------- USER DELETES A TVSHOW FROM ITS WATCHLIST
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

// ------------- USER ADDS A MOVIE TO ITS TOP3 FAVORITES

export const addAMovieToTop3Favorites = async (req: Request, res: Response) => {
    try {
        const { userId, movieId } = req.params;
        const user = await User.findById(userId);
        const movie = await Movie.findById(movieId);
        if (!user || !movie) return res.status(404).json({ message: "User or movie not found" });

        if (user.Top3Movies.length >= 3) {
            return res.status(400).json({ message: "You can only have 3 favorite movies" });
        }
        if (!user.Top3Movies.includes(movie._id as Types.ObjectId)) {
            user.Top3Movies.push(movie._id as Types.ObjectId);
            await user.save();
        }
        
        res.status(200).json({ message: "Movie added to your Top 3 favorites", user });
    } catch (err) {
        res.status(500).json({ message: "Error while adding a movie to your Top 3 favorites", error: err });
    }
}

// ------------- USER ADDS A TVSHOW TO ITS TOP3 FAVORITES
export const addATvShowToTop3Favorites = async (req: Request, res: Response) => {
    try {
        const { userId, tvShowId } = req.params;
        const user = await User.findById(userId);
        const tvShow = await TVShow.findById(tvShowId);
        
        if (!user || !tvShow) {
            return res.status(404).json({ message: "User or TV Show not found" });
        }
        
        if (user.Top3TvShow.length >= 3) {
            return res.status(400).json({ message: "You can only have 3 favorite TV Shows" });
        }
        if (!user.Top3TvShow.includes(tvShow._id as Types.ObjectId)) {
            user.Top3TvShow.push(tvShow._id as Types.ObjectId);
            await user.save();
        }
        
        res.status(200).json({ message: "TV Show added to your Top 3 favorites", user });
    } catch (err) {
        console.error("❌ Error adding TV show to Top3:", err);
        res.status(500).json({ message: "Error while adding a TV Show to your Top 3 favorites", error: err });
    }
};

// ------------- DELETE A MOVIE FROM TOP3 FAVORITES
export const deleteAMovieFromTop3Favorites = async (req: Request, res: Response) => {
    try {
        const { userId, movieId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.Top3Movies = user.Top3Movies.filter((id: Types.ObjectId) => id.toString() !== movieId);
        
        await user.save();
        res.status(200).json({ message: "Movie deleted from your Top 3 favorites", user });
    } catch (err) {
        console.error("❌ Error deleting movie from Top3:", err);
        res.status(500).json({ message: "Error while deleting a movie from your Top 3 favorites", error: err });
    }
};


// ------------- DELETE A TVSHOW FROM TOP3 FAVORITES
export const deleteATvShowFromTop3Favorites = async (req: Request, res: Response) => {
    try {
        const { userId, tvShowId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.Top3TvShow = user.Top3TvShow.filter((id: Types.ObjectId) => id.toString() !== tvShowId);
        
        await user.save();
        res.status(200).json({ message: "TV Show deleted from your Top 3 favorites", user });
    } catch (err) {
        console.error("❌ Error deleting TV show from Top3:", err);
        res.status(500).json({ message: "Error while deleting a TV Show from your Top 3 favorites", error: err });
    }
};
// ------------- SAVE RATING AND REVIEW
export const saveRatingAndReview = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { itemId, type, rating, reviewText } = req.body;

        if (!["movie", "tv"].includes(type))
            return res.status(400).json({ message: "Invalid type" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (type === "movie") {
            const existing = user.RatedMovies.find(
                (r: any) => r.movieId.toString() === itemId
            );

            if (existing) existing.rating = rating;
            else user.RatedMovies.push({ movieId: itemId, rating });

            user.NumberOfWatchedMovies = user.RatedMovies.length;
            user.AverageMovieRating =
                user.RatedMovies.reduce((acc: number, r: any) => acc + r.rating, 0) /
                user.RatedMovies.length;
        }

        if (type === "tv") {
            const existing = user.RatedTvShows.find(
                (r: any) => r.tvShowId.toString() === itemId
            );

            if (existing) existing.rating = rating;
            else user.RatedTvShows.push({ tvShowId: itemId, rating });
            user.NumberOfWatchedTvShows = user.RatedTvShows.length;
            user.AverageTvShowRating =
                user.RatedTvShows.reduce((acc: number, r: any) => acc + r.rating, 0) /
                user.RatedTvShows.length;
        }
        if (reviewText && reviewText.trim().length > 0) {
            user.Reviews.push({
                itemId,
                type,
                text: reviewText,
                date: new Date(),
            });

            user.NumberOfGivenReviews = user.Reviews.length;
        }

        await user.save();

        res.status(200).json({ message: "Saved successfully", user });

    } catch (err) {
        console.error("❌ Error saving rating:", err);
        res.status(500).json({ message: "Saving error", error: err });
    }
};

