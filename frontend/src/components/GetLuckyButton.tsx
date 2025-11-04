import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";

const GetLuckyButton: React.FC = () => {
    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFullOverview, setShowFullOverview] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/movies/random");
            if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
            const data = await res.json();
            setMovie(data);
        } catch (err) {
            console.error("Erreur :", err);
            setError("Impossible de récupérer un film aléatoire.");
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
            <Button
                onClick={handleClick}
                variant="outline"
                size="sm"
                className="button-text mt-3 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold z-10"
            >
                {loading ? "Loading..." : "Get Lucky"}
            </Button>

            {error && <p className="text-red-500 mt-3">{error}</p>}

            {movie && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                    <div className="relative p-4 bg-black rounded-md text-white w-95 text-center shadow-lg border border-white/80">
                        <button
                            onClick={() => setMovie(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
                            aria-label="Fermer"
                        >
                            <X size={18} />
                        </button>

                        {movie.poster_path && (
                            <img
                                src={getPosterUrl(movie.poster_path)}
                                alt={movie.title}
                                className="w-full h-auto max-h-80 object-contain rounded-md mb-2"
                            />
                        )}

                        <h2 className="text-lg font-semibold">{movie.title}</h2>
                        <p className="text-sm text-gray-300">{movie.genre}</p>
                        <p
                            className="text-sm text-gray-300 line-clamp-4 cursor-pointer hover:text-white transition"
                            onClick={() => setShowFullOverview(true)}
                            title="Clique pour lire la suite"
                        >
                            {movie.overview}
                        </p>

                        <p className="text-gray-300 mt-1">
                            ⭐{" "}
                            {movie.vote_average != null
                                ? (Number(movie.vote_average) / 2).toFixed(1)
                                : "N/A"}
                            /5
                        </p>
                    </div>
                </div>
            )}

            {showFullOverview && movie && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[60] px-4">
                    <div className="relative bg-black text-white p-6 rounded-lg max-w-lg w-full shadow-xl border border-white/80">
                        <button
                            onClick={() => setShowFullOverview(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
                        >
                            <X size={18} />
                        </button>
                        <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
                        <p className="text-sm text-gray-300">{movie.overview}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetLuckyButton;
