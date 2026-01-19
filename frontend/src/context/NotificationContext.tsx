import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

export interface Notification {
  _id: string;
  type: 'forum_like' | 'forum_comment' | 'comment_reply' | 'comment_like' | 'friend_request';
  message: string;
  senderPseudo: string;
  senderProfilePicture?: string;
  postId?: string;
  commentId?: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  forumNotificationsCount: number;
  friendRequestsCount: number;
  socket: Socket | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (type?: 'forum' | 'friend_request') => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: (type?: 'forum' | 'friend_request') => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchNotificationCounts: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [forumNotificationsCount, setForumNotificationsCount] = useState(0);
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  const getUserId = () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    try {
      return JSON.parse(user)._id;
    } catch {
      return null;
    }
  };

  const getToken = () => localStorage.getItem('token');
  const fetchNotificationCounts = useCallback(async () => {
    const userId = getUserId();
    const token = getToken();
    if (!userId || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/notifications/${userId}/counts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.total);
        setForumNotificationsCount(data.forumNotifications);
        setFriendRequestsCount(data.friendRequests);
      }
    } catch (error) {
      console.error('Error fetching notification counts:', error);
    }
  }, []);
  const fetchNotifications = useCallback(async () => {
    const userId = getUserId();
    const token = getToken();
    if (!userId || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/notifications/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);
  const markAsRead = useCallback(async (notificationId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
        );
        await fetchNotificationCounts();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [fetchNotificationCounts]);
  const markAllAsRead = useCallback(async (type?: 'forum' | 'friend_request') => {
    const userId = getUserId();
    const token = getToken();
    if (!userId || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/notifications/${userId}/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (response.ok) {
        setNotifications((prev) =>
          type
            ? prev.map((n) => {
                const isForumType = ['forum_like', 'forum_comment', 'comment_reply', 'comment_like'].includes(n.type);
                const shouldUpdate = (type === 'forum' && isForumType) || (type === 'friend_request' && n.type === 'friend_request');
                return shouldUpdate ? { ...n, isRead: true } : n;
              })
            : prev.map((n) => ({ ...n, isRead: true }))
        );
        await fetchNotificationCounts();
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [fetchNotificationCounts]);
  const deleteNotification = useCallback(async (notificationId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
        await fetchNotificationCounts();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [fetchNotificationCounts]);
  const deleteAllNotifications = useCallback(async (type?: 'forum' | 'friend_request') => {
    const userId = getUserId();
    const token = getToken();
    if (!userId || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/notifications/${userId}/delete-all`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (response.ok) {
        setNotifications((prev) =>
          type
            ? prev.filter((n) => {
                const isForumType = ['forum_like', 'forum_comment', 'comment_reply', 'comment_like'].includes(n.type);
                return (type === 'forum' && !isForumType) || (type === 'friend_request' && n.type !== 'friend_request');
              })
            : []
        );
        await fetchNotificationCounts();
      }
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  }, [fetchNotificationCounts]);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    const newSocket = io('http://localhost:5000', {
      auth: { userId },
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      newSocket.emit('joinRoom', userId);
    });

    newSocket.on('newNotification', (notif: Notification) => {
      console.log('🔔 New notification received:', notif);
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      if (['forum_like', 'forum_comment', 'comment_reply', 'comment_like'].includes(notif.type)) {
        setForumNotificationsCount((prev) => prev + 1);
      } else if (notif.type === 'friend_request') {
        setFriendRequestsCount((prev) => prev + 1);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    setSocket(newSocket);
    fetchNotificationCounts();

    return () => {
      newSocket.disconnect();
    };
  }, [fetchNotifications, fetchNotificationCounts]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    forumNotificationsCount,
    friendRequestsCount,
    socket,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    fetchNotifications,
    fetchNotificationCounts,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
