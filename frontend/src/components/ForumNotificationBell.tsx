import React, { useState } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useNotifications } from '../context/NotificationContext';
import { NotificationBadge } from './NotificationBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from './ui/scroll-area';

export const ForumNotificationBell: React.FC = () => {
  const { notifications, forumNotificationsCount, markAsRead, deleteNotification, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const forumNotifs = notifications.filter(
    (n) => ['forum_like', 'forum_comment', 'comment_reply', 'comment_like'].includes(n.type) && !n.isRead
  );

  const handleNotificationClick = async (notif: any) => {
    await markAsRead(notif._id);
    if (notif.postId) {
      setOpen(false);
      navigate('/forum', { state: { postId: notif.postId, commentId: notif.commentId } });
    }
  };

  const handleClearAll = async () => {
    await markAllAsRead('forum');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <div 
          className="relative cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <IoMdNotificationsOutline className="text-white text-2xl hover:text-gray-300 transition" />
          <NotificationBadge count={forumNotificationsCount} />
        </div>

        <DialogContent className="max-w-md bg-black/40 backdrop-blur-md text-white border-white/20">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-white">Forum Notifications</DialogTitle>
              {forumNotifs.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs text-gray-400 hover:text-white hover:bg-white/10"
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
                    className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition"
                  >
                    <div className="flex items-start gap-3">
                      {notif.senderProfilePicture && (
                        <img
                          src={
                            notif.senderProfilePicture?.startsWith("http")
                              ? notif.senderProfilePicture
                              : `http://localhost:5000/${notif.senderProfilePicture}`
                          }
                          alt={notif.senderPseudo}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold text-white">{notif.senderPseudo}</span>
                          {' '}
                          <span className="text-gray-300">{notif.message}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif._id);
                        }}
                        className="text-gray-500 hover:text-red-400 transition flex-shrink-0"
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
    </>
  );
};
