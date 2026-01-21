import express from "express";
import {
  previewLetterboxdImport,
  confirmLetterboxdImport
} from "../controllers/importController";

const router = express.Router();

/**
 * POST /api/import/letterboxd/preview
 * 
 * Aperçu de l'import Letterboxd
 * 
 * Body:
 * {
 *   "userId": "65f...",
 *   "csvData": [
 *     { "name": "Scream", "year": 1996, "rating": 5, "review": "Top!" }
 *   ]
 * }
 */
router.post("/letterboxd/preview", previewLetterboxdImport);

/**
 * POST /api/import/letterboxd/confirm
 * 
 * Confirme et sauvegarde l'import Letterboxd
 * 
 * Body:
 * {
 *   "userId": "65f...",
 *   "filmsToImport": [
 *     { "tmdbId": 123, "title": "Scream", "rating": 5, "review": "", "runtime": 111 }
 *   ]
 * }
 */
router.post("/letterboxd/confirm", confirmLetterboxdImport);

export default router;
