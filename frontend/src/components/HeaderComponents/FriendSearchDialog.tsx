import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { MdOutlinePersonSearch } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchedUser {
  _id: string;
  UserPseudo: string;
  UserMail: string;
  UserProfilePicture?: string;
  UserFirstName?: string;
  UserLastName?: string;
}

const FriendSearchDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const debounce = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/users/search?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchResults([]);
        setMessage('No users found');
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setMessage('Error searching users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId: string) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?._id;

    if (!userId) return;

    try {
      const response = await fetch(
        `${API_URL}/users/${userId}/friends/${friendId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessage('Friend request sent!');
        setTimeout(() => setMessage(null), 2000);
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      setMessage('Error sending friend request');
    }
  };

  const handleViewProfile = (userId: string) => {
    setOpen(false);
    navigate(`/user/${userId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MdOutlinePersonSearch className="order-5 mt-9 text-white text-2xl cursor-pointer hover:text-gray-300 z-50" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#2A2A2A] text-white">
        <DialogHeader>
          <DialogTitle>Search Friends</DialogTitle>
          <DialogDescription className="text-gray-400">
            Search by username or email
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter username or email..."
            className="flex-1 bg-[#1A1A1A] border-white/20 text-white"
          />
          <Button onClick={handleSearch} disabled={loading}>
            <IoSearch />
          </Button>
        </div>

        {message && (
          <div className="p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-center mb-4">
            {message}
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {searchQuery ? 'No users found' : 'Start typing to search'}
            </div>
          ) : (
            searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 bg-[#1A1A1A] rounded-lg hover:bg-[#3A3A3A] transition"
              >
                <div className="flex items-center gap-4">
                  {user.UserProfilePicture ? (
                    <img
                      src={
                        user.UserProfilePicture.startsWith('http')
                          ? user.UserProfilePicture
                          : `${API_URL}/${user.UserProfilePicture}`
                      }
                      alt={user.UserPseudo}
                      className="w-12 h-12 rounded-full object-cover border border-white/40"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-600 border border-white/40 flex items-center justify-center text-white">
                      {user.UserPseudo.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold">{user.UserPseudo}</p>
                    {user.UserFirstName && user.UserLastName && (
                      <p className="text-sm text-gray-400">
                        {user.UserFirstName} {user.UserLastName}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">{user.UserMail}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewProfile(user._id)}
                    variant="outline"
                    size="sm"
                    className="text-white hover:bg-[#4C4C4C]"
                  >
                    View Profile
                  </Button>
                  <Button
                    onClick={() => handleAddFriend(user._id)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus size={16} className="mr-2" />
                    Add Friend
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendSearchDialog;