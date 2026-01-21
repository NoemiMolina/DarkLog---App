import express from "express";
import {
  previewLetterboxdImport,
  confirmLetterboxdImport
} from "../controllers/importController";

const router = express.Router();
router.post("/letterboxd/preview", previewLetterboxdImport);
router.post("/letterboxd/confirm", confirmLetterboxdImport);

export default router;
