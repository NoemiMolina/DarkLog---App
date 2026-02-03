import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { pendingWatchlistService } from "../../services/pendingWatchlistService";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const GetLuckyDialog: React.FC = () => {
  const [movieOrTVShow, setMovieOrTVShow] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [open, setOpen] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  const navigate = useNavigate();

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setMovieOrTVShow(null);

    try {
      const isMovie = Math.random() < 0.5;
      const endpoint = isMovie
        ? "http://localhost:5000/movies/random"
        : "http://localhost:5000/tvshows/random";

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const data = await res.json();

      setMovieOrTVShow({ ...data, type: isMovie ? "movie" : "series" });
      setShowFullOverview(false);
      setOpen(true);
    } catch (err) {
      console.error("Erreur :", err);
      setError("Impossible de récupérer un contenu aléatoire.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async () => {
    if (!movieOrTVShow) return;
    setAddingToWatchlist(true);

    try {
      const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!)?._id : null;
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        const item = {
          _id: movieOrTVShow.id,
          title: movieOrTVShow.title || movieOrTVShow.name,
          poster_path: movieOrTVShow.poster_path,
          vote_average: movieOrTVShow.vote_average,
          overview: movieOrTVShow.overview,
          genre: movieOrTVShow.genre
        };
        pendingWatchlistService.setPendingItem(item, movieOrTVShow.type);
        navigate("/login");
        return;
      }

      const route = movieOrTVShow.type === "movie"
        ? `http://localhost:5000/users/${userId}/watchlist/movie/${movieOrTVShow.id}`
        : `http://localhost:5000/users/${userId}/watchlist/tvshow/${movieOrTVShow.id}`;

      const res = await fetch(route, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.status === 403 || res.status === 401) {
        console.warn("⚠️ Token expired, saving item and redirecting...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        const item = {
          _id: movieOrTVShow.id,
          title: movieOrTVShow.title || movieOrTVShow.name,
          poster_path: movieOrTVShow.poster_path,
          vote_average: movieOrTVShow.vote_average,
          overview: movieOrTVShow.overview,
          genre: movieOrTVShow.genre
        };
        pendingWatchlistService.setPendingItem(item, movieOrTVShow.type);

        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Error response:", errorData);
        setError(errorData.message || 'Error adding to watchlist');
        return;
      }

      const data = await res.json();
      console.log("🎉 Watchlist updated:", data);
      setError(null);
      window.dispatchEvent(new Event('watchlistUpdated'));

    } catch (err: any) {
      console.error("❌ Error adding to watchlist:", err);
      setError("❌ Error adding to watchlist.");
    } finally {
      setAddingToWatchlist(false);
    }
  };

  const getPosterUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return `https://image.tmdb.org/t/p/w500${path}`;
    if (path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".png")) {
      return `http://localhost:5000/uploads/${path}`;
    }
    return path;
  };

  return (
    <div className="relative flex flex-col items-center sm:mt-6">
      <Dialog open={open} onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setMovieOrTVShow(null);
          setShowFullOverview(false);
          setError(null);
        }
      }}>
        <DialogTrigger asChild>
          <Button
            onClick={handleClick}
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex button-text sm:mt-3 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold z-50"
          >
            {loading ? "Loading..." : "Get Lucky"}
          </Button>
        </DialogTrigger>

        <DialogTrigger asChild>
          <Button
            onClick={handleClick}
            variant="ghost"
            size="sm"
            className="sm:hidden text-white hover:bg-[#4C4C4C] p-2"
          >
            <GiPerspectiveDiceSixFacesRandom className="text-2xl w-6 h-6" />
          </Button>
        </DialogTrigger>

        <DialogContent
          className="z-[60] w-[90vw] sm:w-[30rem] bg-black text-white rounded-md border border-white/80 shadow-lg mr-25 translate-y-[-50%] md:ml-5"
        >
          <DialogHeader>
            <DialogTitle className="sr-only">Random pick</DialogTitle>
          </DialogHeader>

          <div
            className="p-5"
            style={{ maxHeight: "60vh", overflowY: "auto", WebkitOverflowScrolling: "touch" }}
          >
            {error && <p className="text-red-500 mb-2">{error}</p>}

            {!movieOrTVShow && !error && (
              <p className="text-sm text-gray-300">
                Get a random horror movie or TV show here !
              </p>
            )}

            {movieOrTVShow && (
              <div className="flex flex-col items-center w-full">
                {movieOrTVShow.poster_path && (
                  <img
                    src={getPosterUrl(movieOrTVShow.poster_path)}
                    alt={movieOrTVShow.title || movieOrTVShow.name}
                    className="w-full h-auto max-h-64 object-contain rounded-md mb-3"
                  />
                )}

                <h2 className="text-lg font-semibold text-center">
                  {movieOrTVShow.title || movieOrTVShow.name}
                </h2>
                <p className="text-sm text-gray-300 mb-2">
                  {movieOrTVShow.genre}{" "}
                  {movieOrTVShow.type === "series" ? "(TV Show)" : "(Movie)"}
                </p>

                <div
                  className={`text-sm text-gray-300 ${showFullOverview ? "" : "line-clamp-4"}`}
                  onClick={() => setShowFullOverview((s) => !s)}
                  title={showFullOverview ? "Cliquer pour réduire" : "Lire la suite"}
                  style={{ cursor: "pointer", width: "100%" }}
                >
                  {movieOrTVShow.overview}
                </div>

                <p className="text-gray-300 mt-2">
                  ⭐{" "}
                  {movieOrTVShow.vote_average != null
                    ? (Number(movieOrTVShow.vote_average) / 2).toFixed(1)
                    : "N/A"}
                  /5
                </p>
                <Button
                  onClick={handleAddToWatchlist}
                  disabled={addingToWatchlist}
                  className="mt-4 bg-white text-black hover:bg-gray-200 px-6 py-2 text-sm font-semibold"
                >
                  {addingToWatchlist ? "Adding..." : "Add to Watchlist"}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetLuckyDialog;