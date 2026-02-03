import Fuse from 'fuse.js';
import Movie from '../models/Movie';

/**
 Never used this before, let's trust the internet docs for now lol
 */
export interface MovieMatchResult {
  found: boolean;
  movie?: any;
  score?: number;
  error?: string;
}

/**
 * Cherche un film dans la DB par nom et année avec fuzzy matching
 * 
 * @param name - Titre du film (ex: "Scream")
 * @param year - Année du film (ex: 1996)
 * @param minScore - Score minimum pour accepter un match (défaut: 0.6 = 60% de similarité)
 * @returns 
 */
export const matchMovieByNameAndYear = async (
  name: string,
  year: number,
  minScore: number = 0.92
): Promise<MovieMatchResult> => {
  try {
    const cleanName = name.replace(/\s*\(\d{4}\)\s*$/g, '').trim();
    if (cleanName !== name) {
    }
    let exactMatch = await Movie.findOne({
      title: cleanName,
      year: year
    });

    if (exactMatch) {
      return {
        found: true,
        movie: exactMatch,
        score: 1.0
      };
    }
    
    const allMovies = await Movie.find({
      $or: [
        { year: { $gte: year - 3, $lte: year + 3 } },
        { release_date: { $regex: `^${year-3}|^${year-2}|^${year-1}|^${year}|^${year+1}|^${year+2}|^${year+3}` } }
      ]
    }).limit(2000);

    if (allMovies.length === 0) {
      return {
        found: false,
        error: `No movies found in year range ${year-3}-${year+3}`
      };
    }
    const fuse = new Fuse(allMovies, {
      keys: ['title'],
      threshold: 0.1, 
      distance: 100,
      includeScore: true
    });

    const fuzzyResults = fuse.search(cleanName);

    if (fuzzyResults.length === 0) {
      return {
        found: false,
        error: `No matching movies found for "${cleanName}"`
      };
    }
    fuzzyResults.slice(0, 3).forEach((result, idx) => {
      const score = 1 - (result.score || 0);
    });
    const bestMatch = fuzzyResults[0];
    const score = 1 - (bestMatch.score || 0);
    const titleLengthDiff = Math.abs(cleanName.length - bestMatch.item.title.length);
    const titleLengthRatio = Math.min(cleanName.length, bestMatch.item.title.length) / Math.max(cleanName.length, bestMatch.item.title.length);
    if (titleLengthRatio < 0.5) {
      return {
        found: false,
        error: `Title length mismatch: "${cleanName}" vs "${bestMatch.item.title}"`
      };
    }
    
    if (score < minScore) {
      return {
        found: false,
        error: `Match score too low: ${(score * 100).toFixed(1)}% < ${(minScore * 100).toFixed(1)}%`
      };
    }

    return {
      found: true,
      movie: bestMatch.item,
      score: score
    };

  } catch (err) {
    console.error('❌ Error in matchMovieByNameAndYear:', err);
    return {
      found: false,
      error: `Error matching movie: ${err instanceof Error ? err.message : 'Unknown error'}`
    };
  }
};

/**
 * Vérifie si un film contient le genre horreur (ID 27)
 * 
 * @param movie - Document du film
 * @returns true si c'est un film horreur
 * 
 * EXEMPLE:
 * const isHorror = isHorrorGenre(movie);
 */
export const isHorrorGenre = (movie: any): boolean => {
  let genreArray = movie.genre_ids || movie.genres || [];
  if (!Array.isArray(genreArray) || genreArray.length === 0) {
    console.warn(`⚠️ Movie "${movie.title}" has no valid genres. genre_ids: ${movie.genre_ids}, genres: ${movie.genres}`);
    return false;
  }
  const hasHorrorGenre = genreArray.some((genre: any) => {
    const genreNum = Number(genre);
    return genreNum === 27;
  });

  return hasHorrorGenre;
};

/**
 * Vérifie si l'utilisateur a déjà noté ce film
 * 
 * @param user - Document de l'utilisateur
 * @param tmdbMovieId - ID TMDB du film
 * @returns L'entrée RatedMovie si existe, sinon null
 * 
 * EXEMPLE:
 * const alreadyRated = findAlreadyRatedMovie(user, 123);
 * if (alreadyRated) {
 *   console.log("Film déjà noté:", alreadyRated.rating);
 * }
 */
export const findAlreadyRatedMovie = (user: any, tmdbMovieId: number) => {
  if (!user.RatedMovies || user.RatedMovies.length === 0) {
    return null;
  }
  return user.RatedMovies.find((rated: any) => rated.tmdbMovieId === tmdbMovieId) || null;
};
