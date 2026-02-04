import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../components/ui/carousel";
import { Trash2 } from 'lucide-react';

interface Top3Item {
  id: number;
  title: string;
  poster: string;
}

interface Top3SectionProps {
  movies: Top3Item[];
  tvShows: Top3Item[];
  onAddMovie: () => void;
  onAddTvShow: () => void;
  onRemove: (id: number, type: 'movie' | 'tv') => void;
}

const Top3Section: React.FC<Top3SectionProps> = ({
  movies,
  tvShows,
  onAddMovie,
  onAddTvShow,
  onRemove
}) => {
  return (
    <Card className="bg-[#2A2A2A] border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Favorites</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Movies Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-2xl border border-purple-500/20">
          <h2 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
            🎬 Movies
          </h2>

          {movies.length === 0 ? (
            <div className="text-center py-6 sm:py-12">
              <button
                onClick={onAddMovie}
                className="bg-gray-800/50 border border-purple-500/20 px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg transition"
              >
                ➕ Add Your Top 3 Movies
              </button>
            </div>
          ) : (
            <>
              {/* CAROUSEL - Mobile et XL+ */}
              <div className="block sm:hidden xl:block">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-4">
                    {movies.map((movie) => (
                      <CarouselItem key={movie.id} className="basis-2/3 h-full relative group max-h-[400px] xl:max-h-[320px] 2xl:max-h-[380px] overflow-hidden p-0">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-contain rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => onRemove(movie.id, 'movie')}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </CarouselItem>
                    ))}

                    {movies.length < 3 && (
                      <CarouselItem className="basis-2/3 h-full max-h-[400px] xl:max-h-[320px] 2xl:max-h-[380px] p-0">
                        <button
                          onClick={onAddMovie}
                          className="w-full h-full border-2 border-dashed border-purple-500 rounded-lg flex flex-col items-center justify-center hover:bg-purple-900/20 transition"
                        >
                          <span className="text-4xl mb-2">➕</span>
                          <span className="text-sm text-gray-400">Add Movie</span>
                        </button>
                      </CarouselItem>
                    )}
                  </CarouselContent>
                </Carousel>
              </div>
            </>
          )}
        </div>

        {/* TV Shows Section - Même structure */}
        {/* TV Shows Section - Version simplifiée comme Movies */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 mb-4 sm:mb-8 shadow-2xl border border-purple-500/20">
          <h2 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6 flex items-center gap-1 sm:gap-2">
            📺 TV Shows
          </h2>

          {tvShows.length === 0 ? (
            <div className="text-center py-6 sm:py-12">
              <button
                onClick={onAddTvShow}
                className="bg-gray-800/50 border border-purple-500/20 px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg transition"
              >
                ➕ Add your Top 3 TV Shows
              </button>
            </div>
          ) : (
            <>
              {/* CAROUSEL - Mobile et XL+ */}
              <div className="block sm:hidden xl:block">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-4">
                    {tvShows.map((show) => (
                      <CarouselItem key={show.id} className="basis-2/3 h-full relative group max-h-[400px] xl:max-h-[320px] 2xl:max-h-[380px] overflow-hidden p-0">
                        <img
                          src={show.poster}
                          alt={show.title}
                          className="w-full h-full object-contain rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => onRemove(show.id, 'tv')}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </CarouselItem>
                    ))}

                    {tvShows.length < 3 && (
                      <CarouselItem className="basis-2/3 h-full max-h-[400px] xl:max-h-[320px] 2xl:max-h-[380px] p-0">
                        <button
                          onClick={onAddTvShow}
                          className="w-full h-full border-2 border-dashed border-purple-500 rounded-lg flex flex-col items-center justify-center hover:bg-purple-900/20 transition"
                        >
                          <span className="text-4xl mb-2">➕</span>
                          <span className="text-sm text-gray-400">Add TV Show</span>
                        </button>
                      </CarouselItem>
                    )}
                  </CarouselContent>
                </Carousel>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Top3Section;