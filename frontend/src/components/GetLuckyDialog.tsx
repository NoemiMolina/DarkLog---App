import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const GetLuckyDialog: React.FC = () => {
  const [movieOrTVShow, setMovieOrTVShow] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [open, setOpen] = useState(false);

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
    <div className="relative flex flex-col items-center mt-6">
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
            className="button-text mt-3 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold z-50"
          >
            {loading ? "Loading..." : "Get Lucky"}
          </Button>
        </DialogTrigger>

        <DialogContent
          className="z-[60] w-[15rem] bg-black text-white rounded-md border border-white/80 shadow-lg mr-25 translate-y-[-65%] md:ml-5 md:w-[30rem]"
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
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GetLuckyDialog;