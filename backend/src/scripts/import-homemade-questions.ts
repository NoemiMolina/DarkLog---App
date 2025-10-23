import mongoose from "mongoose";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Quiz from "../models/Quiz.js";

dotenv.config();

const importQuestions = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) throw new Error("MONGO_URI manquant dans .env");

        await mongoose.connect(mongoUri);
        console.log("Connecté à MongoDB");

        const dataDir = path.join(process.cwd(), "homemade_quiz");

        const files = [
            "quiz_movies_culture_easy.json",
            "quiz_movies_culture_medium.json",
            "quiz_movies_culture_hard.json",
            "quiz_movies_dumbDescription_easy.json",
            "quiz_movies_dumbDescription_medium.json",
            "quiz_movies_dumbDescription_hard.json",
            "quiz_movies_titleless_poster_easy.json",
            "quiz_movies_titleless_poster_medium.json",
            "quiz_movies_titleless_poster_hard.json"
        ];

        for (const file of files) {
            const filePath = path.join(dataDir, file);
            const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

            if (!Array.isArray(data)) {
                console.warn(`Le fichier ${file} n’est pas un tableau JSON`);
                continue;
            }

            await Quiz.insertMany(data);
            console.log(`Importé ${data.length} questions depuis ${file}`);
        }

        console.log("Import terminé !");
        await mongoose.disconnect();
    } catch (err) {
        console.error("Erreur d’import :", err);
    }
};

importQuestions();
