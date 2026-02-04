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
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 sm:-ml-4">
                {movies.map((movie) => (
                  <CarouselItem 
                    key={movie.id} 
                    className="pl-2 sm:pl-4 
                      basis-2/3           /* Mobile: 2/3 de l'écran */
                      sm:basis-1/3        /* sm: 1/3 de l'écran (3 visibles) */
                      lg:basis-1/4        /* lg: 1/4 de l'écran */
                      xl:basis-1/5        /* xl: 1/5 de l'écran */
                      2xl:basis-1/6       /* 2xl: 1/6 de l'écran */
                    "
                  >
                    <div className="relative 
                      h-[280px]          /* Mobile: 280px */
                      sm:h-[220px]       /* sm: 220px */
                      md:h-[240px]       /* md: 240px */
                      lg:h-[260px]       /* lg: 260px */
                      xl:h-[280px]       /* xl: 280px */
                      2xl:h-[300px]      /* 2xl: 300px */
                    ">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => onRemove(movie.id, 'movie')}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1.5 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </CarouselItem>
                ))}

                {/* Bouton Add si moins de 3 films */}
                {movies.length < 3 && (
                  <CarouselItem className="pl-2 sm:pl-4 
                    basis-2/3 
                    sm:basis-1/3 
                    lg:basis-1/4 
                    xl:basis-1/5 
                    2xl:basis-1/6
                  ">
                    <button
                      onClick={onAddMovie}
                      className="w-full h-full 
                        h-[280px] 
                        sm:h-[220px] 
                        md:h-[240px] 
                        lg:h-[260px] 
                        xl:h-[280px] 
                        2xl:h-[300px]
                        border-2 border-dashed border-purple-500 
                        rounded-lg flex flex-col items-center justify-center 
                        hover:bg-purple-900/20 transition"
                    >
                      <span className="
                        text-4xl mb-2 
                        sm:text-3xl 
                        lg:text-4xl 
                        xl:text-5xl
                      ">➕</span>
                      <span className="text-sm text-gray-400 hidden sm:block">Add Movie</span>
                      <span className="text-xs text-gray-400 sm:hidden">Add</span>
                    </button>
                  </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
          )}
        </div>

        {/* TV Shows Section */}
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
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 sm:-ml-4">
                {tvShows.map((show) => (
                  <CarouselItem 
                    key={show.id} 
                    className="pl-2 sm:pl-4 
                      basis-2/3 
                      sm:basis-1/3 
                      lg:basis-1/4 
                      xl:basis-1/5 
                      2xl:basis-1/6
                    "
                  >
                    <div className="relative 
                      h-[280px] 
                      sm:h-[220px] 
                      md:h-[240px] 
                      lg:h-[260px] 
                      xl:h-[280px] 
                      2xl:h-[300px]
                    ">
                      <img
                        src={show.poster}
                        alt={show.title}
                        className="w-full h-full object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => onRemove(show.id, 'tv')}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1.5 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </CarouselItem>
                ))}

                {/* Bouton Add si moins de 3 séries */}
                {tvShows.length < 3 && (
                  <CarouselItem className="pl-2 sm:pl-4 
                    basis-2/3 
                    sm:basis-1/3 
                    lg:basis-1/4 
                    xl:basis-1/5 
                    2xl:basis-1/6
                  ">
                    <button
                      onClick={onAddTvShow}
                      className="w-full h-full 
                        h-[280px] 
                        sm:h-[220px] 
                        md:h-[240px] 
                        lg:h-[260px] 
                        xl:h-[280px] 
                        2xl:h-[300px]
                        border-2 border-dashed border-purple-500 
                        rounded-lg flex flex-col items-center justify-center 
                        hover:bg-purple-900/20 transition"
                    >
                      <span className="
                        text-4xl mb-2 
                        sm:text-3xl 
                        lg:text-4xl 
                        xl:text-5xl
                      ">➕</span>
                      <span className="text-sm text-gray-400 hidden sm:block">Add TV Show</span>
                      <span className="text-xs text-gray-400 sm:hidden">Add</span>
                    </button>
                  </CarouselItem>
                )}
              </CarouselContent>
            </Carousel>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Top3Section;