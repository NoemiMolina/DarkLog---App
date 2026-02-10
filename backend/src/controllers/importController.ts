import type { Request, Response } from "express";
import User from "../models/User";
import {
  matchMovieByNameAndYear,
  isHorrorGenre,
  findAlreadyRatedMovie,
  initializeMovieCache
} from "../services/movieMatcher";

interface LetterboxdMovieData {
  name: string;
  year: number;
  rating: number;
  review: string;
  watchedDate?: string;
}

interface PreviewResult {
  found: {
    name: string;
    year: number;
    tmdbId: number;
    rating: number;
    review: string;
    runtime: number;
    status: "new" | "update";
    oldRating?: number;
  }[];
  notFound: {
    name: string;
    year: number;
    reason: "not_in_database" | "not_horror";
  }[];
  summary: {
    totalInCSV: number;
    found: number;
    notFound: number;
  };
}

export const previewLetterboxdImport = async (req: Request, res: Response) => {
  try {
    const { userId, csvData } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!Array.isArray(csvData) || csvData.length === 0) {
      return res.status(400).json({ message: "csvData must be a non-empty array" });
    }

    // Initialize cache once for all film matching
    console.log("⏳ Initializing movie cache for preview...");
    await initializeMovieCache();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const previewResult: PreviewResult = {
      found: [],
      notFound: [],
      summary: {
        totalInCSV: csvData.length,
        found: 0,
        notFound: 0
      }
    };
    for (const filmData of csvData) {
      const { name, year, rating, review } = filmData as LetterboxdMovieData;
      const matchResult = await matchMovieByNameAndYear(name, year);
      if (!matchResult.found) {
        previewResult.notFound.push({
          name,
          year,
          reason: "not_in_database"
        });
        previewResult.summary.notFound++;
        continue;
      }
      if (!isHorrorGenre(matchResult.movie)) {
        previewResult.notFound.push({
          name,
          year,
          reason: "not_horror"
        });
        previewResult.summary.notFound++;
        continue;
      }
      const alreadyRated = findAlreadyRatedMovie(user, matchResult.movie.tmdb_id);

      const status = alreadyRated ? "update" : "new";
      const oldRating = alreadyRated ? alreadyRated.rating : undefined;
      previewResult.found.push({
        name: matchResult.movie.title,
        year: matchResult.movie.year,
        tmdbId: matchResult.movie.tmdb_id,
        rating,
        review: review || "",
        runtime: matchResult.movie.runtime || 0,
        status,
        oldRating
      });
      previewResult.summary.found++;
    }
    res.status(200).json(previewResult);

  } catch (err) {
    console.error("❌ Erreur dans previewLetterboxdImport:", err);
    res.status(500).json({
      message: "Erreur lors du préview de l'import",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};

export const confirmLetterboxdImport = async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const { userId, filmsToImport } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!Array.isArray(filmsToImport) || filmsToImport.length === 0) {
      return res.status(400).json({ message: "filmsToImport must be a non-empty array" });
    }

    // Initialize cache once for all operations
    console.log("⏳ Initializing movie cache for confirmation...");
    await initializeMovieCache();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(`\n🎬 === CONFIRM LETTERBOXD IMPORT === 🎬`);
    console.log(`📥 Importing ${filmsToImport.length} films for ${user.UserPseudo}`);

    let importedCount = 0;
    let updatedCount = 0;
    if (!Array.isArray(user.RatedMovies)) {
      user.RatedMovies = [];
    }
    for (const film of filmsToImport) {
      const { tmdbId, title, rating, review, runtime } = film;
      console.log(`\n📽️ Import: "${title}" (ID: ${tmdbId}), Note: ${rating}/5`);
      const existingIndex = user.RatedMovies.findIndex(
        (r: any) => r.tmdbMovieId === tmdbId
      );

      if (existingIndex !== -1) {
        console.log(`   → Updating old rating: ${user.RatedMovies[existingIndex].rating} → ${rating}`);
        user.RatedMovies[existingIndex].rating = rating;
        user.RatedMovies[existingIndex].review = review || "";
        user.RatedMovies[existingIndex].runtime = runtime || 0;
        user.RatedMovies[existingIndex].createdAt = new Date();
        updatedCount++;
      } else {
        console.log(`   → Nouveau film ajouté`);
        user.RatedMovies.push({
          tmdbMovieId: tmdbId,
          movieTitle: title,
          rating,
          review: review || "",
          runtime: runtime || 0,
          createdAt: new Date()
        } as any);
        importedCount++;
      }
    }
    const ratedMovies = user.RatedMovies;
    const numberOfWatchedMovies = ratedMovies.length;
    const averageMovieRating = ratedMovies.length > 0
      ? ratedMovies.reduce((sum: number, movie: any) => sum + (movie.rating || 0), 0) / ratedMovies.length
      : 0;
    const totalWatchTime = ratedMovies.reduce((sum: number, movie: any) => sum + (movie.runtime || 0), 0);

    console.log(`\n📊 === UPDATING STATS === `);
    console.log(`   📽️ Watched movies: ${numberOfWatchedMovies}`);
    console.log(`   ⭐ Average rating: ${averageMovieRating.toFixed(2)}/5`);
    console.log(`   ⏱️ Total watchtime: ${totalWatchTime} min (${(totalWatchTime / 60).toFixed(1)}h)`);
    user.NumberOfWatchedMovies = numberOfWatchedMovies;
    user.AverageMovieRating = averageMovieRating;
    
    console.log(`⏳ Saving user to database...`);
    await user.save();
    
    const elapsedTime = Date.now() - startTime;
    console.log(`\n✅ Import finished! ${importedCount} new films, ${updatedCount} updates (took ${elapsedTime}ms)`);

    res.status(200).json({
      message: "Import successful",
      imported: importedCount,
      updated: updatedCount,
      stats: {
        numberOfWatchedMovies,
        averageMovieRating: parseFloat(averageMovieRating.toFixed(2)),
        totalWatchTime
      }
    });

  } catch (err) {
    console.error("❌ Error in confirmLetterboxdImport:", err);
    res.status(500).json({
      message: "Error during import confirmation",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};
