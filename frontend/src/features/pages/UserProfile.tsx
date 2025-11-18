import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Eye, EyeOff, Save, Trash2, Plus } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

interface UserProfileData {
  userProfilePicture: string | null;
  userFirstName: string;
  userLastName: string;
  userPseudo: string;
  userMail: string;
  userPassword: string;
  top3Movies: Array<{ id: number; title: string; poster: string }>;
  top3TvShows: Array<{ id: number; title: string; poster: string }>;
  movieWatchlist: Array<{ id: number; title: string; poster: string }>;
  tvShowWatchlist: Array<{ id: number; title: string; poster: string }>;
  numberOfWatchedMovies: number;
  numberOfWatchedTvShows: number;
  numberOfGivenReviews: number;
  averageMovieRating: number;
  averageTvShowRating: number;
  lastWatchedMovie: { id: number; title: string; poster: string } | null;
}

const UserProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  let userId: string | undefined;
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      userId = decoded.id;
    } catch (error) {
      console.error("❌ Error decoding token:", error);
    }
  }

  console.log("👤 User from localStorage:", user);
  console.log("🆔 UserId:", userId);
  console.log("🔑 Token:", token);

  useEffect(() => {
    if (!userId) {
      console.error("❌ No userId found!");
      return;
    }
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    if (!userId) {
      console.error("❌ Cannot fetch profile: userId is undefined");
      return;
    }

    try {
      console.log(`📡 Fetching: http://localhost:5000/users/${userId}/profile`);
      
      const response = await fetch(`http://localhost:5000/users/${userId}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("✅ Profile data received:", data);
      setProfileData(data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (profileData?.userPassword !== passwordConfirm) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field: keyof UserProfileData, value: any) => {
    setProfileData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const removeFromWatchlist = async (id: number, type: 'movie' | 'tvshow') => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/watchlist/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      fetchProfileData();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen text-white">No profile data</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl">
      <Card className="bg-[#2A2A2A] border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {profileData.userProfilePicture ? (
                <img
                  src={profileData.userProfilePicture.startsWith('http')
                    ? profileData.userProfilePicture
                    : `http://localhost:5000/${profileData.userProfilePicture}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-white/40"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-600 border-2 border-white/40 flex items-center justify-center text-3xl">
                  {profileData.userFirstName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={profileData.userFirstName || ''}
                  onChange={(e) => handleInputChange('userFirstName', e.target.value)}
                  disabled={!isEditing}
                  className="bg-[#1A1A1A] border-white/20 text-white"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={profileData.userLastName || ''}
                  onChange={(e) => handleInputChange('userLastName', e.target.value)}
                  disabled={!isEditing}
                  className="bg-[#1A1A1A] border-white/20 text-white"
                />
              </div>
              <div>
                <Label>Pseudo</Label>
                <Input
                  value={profileData.userPseudo || ''}
                  onChange={(e) => handleInputChange('userPseudo', e.target.value)}
                  disabled={!isEditing}
                  className="bg-[#1A1A1A] border-white/20 text-white"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={profileData.userMail || ''}
                  onChange={(e) => handleInputChange('userMail', e.target.value)}
                  disabled={!isEditing}
                  className="bg-[#1A1A1A] border-white/20 text-white"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password' }
                    value={profileData.userPassword || ''}
                    onChange={(e) => handleInputChange('userPassword', e.target.value)}
                    className="bg-[#1A1A1A] border-white/20 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirm || ''}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="bg-[#1A1A1A] border-white/20 text-white"
                />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                Edit Profile
              </Button>
            ) : (
              <>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="mr-2" size={16} /> Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-white/20" />

      <Card className="bg-[#2A2A2A] border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">My Top 3</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl mb-4">Top 3 Movies</h3>
            <div className="grid grid-cols-3 gap-4">
              {profileData.top3Movies.map((movie, index) => (
                <div key={movie.id} className="relative group">
                  <img src={movie.poster} alt={movie.title} className="w-full rounded-lg" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-semibold">#{index + 1} {movie.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl mb-4">Top 3 TV Shows</h3>
            <div className="grid grid-cols-3 gap-4">
              {profileData.top3TvShows.map((show, index) => (
                <div key={show.id} className="relative group">
                  <img src={show.poster} alt={show.title} className="w-full rounded-lg" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white font-semibold">#{index + 1} {show.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-white/20" />

      <Card className="bg-[#2A2A2A] border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Watchlist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl mb-4">Movies Watchlist ({profileData.movieWatchlist.length})</h3>
            <div className="grid grid-cols-4 gap-4">
              {profileData.movieWatchlist.map((movie) => (
                <div key={movie.id} className="relative group">
                  <img src={movie.poster} alt={movie.title} className="w-full rounded-lg" />
                  <button
                    onClick={() => removeFromWatchlist(movie.id, 'movie')}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl mb-4">TV Shows Watchlist ({profileData.tvShowWatchlist.length})</h3>
            <div className="grid grid-cols-4 gap-4">
              {profileData.tvShowWatchlist.map((show) => (
                <div key={show.id} className="relative group">
                  <img src={show.poster} alt={show.title} className="w-full rounded-lg" />
                  <button
                    onClick={() => removeFromWatchlist(show.id, 'tvshow')}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-white/20" />

      {/* Stats */}
      <Card className="bg-[#2A2A2A] border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">My Stats</CardTitle>
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
              {profileData.lastWatchedMovie && (
                <>
                  <img src={profileData.lastWatchedMovie.poster} alt={profileData.lastWatchedMovie.title} className="w-20 h-28 mx-auto rounded mb-2" />
                  <p className="text-sm text-white/60">Last Watched</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;