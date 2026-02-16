import mongoose, { Schema, Document, Types } from "mongoose";
import { ref } from "process";

interface ITopMovie {
  MovieID: Types.ObjectId;
  MovieName: string;
  MovieGenre: string;
}

interface ITopTvShow {
  TvShowID: Types.ObjectId;
  TvShowName: string;
  TvShowGenre: string;
}

export interface IUser extends Document {
  UserPseudo: string;
  UserMail: string;
  UserPassword: string;
  UserProfilePicture?: string;
  SignUpDate: Date;
  EmailVerified: boolean;
  VerificationToken?: string | null;
  VerificationTokenExpiry?: Date | null;
  NumberOfWatchedMovies: number;
  NumberOfWatchedTvShows: number;
  NumberOfGivenReviews: number;
  AverageMovieRating: number;
  AverageTvShowRating: number;
  LastWatchedMovie: string;
  MovieWatchlist: number[];
  TvShowWatchlist: number[];
  Top3Movies: number[];
  Top3TvShow: number[];
  Friends: {
    friendId: Types.ObjectId;
    friendSince: Date;
    friendPseudo: string;
    friendProfilePicture?: string;
  }[];
  BlockedUsers: Types.ObjectId[];
  UserBadge: string;
  RatedMovies: {
    tmdbMovieId: number;
    movieTitle: string;
    rating: number;
    review?: string;
    createdAt: Date;
    runtime: number;
  }[];
  RatedTvShows: {
    tmdbTvShowId: number;
    tvShowTitle: string;
    rating: number;
    review?: string;
    createdAt: Date;
    total_runtime: number;
  }[];
  Reviews: {
    itemId: string;
    type: "movie" | "tv" | "tvshow";
    text: string;
    date: Date;
  }[];
  SavedHomemadeWatchlists: Types.ObjectId[];
  RatedWatchlists: {
    watchlistId: Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
    totalWatchlistRuntime: number;
  }[];
  WatchedMoviesInWatchlists: {
    watchlistId: Types.ObjectId;
    movieIds: Types.ObjectId[];
  }[];
  TotalWatchTimeFromWatchlists: number;
}

const UserSchema: Schema = new Schema({
  UserPseudo: { type: String, required: true },
  UserMail: { type: String, required: true },
  UserPassword: { type: String, required: true },
  UserProfilePicture: { type: String, default: "" },
  SignUpDate: { type: Date, default: Date.now },
  EmailVerified: { type: Boolean, default: false },
  VerificationToken: { type: String, default: null },
  VerificationTokenExpiry: { type: Date, default: null },
  NumberOfWatchedMovies: { type: Number, default: 0 },
  NumberOfWatchedTvShows: { type: Number, default: 0 },
  NumberOfGivenReviews: { type: Number, default: 0 },
  AverageMovieRating: { type: Number, default: 0 },
  AverageTvShowRating: { type: Number, default: 0 },
  RatedMovies: [
    {
      tmdbMovieId: { type: Number, required: true },
      movieTitle: { type: String, required: true },
      rating: { type: Number },
      review: { type: String },
      createdAt: { type: Date, default: Date.now },
      runtime: { type: Number },
    },
  ],
  RatedTvShows: [
    {
      tmdbTvShowId: { type: Number, required: true },
      tvShowTitle: { type: String, required: true },
      rating: { type: Number },
      review: { type: String },
      createdAt: { type: Date, default: Date.now },
      total_runtime: { type: Number, default: 0 },
    },
  ],
  Reviews: [
    {
      itemId: { type: String, required: true },
      type: { type: String, enum: ["movie", "tv", "tvshow"], required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  LastWatchedMovie: { type: String, default: "" },
  MovieWatchlist: [{ type: Number }],
  TvShowWatchlist: [{ type: Number }],
  Top3Movies: [{ type: Number }],
  Top3TvShow: [{ type: Number }],
  Friends: [
    {
      friendId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      friendSince: { type: Date, default: Date.now },
      friendPseudo: { type: String, required: true },
      friendProfilePicture: { type: String, default: "" },
    },
  ],
  BlockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  UserBadge: { type: String, default: "" },
  SavedHomemadeWatchlists: [
    { type: Schema.Types.ObjectId, ref: "HomemadeWatchlist" },
  ],
  RatedWatchlists: [
    {
      watchlistId: {
        type: Schema.Types.ObjectId,
        ref: "HomemadeWatchlist",
        required: true,
      },
      rating: { type: Number, required: true },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
      totalWatchlistRuntime: { type: Number },
    },
  ],
  WatchedMoviesInWatchlists: [
    {
      watchlistId: { type: Schema.Types.ObjectId, ref: "HomemadeWatchlist" },
      movieIds: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
    },
  ],
  TotalWatchTimeFromWatchlists: { type: Number, default: 0 },
});

export default mongoose.model<IUser>("User", UserSchema);
