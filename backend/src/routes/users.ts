/** route test to create a user, add a film to its watchlist, add, delete, block somebody

import express from "express";
import User from "../models/User.js";
import Movie from "../models/Movie.js";
import { Types } from "mongoose";

const router = express.Router();


router.post("/createProfile", async (req, res) => {
    try {
        const user = await User.create({
            UserName: "test add a friend",
            UserPseudo: "imaginaryFriend",
            UserMail: "imaginaryfriend.com",
            UserLocation: "Croatia",
            UserAge: 90,
        });

        const movie = await Movie.findOne({});
        if (movie) user.Watchlist.push(movie.id);
        await user.save();

        res.json({ user, addedMovie: movie?.title });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post("/:userId/addUser/:friendId", async (req, res) => {
    try {
        const { userId, friendId } = req.params;
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) return res.status(404).json({ message: "User not found" });

        if (!user.Friends) user.Friends = [];
        user.Friends.push(friend._id as Types.ObjectId);
        await user.save();

        res.json({ message: "Friend added", user });
    } catch (err) {
        res.status(500).json({ message: "Error adding friend", error: err });
    }
});

router.post("/:userId/blockUser/:blockedUserId", async (req, res) => {
  const { userId, blockedUserId } = req.params;

  try {
    const user = await User.findById(userId);
    const blockedUser = await User.findById(blockedUserId);

    if (!user || !blockedUser) {
      return res.status(404).json({ message: "User or blocked user not found" });
    }

    if (!user.BlockedUsers.includes(blockedUser._id as Types.ObjectId)) {
      user.BlockedUsers.push(blockedUser._id as Types.ObjectId);
      await user.save();
    }

    res.status(200).json({ message: `${blockedUser.UserPseudo} has been blocked`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error blocking user", error: err });
  }
});

export default router; 

*/
import express from "express"
import {
  registerUser,
  loginUser,
  addAFriend,
  deleteAFriend,
  blockAnUser,
  addAMovieToWatchlist,
  deleteAMovieFromWatchlist
} from "../controllers/userController.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/:userId/friends/:friendId", addAFriend);
router.delete("/:userId/friends/:friendId", deleteAFriend);
router.post("/:userId/block/:blockedUserId", blockAnUser);
router.post("/:userId/watchlist/:movieId", addAMovieToWatchlist);
router.delete("/:userId/watchlist/:movieId", deleteAMovieFromWatchlist);


export default router;
