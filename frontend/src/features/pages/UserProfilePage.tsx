import React, { useState, useEffect } from 'react';
import { Separator } from '../../components/ui/separator';
import { jwtDecode } from 'jwt-decode';
import ProfileInfoSection from '../../components/ProfileComponents/ProfileInfosSection';
import Top3Section from '../../components/ProfileComponents/Top3Section';
import WatchlistSection from '../../components/ProfileComponents/WatchlistSection';
import StatsSection from '../../components/ProfileComponents/ProfileStatsSection';
import SearchDialog from '../../components/HeaderComponents/SearchDialog';

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
  movieWatchlist: Array<{ _id: string; id: number; title: string; poster: string }>;
  tvShowWatchlist: Array<{ _id: string; id: number; title: string; poster: string }>;
  savedHomemadeWatchlists: Array<{ _id: string; id: string; title: string; poster: string; posterPath: string }>; // Ajout posterPath
  numberOfWatchedMovies: number;
  numberOfWatchedTvShows: number;
  numberOfGivenReviews: number;
  averageMovieRating: number;
  averageTvShowRating: number;
  lastWatchedMovie: { id: number; title: string; poster: string } | null;
  numberOfFriends: number;
  watchedMovies?: Array<{ runtime: number }>;
  watchedTvShows?: Array<{ total_runtime: number }>;
  totalWatchTimeFromWatchlists?: number;
}

const UserProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMovieSearch, setShowMovieSearch] = useState(false);
  const [showTvShowSearch, setShowTvShowSearch] = useState(false);
  const [showMovieWatchlistSearch, setShowMovieWatchlistSearch] = useState(false);
  const [showTvShowWatchlistSearch, setShowTvShowWatchlistSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  const token = localStorage.getItem("token");
  let userId: string | undefined;

  if (token) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      userId = decoded.id;
    } catch (error) {
      console.error("❌ Error decoding token:", error);
    }
  }

  useEffect(() => {
    if (!userId) return;
    fetchProfileData();
    const handleWatchlistUpdate = () => {
      fetchProfileData();
    };
    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    return () => {
      window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
    };
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token from localStorage:", token ? "EXISTS" : "MISSING");

      const response = await fetch(`http://localhost:5000/users/${userId}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        return;
      }

      const data = await response.json();
      console.log("✅ Profile data received:", data);
      if (data.savedHomemadeWatchlists) {
        data.savedHomemadeWatchlists = data.savedHomemadeWatchlists.map((wl: any) => ({
          ...wl,
          posterPath: wl.posterPath || wl.poster || ""
        }));
      }
      setProfileData(data);
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (newPassword && newPassword !== passwordConfirm) {
      alert('New passwords do not match!');
      return;
    }
    if (newPassword && !oldPassword) {
      alert('Please enter your current password to change it!');
      return;
    }

    try {
      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('UserProfilePicture', profilePictureFile);

        console.log('📤 Uploading new profile picture...');
        const pictureResponse = await fetch(`http://localhost:5000/users/${userId}/profile-picture`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!pictureResponse.ok) {
          const errorData = await pictureResponse.json();
          console.error('❌ Failed to update profile picture:', errorData);
          throw new Error('Failed to update profile picture');
        }

        console.log('✅ Profile picture updated successfully');
      }
      const profileResponse = await fetch(`http://localhost:5000/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          UserFirstName: profileData?.userFirstName,
          UserLastName: profileData?.userLastName,
          UserPseudo: profileData?.userPseudo,
          UserMail: profileData?.userMail,
        }),
      });

      if (!profileResponse.ok) throw new Error('Failed to update profile');
      if (newPassword && oldPassword) {
        const passwordResponse = await fetch(`http://localhost:5000/users/${userId}/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        });
        if (!passwordResponse.ok) throw new Error('Failed to update password');
      }
      alert('Profile updated successfully!');
      setIsEditing(false);
      setOldPassword('');
      setNewPassword('');
      setPasswordConfirm('');
      setProfilePictureFile(null);
      fetchProfileData();
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfileData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleProfilePictureChange = (file: File) => {
    setProfilePictureFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      handleInputChange('userProfilePicture', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        let type: 'movie' | 'tv' = 'movie';
        if (showTvShowSearch || showTvShowWatchlistSearch) type = 'tv';
        const response = await fetch(
          `https://api.themoviedb.org/3/search/${type}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${searchQuery}`
        );
        const data = await response.json();
        setSearchResults(data.results.slice(0, 10));
      } catch (error) {
        console.error('Error searching:', error);
      }
    }, 400); 
    return () => clearTimeout(timeout);
  }, [searchQuery, showMovieSearch, showTvShowSearch, showMovieWatchlistSearch, showTvShowWatchlistSearch]);

  const handleSearch = async (type: 'movie' | 'tv') => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${type}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${searchQuery}`
      );
      const data = await response.json();
      setSearchResults(data.results.slice(0, 10));
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleAddToTop3 = async (item: any, type: 'movie' | 'tv') => {
    if (!userId) return;
    try {
      const tmdbId = item.id;
      
      console.log('Adding to Top3 with TMDB ID:', tmdbId);
      const addResponse = await fetch(
        `http://localhost:5000/users/${userId}/top3favorites/${type === 'movie' ? 'movie' : 'tvshow'}/${tmdbId}`,
        { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (!addResponse.ok) {
        const errorData = await addResponse.json();
        console.error('Error response:', errorData);
        alert(`Error: ${errorData.message || 'Failed to add to Top 3'}`);
        return;
      }

      if (addResponse.ok) {
        alert(`${item.title || item.name} added to Top 3!`);
        setShowMovieSearch(false);
        setShowTvShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        fetchProfileData();
      }
    } catch (error) {
      console.error('Error adding to Top 3:', error);
    }
  };

  const removeFromTop3 = async (itemId: number, type: 'movie' | 'tv') => {
    try {
      const endpoint = type === 'movie'
        ? `http://localhost:5000/users/${userId}/top3favorites/movie/${itemId}`
        : `http://localhost:5000/users/${userId}/top3favorites/tvshow/${itemId}`;

      await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchProfileData();
    } catch (error) {
      console.error('Error removing from Top 3:', error);
    }
  };

  const handleAddToWatchlist = async (item: any, type: 'movie' | 'tv') => {
    if (!userId) return;
    try {
      const tmdbId = item.id;

      const endpoint = type === 'movie'
        ? `http://localhost:5000/users/${userId}/watchlist/movie/${tmdbId}`
        : `http://localhost:5000/users/${userId}/watchlist/tvshow/${tmdbId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to add to watchlist'}`);
        return;
      }

      alert(`${item.title || item.name} added to watchlist!`);
      setShowMovieWatchlistSearch(false);
      setShowTvShowWatchlistSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      fetchProfileData();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const removeFromWatchlist = async (id: string, type: 'movie' | 'tv' | 'homemadewatchlist') => {
    try {
      let endpoint: string;
      
      if (type === 'movie') {
        endpoint = `http://localhost:5000/users/${userId}/watchlist/movie/${id}`;
      } else if (type === 'tv') {
        endpoint = `http://localhost:5000/users/${userId}/watchlist/tvshow/${id}`;
      } else if (type === 'homemadewatchlist') {
        endpoint = `http://localhost:5000/users/${userId}/saved-homemade-watchlists/${id}`;
      }

      await fetch(endpoint!, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchProfileData();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  if (loading || !profileData) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-6xl 2xl:scale-83 2xl:-translate-y-55"> 

      <ProfileInfoSection
        profileData={profileData}
        isEditing={isEditing}
        showPassword={showPassword}
        oldPassword={oldPassword}
        newPassword={newPassword}
        passwordConfirm={passwordConfirm}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={() => {
          setIsEditing(false);
          setProfilePictureFile(null);
          fetchProfileData();
        }}
        onInputChange={handleInputChange}
        onPasswordChange={(field, value) => {
          if (field === 'old') setOldPassword(value);
          else if (field === 'new') setNewPassword(value);
          else setPasswordConfirm(value);
        }}
        onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
        onProfilePictureChange={handleProfilePictureChange}
      />

      <Separator className="bg-white/20" />

        <Top3Section
          movies={profileData?.top3Movies || []}
          tvShows={profileData?.top3TvShows || []}
          onAddMovie={() => setShowMovieSearch(true)}
          onAddTvShow={() => setShowTvShowSearch(true)}
          onRemove={removeFromTop3}
        />

      <SearchDialog
        open={showMovieSearch}
        onOpenChange={setShowMovieSearch}
        title="Search Movies"
        description="Search for a movie to add to your Top 3 favorites"
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={() => handleSearch('movie')}
        results={searchResults}
        onSelect={(item) => handleAddToTop3(item, 'movie')}
        type="movie"
      />

      <SearchDialog
        open={showTvShowSearch}
        onOpenChange={setShowTvShowSearch}
        title="Search TV Shows"
        description="Search for a TV show to add to your Top 3 favorites"
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={() => handleSearch('tv')}
        results={searchResults}
        onSelect={(item) => handleAddToTop3(item, 'tv')}
        type="tv"
      />

      <Separator className="bg-white/20" />
      
        <WatchlistSection
        movieWatchlist={profileData?.movieWatchlist || []}
        tvShowWatchlist={profileData?.tvShowWatchlist || []}
        savedHomemadeWatchlists={profileData?.savedHomemadeWatchlists || []}
        onAddMovie={() => setShowMovieWatchlistSearch(true)}
        onAddTvShow={() => setShowTvShowWatchlistSearch(true)}
        onRemove={removeFromWatchlist}
      />
    

      <SearchDialog
        open={showMovieWatchlistSearch}
        onOpenChange={setShowMovieWatchlistSearch}
        title="Search Movies for Watchlist"
        description="Search for a movie to add to your watchlist"
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={() => handleSearch('movie')}
        results={searchResults}
        onSelect={(item) => handleAddToWatchlist(item, 'movie')}
        type="movie"
      />

      <SearchDialog
        open={showTvShowWatchlistSearch}
        onOpenChange={setShowTvShowWatchlistSearch}
        title="Search TV Shows for Watchlist"
        description="Search for a TV show to add to your watchlist"
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearch={() => handleSearch('tv')}
        results={searchResults}
        onSelect={(item) => handleAddToWatchlist(item, 'tv')}
        type="tv"
      />

      <Separator className="bg-white/20" />

      <StatsSection
        numberOfWatchedMovies={profileData.numberOfWatchedMovies}
        numberOfWatchedTvShows={profileData.numberOfWatchedTvShows}
        numberOfGivenReviews={profileData.numberOfGivenReviews}
        averageMovieRating={profileData.averageMovieRating}
        averageTvShowRating={profileData.averageTvShowRating}
        numberOfFriends={profileData.numberOfFriends}
        watchedMovies={profileData.watchedMovies || []}
        watchedTvShows={profileData.watchedTvShows || []}
        totalWatchTimeFromWatchlists={profileData.totalWatchTimeFromWatchlists || 0}
        userId={userId!}
      />
    </div>
  );
};

export default UserProfile;