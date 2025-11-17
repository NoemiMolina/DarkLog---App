import mongoose from "mongoose";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const TMDB_KEY = process.env.TMDB_API_KEY!;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/HorrorDB";
const KEYWORD_ID = 315058; // Mot-clé Horror pour les séries
const MAX_PAGES = 15;

interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  air_date: string;
  vote_average: number;
  vote_count: number;
  ratings: { userId: mongoose.Types.ObjectId; value: number }[];
}

interface Season {
  season_number: number;
  name: string;
  overview: string;
  air_date: string;
  episodes: Episode[];
}

const tvSchema = new mongoose.Schema(
  {
    tmdb_id: { type: Number, unique: true },
    name: String,
    original_name: String,
    overview: String,
    first_air_date: String,
    popularity: Number,
    vote_average: Number,
    vote_count: Number,
    genre_ids: [Number],
    poster_path: String,
    keywords: [String],

    cast: [
      {
        name: String,
        character: String,
        profile_path: String,
      },
    ],

    platforms: [
      {
        provider_id: Number,
        provider_name: String,
        logo_path: String,
      },
    ],

    seasons: [
      new mongoose.Schema(
        {
          season_number: Number,
          name: String,
          overview: String,
          air_date: String,
          episodes: [
            new mongoose.Schema(
              {
                episode_number: Number,
                name: String,
                overview: String,
                air_date: String,
                vote_average: Number,
                vote_count: Number,
                ratings: [
                  { userId: mongoose.Schema.Types.ObjectId, value: Number },
                ],
              },
              { _id: false }
            ),
          ],
        },
        { _id: false }
      ),
    ],

    raw: Object,
  },
  { timestamps: true }
);

const TVShow = mongoose.model("tvshows", tvSchema);

async function fetchTVShows(page: number) {
  return axios
    .get("https://api.themoviedb.org/3/discover/tv", {
      params: {
        api_key: TMDB_KEY,
        with_keywords: KEYWORD_ID,
        sort_by: "popularity.desc",
        page,
      },
    })
    .then((r) => r.data);
}

async function fetchKeywords(tvId: number) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/keywords`,
      { params: { api_key: TMDB_KEY } }
    );

    return (res.data?.results || []).map((k: any) => k.name.toLowerCase());
  } catch {
    return [];
  }
}

async function fetchPlatforms(tvId: number) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/watch/providers`,
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
}

async function fetchCast(tvId: number) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/credits`,
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
}

async function fetchSeasons(tvId: number) {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/tv/${tvId}`, {
      params: { api_key: TMDB_KEY },
    });
    return res.data.seasons || [];
  } catch {
    return [];
  }
}

async function fetchEpisodes(tvId: number, seasonNumber: number) {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}`,
      { params: { api_key: TMDB_KEY } }
    );
    return res.data.episodes || [];
  } catch {
    return [];
  }
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Connecté à MongoDB pour TV shows");

  const first = await fetchTVShows(1);
  const totalPages = Math.min(first.total_pages, MAX_PAGES);

  console.log(`Importing ${totalPages} pages...`);

  for (let p = 1; p <= totalPages; p++) {
    console.log(`➡️ Fetch page ${p}`);
    const pageData = await fetchTVShows(p);

    for (const item of pageData.results) {
      const keywords = await fetchKeywords(item.id);
      const platforms = await fetchPlatforms(item.id);
      const cast = await fetchCast(item.id);

      const seasonsRaw = await fetchSeasons(item.id);
      const seasons: Season[] = [];

      for (const season of seasonsRaw) {
        const epsRaw = await fetchEpisodes(item.id, season.season_number);

        const episodes: Episode[] = epsRaw.map((ep: any) => ({
          episode_number: ep.episode_number,
          name: ep.name,
          overview: ep.overview,
          air_date: ep.air_date,
          vote_average: ep.vote_average,
          vote_count: ep.vote_count,
          ratings: [],
        }));

        seasons.push({
          season_number: season.season_number,
          name: season.name,
          overview: season.overview,
          air_date: season.air_date,
          episodes,
        });
      }

      await TVShow.updateOne(
        { tmdb_id: item.id },
        {
          $set: {
            tmdb_id: item.id,
            name: item.name,
            original_name: item.original_name,
            overview: item.overview,
            first_air_date: item.first_air_date,
            popularity: item.popularity,
            vote_average: item.vote_average,
            vote_count: item.vote_count,
            genre_ids: item.genre_ids,
            poster_path: item.poster_path,
            keywords,
            platforms,
            cast,
            seasons,
            raw: item,
          },
        },
        { upsert: true }
      );
    }

    await new Promise((r) => setTimeout(r, 300)); 
  }

  console.log("🎉 Import TV shows terminé !");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
