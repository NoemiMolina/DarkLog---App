import mongoose from "mongoose";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const TMDB_KEY = process.env.TMDB_API_KEY!;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/HorrorDB";
const GENRE_ID = 27;
const MAX_PAGES = 50;

const filmSchema = new mongoose.Schema(
  {
    tmdb_id: { type: Number, unique: true },
    title: String,
    original_title: String,
    overview: String,
    release_date: String,
    popularity: Number,
    vote_average: Number,
    vote_count: Number,
    genre_ids: [Number],
    poster_path: String,
    keywords: [String],
    platforms: [
      {
        provider_id: Number,
        provider_name: String,
        logo_path: String,
      }
    ],
    cast: [
      {
        name: String,
        character: String,
        profile_path: String,
      }
    ],
    raw: Object,

  },

  { timestamps: true }
);

const Film = mongoose.model("movies", filmSchema);

async function fetchPage(page: number) {
  const url = `https://api.themoviedb.org/3/discover/movie`;
  const res = await axios.get(url, {
    params: {
      api_key: TMDB_KEY,
      with_genres: GENRE_ID,
      sort_by: "popularity.desc",
      page,
    },
  });
  return res.data;
}

async function fetchKeywords(movieId: number): Promise<string[]> {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${TMDB_KEY}`;

  try {
    const res = await axios.get(url);
    const list = res.data.keywords || [];

    return list.map((k: any) => k.name.toLowerCase());
  } catch (err) {
    console.error("❌ Error fetching keywords for movie", movieId, err);
    return [];
  }
}

async function fetchPlatforms(type: "movie" | "tv", id: number) {
  const url = `https://api.themoviedb.org/3/${type}/${id}/watch/providers`;

  try {
    const res = await axios.get(url, { params: { api_key: TMDB_KEY } });

    const fr = res.data.results?.FR;
    if (!fr || !fr.flatrate) return [];

    return fr.flatrate.map((p: any) => ({
      provider_id: p.provider_id,
      provider_name: p.provider_name,
      logo_path: p.logo_path,
    }));
  } catch (err) {
    console.error(`❌ Error fetching platforms for ${type} ${id}`, err);
    return [];
  }
}

async function fetchCast(movieId: number) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_KEY}`;
  try {
    const res = await axios.get(url);

    return res.data.cast.slice(0, 10).map((actor: any) => ({
      name: actor.name,
      character: actor.character,
      profile_path: actor.profile_path,
    }));
  } catch (err) {
    console.error("❌ Error fetching cast for movie", movieId, err);
    return [];
  }
}

async function main() {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/horror_movies_db"
  );

  console.log("Connecté à MongoDB");

  const first = await fetchPage(1);
  const totalPages = Math.min(first.total_pages, MAX_PAGES);
  console.log(
    `total_pages API = ${first.total_pages}, fetching ${totalPages} pages...`
  );

  for (const item of first.results) {
    const keywords = await fetchKeywords(item.id);
    const platforms = await fetchPlatforms("movie", item.id);
    const cast = await fetchCast(item.id);

    await Film.updateOne(
      { tmdb_id: item.id },
      {
        $set: {
          tmdb_id: item.id,
          title: item.title,
          original_title: item.original_title,
          overview: item.overview,
          release_date: item.release_date,
          popularity: item.popularity,
          vote_average: item.vote_average,
          vote_count: item.vote_count,
          genre_ids: item.genre_ids,
          poster_path: item.poster_path,
          keywords,
          platforms,
          cast,
          raw: item,
        },
      },
      { upsert: true }
    );
  }

  for (let p = 2; p <= totalPages; p++) {
    console.log(`Fetching page ${p}...`);
    const pageData = await fetchPage(p);

    for (const item of pageData.results) {
      const keywords = await fetchKeywords(item.id);

      await Film.updateOne(
        { tmdb_id: item.id },
        {
          $set: {
            tmdb_id: item.id,
            title: item.title,
            original_title: item.original_title,
            overview: item.overview,
            release_date: item.release_date,
            popularity: item.popularity,
            vote_average: item.vote_average,
            vote_count: item.vote_count,
            genre_ids: item.genre_ids,
            poster_path: item.poster_path,
            keywords,
            raw: item,
          },
        },
        { upsert: true }
      );
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("🎉 Import terminé.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
