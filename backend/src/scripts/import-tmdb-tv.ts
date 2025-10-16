import mongoose from 'mongoose';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const TMDB_KEY = process.env.TMDB_API_KEY!;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/HorrorDB';
const KEYWORD_ID = 315058; // Horror keyword pour TV shows
const MAX_PAGES = 20;

const tvSchema = new mongoose.Schema({
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
  raw: Object,
}, { timestamps: true });

const TVShow = mongoose.model('tvshows', tvSchema);

async function fetchPage(page: number) {
  const url = `https://api.themoviedb.org/3/discover/tv`;
  const res = await axios.get(url, {
    params: {
      api_key: TMDB_KEY,
      with_keywords: KEYWORD_ID,
      sort_by: 'popularity.desc',
      page
    }
  });
  return res.data;
}

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('Connecté à MongoDB pour TV shows');

  const first = await fetchPage(1);
  const totalPages = Math.min(first.total_pages, MAX_PAGES);
  console.log(`total_pages API = ${first.total_pages}, fetch ${totalPages} pages...`);

  for (const item of first.results) {
    await TVShow.updateOne({ tmdb_id: item.id }, {
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
        raw: item
      }
    }, { upsert: true });
  }

  for (let p = 2; p <= totalPages; p++) {
    console.log(`Fetching page ${p}...`);
    const pageData = await fetchPage(p);
    for (const item of pageData.results) {
      await TVShow.updateOne({ tmdb_id: item.id }, {
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
          raw: item
        }
      }, { upsert: true });
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('Import TV shows terminé.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
