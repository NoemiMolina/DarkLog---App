import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Movie from "../models/Movie";
import { Types } from "mongoose";
import TVShow from "../models/TVShow";
import HomemadeWatchlist from "../models/HomemadeWatchlists";
import { isNumberObject } from "util/types";
import { createNotification } from "./notificationController";

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

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET || "secretKey",
            { expiresIn: "2h" }
        );

        res.status(201).json({
            message: "User successfully created",
            token,
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
        const user = await User.findById(userId)
            .populate('SavedHomemadeWatchlists')
            .populate('Friends');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const top3MovieIds = (user.Top3Movies || []) as number[];
        const movieWatchlistIds = (user.MovieWatchlist || []) as number[];
        const tvShowWatchlistIds = (user.TvShowWatchlist || []) as number[];
        const top3TvShowIds = (user.Top3TvShow || []) as number[];

        const top3Movies = top3MovieIds.length > 0
            ? await Movie.find({ tmdb_id: { $in: top3MovieIds } })
            : [];

        const movieWatchlist = movieWatchlistIds.length > 0
            ? await Movie.find({ tmdb_id: { $in: movieWatchlistIds } })
            : [];

        const top3TvShows = top3TvShowIds.length > 0
            ? await TVShow.find({ tmdb_id: { $in: top3TvShowIds } })
            : [];

        const tvShowWatchlist = tvShowWatchlistIds.length > 0
            ? await TVShow.find({ tmdb_id: { $in: tvShowWatchlistIds } })
            : [];

        const averageMovieRating = user.RatedMovies && user.RatedMovies.length > 0
            ? user.RatedMovies.reduce((sum, item) => sum + item.rating, 0) / user.RatedMovies.length
            : 0;

        const averageTvShowRating = user.RatedTvShows && user.RatedTvShows.length > 0
            ? user.RatedTvShows.reduce((sum, item) => sum + item.rating, 0) / user.RatedTvShows.length
            : 0;
        const watchedMoviesWithDetails = user.RatedMovies.map((ratedMovie: any) => {
            return { runtime: ratedMovie.runtime || 0 };
        });

        const watchedTvShowsWithDetails = user.RatedTvShows.map((ratedShow: any) => {
            return { total_runtime: ratedShow.total_runtime || 0 };
        });
        const profileData = {
            userProfilePicture: user.UserProfilePicture || null,
            userFirstName: user.UserFirstName || '',
            userLastName: user.UserLastName || '',
            userPseudo: user.UserPseudo || '',
            userMail: user.UserMail || '',
            userPassword: '',
            top3Movies: top3Movies.map((movie: any) => ({
                id: movie.tmdb_id,
                title: movie.title || 'Unknown Movie',
                poster: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : ''
            })),
            top3TvShows: top3TvShows.map((show: any) => ({
                id: show.tmdb_id,
                title: show.name || 'Unknown Show',
                poster: show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : ''
            })),
            movieWatchlist: movieWatchlist.map((movie: any) => ({
                id: movie.tmdb_id,
                title: movie.title || 'Unknown Movie',
                poster: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : ''
            })),
            savedHomemadeWatchlists: (user.SavedHomemadeWatchlists as any[]).map((watchlist: any) => ({
                _id: watchlist._id,
                id: watchlist._id,
                title: watchlist.title || 'Unknown Watchlist',
                posterPath: watchlist.posterPath || ''
            })),
            tvShowWatchlist: tvShowWatchlist.map((show: any) => ({
                id: show.tmdb_id,
                title: show.name || 'Unknown Show',
                poster: show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : ''
            })),
            numberOfWatchedMovies: user.NumberOfWatchedMovies || 0,
            numberOfWatchedTvShows: user.NumberOfWatchedTvShows || 0,
            numberOfGivenReviews: user.NumberOfGivenReviews || 0,
            numberOfFriends: user.Friends?.length || 0,
            averageMovieRating: Number(averageMovieRating.toFixed(1)),
            averageTvShowRating: Number(averageTvShowRating.toFixed(1)),
            reviews: user.Reviews || [],
            ratedMovies: user.RatedMovies || [],
            ratedTvShows: user.RatedTvShows || [],
            watchedMovies: watchedMoviesWithDetails,
            watchedTvShows: watchedTvShowsWithDetails,
            totalWatchTimeFromWatchlists: user.TotalWatchTimeFromWatchlists || 0,
            lastWatchedMovie: null
        };

        console.log("📤 Sending watchedMovies:", profileData.watchedMovies);

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
        }).select('_id UserPseudo UserMail UserProfilePicture UserFirstName UserLastName').limit(10);

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Error searching users", error: err });
    }
};

