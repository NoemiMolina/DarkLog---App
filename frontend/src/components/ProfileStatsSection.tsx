import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Users } from 'lucide-react';

interface ProfileStatsSection {
  numberOfWatchedMovies: number;
  numberOfWatchedTvShows: number;
  numberOfGivenReviews: number;
  averageMovieRating: number;
  averageTvShowRating: number;
  numberOfFriends: number;
  userId?: string;
}

const StatsSection: React.FC<ProfileStatsSection> = ({
  numberOfWatchedMovies = 0,
  numberOfWatchedTvShows = 0,
  numberOfGivenReviews = 0,
  averageMovieRating = 0,
  averageTvShowRating = 0,
  numberOfFriends = 0,
  userId,
}) => {
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/users/${userId}/friends`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      console.log('📥 Friends data received:', data);
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleFriendsClick = () => {
    setShowFriendsModal(true);
    fetchFriends();
  };

  return (
    <>
      <Card className="bg-[#2A2A2A] border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">My Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <p className="text-4xl font-bold text-blue-400">{numberOfWatchedMovies}</p>
              <p className="text-sm text-white/60">Movies Watched</p>
            </div>
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <p className="text-4xl font-bold text-purple-400">{numberOfWatchedTvShows}</p>
              <p className="text-sm text-white/60">TV Shows Watched</p>
            </div>
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <p className="text-4xl font-bold text-green-400">{numberOfGivenReviews}</p>
              <p className="text-sm text-white/60">Reviews Given</p>
            </div>
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <p className="text-4xl font-bold text-yellow-400">{averageMovieRating.toFixed(1)}</p>
              <p className="text-sm text-white/60">Avg Movie Rating</p>
            </div>
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <p className="text-4xl font-bold text-orange-400">{averageTvShowRating.toFixed(1)}</p>
              <p className="text-sm text-white/60">Avg TV Show Rating</p>
            </div>
            <div
              className="text-center p-4 bg-[#1A1A1A] rounded-lg cursor-pointer hover:bg-[#333333] transition-colors"
              onClick={handleFriendsClick}
            >
              <p className="text-4xl font-bold text-pink-400">{numberOfFriends}</p>
              <p className="text-sm text-white/60 flex items-center justify-center gap-1">
                <Users size={16} /> Friends
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showFriendsModal} onOpenChange={setShowFriendsModal}>
        <DialogContent className="bg-[#2A2A2A] border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Friends ({numberOfFriends})</DialogTitle>
            <DialogDescription className="text-gray-400">
              View your friends list
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {loadingFriends ? (
              <p className="text-center py-4">Loading...</p>
            ) : friends.length === 0 ? (
              <p className="text-center py-4 text-gray-400">No friends yet</p>
            ) : (
              <div className="space-y-3">
                {friends.map((friend: any) => {
                  const friendName = friend.friendPseudo || friend.UserPseudo || 'Unknown';
                  const friendPicture = friend.friendProfilePicture || friend.UserProfilePicture;
                  const friendId = friend.friendId || friend._id;

                  return (
                    <div
                      key={friendId}
                      className="flex items-center gap-4 p-3 bg-[#1A1A1A] rounded-lg hover:bg-[#333333] transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/user/${friendId}`}
                    >
                      {friendPicture ? (
                        <img
                          src={friendPicture.startsWith('http')
                            ? friendPicture
                            : `http://localhost:5000/${friendPicture}`}
                          alt={friendName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {friendName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{friendName}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StatsSection;