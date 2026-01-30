import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/FearLogApp";

const watchlistsData = [
    {
        title: "The Dev's favorites",
        description: "The developer's favorite movies.",
        tmdbIds: [46633, 530385, 694, 493922, 4232, 1197137, 755, 348, 346364, 1151031, 1100988, 2662],
        posterPath: "/HomemadeWatchlistsFigmaCards/devsfavs.png",
    },
    {
        title: "Scream Saga",
        description: "All movies from the Scream saga.",
        tmdbIds: [4232, 4233, 4234, 41446, 646385, 934433],
        posterPath: "/HomemadeWatchlistsFigmaCards/screamsaga.png",
    },
    {
        title: 'October marathon',
        description: 'A selection of 31 horror movies perfect for October.',
        tmdbIds: [760104, 663712, 170, 610253, 5876, 713704, 1562, 9378, 19994, 338967, 489430, 396535, 913290, 744857, 1100988, 747, 1373445, 588, 426063, 132232, 565, 1285965, 1111873, 43593, 949423, 6466, 1690, 10066, 8851, 762441, 9358],
        posterPath: "/HomemadeWatchlistsFigmaCards/31moviesuntilhalloween.png",
    },
    {
        title: 'A24 Horrors',
        description: 'A selection of horror movies produced by A24.',
        tmdbIds: [310131, 246403, 493922, 530385, 426487, 780609, 520023, 760104, 949423, 1023922, 1138194, 1008042, 1151031],
        posterPath: "/HomemadeWatchlistsFigmaCards/a24horrors.png",
    },
    {
        title: 'John Carpenter Classics',
        description: 'A selection of classic horror movies directed or produced by John Carpenter.',
        tmdbIds: [616820, 610253, 424139, 1091, 790, 11442, 10987, 11361, 11281, 948],
        posterPath: "/HomemadeWatchlistsFigmaCards/johncarpenterclassics.png",
    },
    {
        title: 'Stephen King Adaptations',
        description: 'A selection of horror movies adapted from Stephen King\'s works.',
        tmdbIds: [7340, 133805, 157433, 8913, 10280, 10489, 1700, 604079, 5876, 1124620, 694, 346364, 474350],
        posterPath: "/HomemadeWatchlistsFigmaCards/stephenkingadaptations.png",
    },
    {
        title: 'Found Footage Horrors',
        description: 'A selection of found footage horror movies',
        tmdbIds: [23827, 146301, 59429, 227348, 72571, 82990, 41436, 80280, 185341, 10664, 8329, 13812, 2667, 27370, 159117, 267806, 8348, 297608, 359246, 256274],
        posterPath: "/HomemadeWatchlistsFigmaCards/foundfootagehorrors.png",
    }, 
    {
        title: 'Old but Gold',
        description: 'A selection of cult classic horror movies.',
        tmdbIds: [948, 11281, 4488, 377, 16938, 30497, 3987, 4232, 694, 348, 9599, 578, 2662],
        posterPath: "/HomemadeWatchlistsFigmaCards/oldbutgold.png",
    }
];

const seedWatchlists = async () => {
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
                        posterPath: watchlist.posterPath,
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
};

seedWatchlists();
