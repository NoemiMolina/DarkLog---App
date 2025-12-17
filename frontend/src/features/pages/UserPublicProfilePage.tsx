import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { Button } from '../../components/ui/button';
import { UserPlus, UserCheck, Ban, ShieldOff } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

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
    const [profileData, setProfileData] = useState<PublicProfileData | null>(null);
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
        checkIfBlocked();
    }, [userId]);

    useEffect(() => {
        if (profileData?.watchedMovies) {
            const totalMinutes = profileData.watchedMovies.reduce(
                (sum, movie) => sum + (movie.runtime || 0),
                0
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
            const response = await fetch(`http://localhost:5000/users/${userId}/public-profile`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await response.json();
            setProfileData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching public profile:', error);
            setLoading(false);
        }
    };

    const checkFriendship = async () => {
        if (!currentUserId) return;
        try {
            const response = await fetch(`http://localhost:5000/users/${currentUserId}/friends`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const friends = await response.json();
            const isAlreadyFriend = friends.some((friend: any) => friend._id === userId);
            setIsFriend(isAlreadyFriend);
        } catch (error) {
            console.error('Error checking friendship:', error);
        }
    };
    const checkIfBlocked = async () => {
        if (!currentUserId) return;
        try {
            const response = await fetch(`http://localhost:5000/users/${currentUserId}/blocked-users`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                const blockedUsers = data.blockedUsers || [];
                setIsBlocked(blockedUsers.includes(userId));
            }
        } catch (error) {
            console.error('Error checking if user is blocked:', error);
        }
    };

    const handleAddFriend = async () => {
        if (!currentUserId) return;
        try {
            const response = await fetch(
                `http://localhost:5000/users/${currentUserId}/friends/${userId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                setIsFriend(true);
                setMessage('✅ Friend added successfully!');
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage(`❌ ${error.message || 'Failed to add friend'}`);
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (error) {
            console.error('Error adding friend:', error);
            setMessage('❌ Error adding friend');
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleBlockUser = async () => {
        if (!currentUserId) return;
        try {
            const response = await fetch(
                `http://localhost:5000/users/${currentUserId}/block/${userId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                setIsBlocked(true);
                setIsFriend(false);
                setMessage('🚫 User blocked successfully!');
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage(`❌ ${error.message || 'Failed to block user'}`);
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (error) {
            console.error('Error blocking user:', error);
            setMessage('❌ Error blocking user');
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleUnblockUser = async () => {
        if (!currentUserId) return;

        try {
            const response = await fetch(
                `http://localhost:5000/users/${currentUserId}/unblock/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                setIsBlocked(false);
                setMessage('✅ User unblocked successfully!');
                setTimeout(() => setMessage(null), 3000);
            } else {
                const error = await response.json();
                setMessage(`❌ ${error.message || 'Failed to unblock user'}`);
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (error) {
            console.error('Error unblocking user:', error);
            setMessage('❌ Error unblocking user');
            setTimeout(() => setMessage(null), 3000);
        }
    };
    if (loading || !profileData) {
        return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
    }


    const isOwnProfile = currentUserId === userId;


    return (
        <div className="container mx-auto p-6 space-y-8 max-w-6xl">
            <Card className="bg-[#2A2A2A] border-white/20 text-white">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {profileData.UserProfilePicture ? (
                                <img
                                    src={
                                        profileData.UserProfilePicture.startsWith('http')
                                            ? profileData.UserProfilePicture
                                            : `http://localhost:5000/${profileData.UserProfilePicture}`
                                    }
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-white/40"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-600 border-2 border-white/40 flex items-center justify-center text-3xl">
                                    {profileData.UserPseudo.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <CardTitle className="text-3xl">{profileData.UserPseudo}</CardTitle>
                                <p className="text-gray-400">
                                    {profileData.UserFirstName} {profileData.UserLastName}
                                </p>
                            </div>
                        </div>
                        {!isOwnProfile && (
                            <div className="flex gap-3">
                                {!isBlocked && (
                                    <>
                                        {isFriend ? (
                                            <Button disabled className="bg-green-600/50 cursor-not-allowed">
                                                <UserCheck className="mr-2" size={18} />
                                                Friends
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleAddFriend}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                <UserPlus className="mr-2" size={18} />
                                                Add Friend
                                            </Button>
                                        )}
                                    </>
                                )}
                                {isBlocked ? (
                                    <Button
                                        onClick={handleUnblockUser}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <ShieldOff className="mr-2" size={18} />
                                        Unblock User
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleBlockUser}
                                        variant="destructive"
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        <Ban className="mr-2" size={18} />
                                        Block User
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
                            <CardTitle className="text-2xl">🎬 Top 3 Favorite Movies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {profileData.top3Movies.length > 0 ? (
                                <div className="grid grid-cols-3 gap-6">
                                    {profileData.top3Movies.map((movie) => (
                                        <div key={movie.id} className="relative group">
                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <p className="text-center mt-2 text-sm">{movie.title}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400">No favorite movies yet</p>
                            )}
                        </CardContent>
                    </Card>

                    <Separator className="bg-white/20" />
                    <Card className="bg-[#2A2A2A] border-white/20 text-white">
                        <CardHeader>
                            <CardTitle className="text-2xl">📺 Top 3 Favorite TV Shows</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                <p className="text-center text-gray-400">No favorite TV shows yet</p>
                            )}
                        </CardContent>
                    </Card>

                    <Separator className="bg-white/20" />
                    <Card className="bg-[#2A2A2A] border-white/20 text-white">
                        <CardHeader>
                            <CardTitle className="text-2xl">📋 Watchlist</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-blue-400">🎬 Movies</h3>
                                {profileData.MovieWatchlist && profileData.MovieWatchlist.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {profileData.MovieWatchlist.map((movie) => (
                                            <div key={movie.movieId} className="relative group">
                                                <img
                                                    src={movie.poster}
                                                    alt={movie.title}
                                                    className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <p className="text-center mt-2 text-xs truncate">{movie.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 py-8">No movies in watchlist</p>
                                )}
                            </div>

                            <Separator className="bg-white/10" />

                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-purple-400">📺 TV Shows</h3>
                                {profileData.TvShowWatchlist && profileData.TvShowWatchlist.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {profileData.TvShowWatchlist.map((show) => (
                                            <div key={show.tvshowId} className="relative group">
                                                <img
                                                    src={show.poster}
                                                    alt={show.title}
                                                    className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <p className="text-center mt-2 text-xs truncate">{show.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-400 py-8">No TV shows in watchlist</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Separator className="bg-white/20" />

                    <Card className="bg-[#2A2A2A] border-white/20 text-white">
                        <CardHeader>
                            <CardTitle className="text-2xl">📊 Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                                    <p className="text-4xl font-bold text-blue-400">{profileData.numberOfWatchedMovies}</p>
                                    <p className="text-sm text-white/60">Movies Watched</p>
                                </div>
                                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                                    <p className="text-4xl font-bold text-purple-400">{profileData.numberOfWatchedTvShows}</p>
                                    <p className="text-sm text-white/60">TV Shows Watched</p>
                                </div>
                                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                                    <p className="text-4xl font-bold text-cyan-400">
                                        {formatWatchTime(totalWatchTimeMinutes)}
                                    </p>
                                    <p className="text-sm text-white/60">Watch Time</p>
                                </div>
                                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                                    <p className="text-4xl font-bold text-green-400">{profileData.numberOfGivenReviews}</p>
                                    <p className="text-sm text-white/60">Reviews Given</p>
                                </div>
                                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                                    <p className="text-4xl font-bold text-yellow-400">{profileData.averageMovieRating.toFixed(1)}</p>
                                    <p className="text-sm text-white/60">Avg Movie Rating</p>
                                </div>
                                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                                    <p className="text-4xl font-bold text-orange-400">{profileData.averageTvShowRating.toFixed(1)}</p>
                                    <p className="text-sm text-white/60">Avg TV Show Rating</p>
                                </div>
                                <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
                                    <p className="text-4xl font-bold text-pink-400">{profileData.numberOfFriends}</p>
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