// ------------- GET PUBLIC PROFILE
export const getPublicProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = (req as any).userId;

        console.log('📋 getPublicProfile - viewing userId:', userId, 'by currentUserId:', currentUserId);

        const user = await User.findById(userId);

        if (!user) {
            console.log('❌ User not found:', userId);
            return res.status(404).json({ message: "User not found" });
        }

        console.log('✅ User found:', user.UserPseudo);
        let isBlocked = false;
        try {
            isBlocked = user.BlockedUsers && Array.isArray(user.BlockedUsers) && user.BlockedUsers.some(
                (blockedId: any) => blockedId.toString() === currentUserId
            );
        } catch (blockErr) {
            console.log('⚠️ Error checking blocked status:', blockErr);
            isBlocked = false;
        }
        console.log('🚫 isBlocked:', isBlocked);
        const top3MovieIds = Array.isArray(user.Top3Movies) ? user.Top3Movies.filter(id => typeof id === 'number') : [];
        const movieWatchlistIds = Array.isArray(user.MovieWatchlist) ? user.MovieWatchlist.filter(id => typeof id === 'number') : [];
        const tvShowWatchlistIds = Array.isArray(user.TvShowWatchlist) ? user.TvShowWatchlist.filter(id => typeof id === 'number') : [];
        const top3TvShowIds = Array.isArray(user.Top3TvShow) ? user.Top3TvShow.filter(id => typeof id === 'number') : [];

        console.log('🎬 Fetching movies:', { top3MovieIds: top3MovieIds.length, movieWatchlistIds: movieWatchlistIds.length });

        let top3Movies: any[] = [];
        let movieWatchlist: any[] = [];
        let top3TvShows: any[] = [];
        let tvShowWatchlist: any[] = [];

        if (top3MovieIds.length > 0) {
            try {
                top3Movies = await Movie.find({ tmdb_id: { $in: top3MovieIds } }).lean();
            } catch (err) {
                console.log('⚠️ Error fetching top3 movies:', err);
            }
        }

        if (movieWatchlistIds.length > 0) {
            try {
                movieWatchlist = await Movie.find({ tmdb_id: { $in: movieWatchlistIds } }).lean();
            } catch (err) {
                console.log('⚠️ Error fetching movie watchlist:', err);
            }
        }

        if (top3TvShowIds.length > 0) {
            try {
                top3TvShows = await TVShow.find({ tmdb_id: { $in: top3TvShowIds } }).lean();
            } catch (err) {
                console.log('⚠️ Error fetching top3 TV shows:', err);
            }
        }

        if (tvShowWatchlistIds.length > 0) {
            try {
                tvShowWatchlist = await TVShow.find({ tmdb_id: { $in: tvShowWatchlistIds } }).lean();
            } catch (err) {
                console.log('⚠️ Error fetching TV show watchlist:', err);
            }
        }

        console.log('📺 TV shows fetched:', { top3TvShows: top3TvShows.length, tvShowWatchlist: tvShowWatchlist.length });

        const averageMovieRating = user.RatedMovies && Array.isArray(user.RatedMovies) && user.RatedMovies.length > 0
            ? user.RatedMovies.reduce((sum, item) => sum + (item.rating || 0), 0) / user.RatedMovies.length
            : 0;

        const averageTvShowRating = user.RatedTvShows && Array.isArray(user.RatedTvShows) && user.RatedTvShows.length > 0
            ? user.RatedTvShows.reduce((sum, item) => sum + (item.rating || 0), 0) / user.RatedTvShows.length
            : 0;

        const watchedMoviesWithDetails = (Array.isArray(user.RatedMovies) ? user.RatedMovies : []).map((ratedMovie: any) => {
            return { runtime: ratedMovie.runtime || 0 };
        });

        const watchedTvShowsWithDetails = (Array.isArray(user.RatedTvShows) ? user.RatedTvShows : []).map((ratedShow: any) => {
            return { total_runtime: ratedShow.total_runtime || 0 };
        });

        const responseData = {
            UserPseudo: user.UserPseudo || '',
            UserFirstName: user.UserFirstName || '',
            UserLastName: user.UserLastName || '',
            UserProfilePicture: user.UserProfilePicture || null,
            isBlocked,
            top3Movies: top3Movies.map((movie: any) => ({
                id: movie.tmdb_id,
                title: movie.title || 'Unknown Movie',
                poster: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : ''
            })),
            top3TvShows: top3TvShows.map((show: any) => ({
                id: show.tmdb_id,
                title: show.name || 'Unknown Show',
                poster: show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : ''
            })),
            numberOfWatchedMovies: user.NumberOfWatchedMovies || 0,
            numberOfWatchedTvShows: user.NumberOfWatchedTvShows || 0,
            numberOfGivenReviews: user.NumberOfGivenReviews || 0,
            MovieWatchlist: movieWatchlist.map((m: any) => ({
                id: m.tmdb_id,
                title: m.title || 'Unknown Movie',
                poster: m.poster_path
                    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                    : ''
            })),
            TvShowWatchlist: tvShowWatchlist.map((show: any) => ({
                id: show.tmdb_id,
                title: show.name || 'Unknown Show',
                poster: show.poster_path
                    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                    : ''
            })),
            averageMovieRating: Number(averageMovieRating.toFixed(1)),
            averageTvShowRating: Number(averageTvShowRating.toFixed(1)),
            numberOfFriends: (Array.isArray(user.Friends) ? user.Friends : []).length,
            watchedMovies: watchedMoviesWithDetails,
            watchedTvShows: watchedTvShowsWithDetails,
        };

        console.log('✅ Sending profile data for:', user.UserPseudo);
        res.status(200).json(responseData);
    } catch (err) {
        console.error('💥 Error in getPublicProfile:', err);
        res.status(500).json({
            message: "Error fetching public profile",
            error: err instanceof Error ? err.message : String(err)
        });
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
        console.log('🔍 Adding friend - userId:', userId);
        console.log('🔍 Adding friend - friendId:', friendId);
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        console.log('👤 User found:', user ? 'Yes' : 'No');
        console.log('👤 Friend found:', friend ? 'Yes' : 'No');
        if (!user || !friend) {
            return res.status(404).json({ message: "User request not found" });
        }
        console.log('👥 User.Friends BEFORE cleanup:', user.Friends);
        if (!Array.isArray(user.Friends)) {
            console.log('⚠️ Friends is not an array, initializing...');
            user.Friends = [];
        }

        user.Friends = user.Friends.filter(f =>
            f.friendId && f.friendPseudo
        );
        console.log('👥 User.Friends AFTER cleanup:', user.Friends);

        const isAlreadyFriend = user.Friends.some(f =>
            f.friendId && f.friendId.toString() === friendId
        );
        console.log('🤝 Already friends?', isAlreadyFriend);
        if (!isAlreadyFriend) {
            console.log('➕ Adding friend relationship...');
            console.log('   Friend pseudo:', friend.UserPseudo);
            console.log('   Friend ID:', friend._id);
            user.Friends.push({
                friendId: friend._id as Types.ObjectId,
                friendSince: new Date(),
                friendPseudo: friend.UserPseudo,
                friendProfilePicture: friend.UserProfilePicture || ""
            });
            if (!Array.isArray(friend.Friends)) {
                friend.Friends = [];
            }
            friend.Friends = friend.Friends.filter(f =>
                f.friendId && f.friendPseudo
            );
            friend.Friends.push({
                friendId: user._id as Types.ObjectId,
                friendSince: new Date(),
                friendPseudo: user.UserPseudo,
                friendProfilePicture: user.UserProfilePicture || ""
            });
            await User.updateOne({ _id: userId }, { Friends: user.Friends });
            console.log('✅ User saved');
            await User.updateOne({ _id: friendId }, { Friends: friend.Friends });
            console.log('✅ Friend saved');
            await createNotification(
                friendId,
                userId,
                "friend_request",
                `has added you as a friend`
            );
        } else {
            console.log('⚠️ Already friends, skipping');
        }
        res.status(200).json({ message: "Friend successfully added", user });
    } catch (err) {
        console.error('💥 Error in addAFriend:', err);
        res.status(500).json({
            message: "Could not add this friend",
            error: err instanceof Error ? err.message : 'Unknown error'
        });
    }
};
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

