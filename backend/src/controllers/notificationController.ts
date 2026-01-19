import { Request, Response } from "express";
import Notification, { NotificationType } from "../models/Notification";
import User from "../models/User";
import { io } from "../server";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { isRead } = req.query;

    let query: any = { recipientId: userId };
    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-__v");

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

export const getNotificationCounts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const forumNotifications = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
      type: { $in: ["forum_like", "forum_comment", "comment_reply", "comment_like"] },
    });

    const friendRequests = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
      type: "friend_request",
    });

    const total = forumNotifications + friendRequests;

    res.json({
      total,
      forumNotifications,
      friendRequests,
    });
  } catch (error) {
    console.error("Error fetching notification counts:", error);
    res.status(500).json({ message: "Error fetching notification counts" });
  }
};

// ✅ Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Error marking notification as read" });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { type } = req.body;

    const query: any = { recipientId: userId, isRead: false };
    if (type) {
      if (type === "forum") {
        query.type = { $in: ["forum_like", "forum_comment", "comment_reply", "comment_like"] };
      } else if (type === "friend_request") {
        query.type = "friend_request";
      }
    }

    await Notification.updateMany(query, { isRead: true });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ message: "Error marking notifications as read" });
  }
};


export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    await Notification.findByIdAndDelete(notificationId);

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Error deleting notification" });
  }
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { type } = req.body;

    const query: any = { recipientId: userId };
    if (type) {
      if (type === "forum") {
        query.type = { $in: ["forum_like", "forum_comment", "comment_reply", "comment_like"] };
      } else if (type === "friend_request") {
        query.type = "friend_request";
      }
    }

    await Notification.deleteMany(query);

    res.json({ message: "Notifications deleted" });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Error deleting notifications" });
  }
};

export const createNotification = async (
  recipientId: string,
  senderId: string,
  type: NotificationType,
  message: string,
  postId?: string,
  commentId?: string
) => {
  try {
    if (recipientId === senderId) {
      return;
    }
    const sender = await User.findById(senderId).select("UserPseudo UserProfilePicture");
    if (!sender) return;
    if (type.includes("like")) {
      const exists = await Notification.findOne({
        recipientId,
        senderId,
        type,
        postId,
        commentId,
        isRead: false,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      });

      if (exists) {
        return; 
      }
    }

    const notification = new Notification({
      recipientId,
      senderId,
      senderPseudo: sender.UserPseudo,
      senderProfilePicture: sender.UserProfilePicture || "",
      type,
      message,
      postId,
      commentId,
    });

    await notification.save();
    io.to(recipientId).emit("newNotification", {
      _id: notification._id,
      type: notification.type,
      message: notification.message,
      senderPseudo: notification.senderPseudo,
      senderProfilePicture: notification.senderProfilePicture,
      postId: notification.postId,
      commentId: notification.commentId,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ message: "Error fetching notification" });
  }
};
