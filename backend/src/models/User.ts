import mongoose, { Schema, Document, Types } from "mongoose";

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
    UserName: string;
    UserFamilyName: string;
    UserPseudo: string;
    UserMail: string;
    UserPassword: string;
    UserLocation: string;
    UserAge: number;
    SignUpDate: Date;
    NumberOfWatchedMovies: number;
    NumberOfWatchedTvShows: number;
    NumberOfGivenReviews: number;
    AverageMovieRating: number;
    AverageTvShowRating: number;
    LastWatchedMovie: string;
    MovieWatchlist: Types.ObjectId[];
    TvShowWatchlist: Types.ObjectId[];
    Top3Movies: ITopMovie[];
    Top3TvShow: ITopTvShow[];
    Friends: Types.ObjectId[];
    BlockedUsers: Types.ObjectId[];
    UserBadge: string;

};

const TopMovieSchema: Schema = new Schema({
    MovieID: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    MovieName: { type: String, required: true },
    MovieGenre: { type: String, required: true },
    TW: { type: [String], default: [] },
});

const TopTvShowSchema: Schema = new Schema({
    TvShowID: { type: Schema.Types.ObjectId, ref: "TV", required: true },
    TvShowName: { type: String, required: true },
    TvShowGenre: { type: String, required: true },
    TW: { type: [String], default: [] },
})

const UserSchema: Schema = new Schema({
    UserName: { type: String, required: true },
    UserFamilyName: { type: String, required: true },
    UserPseudo: { type: String, required: true },
    UserMail: { type: String, required: true },
    UserLocation: { type: String, required: true },
    UserPassword: { type: String, required: true },
    UserAge: { type: Number },
    SignUpDate: { type: Date, default: Date.now },
    NumberOfWatchedMovies: { type: Number, default: 0 },
    NumberOfWatchedTvShows: { type: Number, default: 0 },
    NumberOfGivenReviews: { type: Number, default: 0 },
    AverageMovieRating: { type: Number, default: 0 },
    AverageTvShowRating: { type: Number, default: 0 },
    LastWatchedMovie: { type: String, default: "" },
    MovieWatchlist: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    TvShowWatchlist: [{ type: Schema.Types.ObjectId, ref: "TV" }],
    Top3Movies: { type: [TopMovieSchema], default: [] },
    Top3TvShow: { type: [TopTvShowSchema], default: [] },
    Friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    BlockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    UserBadge: { type: String, default: "" }
});

export default mongoose.model<IUser>("User", UserSchema);