import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createPost,
  publishPost,
  updatePost,
  deletePost,
  getPublishedPosts, 
  getPost, 
  addCommentToPost,
  deleteCommentFromPost,
  replyToComment,
  addReactionToPost,
  addReactionToComment,
  getPostsByTag,
  reportPost,
  reportComment,
  searchPosts,
  getNotificationsForUser,
  markNotificationAsRead,
  addReactionToReply,
} from "../controllers/forumController";

const router = Router();

router.post("/posts", authMiddleware, createPost); 
router.get("/posts/search", searchPosts);
router.put("/posts/:id/publish", authMiddleware, publishPost); 
router.put("/posts/:id", authMiddleware, updatePost); 
router.delete("/posts/:id", authMiddleware, deletePost); 
router.get("/posts/published", getPublishedPosts);
router.get("/posts/:id", getPost); 
router.post("/posts/:id/comments", authMiddleware, addCommentToPost); 
router.delete(
  "/posts/:id/comments/:commentId",
  authMiddleware,
  deleteCommentFromPost,
); 
router.post(
  "/posts/:id/comments/:commentId/replies",
  authMiddleware,
  replyToComment,
); 
router.post(
  "/posts/:id/comments/:commentId/reactions",
  authMiddleware,
  addReactionToComment,
); 
router.post("/posts/:id/reaction", authMiddleware, addReactionToPost); 
router.post(
  "/posts/:id/comments/:commentId/replies/:replyId/reaction",
  authMiddleware,
  addReactionToReply,
);
router.get("/posts/tags/:tag", getPostsByTag); 
router.post("/posts/:id/report", authMiddleware, reportPost);
router.post(
  "/posts/:id/comments/:commentId/report",
  authMiddleware,
  reportComment,
);
router.get("/notifications", authMiddleware, getNotificationsForUser);
router.put(
  "/notifications/:notificationId/read",
  authMiddleware,
  markNotificationAsRead,
);

export default router;
