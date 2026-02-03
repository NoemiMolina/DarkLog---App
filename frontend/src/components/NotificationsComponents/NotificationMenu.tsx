import React, { useState } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationBadge } from '../NotificationsComponents/NotificationBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '../ui/scroll-area';

export const NotificationMenu: React.FC = () => {
  const { notifications, forumNotificationsCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const forumNotifs = notifications.filter(
    (n) => ['forum_like', 'forum_comment', 'comment_reply', 'comment_like'].includes(n.type) && !n.isRead
  );

  const handleNotificationClick = async (notif: any) => {
    // Mark as read
    await markAsRead(notif._id);

    // Navigate to post
    if (notif.postId) {
      setOpen(false);
      navigate(`/forum/${notif.postId}`, { state: { commentId: notif.commentId } });
    }
  };

  const handleClearAll = async () => {
    await markAllAsRead('forum');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer">
          <IoMdNotificationsOutline className="text-white text-2xl hover:text-gray-300 transition" />
          <NotificationBadge count={forumNotificationsCount} />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-[#2A2A2A] text-white border-white/20">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Forum Notifications</DialogTitle>
            {forumNotifs.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs text-gray-400 hover:text-white"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[300px] pr-4">
          {forumNotifs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No new forum notifications
            </div>
          ) : (
            <div className="space-y-2">
              {forumNotifs.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className="p-3 bg-[#1A1A1A] rounded-lg hover:bg-[#252525] cursor-pointer transition"
                >
                  <div className="flex items-start gap-3">
                    {notif.senderProfilePicture && (
                      <img
                        src={notif.senderProfilePicture}
                        alt={notif.senderPseudo}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{notif.senderPseudo}</span>
                        {' '}
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif._id);
                      }}
                      className="text-gray-500 hover:text-red-400 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
