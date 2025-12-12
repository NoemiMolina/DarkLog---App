import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfileInfos,
  updatePassword,
  updateProfilePicture,
  searchUsers,
  getPublicProfile,
  getFriends,
  addAFriend,
  deleteAFriend,
  blockAnUser,
  unblockAnUser,
  addAMovieToWatchlist,
  addATvShowToWatchlist,
  deleteAMovieFromWatchlist,
  deleteATvShowFromWatchlist,
  addAMovieToTop3Favorites,
  addATvShowToTop3Favorites,
  deleteAMovieFromTop3Favorites,
  deleteATvShowFromTop3Favorites,
  saveRatingAndReview,
  getFriendsReviews,
  getItemWithUserData

} from "../controllers/userController"

const router = express.Router();

router.get("/search", authMiddleware, searchUsers);
router.post("/register", uploadMiddleware.single("UserProfilePicture"), registerUser);
router.post("/login", loginUser);
router.get("/:userId/profile", authMiddleware, getUserProfile);
router.put("/:userId/profile", authMiddleware, uploadMiddleware.single("UserProfilePicture"), updateProfileInfos);
router.put("/:userId/password", authMiddleware, updatePassword);
router.put("/:userId/profile-picture", authMiddleware, uploadMiddleware.single("UserProfilePicture"), updateProfilePicture);
router.get("/:userId/items/:itemId", authMiddleware, getItemWithUserData); 
router.post("/:userId/items/:itemId/rating-review", authMiddleware, saveRatingAndReview);
router.post("/:userId/top3favorites/movie/:movieId", authMiddleware, addAMovieToTop3Favorites);
router.post("/:userId/top3favorites/tvshow/:tvShowId", authMiddleware, addATvShowToTop3Favorites);
router.delete("/:userId/top3favorites/movie/:movieId", authMiddleware, deleteAMovieFromTop3Favorites);
router.delete("/:userId/top3favorites/tvshow/:tvShowId", authMiddleware, deleteATvShowFromTop3Favorites);
router.get("/:userId/public-profile", authMiddleware, getPublicProfile);
router.get("/:userId/friends", authMiddleware, getFriends);
router.post("/:userId/friends/:friendId", authMiddleware, addAFriend);
router.delete("/:userId/friends/:friendId", authMiddleware, deleteAFriend);
router.post("/:userId/friends/:friendId", authMiddleware, addAFriend);
router.delete("/:userId/friends/:friendId", authMiddleware, deleteAFriend);
router.get("/:userId/friends-reviews", authMiddleware, getFriendsReviews);
router.post("/:userId/block/:blockedUserId", authMiddleware, blockAnUser);
router.delete("/:userId/unblock/:blockedUserId", authMiddleware, unblockAnUser);
router.post("/:userId/watchlist/movie/:movieId", authMiddleware, addAMovieToWatchlist);
router.post("/:userId/watchlist/tvshow/:tvShowId", authMiddleware, addATvShowToWatchlist);
router.delete("/:userId/watchlist/movie/:movieId", authMiddleware, deleteAMovieFromWatchlist);
router.delete("/:userId/watchlist/tvshow/:tvShowId", authMiddleware, deleteATvShowFromWatchlist);


export default router;
