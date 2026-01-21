import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMovie extends Document {
  tmdb_id: number;
  title: string;
  year: number;
  genres: string[];
  genre_ids?: number[];
  tags: string[];
  poster_path?: string;
  runtime?: number;
  release_date?: string;
  ratings: [
    {
      userId: Types.ObjectId,
      value: Number
    }
  ]
}

const MovieSchema: Schema = new Schema({
  tmdb_id: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  genres: { type: [String], required: true },
  genre_ids: { type: [Number], default: [] },
  tags: { type: [String], default: [] },
  poster_path: { type: String },
  runtime: { type: Number },
  release_date: { type: String },
  ratings: { type: [Number], default: [] }
}, { timestamps: true });

export default mongoose.model<IMovie>("Movie", MovieSchema, "movies");
