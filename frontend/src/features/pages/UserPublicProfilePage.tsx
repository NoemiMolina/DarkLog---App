import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import { UserPlus, UserCheck, Ban, ShieldOff } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

interface PublicProfileData {
  UserPseudo: string;
  UserFirstName: string;
  UserLastName: string;
  UserProfilePicture: string | null;
  isBlocked: boolean;
  top3Movies: Array<{ id: number; title: string; poster: string }>;
  top3TvShows: Array<{ id: number; title: string; poster: string }>;
  numberOfWatchedMovies: number;
  numberOfWatchedTvShows: number;
  numberOfGivenReviews: number;
  averageMovieRating: number;
  averageTvShowRating: number;
  numberOfFriends: number;
  MovieWatchlist: Array<{ movieId: number; title: string; poster: string }>;
  TvShowWatchlist: Array<{ tvshowId: number; title: string; poster: string }>;
  watchedMovies: Array<{ runtime: number }>;
}

const UserPublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profileData, setProfileData] = useState<PublicProfileData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [totalWatchTimeMinutes, setTotalWatchTimeMinutes] = useState(0);
  const token = localStorage.getItem("token");

  let currentUserId: string | undefined;
  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      currentUserId = decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  useEffect(() => {
    fetchPublicProfile();
    checkFriendship();
  }, [userId]);

  useEffect(() => {
    if (profileData?.watchedMovies) {
      const totalMinutes = profileData.watchedMovies.reduce(
        (sum, movie) => sum + (movie.runtime || 0),
        0,
      );
      setTotalWatchTimeMinutes(totalMinutes);
    }
  }, [profileData]);

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes % 60}m`;
  };

  const fetchPublicProfile = async () => {
    try {
      const response = await fetch(
        `${API_URL}/users/${userId}/public-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setProfileData(data);
      setIsBlocked(data.isBlocked || false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching public profile:", error);
      setLoading(false);
    }
  };

  const checkFriendship = async () => {
    if (!currentUserId) return;
    try {
      const response = await fetch(
        `${API_URL}/users/${currentUserId}/friends`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const friends = await response.json();
      const isAlreadyFriend = friends.some(
        (friend: any) => String(friend.friendId) === String(userId),
      );
      setIsFriend(isAlreadyFriend);
    } catch (error) {
      console.error("Error checking friendship:", error);
    }
  };

  const handleAddFriend = async () => {
    if (!currentUserId) return;
    try {
      const response = await fetch(
        `${API_URL}/users/${currentUserId}/friends/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        setIsFriend(true);
        setMessage("✅ Friend added successfully!");
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.message || "Failed to add friend"}`);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setMessage("❌ Error adding friend");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleBlockUser = async () => {
    if (!currentUserId) return;
    try {
      const response = await fetch(
        `${API_URL}/users/${currentUserId}/block/${userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        setIsBlocked(true);
        setIsFriend(false);
        setMessage("🚫 User blocked successfully!");
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.message || "Failed to block user"}`);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      setMessage("❌ Error blocking user");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUnblockUser = async () => {
    if (!currentUserId) return;

    try {
      const response = await fetch(
        `${API_URL}/users/${currentUserId}/unblock/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        setIsBlocked(false);
        setMessage("✅ User unblocked successfully!");
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.message || "Failed to unblock user"}`);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      setMessage("❌ Error unblocking user");
      setTimeout(() => setMessage(null), 3000);
    }
  };
  if (loading || !profileData) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  const isOwnProfile = currentUserId === userId;

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl 2xl:scale-83 2xl:-translate-y-45">
      <Card className="bg-[#2A2A2A] border-white/20 text-white">
        <CardHeader className="relative p-5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative flex-shrink-0">
              {profileData.UserProfilePicture ? (
                <img
                  src={
                    profileData.UserProfilePicture.startsWith("http")
                      ? profileData.UserProfilePicture
                      : `${API_URL}/${profileData.UserProfilePicture}`
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/40"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-600 border-2 border-white/40 flex items-center justify-center text-2xl">
                  {profileData.UserPseudo.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="w-full sm:flex-1 flex flex-col gap-1">
              <CardTitle className="text-2xl leading-tight">
                {profileData.UserPseudo}
              </CardTitle>
              <p className="text-gray-400 text-base">
                {profileData.UserFirstName} {profileData.UserLastName}
              </p>
            </div>
            {!isOwnProfile && (
              <div className="sm:absolute sm:top-3 sm:right-6 flex gap-2 mt-4 sm:mt-0">
                {!isBlocked && (
                  <>
                    {isFriend ? (
                      <Button
                        disabled
                        className="bg-gray-800/50 border border-purple-500/20 text-white p-1 sm:p-2"
                      >
                        <UserCheck className="mr-0 md:mr-2" size={18} />
                        <span className="hidden md:inline">Friends</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAddFriend}
                        className="bg-gray-800/50 border border-purple-500/20 text-white p-1 sm:p-2"
                      >
                        <UserPlus className="mr-0 md:mr-2" size={18} />
                        <span className="hidden md:inline">Add Friend</span>
                      </Button>
                    )}
                  </>
                )}
                {isBlocked ? (
                  <Button
                    onClick={handleUnblockUser}
                    className="bg-green-600 hover:bg-green-700 h-9 px-3"
                  >
                    <ShieldOff className="mr-0 md:mr-2" size={18} />
                    <span className="hidden md:inline">Unblock User</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleBlockUser}
                    className="bg-gray-800/50 border border-purple-500/20 text-white p-1 sm:p-2"
                  >
                    <Ban className="mr-0 md:mr-2" size={18} />
                    <span className="hidden md:inline">Block User</span>
                  </Button>
                )}
              </div>
            )}
          </div>
          {message && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-center">
              {message}
            </div>
          )}
        </CardHeader>
      </Card>

      {!isBlocked ? (
        <>
          <Separator className="bg-white/20" />
          <Card className="bg-[#2A2A2A] border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Favorites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-2xl border border-purple-500/20">
                <h2 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
                  🎬 Movies
                </h2>
                {profileData.top3Movies.length > 0 ? (
                  <div className="grid grid-cols-3 gap-6">
                    {profileData.top3Movies.map((movie) => (
                      <div key={movie.id} className="relative group">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400">
                    No favorite movies yet
                  </p>
                )}
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-2xl border border-purple-500/20">
                <h2 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
                  📺 TV Shows
                </h2>
                {profileData.top3TvShows.length > 0 ? (
                  <div className="grid grid-cols-3 gap-6">
                    {profileData.top3TvShows.map((show) => (
                      <div key={show.id} className="relative group">
                        <img
                          src={show.poster}
                          alt={show.title}
                          className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <p className="text-center mt-2 text-sm">{show.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400">
                    No favorite TV shows yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-white/20" />
          <Card className="bg-[#2A2A2A] border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Watchlist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-2xl border border-purple-500/20">
                <h2 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
                  🎬 Movies
                </h2>
                {profileData.MovieWatchlist &&
                profileData.MovieWatchlist.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {profileData.MovieWatchlist.map((movie) => (
                      <div key={movie.movieId} className="relative group">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <p className="text-center mt-2 text-xs truncate">
                          {movie.title}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">
                    No movies in watchlist
                  </p>
                )}
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-2xl border border-purple-500/20">
                <h2 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
                  📺 TV Shows
                </h2>
                {profileData.TvShowWatchlist &&
                profileData.TvShowWatchlist.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {profileData.TvShowWatchlist.map((show) => (
                      <div key={show.tvshowId} className="relative group">
                        <img
                          src={show.poster}
                          alt={show.title}
                          className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <p className="text-center mt-2 text-xs truncate">
                          {show.title}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">
                    No TV shows in watchlist
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Separator className="bg-white/20" />

          <Card className="bg-[#2A2A2A] border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
                Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">
                    {profileData.numberOfWatchedMovies}
                  </p>
                  <p className="text-sm text-white/60">Movies Watched</p>
                </div>
                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">
                    {profileData.numberOfWatchedTvShows}
                  </p>
                  <p className="text-sm text-white/60">TV Shows Watched</p>
                </div>
                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">
                    {formatWatchTime(totalWatchTimeMinutes)}
                  </p>
                  <p className="text-sm text-white/60">Watch Time</p>
                </div>
                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">
                    {profileData.numberOfGivenReviews}
                  </p>
                  <p className="text-sm text-white/60">Reviews Given</p>
                </div>
                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">
                    {profileData.averageMovieRating.toFixed(1)}
                  </p>
                  <p className="text-sm text-white/60">Avg Movie Rating</p>
                </div>
                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">
                    {profileData.averageTvShowRating.toFixed(1)}
                  </p>
                  <p className="text-sm text-white/60">Avg TV Show Rating</p>
                </div>
                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">
                    {profileData.numberOfFriends}
                  </p>
                  <p className="text-sm text-white/60">Friends</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="bg-[#2A2A2A] border-white/20 text-white">
          <CardContent className="py-12 text-center">
            <Ban size={48} className="mx-auto mb-4 text-red-500" />
            <p className="text-xl text-gray-400">
              You have blocked this user. Unblock them to view their profile.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserPublicProfile;
