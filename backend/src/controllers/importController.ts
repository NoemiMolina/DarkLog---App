import type { Request, Response } from "express";
import User from "../models/User";
import {
  matchMovieByNameAndYear,
  isHorrorGenre,
  findAlreadyRatedMovie
} from "../services/movieMatcher";

/**
 * Interface pour les données d'import depuis Letterboxd CSV
 */
interface LetterboxdMovieData {
  name: string;
  year: number;
  rating: number; // 0-5 avec possibilité décimales (ex: 3.5)
  review: string; // Commentaire optionnel
  watchedDate?: string; // Date du visionnage
}

/**
 * Interface pour le résultat du préview
 */
interface PreviewResult {
  found: {
    name: string;
    year: number;
    tmdbId: number;
    rating: number;
    review: string;
    runtime: number; // 🆕 Runtime du film depuis la BD
    status: "new" | "update"; // "new" = film nouveau pour l'utilisateur, "update" = déjà noté
    oldRating?: number; // Si c'est une mise à jour
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

/**
 * === ENDPOINT 1: PREVIEW DE L'IMPORT ===
 * 
 * Reçoit le CSV parsé et retourne un aperçu des films trouvés/non-trouvés
 * 
 * REQUÊTE:
 * POST /api/import/letterboxd/preview
 * {
 *   "userId": "65f...",
 *   "csvData": [
 *     { "name": "Scream", "year": 1996, "rating": 5, "review": "Classique!" },
 *     { "name": "Barbie", "year": 2023, "rating": 4, "review": "" }
 *   ]
 * }
 * 
 * RÉPONSE:
 * {
 *   "found": [
 *     { "name": "Scream", "year": 1996, "tmdbId": 123, "rating": 5, "status": "new", ... },
 *     { "name": "Get Out", "year": 2017, "tmdbId": 456, "rating": 3, "status": "update", "oldRating": 2, ... }
 *   ],
 *   "notFound": [
 *     { "name": "Barbie", "year": 2023, "reason": "not_horror" },
 *     { "name": "UnknownMovie", "year": 2020, "reason": "not_in_database" }
 *   ],
 *   "summary": { "totalInCSV": 4, "found": 2, "notFound": 2 }
 * }
 */
export const previewLetterboxdImport = async (req: Request, res: Response) => {
  try {
    const { userId, csvData } = req.body;

    // ✅ Validations de base
    if (!userId) {
      return res.status(400).json({ message: "userId est requis" });
    }

    if (!Array.isArray(csvData) || csvData.length === 0) {
      return res.status(400).json({ message: "csvData doit être un array non-vide" });
    }

    // Récupère l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    console.log(`\n🎬 === PREVIEW IMPORT LETTERBOXD === 🎬`);
    console.log(`📊 ${csvData.length} films à traiter pour ${user.UserPseudo}`);

    // Initialise les résultats
    const previewResult: PreviewResult = {
      found: [],
      notFound: [],
      summary: {
        totalInCSV: csvData.length,
        found: 0,
        notFound: 0
      }
    };

    // ✅ Traite chaque film du CSV
    for (const filmData of csvData) {
      const { name, year, rating, review } = filmData as LetterboxdMovieData;

      console.log(`\n📽️ Traitement: "${name}" (${year})`);

      // ✅ ÉTAPE 1 : Cherche le film dans la DB avec matching
      const matchResult = await matchMovieByNameAndYear(name, year);

      if (!matchResult.found) {
        console.log(`   → Pas trouvé: ${matchResult.error}`);
        previewResult.notFound.push({
          name,
          year,
          reason: "not_in_database"
        });
        previewResult.summary.notFound++;
        continue;
      }

      // ✅ ÉTAPE 2 : Vérifie que c'est bien horreur
      if (!isHorrorGenre(matchResult.movie)) {
        console.log(`   → Rejeté: pas du genre horreur`);
        previewResult.notFound.push({
          name,
          year,
          reason: "not_horror"
        });
        previewResult.summary.notFound++;
        continue;
      }

      // ✅ ÉTAPE 3 : Vérifie si déjà noté (doublons)
      const alreadyRated = findAlreadyRatedMovie(user, matchResult.movie.tmdb_id);

      const status = alreadyRated ? "update" : "new";
      const oldRating = alreadyRated ? alreadyRated.rating : undefined;

      console.log(`   ✅ Trouvé! Genre_ids: ${matchResult.movie.genre_ids?.join(", ") || 'N/A'}, Status: ${status}, TMDB_ID: ${matchResult.movie.tmdb_id}, Runtime: ${matchResult.movie.runtime || 0}min`);

      previewResult.found.push({
        name: matchResult.movie.title,
        year: matchResult.movie.year,
        tmdbId: matchResult.movie.tmdb_id,
        rating,
        review: review || "",
        runtime: matchResult.movie.runtime || 0, // 🆕 Runtime depuis la BD
        status,
        oldRating
      });
      previewResult.summary.found++;
    }

    // ✅ Retourne le résumé
    console.log(`\n📊 === RÉSUMÉ === `);
    console.log(`   ✅ Trouvés: ${previewResult.summary.found}`);
    console.log(`   ❌ Non trouvés: ${previewResult.summary.notFound}`);

    res.status(200).json(previewResult);

  } catch (err) {
    console.error("❌ Erreur dans previewLetterboxdImport:", err);
    res.status(500).json({
      message: "Erreur lors du préview de l'import",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};

/**
 * === ENDPOINT 2: CONFIRMER L'IMPORT ===
 * 
 * Reçoit la liste des films confirmés et les ajoute/met à jour au profil
 * 
 * REQUÊTE:
 * POST /api/import/letterboxd/confirm
 * {
 *   "userId": "65f...",
 *   "filmsToImport": [
 *     { "tmdbId": 123, "title": "Scream", "rating": 5, "review": "Classique", "runtime": 111 },
 *     { "tmdbId": 456, "title": "Get Out", "rating": 3, "review": "", "runtime": 104 }
 *   ]
 * }
 * 
 * RÉPONSE:
 * {
 *   "message": "Import réussi",
 *   "imported": 2,
 *   "updated": 1,
 *   "stats": {
 *     "numberOfWatchedMovies": 25,
 *     "averageMovieRating": 3.8,
 *     "totalWatchTime": 2850
 *   }
 * }
 */
export const confirmLetterboxdImport = async (req: Request, res: Response) => {
  try {
    const { userId, filmsToImport } = req.body;

    // ✅ Validations
    if (!userId) {
      return res.status(400).json({ message: "userId est requis" });
    }

    if (!Array.isArray(filmsToImport) || filmsToImport.length === 0) {
      return res.status(400).json({ message: "filmsToImport doit être un array non-vide" });
    }

    // Récupère l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    console.log(`\n🎬 === CONFIRMATION IMPORT LETTERBOXD === 🎬`);
    console.log(`📥 Import de ${filmsToImport.length} films pour ${user.UserPseudo}`);

    let importedCount = 0;
    let updatedCount = 0;

    // ✅ Initialise RatedMovies si n'existe pas
    if (!Array.isArray(user.RatedMovies)) {
      user.RatedMovies = [];
    }

    // ✅ Traite chaque film à importer
    for (const film of filmsToImport) {
      const { tmdbId, title, rating, review, runtime } = film;

      console.log(`\n📽️ Import: "${title}" (ID: ${tmdbId}), Note: ${rating}/5`);

      // Cherche si le film existe déjà pour cet utilisateur
      const existingIndex = user.RatedMovies.findIndex(
        (r: any) => r.tmdbMovieId === tmdbId
      );

      if (existingIndex !== -1) {
        // ✅ Mise à jour (doublon)
        console.log(`   → Mise à jour de l'ancienne note: ${user.RatedMovies[existingIndex].rating} → ${rating}`);
        user.RatedMovies[existingIndex].rating = rating;
        user.RatedMovies[existingIndex].review = review || "";
        user.RatedMovies[existingIndex].runtime = runtime || 0;
        user.RatedMovies[existingIndex].createdAt = new Date();
        updatedCount++;
      } else {
        // ✅ Ajout nouveau
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

    // ✅ Recalcule les stats
    const ratedMovies = user.RatedMovies;
    const numberOfWatchedMovies = ratedMovies.length;
    const averageMovieRating = ratedMovies.length > 0
      ? ratedMovies.reduce((sum: number, movie: any) => sum + (movie.rating || 0), 0) / ratedMovies.length
      : 0;

    // Total watch time = somme des durées de tous les films vus
    const totalWatchTime = ratedMovies.reduce((sum: number, movie: any) => sum + (movie.runtime || 0), 0);

    console.log(`\n📊 === MISE À JOUR STATS === `);
    console.log(`   📽️ Films vus: ${numberOfWatchedMovies}`);
    console.log(`   ⭐ Moyenne: ${averageMovieRating.toFixed(2)}/5`);
    console.log(`   ⏱️ Total watchtime: ${totalWatchTime} min (${(totalWatchTime / 60).toFixed(1)}h)`);

    // ✅ Sauvegarde les mises à jour
    user.NumberOfWatchedMovies = numberOfWatchedMovies;
    user.AverageMovieRating = averageMovieRating;
    await user.save();

    console.log(`\n✅ Import terminé! ${importedCount} nouveaux films, ${updatedCount} mises à jour`);

    res.status(200).json({
      message: "Import réussi",
      imported: importedCount,
      updated: updatedCount,
      stats: {
        numberOfWatchedMovies,
        averageMovieRating: parseFloat(averageMovieRating.toFixed(2)),
        totalWatchTime
      }
    });

  } catch (err) {
    console.error("❌ Erreur dans confirmLetterboxdImport:", err);
    res.status(500).json({
      message: "Erreur lors de la confirmation de l'import",
      error: err instanceof Error ? err.message : "Unknown error"
    });
  }
};