//-------------- USER GET FRIENDS REVIEWS
export const getFriendsReviews = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('Friends.friendId', 'UserPseudo UserFirstName UserProfilePicture RatedMovies RatedTvShows');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const friendReviews: any[] = [];
        for (const friend of user.Friends) {
            const friendData = friend.friendId as any;
            if (friendData) {
                if (friendData.RatedMovies) {
                    friendData.RatedMovies.forEach((ratedMovie: any) => {
                        if (ratedMovie.review) {
                            friendReviews.push({
                                friendId: friendData._id,
                                friendName: friendData.UserPseudo || friendData.UserFirstName,
                                friendProfilePicture: friendData.UserProfilePicture || null,
                                movieId: ratedMovie.tmdbMovieId,
                                movieTitle: ratedMovie.movieTitle,
                                moviePosterPath: null,
                                review: ratedMovie.review,
                                rating: ratedMovie.rating,
                                createdAt: ratedMovie.createdAt || new Date(),
                                type: 'movie'
                            });
                        }
                    });
                }
                if (friendData.RatedTvShows) {
                    friendData.RatedTvShows.forEach((ratedShow: any) => {
                        if (ratedShow.review) {
                            friendReviews.push({
                                friendId: friendData._id,
                                friendName: friendData.UserPseudo || friendData.UserFirstName,
                                friendProfilePicture: friendData.UserProfilePicture || null,
                                movieId: ratedShow.tmdbTvShowId,
                                movieTitle: ratedShow.tvShowTitle,
                                moviePosterPath: null,
                                review: ratedShow.review,
                                rating: ratedShow.rating,
                                createdAt: ratedShow.createdAt || new Date(),
                                type: 'tv'
                            });
                        }
                    });
                }
            }
        }
        friendReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const limitedReviews = friendReviews.slice(0, 20);
        res.json({ reviews: limitedReviews });
    } catch (error) {
        console.error('Error fetching friends reviews:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// --------- USER ADDS A MOVIE TO ITS WATCHLIST
export const addAMovieToWatchlist = async (req: Request, res: Response) => {
    try {
        const { userId, movieId } = req.params;
        console.log("🎬 Adding movie to watchlist:", { userId, movieId });

        const user = await User.findById(userId);
        const movie = await Movie.findOne({ tmdb_id: Number(movieId) });

        console.log("User:", !!user, "Movie:", !!movie);

        if (!user || !movie) {
            return res.status(404).json({ message: "User or movie not found" });
        }
        user.RatedMovies = user.RatedMovies.filter((r: any) =>
            r.tmdbMovieId && r.movieTitle
        );

        user.RatedTvShows = user.RatedTvShows.filter((r: any) =>
            r.tmdbTvShowId && r.tvShowTitle
        );

        const movieTmdbId = Number(movieId);
        if (!user.MovieWatchlist.includes(movieTmdbId)) {
            user.MovieWatchlist.push(movieTmdbId);
            await user.save();
            console.log("✅ Movie added to watchlist");
        } else {
            console.log("⚠️ Movie already in watchlist");
        }

        res.status(200).json({ message: "Movie added to your watchlist", user });
    } catch (err) {
        console.error("❌ Error in addAMovieToWatchlist:", err);
        res.status(500).json({
            message: "Error while adding a movie to your watchlist",
            error: err instanceof Error ? err.message : String(err)
        });
    }
}

// ------------- USER ADDS A TVSHOW TO ITS WATCHLIST
export const addATvShowToWatchlist = async (req: Request, res: Response) => {
    try {
        const { userId, tvShowId } = req.params;
        console.log("📺 Adding TV show to watchlist:", { userId, tvShowId });

        const user = await User.findById(userId);
        const tvShow = await TVShow.findOne({ tmdb_id: Number(tvShowId) });

        console.log("User:", !!user, "TV Show:", !!tvShow);

        if (!user || !tvShow) {
            return res.status(404).json({ message: "User or TV Show not found" });
        }
        user.RatedMovies = user.RatedMovies.filter((r: any) =>
            r.tmdbMovieId && r.movieTitle
        );

        user.RatedTvShows = user.RatedTvShows.filter((r: any) =>
            r.tmdbTvShowId && r.tvShowTitle
        );

        const tvShowTmdbId = Number(tvShowId);
        if (!user.TvShowWatchlist.includes(tvShowTmdbId)) {
            user.TvShowWatchlist.push(tvShowTmdbId);
            await user.save();
            console.log("✅ TV show added to watchlist");
        } else {
            console.log("⚠️ TV show already in watchlist");
        }

        res.status(200).json({ message: "TV Show added to your watchlist", user });
    } catch (err) {
        console.error("❌ Error in addATvShowToWatchlist:", err);
        res.status(500).json({
            message: "Error while adding a TV Show to your watchlist",
            error: err instanceof Error ? err.message : String(err)
        });
    }
}

// ------------- USER DELETES A MOVIE FROM ITS WATCHLIST
export const deleteAMovieFromWatchlist = async (req: Request, res: Response) => {
    try {
        const { userId, movieId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const movieTmdbId = Number(movieId);
        user.MovieWatchlist = user.MovieWatchlist.filter(id => id !== movieTmdbId);
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

        const tvShowTmdbId = Number(tvShowId);
        user.TvShowWatchlist = user.TvShowWatchlist.filter(id => id !== tvShowTmdbId);
        await user.save();

        res.status(200).json({ message: "TV Show deleted from your watchlist", user });
    } catch (err) {
        res.status(500).json({ message: "Error while deleting a TV Show from your watchlist", error: err });
    }
}

// ---------- USER DELETES A HOMEMADE WATCHLIST FROM ITS SAVED WATCHLISTS
export const deleteAHomemadeWatchlistFromSavedWatchlists = async (req: Request, res: Response) => {
    try {
        const { userId, watchlistId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.SavedHomemadeWatchlists = user.SavedHomemadeWatchlists.filter(id => id.toString() !== watchlistId);
        await user.save();
        res.status(200).json({ message: "Homemade watchlist deleted from your saved watchlists", user });
    } catch (err) {
        res.status(500).json({ message: "Error while deleting a homemade watchlist from your saved watchlists", error: err });
    }
}

// ------------- USER ADDS A MOVIE TO ITS TOP3 FAVORITES

export const addAMovieToTop3Favorites = async (req: Request, res: Response) => {
    try {
        const { userId, movieId } = req.params;
        console.log('🎬 Adding movie to top3:', { userId, movieId });

        const user = await User.findById(userId);
        const movie = await Movie.findOne({ tmdb_id: Number(movieId) });

        if (!user || !movie) {
            return res.status(404).json({ message: "User or movie not found" });
        }

        const currentTop3 = Array.isArray(user.Top3Movies) ? user.Top3Movies : [];
        if (currentTop3.length >= 3) {
            return res.status(400).json({ message: "You can only have 3 favorite movies" });
        }

        const movieTmdbId = Number(movieId);
        if (!currentTop3.includes(movieTmdbId)) {
            currentTop3.push(movieTmdbId);
            await User.updateOne({ _id: userId }, { Top3Movies: currentTop3 });
            console.log('✅ Movie added to top3');
        } else {
            console.log('⚠️ Movie already in top3');
        }

        res.status(200).json({ message: "Movie added to your Top 3 favorites" });
    } catch (err) {
        console.error('💥 Error adding movie to top3:', err);
        res.status(500).json({ message: "Error while adding a movie to your Top 3 favorites", error: err instanceof Error ? err.message : String(err) });
    }
}

// ------------- USER ADDS A TVSHOW TO ITS TOP3 FAVORITES
export const addATvShowToTop3Favorites = async (req: Request, res: Response) => {
    try {
        const { userId, tvShowId } = req.params;
        console.log('📺 Adding TV show to top3:', { userId, tvShowId });

        const user = await User.findById(userId);
        const tvShow = await TVShow.findOne({ tmdb_id: Number(tvShowId) });

        if (!user || !tvShow) {
            return res.status(404).json({ message: "User or TV Show not found" });
        }

        const currentTop3 = Array.isArray(user.Top3TvShow) ? user.Top3TvShow : [];
        if (currentTop3.length >= 3) {
            return res.status(400).json({ message: "You can only have 3 favorite TV Shows" });
        }

        const tvShowTmdbId = Number(tvShowId);
        if (!currentTop3.includes(tvShowTmdbId)) {
            currentTop3.push(tvShowTmdbId);
            await User.updateOne({ _id: userId }, { Top3TvShow: currentTop3 });
            console.log('✅ TV show added to top3');
        } else {
            console.log('⚠️ TV show already in top3');
        }

        res.status(200).json({ message: "TV Show added to your Top 3 favorites" });
    } catch (err) {
        console.error("❌ Error adding TV show to Top3:", err);
        res.status(500).json({ message: "Error while adding a TV Show to your Top 3 favorites", error: err instanceof Error ? err.message : String(err) });
    }
};

// ------------- DELETE A MOVIE FROM TOP3 FAVORITES
export const deleteAMovieFromTop3Favorites = async (req: Request, res: Response) => {
    try {
        const { userId, movieId } = req.params;
        console.log('🗑️ Deleting movie from top3:', { userId, movieId });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const movieTmdbId = Number(movieId);
        const currentTop3 = Array.isArray(user.Top3Movies) ? user.Top3Movies : [];
        const updatedTop3 = currentTop3.filter((id: any) => Number(id) !== movieTmdbId);
        await User.updateOne({ _id: userId }, { Top3Movies: updatedTop3 });
        console.log('✅ Movie deleted from top3');

        res.status(200).json({ message: "Movie deleted from your Top 3 favorites" });
    } catch (err) {
        console.error("❌ Error deleting movie from Top3:", err);
        res.status(500).json({ message: "Error while deleting a movie from your Top 3 favorites", error: err instanceof Error ? err.message : String(err) });
    }
};


// ------------- DELETE A TVSHOW FROM TOP3 FAVORITES
export const deleteATvShowFromTop3Favorites = async (req: Request, res: Response) => {
    try {
        const { userId, tvShowId } = req.params;
        console.log('🗑️ Deleting TV show from top3:', { userId, tvShowId });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const tvShowTmdbId = Number(tvShowId);
        const currentTop3 = Array.isArray(user.Top3TvShow) ? user.Top3TvShow : [];
        const updatedTop3 = currentTop3.filter((id: any) => Number(id) !== tvShowTmdbId);
        await User.updateOne({ _id: userId }, { Top3TvShow: updatedTop3 });
        console.log('✅ TV show deleted from top3');

        res.status(200).json({ message: "TV Show deleted from your Top 3 favorites" });
    } catch (err) {
        console.error("❌ Error deleting TV show from Top3:", err);
        res.status(500).json({ message: "Error while deleting a TV Show from your Top 3 favorites", error: err instanceof Error ? err.message : String(err) });
    }
};
// ------------- SAVE RATING AND REVIEW
export const saveRatingAndReview = async (req: Request, res: Response) => {
    try {
        console.log('🚀 saveRatingAndReview called!');
        const { userId, itemId } = req.params;
        const { type, rating, reviewText, itemTitle } = req.body;

        console.log('📥 Request params:', { userId, itemId });
        console.log('📥 Request body:', { type, rating, reviewText, itemTitle });

        if (!itemId) {
            console.log('❌ No itemId provided');
            return res.status(400).json({ message: "itemId is required" });
        }

        if (!["movie", "tvshow"].includes(type)) {
            console.log('❌ Invalid type:', type);
            return res.status(400).json({ message: "Invalid type" });
        }

        console.log('🔍 Finding user:', userId);
        const user = await User.findById(userId);
        if (!user) {
            console.log('❌ User not found');
            return res.status(404).json({ message: "User not found" });
        }
        console.log('✅ User found:', user.UserPseudo);

        let runtime = 0;
        if (type === "movie") {
            try {
                const tmdbResponse = await fetch(
                    `https://api.themoviedb.org/3/movie/${itemId}?api_key=${process.env.TMDB_API_KEY}`
                );
                const tmdbData = await tmdbResponse.json();
                runtime = tmdbData.runtime || 0;
                console.log(`⏱️ Fetched movie runtime: ${runtime} minutes`);
            } catch (err) {
                console.error("❌ Error fetching movie runtime:", err);
            }
        }
        const ratedMovies = Array.isArray(user.RatedMovies)
            ? user.RatedMovies.filter(r => r && r.tmdbMovieId && r.movieTitle)
            : [];

        const ratedTvShows = Array.isArray(user.RatedTvShows)
            ? user.RatedTvShows.filter(r => r && r.tmdbTvShowId && r.tvShowTitle)
            : [];

        const reviews = Array.isArray(user.Reviews)
            ? user.Reviews.filter(r => r && r.itemId && r.itemId.toString().trim().length > 0)
            : [];

        if (type === "movie") {
            console.log('🎬 Processing movie rating...');
            const existingIndex = ratedMovies.findIndex(
                (r: any) => r.tmdbMovieId === Number(itemId)
            );

            if (existingIndex !== -1) {
                console.log('📝 Updating existing movie rating');
                ratedMovies[existingIndex].rating = rating;
                ratedMovies[existingIndex].review = reviewText || "";
                ratedMovies[existingIndex].movieTitle = itemTitle || ratedMovies[existingIndex].movieTitle;
                ratedMovies[existingIndex].runtime = runtime;
                ratedMovies[existingIndex].createdAt = new Date();
            } else {
                console.log('➕ Adding new movie rating');
                ratedMovies.push({
                    tmdbMovieId: Number(itemId),
                    movieTitle: itemTitle || 'Unknown Movie',
                    rating,
                    review: reviewText || "",
                    runtime,
                    createdAt: new Date()
                } as any);
            }

            const numberOfWatchedMovies = ratedMovies.length;
            const averageMovieRating = ratedMovies.length > 0
                ? ratedMovies.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / ratedMovies.length
                : 0;

            console.log('📊 Updated movie stats:', {
                count: numberOfWatchedMovies,
                avg: averageMovieRating
            });
            await User.updateOne(
                { _id: userId },
                {
                    RatedMovies: ratedMovies,
                    NumberOfWatchedMovies: numberOfWatchedMovies,
                    AverageMovieRating: averageMovieRating,
                    $pull: { MovieWatchlist: Number(itemId) } 
                }
            );
        } else if (type === "tvshow") {
            console.log('📺 Processing TV show rating...');

            // Fetch TV show runtime from database
            let total_runtime = 0;
            try {
                const TVShowModel = require('../models/TVShow').default;
                const tvShow = await TVShowModel.findOne({ tmdb_id: Number(itemId) });
                if (tvShow) {
                    total_runtime = tvShow.total_runtime || 0;
                    console.log(`⏱️ Fetched TV show total_runtime: ${total_runtime} minutes`);
                }
            } catch (err) {
                console.error("❌ Error fetching TV show runtime:", err);
            }

            const existingIndex = ratedTvShows.findIndex(
                (r: any) => r.tmdbTvShowId === Number(itemId)
            );

            if (existingIndex !== -1) {
                console.log('📝 Updating existing TV show rating');
                ratedTvShows[existingIndex].rating = rating;
                ratedTvShows[existingIndex].review = reviewText || "";
                ratedTvShows[existingIndex].tvShowTitle = itemTitle || ratedTvShows[existingIndex].tvShowTitle;
                ratedTvShows[existingIndex].total_runtime = total_runtime;
                ratedTvShows[existingIndex].createdAt = new Date();
            } else {
                console.log('➕ Adding new TV show rating');
                ratedTvShows.push({
                    tmdbTvShowId: Number(itemId),
                    tvShowTitle: itemTitle || 'Unknown TV Show',
                    rating,
                    review: reviewText || "",
                    total_runtime,
                    createdAt: new Date()
                } as any);
            }

            const numberOfWatchedTvShows = ratedTvShows.length;
            const averageTvShowRating = ratedTvShows.length > 0
                ? ratedTvShows.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / ratedTvShows.length
                : 0;

            console.log('📊 Updated TV show stats:', {
                count: numberOfWatchedTvShows,
                avg: averageTvShowRating
            });
            await User.updateOne(
                { _id: userId },
                {
                    RatedTvShows: ratedTvShows,
                    NumberOfWatchedTvShows: numberOfWatchedTvShows,
                    AverageTvShowRating: averageTvShowRating,
                    $pull: { TvShowWatchlist: Number(itemId) }
                }
            );
        }
        if (reviewText && reviewText.trim().length > 0) {
            console.log('💾 Saving review in Reviews array...');
            const existingReviewIndex = reviews.findIndex(
                r => r.itemId === String(itemId) && r.type === type
            );
            if (existingReviewIndex !== -1) {
                console.log('📝 Updating existing review');
                reviews[existingReviewIndex].text = reviewText;
                reviews[existingReviewIndex].date = new Date();
            } else {
                console.log('➕ Adding new review');
                reviews.push({
                    itemId: String(itemId),
                    type,
                    text: reviewText,
                    date: new Date(),
                });
            }

            const numberOfGivenReviews = reviews.length;
            console.log('📊 Total reviews after update:', numberOfGivenReviews);
            await User.updateOne(
                { _id: userId },
                {
                    Reviews: reviews,
                    NumberOfGivenReviews: numberOfGivenReviews
                }
            );
        }

        console.log('✅ All updates completed successfully!');

        res.status(200).json({
            message: "Saved successfully",
            runtime: runtime
        });
    } catch (err) {
        console.error("❌ Error saving rating:", err);
        res.status(500).json({ message: "Saving error", error: err instanceof Error ? err.message : String(err) });
    }
};

// ------------- GET MOVIE/TV WITH USER RATING AND REVIEW
export const getItemWithUserData = async (req: Request, res: Response) => {
    try {
        const { userId, itemId } = req.params;
        const { type } = req.query;

        console.log('🔍 Getting item with user data:', { userId, itemId, type });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let userRating = 0;
        let userReview = "";

        if (type === "movie") {
            const ratedMovie = user.RatedMovies.find(
                (r: any) => r.tmdbMovieId === Number(itemId)
            );
            if (ratedMovie) {
                userRating = ratedMovie.rating;
                userReview = ratedMovie.review || "";
            }
        } else if (type === "tvshow") {
            const ratedShow = user.RatedTvShows.find(
                (r: any) => r.tmdbTvShowId === Number(itemId)
            );
            if (ratedShow) {
                userRating = ratedShow.rating;
                userReview = ratedShow.review || "";
            }
        }

        console.log('✅ Found user data:', { userRating, userReview });

        res.status(200).json({
            myRating: userRating,
            myReview: userReview
        });

    } catch (err) {
        console.error("❌ Error getting item with user data:", err);
        res.status(500).json({ message: "Error getting item data", error: err });
    }
};