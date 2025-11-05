import React, { useState, useEffect } from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../components/ui/input-group";
import { Search } from "lucide-react";

const PublicSearchBar: React.FC = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (query.trim().length === 0) {
            setResults([]);
            setIsVisible(false);
            return;
        }

        const fetchMoviesAndTVShows = async () => {
            try {
                const res = await fetch(`http://localhost:5000/search?query=${query}`);
                if (!res.ok) throw new Error("Erreur serveur");
                const data = await res.json();
                setResults(data);
                setIsVisible(true);
            } catch (error) {
                console.error("Erreur recherche :", error);
                setResults([]);
                setIsVisible(false);
            }
        };

        const debounce = setTimeout(fetchMoviesAndTVShows, 400);
        return () => clearTimeout(debounce);
    }, [query]);

    return (
        <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-[2rem] ml-4">
            <div className="relative z-50">
                <InputGroup className="w-70">
                    <InputGroupInput
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-60"
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            <div
  className={`absolute top-full left-0 right-0 mt-2 z-[9999] transition-all duration-300 ease-in-out 
  ${isVisible
    ? "opacity-100 translate-y-0 pointer-events-auto"
    : "opacity-0 -translate-y-2 pointer-events-none"
  }`}
>
  {results.length > 0 && (
    <div
      className="bg-black/95 text-white rounded-md border border-white/50 shadow-2xl backdrop-blur-md
                 w-[15rem] sm:w-[25rem] md:w-[30rem] mx-auto p-3
                 max-h-[15rem] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {results.map((movie) => (
        <div
          key={movie._id}
          className="bg-black text-white p-3 rounded-md w-full border border-white/30 mb-2 last:mb-0"
        >
          <h3 className="text-sm font-semibold">{movie.title || movie.name}</h3>
          <p className="text-xs italic text-gray-400">
            {movie.type === "movie" ? "🎬 Film" : "📺 Série"}
          </p>
          <p className="text-sm text-gray-300 line-clamp-4">{movie.overview}</p>
          <p className="text-yellow-400 mt-1">
            ⭐{" "}
            {movie.vote_average != null
              ? (Number(movie.vote_average) / 2).toFixed(1)
              : "N/A"}
            /5
          </p>
        </div>
      ))}
    </div>
  )}
</div>
        </div>

    );
};

export default PublicSearchBar;
