import mongoose, { Schema, Document, Types } from "mongoose";

interface ITopMovie {
    MovieID: Types.ObjectId;
    MovieName: string;
    MovieGenre: string;
};

export interface IUser extends Document {
    UserName: string;
    UserPseudo: string;
    UserMail: string;
    UserPassword: string;
    UserLocation: string;
    UserAge: number;
    SignUpDate: Date;
    NumberOfWatchedMovies: number;
    NumberOfGivenReviews: number;
    AverageMovieRating: number;
    LastWatchedMovie: string;
    Watchlist: Types.ObjectId[];
    Top3Movies: ITopMovie[];
    Friends: Types.ObjectId[];
    BlockedUsers: Types.ObjectId[]

};

const TopMovieSchema: Schema = new Schema({
    MovieID: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    MovieName: { type: String, required: true },
    MovieGenre: { type: String, required: true },
    TW: { type: [String], default: [] },
});

const UserSchema: Schema = new Schema({
    UserName: { type: String, required: true },
    UserPseudo: { type: String, required: true },
    UserMail: { type: String, required: true },
    UserLocation: { type: String, required: true },
    UserPassword: { type: String, required: true},
    UserAge: { type: Number },
    SignUpDate: { type: Date, default: Date.now },
    NumberOfWatchedMovies: { type: Number, default: 0 },
    NumberOfGivenReviews: { type: Number, default: 0 },
    AverageMovieRating: { type: Number, default: 0 },
    LastWatchedMovie: { type: String, default: "" },
    Watchlist: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    Top3Movies: { type: [TopMovieSchema], default: [] },
    Friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    BlockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model<IUser>("User", UserSchema);