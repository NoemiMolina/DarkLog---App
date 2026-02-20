import mongoose from "mongoose";

const { Schema } = mongoose;

const ReplySchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const CommentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    replies: [ReplySchema],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reports: [
      {
        reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reason: { type: String, required: true, trim: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const ForumPostSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    tags: [{ type: String, trim: true, lowercase: true }],
    published: { type: Boolean, default: false },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }], 
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }], 
    comments: [CommentSchema],
    reports: [
      {
        reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reason: { type: String, required: true, trim: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// probably useless but let's keep it for now
ForumPostSchema.index({ published: 1, createdAt: -1 });

export type ForumPostDocument = mongoose.InferSchemaType<
  typeof ForumPostSchema
> &
  mongoose.Document;

export default mongoose.model<ForumPostDocument>("ForumPost", ForumPostSchema);
