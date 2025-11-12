import express from "express";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/test-upload", uploadMiddleware.single("file"), (req, res) => {
  console.log("✅ Fichier reçu :", req.file);
  res.json({ message: "Upload OK", file: req.file });
});

export default router;
