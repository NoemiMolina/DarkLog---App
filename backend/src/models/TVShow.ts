import mongoose from "mongoose";

// per episode
const episodeSchema = new mongoose.Schema({
    episode_number: Number,
    name: String,
    overview: String,
    air_date: String,
    vote_average: Number,
    vote_count: Number,
    ratings: [
        {
            userId: mongoose.Schema.Types.ObjectId,
            value: Number
        }
    ]
});

// per season
const seasonSchema = new mongoose.Schema({
    season_number: Number,
    name: String,
    overview: String,
    air_date: String,
    episodes: [episodeSchema],
});

// whole tv show
const tvShowSchema = new mongoose.Schema({
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
    episode_runtime: { type: Number, default: 0 }, 
    number_of_episodes: { type: Number, default: 0 }, 
    total_runtime: { type: Number, default: 0 }, 
    seasons: [seasonSchema],
    raw: Object,
}, { timestamps: true });

const TVShow = mongoose.model("tvshows", tvShowSchema);

export default TVShow;
