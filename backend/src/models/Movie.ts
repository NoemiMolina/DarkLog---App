import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMovie extends Document {
  title: string;
  year: number;
  genres: string[];
  tags: string[];
  ratings: [
    {
      userId: Types.ObjectId,
      value: Number
    }
  ]
}

const MovieSchema: Schema = new Schema({
  title: { type: String, required: true },
  year: { type: Number, required: true },
  genres: { type: [String], required: true },
  tags: { type: [String], default: [] },
  ratings: { type: [Number], default: [] }
});

export default mongoose.model<IMovie>("Movie", MovieSchema);
