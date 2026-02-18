import React, { useState, useEffect } from "react";
import { API_URL } from "../../config/api";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FaUserPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

interface AddFriendDialogProps {
  currentUserId: string;
  onFriendAdded?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface User {
  _id: string;
  UserPseudo: string;
  UserProfilePicture?: string;
  UserFirstName?: string;
}

const AddFriendDialog: React.FC<AddFriendDialogProps> = ({
  currentUserId,
  onFriendAdded,
  open: controlledOpen,
  onOpenChange: onControlledOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onControlledOpenChange || setInternalOpen;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${API_URL}/users/search?query=${encodeURIComponent(searchQuery)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchQuery(user.UserPseudo);
    setSearchResults([]);
  };

  const handleAddFriend = async () => {
    if (!selectedUser) {
      setMessage("Please select a friend");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${API_URL}/users/${currentUserId}/friends/${selectedUser._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        setMessage("Friend added successfully!");
        setMessageType("success");
        setSearchQuery("");
        setSelectedUser(null);
        setTimeout(() => {
          setOpen(false);
          onFriendAdded?.();
        }, 1500);
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to add friend");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setMessage("Error adding friend");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-[#4C4C4C] p-2 hidden"
          style={{ fontFamily: "'Metal Mania', serif" }}
          title="Add a friend"
        >
          <FaUserPlus className="text-xl w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/40 backdrop-blur-md border-white/20 text-white max-w-sm">
        <DialogHeader>
          <DialogTitle
            className="text-center text-2xl"
            style={{ fontFamily: "'Metal Mania', serif" }}
          >
            Add Friend
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-white/80">Search by username</label>
            <Input
              placeholder="Enter friend's username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="bg-white/5 rounded border border-white/10 max-h-48 overflow-y-auto">
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={`w-full text-left px-4 py-3 hover:bg-white/10 transition border-b border-white/5 last:border-b-0 ${
                    selectedUser?._id === user._id ? "bg-white/20" : ""
                  }`}
                >
                  <div className="font-semibold">{user.UserPseudo}</div>
                  <div className="text-sm text-white/60">
                    {user.UserFirstName || "No name"}
                  </div>
                </button>
              ))}
            </div>
          )}
          {message && (
            <div
              className={`p-2 rounded text-sm text-center ${
                messageType === "success"
                  ? "bg-green-500/20 text-green-200"
                  : "bg-red-500/20 text-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <Button
            onClick={handleAddFriend}
            disabled={loading || !selectedUser}
            className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Friend"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
