import mongoose from "mongoose";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const TMDB_KEY = process.env.TMDB_API_KEY!;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/HorrorDB";
const KEYWORD_ID = 315058; // Horror keyword pour TV shows
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
      }
    ],
    platforms: [
      {
        provider_id: Number,
        provider_name: String,
        logo_path: String,
      }
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
  const url = `https://api.themoviedb.org/3/discover/tv`;

  const res = await axios.get(url, {
    params: {
      api_key: TMDB_KEY,
      with_keywords: KEYWORD_ID,
      sort_by: "popularity.desc",
      page,
    },
  });

  return res.data;
}

async function fetchSeasons(tvId: number) {
  const url = `https://api.themoviedb.org/3/tv/${tvId}`;
  const res = await axios.get(url, {
    params: { api_key: TMDB_KEY, append_to_response: "seasons" },
  });
  return res.data.seasons || [];
}

async function fetchEpisodes(tvId: number, seasonNumber: number) {
  const url = `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}`;
  const res = await axios.get(url, { params: { api_key: TMDB_KEY } });
  return res.data.episodes || [];
}

async function fetchKeywords(tvId: number): Promise<string[]> {
  try {
    const url = `https://api.themoviedb.org/3/tv/${tvId}/keywords`;
    const res = await axios.get(url, {
      params: { api_key: TMDB_KEY },
    });

    if (!res.data?.results) return [];
    return res.data.results.map((k: any) => k.name.toLowerCase());
  } catch {
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

async function fetchCast(tvId: number) {
  const url = `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${TMDB_KEY}`;
  try {
    const res = await axios.get(url);

    return res.data.cast.slice(0, 10).map((actor: any) => ({
      name: actor.name,
      character: actor.character,
      profile_path: actor.profile_path,
    }));
  } catch (err) {
    console.error("❌ Error fetching cast for TV show", tvId, err);
    return [];
  }
}


async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Connecté à MongoDB pour TV shows");

  const first = await fetchTVShows(1);
  const totalPages = Math.min(first.total_pages, MAX_PAGES);
  console.log(`total_pages API = ${first.total_pages}, fetch ${totalPages} pages...`);

  for (let p = 1; p <= totalPages; p++) {
    console.log(`Fetching page ${p}...`);
    const pageData = await fetchTVShows(p);

    for (const item of pageData.results) {

      const keywords = await fetchKeywords(item.id);
      const seasonsData = await fetchSeasons(item.id);
      const platforms = await fetchPlatforms("tv", item.id);
      const cast = await fetchCast(item.id);
      const seasons: Season[] = [];

      for (const season of seasonsData) {
        const episodesData = await fetchEpisodes(item.id, season.season_number);

        const episodes: Episode[] = episodesData.map((e: any) => ({
          episode_number: e.episode_number,
          name: e.name,
          overview: e.overview,
          air_date: e.air_date,
          vote_average: e.vote_average,
          vote_count: e.vote_count,
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

  console.log("Import TV shows ok with seasons and episodes finished.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
