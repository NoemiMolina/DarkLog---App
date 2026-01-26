import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
});

export default mongoose.model("News", NewsSchema);
