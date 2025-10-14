import mongoose, { Schema, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  year: number;
  genres: string[];
  tags: string[];
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  genres: { type: [String], required: true },
  tags: { type: [String], default: [] },
});

export default mongoose.model<IMovie>("Movie", MovieSchema);
