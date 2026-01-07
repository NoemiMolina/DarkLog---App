import mongoose, { Schema, Document, Types } from "mongoose";

export interface IHomemadeWatchlist extends Document {
  title: string;
  description?: string;
  posterPath?: string;
  movies: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const HomemadeWatchlistSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    posterPath: { type: String },
    movies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IHomemadeWatchlist>(
  "HomemadeWatchlist",
  HomemadeWatchlistSchema,
  "homemade_watchlists"
);
