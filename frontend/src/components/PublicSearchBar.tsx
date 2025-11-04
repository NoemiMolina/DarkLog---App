import React, { useState, useEffect } from "react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../components/ui/input-group"
import { Search } from "lucide-react"


const PublicSearchBar: React.FC = () => {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);


    useEffect(() => {
        if (query.trim().length === 0) {
            setResults([]);
            return;
        }

        const fetchMovies = async () => {
            const res = await fetch(`http://localhost:5000/search?query=${query}`);
            const data = await res.json();
            setResults(data);
        };

        const debounce = setTimeout(fetchMovies, 400);
        return () => clearTimeout(debounce);
    }, [query]);

    return (
       <div className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-[2rem] ml-4">
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

            <div className="grid grid-cols-2 gap-4 mt-4">
                {results.map((movie) => (
                    <div
                        key={movie._id}
                        className="bg-black text-white p-3 rounded-md text-center w-60 mt-2 border border-white/80"
                    >
                        <h3 className="text-sm font-semibold">{movie.title}</h3>
                        <p className="text-sm text-gray-300 line-clamp-4">{movie.overview}</p>
                        <p className="text-yellow-400 mt-1">⭐ {movie.vote_average != null ? (Number(movie.vote_average) / 2).toFixed(1) : "N/A"}/5</p>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default PublicSearchBar;
