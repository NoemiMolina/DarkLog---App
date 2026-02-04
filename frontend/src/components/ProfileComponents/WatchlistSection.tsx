import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../components/ui/carousel";
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
        <CardTitle className="text-base sm:text-lg">Watchlists</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-8 shadow-2xl border border-purple-500/20">
          <h3 className="text-sm mb-4"> 🎬 Movies ({movieWatchlist.length})</h3>
          {movieWatchlist.length === 0 ? (
            <div className="text-center py-6 sm:py-12">
              <button
                onClick={onAddMovie}
                className="bg-gray-800/50 border border-purple-500/20 px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg transition">
                ➕ Add a movie to your watchlist
              </button>
            </div>
          ) : (
            <>
              {/* CAROUSEL - Mobile, XL et 2XL */}
              <div className="block sm:hidden xl:block">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-4 xl:gap-4 2xl:gap-6">
                    {movieWatchlist.map((movie) => (
                      <CarouselItem key={movie._id} className="basis-2/3 h-full relative group max-h-[400px] xl:max-h-[280px] 2xl:max-h-[330px] overflow-hidden p-0">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-contain rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => onRemove(movie._id, 'movie')}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </>
          )}
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-8 shadow-2xl border border-purple-500/20">
          <h3 className="text-sm mb-4">TV Shows Watchlist ({tvShowWatchlist.length})</h3>
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
            <div className="block sm:hidden xl:block">
              <Carousel className="w-full">
                <CarouselContent className="-ml-4 xl:gap-4 2xl:gap-6">
                  {tvShowWatchlist.map((show) => (
                    <CarouselItem key={show._id} className="basis-2/3 h-full relative group max-h-[400px] xl:max-h-[280px] 2xl:max-h-[330px] overflow-hidden p-0">
                      <img
                        src={show.poster}
                        alt={show.title}
                        className="w-full h-full object-contain rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => onRemove(show._id, 'tv')}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-8 shadow-2xl border border-purple-500/20">
          <h3 className="text-sm mb-4">Homemade Watchlists ({savedHomemadeWatchlists.length})</h3>
          {savedHomemadeWatchlists.length === 0 ? (
            <div className="text-center py-12 bg-[#1A1A1A] rounded-lg">
              <p className="text-gray-400">No homemade watchlists added yet</p>
            </div>
          ) : (
            <div className="block sm:hidden xl:block">
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {savedHomemadeWatchlists.map((watchlist) => (
                    <CarouselItem key={watchlist._id} className="basis-2/3 h-full relative group max-h-[400px] xl:max-h-[320px] 2xl:max-h-[380px] overflow-hidden p-0">
                      <img
                        src={watchlist.posterPath ? `${API_URL}${watchlist.posterPath}` : '/placeholder.jpg'}
                        alt={watchlist.title}
                        className="w-full h-full rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-lg object-contain"
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
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchlistSection;