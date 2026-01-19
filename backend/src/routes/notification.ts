import express from "express";
import {
  getNotifications,
  getNotificationCounts,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationById,
} from "../controllers/notificationController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);
router.get("/:userId", getNotifications);
router.get("/:userId/counts", getNotificationCounts);
router.get("/detail/:notificationId", getNotificationById);
router.patch("/:notificationId/read", markAsRead);
router.patch("/:userId/read-all", markAllAsRead);
router.delete("/:notificationId", deleteNotification);
router.delete("/:userId/delete-all", deleteAllNotifications);

export default router;
