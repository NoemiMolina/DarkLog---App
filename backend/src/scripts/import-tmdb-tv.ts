import mongoose from "mongoose";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const TMDB_KEY = process.env.TMDB_API_KEY!;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/FearLogApp";
const KEYWORD_ID = 315058; // Mot-clé Horror pour les séries
const MAX_PAGES = 5;
const MANUAL_TMDB_IDS = [54671]; // cracra 

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
    trailer_key: String,

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

    episode_runtime: { type: Number, default: 0 },
    number_of_episodes: { type: Number, default: 0 },
    total_runtime: { type: Number, default: 0 },

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

const fetchTVShows = async (page: number) => {
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
};

const fetchKeywords = async (tvId: number) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/keywords`,
      { params: { api_key: TMDB_KEY } }
    );

    return (res.data?.results || []).map((k: any) => k.name.toLowerCase());
  } catch {
    return [];
  }
};

const fetchPlatforms = async (tvId: number) => {
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
};

const fetchCast = async (tvId: number) => {
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
};

const fetchSeasons = async (tvId: number) => {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/tv/${tvId}`, {
      params: { api_key: TMDB_KEY },
    });
    return {
      seasons: res.data.seasons || [],
      episode_runtime: res.data.episode_run_time?.[0] || 0,
      number_of_episodes: res.data.number_of_episodes || 0,
    };
  } catch {
    return {
      seasons: [],
      episode_runtime: 0,
      number_of_episodes: 0,
    };
  }
};

const fetchEpisodes = async (tvId: number, seasonNumber: number) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}`,
      { params: { api_key: TMDB_KEY } }
    );
    return res.data.episodes || [];
  } catch {
    return [];
  }
};

const fetchTrailer = async (tvId: number) => {
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/tv/${tvId}/videos`,
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
  const first = await fetchTVShows(1);
  const totalPages = Math.min(first.total_pages, MAX_PAGES);
  for (let p = 1; p <= totalPages; p++) {
    const pageData = await fetchTVShows(p);
    for (const item of pageData.results) {
      const keywords = await fetchKeywords(item.id);
      const platforms = await fetchPlatforms(item.id);
      const cast = await fetchCast(item.id);
      const trailer_key = await fetchTrailer(item.id);

      const seasonsRaw = await fetchSeasons(item.id);
      const { seasons: rawSeasons, episode_runtime, number_of_episodes } = seasonsRaw;
      const seasons: Season[] = [];
      const total_runtime = episode_runtime * number_of_episodes;

      for (const season of rawSeasons) {
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
            trailer_key: trailer_key,
            episode_runtime,
            number_of_episodes,
            total_runtime,
            seasons,
            raw: item,
          },
        },
        { upsert: true }
      );
    }

    await new Promise((r) => setTimeout(r, 300));
  }
  process.exit(0);
};

// Importer les séries manuelles
async function importManualTVShows() {
  if (MANUAL_TMDB_IDS.length > 0) {
    for (const tmdbId of MANUAL_TMDB_IDS) {
      try {
        const keywords = await fetchKeywords(tmdbId);
        const platforms = await fetchPlatforms(tmdbId);
        const cast = await fetchCast(tmdbId);
        const trailer_key = await fetchTrailer(tmdbId);

        const seasonsRaw = await fetchSeasons(tmdbId);
        const { seasons: rawSeasons, episode_runtime, number_of_episodes } = seasonsRaw;

        const seasons: Season[] = [];
        const total_runtime = episode_runtime * number_of_episodes;

        for (const season of rawSeasons) {
          const epsRaw = await fetchEpisodes(tmdbId, season.season_number);

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

        const detailsRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${tmdbId}`,
          { params: { api_key: TMDB_KEY } }
        );

        const details = detailsRes.data;

        await TVShow.updateOne(
          { tmdb_id: tmdbId },
          {
            $set: {
              tmdb_id: tmdbId,
              name: details.name,
              original_name: details.original_name,
              overview: details.overview,
              first_air_date: details.first_air_date,
              popularity: details.popularity,
              vote_average: details.vote_average,
              vote_count: details.vote_count,
              genre_ids: details.genre_ids || [],
              poster_path: details.poster_path,
              keywords,
              platforms,
              cast,
              trailer_key,
              episode_runtime,
              number_of_episodes,
              total_runtime,
              seasons,
              raw: details,
            },
          },
          { upsert: true }
        );
      } catch (err) {
        console.error(`❌ Erreur pour la série ${tmdbId}:`, err);
      }
    }
  }
}


main()
  .then(() => importManualTVShows())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
