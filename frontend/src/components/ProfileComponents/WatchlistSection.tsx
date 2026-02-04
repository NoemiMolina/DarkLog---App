import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trash2 } from 'lucide-react';
import { API_URL } from '../../config/api';

interface WatchlistItem {
  _id: string;
  id: number;
  title: string;
  poster: string;
}

interface HomemadeWatchlistItem {
  _id: string;
  id: string;
  title: string;
  posterPath: string;
}

interface WatchlistSectionProps {
  movieWatchlist: WatchlistItem[];
  tvShowWatchlist: WatchlistItem[];
  savedHomemadeWatchlists?: HomemadeWatchlistItem[];
  onAddMovie: () => void;
  onAddTvShow: () => void;
  onRemove: (id: string, type: 'movie' | 'tv' | 'homemadewatchlist') => void;
}

const WatchlistSection: React.FC<WatchlistSectionProps> = ({
  movieWatchlist = [],
  tvShowWatchlist = [],
  savedHomemadeWatchlists = [],
  onAddMovie,
  onAddTvShow,
  onRemove
}) => {
  return (
    <Card className="bg-[#2A2A2A] border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-lg">Watchlists</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-8 shadow-2xl border border-purple-500/20">
          <h3 className="text-xl mb-4"> 🎬 Movies ({movieWatchlist.length})</h3>
          {movieWatchlist.length === 0 ? (
            <div className="text-center py-6 sm:py-12">
              <button
                onClick={onAddMovie}
                className="bg-gray-800/50 border border-purple-500/20 px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg transition">
                ➕ Add a movie to your watchlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
              {movieWatchlist.map((movie) => (
                <div key={movie._id} className="relative group h-64 sm:h-80">
                  <img src={movie.poster} alt={movie.title} className="w-full group-hover:scale-105 transition-transform duration-300 rounded-lg shadow-lg" />
                  <button
                    onClick={() => onRemove(movie._id, 'movie')}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-8 shadow-2xl border border-purple-500/20">
          <h3 className="text-xl mb-4">TV Shows Watchlist ({tvShowWatchlist.length})</h3>
          {tvShowWatchlist.length === 0 ? (
            <div className="text-center py-6 sm:py-12">
              <button
                onClick={onAddTvShow}
                className="bg-gray-800/50 border border-purple-500/20 px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg transition"
              >
                ➕ Add a TV show to your watchlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tvShowWatchlist.map((show) => (
                <div key={show._id} className="relative group h-64 sm:h-80">
                  <img src={show.poster} alt={show.title} className="w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-lg object-cover" />
                  <button
                    onClick={() => onRemove(show._id, 'tv')}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-8 shadow-2xl border border-purple-500/20">
          <h3 className="text-xl mb-4">Homemade Watchlists ({savedHomemadeWatchlists.length})</h3>
          {savedHomemadeWatchlists.length === 0 ? (
            <div className="text-center py-12 bg-[#1A1A1A] rounded-lg">
              <p className="text-gray-400">No homemade watchlists added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {savedHomemadeWatchlists.map((watchlist) => (
                <div key={watchlist._id} className="relative group h-64 sm:h-80">
                  <img
                    src={watchlist.posterPath ? `${API_URL}${watchlist.posterPath}` : '/placeholder.jpg'}
                    alt={watchlist.title}
                    className="w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-lg object-cover"
                  />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded text-white text-sm opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%]">
                    {watchlist.title}
                  </div>
                  <button
                    onClick={() => onRemove(watchlist._id, 'homemadewatchlist')}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchlistSection;