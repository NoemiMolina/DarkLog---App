import mongoose, { Schema, Document, Types } from "mongoose";
import { ref } from "process";

interface ITopMovie {
    MovieID: Types.ObjectId;
    MovieName: string;
    MovieGenre: string;
};

interface ITopTvShow {
    TvShowID: Types.ObjectId;
    TvShowName: string;
    TvShowGenre: string;
};

export interface IUser extends Document {
    UserFirstName: string;
    UserLastName: string;
    UserPseudo: string;
    UserMail: string;
    UserPassword: string;
    UserLocation: string;
    UserAge: number;
    UserProfilePicture?: string;
    SignUpDate: Date;
    NumberOfWatchedMovies: number;
    NumberOfWatchedTvShows: number;
    NumberOfGivenReviews: number;
    AverageMovieRating: number;
    AverageTvShowRating: number;
    LastWatchedMovie: string;
    MovieWatchlist: Types.ObjectId[];
    TvShowWatchlist: Types.ObjectId[];
    Top3Movies: Types.ObjectId[];
    Top3TvShow: Types.ObjectId[];
    Friends: {
        friendId: Types.ObjectId;
        friendSince: Date;
        friendPseudo: string;
        friendProfilePicture?: string;
    }[];
    BlockedUsers: Types.ObjectId[];
    UserBadge: string;
    RatedMovies: {
        movieId: string;
        rating: number;
        review?: string;
    }[];
    RatedTvShows: {
        tvShowId: string;
        rating: number;
        review?: string;
    }[];
    Reviews: {
        itemId: string;
        type: "movie" | "tv";
        text: string;
        date: Date;
    }[];
};

const UserSchema: Schema = new Schema({
    UserFirstName: { type: String, required: true },
    UserLastName: { type: String, required: true },
    UserPseudo: { type: String, required: true },
    UserMail: { type: String, required: true },
    UserLocation: { type: String, required: true },
    UserPassword: { type: String, required: true },
    UserAge: { type: Number },
    UserProfilePicture: { type: String, default: "" },
    SignUpDate: { type: Date, default: Date.now },
    NumberOfWatchedMovies: { type: Number, default: 0 },
    NumberOfWatchedTvShows: { type: Number, default: 0 },
    NumberOfGivenReviews: { type: Number, default: 0 },
    AverageMovieRating: { type: Number, default: 0 },
    AverageTvShowRating: { type: Number, default: 0 },
    RatedMovies: [{
        movieId: { type: String },
        rating: { type: Number },
        review: { type: String }
    }],
    RatedTvShows: [{
        tvShowId: { type: String },
        rating: { type: Number },
        review: { type: String }
    }],
    Reviews: [{
        itemId: { type: String, required: true },  
        type: { type: String, enum: ["movie", "tv"], required: true },  
        text: { type: String, required: true }, 
        date: { type: Date, default: Date.now }
    }],
    LastWatchedMovie: { type: String, default: "" },
    MovieWatchlist: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    TvShowWatchlist: [{ type: Schema.Types.ObjectId, ref: "tvshows" }],
    Top3Movies: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    Top3TvShow: [{ type: Schema.Types.ObjectId, ref: "tvshows" }],
    Friends: [{
        friendId: { type: Schema.Types.ObjectId, ref: "User" },
        friendSince: { type: Date, default: Date.now },
        friendPseudo: { type: String, required: true, ref: "User" },
        friendProfilePicture: { type: String, default: "", ref: "User" }
    }],
    BlockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    UserBadge: { type: String, default: "" }
});

export default mongoose.model<IUser>("User", UserSchema);