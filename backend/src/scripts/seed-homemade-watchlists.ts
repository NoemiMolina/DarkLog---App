import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/FearLogApp";

const watchlistsData = [
    {
        title: "Scream Saga",
        description: "Tous les films de la saga Scream",
        tmdbIds: [4232, 4233, 4234, 41446, 646385, 934433],
    },
    {
        title: "The Dev's favorites",
        description: "Les films préférés du développeur",
        tmdbIds: [46633, 530385, 694, 493922, 4232, 1197137, 755, 348, 346364, 1151031],
    },
];

async function seedWatchlists() {
    try {
        console.log("🌱 Démarrage du seed des watchlists...");
        
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connecté à MongoDB");

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Base de données non disponible");
        }

        const moviesCollection = db.collection("movies");
        const watchlistsCollection = db.collection("homemade_watchlists");

        let createdCount = 0;
        let updatedCount = 0;

        for (const watchlist of watchlistsData) {
            console.log(`\n📺 Traitement de "${watchlist.title}"...`);

            const movies = await moviesCollection
                .find({ tmdb_id: { $in: watchlist.tmdbIds } })
                .toArray();

            console.log(`   Trouvé ${movies.length}/${watchlist.tmdbIds.length} films`);

            if (movies.length === 0) {
                console.warn(
                    `   ⚠️  Aucun film trouvé pour "${watchlist.title}". Vérifiez les TMDB IDs.`
                );
                continue;
            }

            const movieIds = movies.map((m: any) => new mongoose.Types.ObjectId(m._id));
            const result = await watchlistsCollection.updateOne(
                { title: watchlist.title },
                {
                    $set: {
                        title: watchlist.title,
                        description: watchlist.description,
                        movies: movieIds,
                        updatedAt: new Date(),
                    },
                    $setOnInsert: {
                        createdAt: new Date(),
                    },
                },
                { upsert: true }
            );

            if (result.upsertedId) {
                createdCount++;
                console.log(`   ✨ Watchlist créée avec ${movieIds.length} films`);
            } else {
                updatedCount++;
                console.log(`   🔄 Watchlist mise à jour avec ${movieIds.length} films`);
            }
        }

        console.log("\n" + "=".repeat(50));
        console.log("📊 Résumé du seed :");
        console.log(`   ✨ Créées : ${createdCount}`);
        console.log(`   🔄 Mises à jour : ${updatedCount}`);
        console.log(`   📺 Total traité : ${createdCount + updatedCount}`);
        console.log("=".repeat(50));

        const finalCount = await watchlistsCollection.countDocuments();
        console.log(`\n✅ Total de watchlists en base : ${finalCount}`);

    } catch (error) {
        console.error("❌ Erreur lors du seed :", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("\n✅ Déconnecté de MongoDB");
        process.exit(0);
    }
}

seedWatchlists();
