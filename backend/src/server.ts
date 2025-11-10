import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/database.js";
import userRoutes from "./routes/users.js";
import movieRoutes from "./routes/movies.js";
import tvShowsRoutes from "./routes/tvShows.js"
import reaiperRoutes from "./routes/reaiper.js"
import forumRoutes from "./routes/forum.js";
import quizRoutes from "./routes/quiz.js";
import searchRoutes from "./routes/search.js";

console.log("✅ Server.ts démarre !");


dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);
app.use("/tvShows", tvShowsRoutes);
app.use("/reaiper", reaiperRoutes); // not prioritized for now
app.use("/forum", forumRoutes);
app.use("/quiz", quizRoutes);
app.use("/search", searchRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.get("/", (req, res) => {
  res.send("Backend's app is online, gg");
});

app.listen(PORT, () => {
  console.log(`server is on on port : ${PORT}`);
});



