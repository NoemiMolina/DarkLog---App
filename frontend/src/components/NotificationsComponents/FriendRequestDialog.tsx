import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';

interface FriendRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FriendRequestDialog: React.FC<FriendRequestDialogProps> = ({ open, onOpenChange }) => {
  const { notifications, markAsRead, deleteNotification } = useNotifications();
  const [currentRequest, setCurrentRequest] = useState<any | null>(null);

  const friendRequests = notifications.filter((n) => n.type === 'friend_request' && !n.isRead);

  useEffect(() => {
    if (open && friendRequests.length > 0 && !currentRequest) {
      setCurrentRequest(friendRequests[0]);
    }
  }, [open, friendRequests]);

  // Auto-open dialog when friend requests arrive
  useEffect(() => {
    if (friendRequests.length > 0 && !open) {
      onOpenChange(true);
      setCurrentRequest(friendRequests[0]);
    }
  }, [friendRequests.length]);

  const handleAccept = async () => {
    if (!currentRequest) return;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `http://localhost:5000/users/${user._id}/friends/${currentRequest.senderId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        // Mark notification as read and navigate
        await markAsRead(currentRequest._id);
        
        // Move to next request or close
        const nextRequest = friendRequests.find((r) => r._id !== currentRequest._id);
        if (nextRequest) {
          setCurrentRequest(nextRequest);
        } else {
          onOpenChange(false);
          setCurrentRequest(null);
        }
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDecline = async () => {
    if (!currentRequest) return;

    await deleteNotification(currentRequest._id);

    // Move to next request or close
    const nextRequest = friendRequests.find((r) => r._id !== currentRequest._id);
    if (nextRequest) {
      setCurrentRequest(nextRequest);
    } else {
      onOpenChange(false);
      setCurrentRequest(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-black/40 backdrop-blur-md border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Friend Request</DialogTitle>
          <DialogDescription className="text-gray-300">
            <span className="font-semibold text-white">{currentRequest?.senderPseudo}</span> has sent you a friend request
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center py-4">
          {currentRequest?.senderProfilePicture && (
            <img
              src={
                currentRequest.senderProfilePicture?.startsWith("http")
                  ? currentRequest.senderProfilePicture
                  : `http://localhost:5000/${currentRequest.senderProfilePicture}`
              }
              alt={currentRequest.senderPseudo}
              className="w-16 h-16 rounded-full border border-white/20"
            />
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleDecline}
            variant="outline"
            className="flex-1 border-white/20 text-white hover:bg-red-500/10 hover:border-red-500/20"
          >
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Accept
          </Button>
        </div>

        {friendRequests.length > 1 && (
          <p className="text-xs text-gray-400 text-center">
            {friendRequests.filter((r) => r._id !== currentRequest?._id).length} more request(s)
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
       
