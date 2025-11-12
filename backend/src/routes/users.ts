import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";
import {
  registerUser,
  loginUser,
  addAFriend,
  deleteAFriend,
  blockAnUser,
  addAMovieToWatchlist,
  addATvShowToWatchlist,
  deleteAMovieFromWatchlist,
  deleteATvShowFromWatchlist,
  addAMovieToTop3Favorites,
  addATvShowToTop3Favorites
} from "../controllers/userController.js"

const router = express.Router();

router.post("/register", uploadMiddleware.single("UserProfilePicture"), registerUser);
router.post("/login", loginUser);
router.post("/:userId/top3favorites/movie/:movieId", authMiddleware, addAMovieToTop3Favorites);
router.post("/:userId/top3favorites/tvshow/:tvShowId", authMiddleware, addATvShowToTop3Favorites);
router.post("/:userId/friends/:friendId", authMiddleware, addAFriend);
router.delete("/:userId/friends/:friendId", authMiddleware, deleteAFriend);
router.post("/:userId/block/:blockedUserId", authMiddleware, blockAnUser);
router.post("/:userId/watchlist/:movieId", authMiddleware, addAMovieToWatchlist);
router.post("/:userId/watchlist/:tvShowId", authMiddleware, addATvShowToWatchlist);
router.delete("/:userId/watchlist/:movieId", authMiddleware, deleteAMovieFromWatchlist);
router.delete("/:userId/watchlist/:tvShowId", authMiddleware, deleteATvShowFromWatchlist);


export default router;
