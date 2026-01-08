import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/database";

import userRoutes from "./routes/users";
import movieRoutes from "./routes/movies";
import tvShowsRoutes from "./routes/tvShows";
import reaiperRoutes from "./routes/reaiper";
import forumRoutes from "./routes/forum";
import quizRoutes from "./routes/quiz";
import searchRoutes from "./routes/search";
import homemadeWatchlistsRoutes from "./routes/homemadeWatchlists";

console.log("✅ LETSGO !");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

const uploadsPath = path.resolve("uploads");
console.log("🗂️ Static folder served from:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

const publicPath = path.resolve("public");
console.log("🗂️ Public folder served from:", publicPath);
app.use("/", express.static(publicPath));

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);
app.use("/tvShows", tvShowsRoutes);
app.use("/reaiper", reaiperRoutes);
app.use("/forum", forumRoutes);
app.use("/quiz", quizRoutes);
app.use("/search", searchRoutes);
app.use("/homemade-watchlists", homemadeWatchlistsRoutes);
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Backend's app is online, gg");
});

app.listen(PORT, () => {
  console.log(`server is on on port : ${PORT}`);
});
