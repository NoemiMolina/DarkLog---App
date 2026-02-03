import mongoose from "mongoose";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const TMDB_KEY = process.env.TMDB_API_KEY!;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/FearLogApp";
const GENRE_ID = 27;
const MAX_PAGES = 5;
const MANUAL_TMDB_IDS = [46633, 351286, 7569, 1771, 8134, 37837, 7929, 15017, 10539, 11604, 1700, 59429, 185341, 27370, 159117, 267806, 8348, 359246, 11281, 3987, 10072]; //sale un peu oups ni vu ni connu

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
    runtime: Number,
    trailer_key: String,
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

const fetchPage = async (page: number) => {
  const res = await axios.get("https://api.themoviedb.org/3/discover/movie", {
    params: {
      api_key: TMDB_KEY,
      with_genres: GENRE_ID,
      sort_by: "popularity.desc",
      page,
    },
  });
  return res.data;
};

const fetchKeywords = async (movieId: number) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/keywords`,
      { params: { api_key: TMDB_KEY } }
    );
    return (res.data.keywords || []).map((k: any) => k.name.toLowerCase());
  } catch {
    return [];
  }
};

const fetchPlatforms = async (id: number) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
      { params: { api_key: TMDB_KEY } }
    );

    const fr = res.data.results?.FR;
    if (!fr?.flatrate) return [];

    return fr.flatrate.map((p: any) => ({
      provider_id: p.provider_id,
      provider_name: p.provider_name,
      logo_path: p.logo_path,
    }));
  } catch {
    return [];
  }
};

const fetchCast = async (movieId: number) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      { params: { api_key: TMDB_KEY } }
    );

    return res.data.cast.slice(0, 10).map((actor: any) => ({
      name: actor.name,
      character: actor.character,
      profile_path: actor.profile_path,
    }));
  } catch {
    return [];
  }
};

const fetchMovieDetails = async (movieId: number) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      { params: { api_key: TMDB_KEY } }
    );
    return res.data;
  } catch {
    return null;
  }
};

const fetchTrailer = async (movieId: number) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      {
        params: {
          api_key: TMDB_KEY,
          language: 'en-US'
        }
      }
    );

    const trailer = res.data.results.find(
      (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
    );

    return trailer?.key || null;
  } catch {
    return null;
  }
};

const main = async () => {
  await mongoose.connect(MONGO_URI);
  const first = await fetchPage(1);
  const totalPages = Math.min(first.total_pages, MAX_PAGES);
  for (let page = 1; page <= totalPages; page++) {
    const { results } = await fetchPage(page);
    for (const item of results) {
      const keywords = await fetchKeywords(item.id);
      const platforms = await fetchPlatforms(item.id);
      const cast = await fetchCast(item.id);
      const details = await fetchMovieDetails(item.id);
      const trailer_key = await fetchTrailer(item.id);

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
            runtime: details?.runtime || null,
            trailer_key,
            platforms,
            cast,
            raw: item,
          },
        },
        { upsert: true }
      );
    }

    await new Promise((res) => setTimeout(res, 500));
  }
  // Importer les films manuels
  if (MANUAL_TMDB_IDS.length > 0) {
    for (const tmdbId of MANUAL_TMDB_IDS) {
      try {
        const keywords = await fetchKeywords(tmdbId);
        const platforms = await fetchPlatforms(tmdbId);
        const cast = await fetchCast(tmdbId);
        const details = await fetchMovieDetails(tmdbId);
        const trailer_key = await fetchTrailer(tmdbId);

        await Film.updateOne(
          { tmdb_id: tmdbId },
          {
            $set: {
              tmdb_id: tmdbId,
              title: details?.title,
              original_title: details?.original_title,
              overview: details?.overview,
              release_date: details?.release_date,
              popularity: details?.popularity,
              vote_average: details?.vote_average,
              vote_count: details?.vote_count,
              genre_ids: details?.genre_ids || [],
              poster_path: details?.poster_path,
              keywords,
              runtime: details?.runtime || null,
              trailer_key,
              platforms,
              cast,
              raw: details,
            },
          },
          { upsert: true }
        );
      } catch (err) {
        console.error(`❌ Erreur pour le film ${tmdbId}:`, err);
      }
    }
  }
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
