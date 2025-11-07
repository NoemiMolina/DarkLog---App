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
        if (!res.ok) throw new Error("Search request failed");
        const data = await res.json();
        setResults(data);
        setIsVisible(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setIsVisible(false);
      }
    };

    const debounce = setTimeout(fetchMoviesAndTVShows, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="relative isolate z-[300] mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-[2rem] ml-4">
      
      {/* Search Bar */}
      <div className="relative z-[350]">
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

      {/* Dropdown */}
      <div
        className={`absolute top-full left-0 right-0 mt-2 z-[400] transition-opacity transition-transform duration-200 ease-in-out
          ${isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        {results.length > 0 && (
          <div
            className="bg-black !bg-opacity-100 text-white rounded-md border border-white/80 shadow-2xl isolate
                        w-[15rem] sm:w-[25rem] md:w-[30rem] mx-auto p-3
                        max-h-[15rem] overflow-y-auto modern-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {results.map((movie) => (
              <div
                key={movie._id}
                className="bg-black !bg-opacity-100 text-white p-3 rounded-md w-full border border-white/30 mb-2 last:mb-0"
              >
                <h3 className="text-sm font-semibold">{movie.title || movie.name}</h3>
                <p className="text-xs italic text-gray-400">
                  {movie.type === "movie" ? "🎬 Movie" : "📺 TV Show"}
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
