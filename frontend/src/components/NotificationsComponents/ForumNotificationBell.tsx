import React, { useState } from 'react';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationBadge } from '../NotificationsComponents/NotificationBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '../ui/scroll-area';
import { API_URL } from '../../config/api';

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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative cursor-pointer hover:opacity-80 transition">
          <IoMdNotificationsOutline className="text-white text-2xl" />
          <NotificationBadge count={forumNotificationsCount} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-black/75 backdrop-blur-md text-white border-white/20"
      >
        <div className="p-4 border-b border-white/10">
          <div className="flex justify-between items-center">
            {forumNotifs.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs text-gray-400 hover:text-white hover:bg-white/10 h-6"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[300px]">
          {forumNotifs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No new notifications
            </div>
          ) : (
            <div className="space-y-2 p-2">
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
                            : `${API_URL}/${notif.senderProfilePicture}`
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
