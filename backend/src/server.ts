import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import connectDB from "./config/database";

import userRoutes from "./routes/users";
import movieRoutes from "./routes/movies";
import tvShowsRoutes from "./routes/tvShows";
import reaiperRoutes from "./routes/reaiper";
import forumRoutes from "./routes/forum";
import quizRoutes from "./routes/quiz";
import searchRoutes from "./routes/search";
import homemadeWatchlistsRoutes from "./routes/homemadeWatchlists";
import notificationRoutes from "./routes/notification";
import newsRoutes from "./routes/news";
import importRoutes from "./routes/import";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// 🔌 Socket.IO setup
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
    "https://fearlogapp.vercel.app",
    "https://fearlogapp.com",
    "https://www.fearlogapp.com"
  ]
  : ["http://localhost:5173", "http://localhost:3000"];

export const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

connectDB();

const uploadsPath = path.resolve("uploads");
app.use("/uploads", express.static(uploadsPath));

const publicPath = path.resolve("public");
app.use("/", express.static(publicPath));

const quizPath = path.resolve("homemade_quiz");
app.use("/homemade_quiz", express.static(quizPath));

app.use("/users", userRoutes);
app.use("/movies", movieRoutes);
app.use("/tvShows", tvShowsRoutes);
app.use("/reaiper", reaiperRoutes);
app.use("/forum", forumRoutes);
app.use("/quiz", quizRoutes);
app.use("/search", searchRoutes);
app.use("/homemade-watchlists", homemadeWatchlistsRoutes);
app.use("/notifications", notificationRoutes);
app.use("/import", importRoutes);
app.use("/news", newsRoutes);
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req: Request, res: Response) => {
  res.send("Backend's app is online, gg");
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (userId: string) => {
    socket.join(userId);
  });
  socket.on("disconnect", () => {
    console.log("🔌 A user disconnected from Socket.IO");
  });
});

server.listen(PORT, () => {
  console.log(`server is on on port : ${PORT}`);
});
