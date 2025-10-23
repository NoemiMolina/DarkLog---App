import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IQuiz extends Document {
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  difficulty: string;
  type: string;
  imageUrl?: string;
  source: string;

}

const QuizQuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    category: { type: String, enum: ["culture", "dumb_description", "titleless_poster"], default: "culture" }, // check later for dumb description in case they say it's too vulgar...
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    type: { type: String, enum: ["movie", "tv"], default: "movie" },
    imageUrl: { type: String },
    source: { type: String, default: "manual" }
  },
  { timestamps: true }
);

export default mongoose.model("QuizQuestion", QuizQuestionSchema);

