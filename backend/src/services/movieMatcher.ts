import Fuse from "fuse.js";
import Movie from "../models/Movie";

/**
 Never used this before, let's trust the internet docs for now lol
 */
export interface MovieMatchResult {
  found: boolean;
  movie?: any;
  score?: number;
  error?: string;
}

let cachedMovies: any[] | null = null;
let cachedFuseIndex: Fuse<any> | null = null;
let cacheInitializing = false;

/**
 * Initialize movie cache for faster batch processing
 */
export const initializeMovieCache = async () => {
  if (cacheInitializing) {
    let attempts = 0;
    while (!cachedMovies && attempts < 60) {
      await new Promise((r) => setTimeout(r, 100));
      attempts++;
    }
    return;
  }

  if (cachedMovies) return;

  cacheInitializing = true;
  try {
    console.log("⏳ Loading movies into cache...");
    const startTime = Date.now();
    cachedMovies = await Movie.find(
      {},
      "title original_title year release_date genre_ids genres tmdb_id runtime",
    ).lean();
    cachedFuseIndex = new Fuse(cachedMovies, {
      keys: ["title", "original_title"],
      threshold: 0.3,
      includeScore: true,
    });
    const elapsed = Date.now() - startTime;
    console.log(`✅ Cached ${cachedMovies.length} movies in ${elapsed}ms`);
  } catch (err) {
    console.error("❌ Error initializing cache:", err);
    cachedMovies = null;
    cachedFuseIndex = null;
    throw err;
  } finally {
    cacheInitializing = false;
  }
};

/**
 * Cherche un film dans le cache par nom et année avec fuzzy matching
 *
 * @param name - Titre du film (ex: "Scream")
 * @param year - Année du film (ex: 1996)
 * @param minScore - Score minimum pour accepter un match (défaut: 0.6 = 60% de similarité)
 * @returns
 */
export const matchMovieByNameAndYear = async (
  name: string,
  year: number,
  minScore: number = 0.92,
): Promise<MovieMatchResult> => {
  try {
    // Initialize cache on first call
    if (!cachedMovies || !cachedFuseIndex) {
      await initializeMovieCache();
    }

    const cleanName = name.replace(/\s*\(\d{4}\)\s*$/g, "").trim();

    // Look for exact match first
    const exactMatch = cachedMovies!.find(
      (m) =>
        (m.title === cleanName || m.original_title === cleanName) &&
        m.year === year,
    );

    if (exactMatch) {
      return {
        found: true,
        movie: exactMatch,
        score: 1.0,
      };
    }

    // Fuzzy search using cached index
    const fuseResults = cachedFuseIndex!.search(cleanName, { limit: 10 });

    if (fuseResults.length === 0) {
      return {
        found: false,
        error: `No matching movies found for "${cleanName}"`,
      };
    }

    // Filter by year range from results
    const yearFilteredResults = fuseResults.filter((r) => {
      const movieYear =
        r.item.year || parseInt(r.item.release_date?.substring(0, 4) || "0");
      return Math.abs(movieYear - year) <= 3;
    });

    if (yearFilteredResults.length === 0) {
      return {
        found: false,
        error: `No movies found in year range ${year - 3}-${year + 3}`,
      };
    }

    const bestMatch = yearFilteredResults[0];
    const score = 1 - (bestMatch.score || 0);

    if (score < minScore) {
      return {
        found: false,
        error: `Match score too low: ${(score * 100).toFixed(1)}% < ${(minScore * 100).toFixed(1)}%`,
      };
    }

    return {
      found: true,
      movie: bestMatch.item,
      score: score,
    };
  } catch (err) {
    console.error("❌ Error in matchMovieByNameAndYear:", err);
    return {
      found: false,
      error: `Error matching movie: ${err instanceof Error ? err.message : "Unknown error"}`,
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
    console.warn(
      `⚠️ Movie "${movie.title}" has no valid genres. genre_ids: ${movie.genre_ids}, genres: ${movie.genres}`,
    );
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
  return (
    user.RatedMovies.find((rated: any) => rated.tmdbMovieId === tmdbMovieId) ||
    null
  );
};
