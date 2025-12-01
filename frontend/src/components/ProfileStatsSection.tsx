import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

interface ProfileStatsSection {
  numberOfWatchedMovies: number;
  numberOfWatchedTvShows: number;
  numberOfGivenReviews: number;
  averageMovieRating: number;
  averageTvShowRating: number;
}

const StatsSection: React.FC<ProfileStatsSection> = ({
  numberOfWatchedMovies = 0,
  numberOfWatchedTvShows = 0,
  numberOfGivenReviews = 0,
  averageMovieRating = 0,
  averageTvShowRating = 0,
}) => {
  return (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsSection;