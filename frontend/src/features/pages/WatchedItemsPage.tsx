import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Skull } from "lucide-react";
import { API_URL } from "../../config/api";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";

interface RatedMovie {
    tmdbMovieId: number;
    movieTitle: string;
    rating: number;
    review?: string;
    createdAt: Date;
    runtime: number;
    posterPath?: string;
}

interface RatedTvShow {
    tmdbTvShowId: number;
    tvShowTitle: string;
    rating: number;
    review?: string;
    createdAt: Date;
    total_runtime: number;
    posterPath?: string;
}

const WatchedItemsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [items, setItems] = useState<RatedMovie[] | RatedTvShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedYear, setExpandedYear] = useState<string | null>(null);
    const type = searchParams.get("type") || "movies"; // "movies" or "tvshows"

    const getPosterUrl = (posterPath: string | null | undefined): string => {
        if (!posterPath) {
            return "https://via.placeholder.com/300x450?text=No+Poster";
        }
        return posterPath.startsWith("http")
            ? posterPath
            : `https://image.tmdb.org/t/p/w500${posterPath}`;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                const user = storedUser ? JSON.parse(storedUser) : null;
                const userId = user?._id;
                const token = localStorage.getItem("token");

                if (!userId) {
                    navigate("/");
                    return;
                }

                const response = await fetch(`${API_URL}/users/${userId}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (type === "movies") {
                    setItems(data.ratedMovies || []);
                } else {
                    setItems(data.ratedTvShows || []);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [type, navigate]);

    const groupByYear = () => {
        const grouped: { [key: string]: any[] } = {};
        items.forEach((item: any) => {
            const year = new Date(item.createdAt).getFullYear().toString();
            if (!grouped[year]) {
                grouped[year] = [];
            }
            grouped[year].push(item);
        });
        return Object.keys(grouped)
            .sort((a, b) => Number(b) - Number(a))
            .reduce((acc: { [key: string]: any[] }, year) => {
                // Sort items within each year by createdAt (newest first)
                acc[year] = grouped[year].sort((a: any, b: any) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                return acc;
            }, {});
    };

    const getTitle = () => {
        return type === "movies" ? "🎬 Movies Watched" : "📺 TV Shows Watched";
    };

    const groupedItems = groupByYear();

    return (
        <div className="min-h-screen bg-[#1A1A1A] text-white p-4 sm:p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-6"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>
                <h1 className="text-4xl font-bold text-purple-400">{getTitle()}</h1>
                <p className="text-gray-400 mt-2">
                    {items.length} {type === "movies" ? "movies" : "shows"} watched
                </p>
            </div>

            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <p className="text-center py-8">Loading...</p>
                ) : items.length === 0 ? (
                    <p className="text-center py-12 text-gray-400">
                        No {type === "movies" ? "movies" : "shows"} watched yet
                    </p>
                ) : (
                    <div className="space-y-4">
                        {Object.entries(groupedItems).map(([year, yearItems]) => (
                            <div
                                key={year}
                                className="bg-[#2A2A2A] rounded-lg overflow-hidden border border-purple-500/20"
                            >
                                <button
                                    onClick={() =>
                                        setExpandedYear(expandedYear === year ? null : year)
                                    }
                                    className="w-full flex items-center justify-between p-4 hover:bg-[#333333] transition-colors"
                                >
                                    <h3 className="text-lg font-semibold text-purple-400">
                                        {year} ({yearItems.length})
                                    </h3>
                                    <ChevronDown
                                        size={20}
                                        className={`transition-transform ${expandedYear === year ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {expandedYear === year && (
                                    <div className="px-4 pb-4 pt-2 border-t border-purple-500/10">
                                        <Carousel className="w-full">
                                            <CarouselContent className="-ml-2">
                                                {yearItems.map((item: any) => (
                                                    <CarouselItem
                                                        key={`${type === "movies" ? item.tmdbMovieId : item.tmdbTvShowId}-${item.createdAt}`}
                                                        className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-2"
                                                    >
                                                        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden border border-purple-500/10 h-full flex flex-col hover:border-purple-500/40 transition-colors">
                                                            <div className="relative w-full aspect-[2/3] bg-[#2A2A2A] flex items-center justify-center overflow-hidden">
                                                                <img
                                                                    src={getPosterUrl(item.poster_path)}
                                                                    alt={type === "movies" ? item.movieTitle : item.tvShowTitle}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>

                                                            <div className="p-3 space-y-2 flex-1 flex flex-col">
                                                                {item.rating > 0 && (
                                                                    <div className="text-yellow-400 text-xs font-medium flex items-center gap-1">
                                                                        <Skull size={14} /> {item.rating}/5
                                                                    </div>
                                                                )}

                                                                {item.review && (
                                                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                                                                        "{item.review}"
                                                                    </p>
                                                                )}

                                                                <div className="text-xs text-gray-500 pt-1">
                                                                    {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="hidden sm:flex -left-12" />
                                            <CarouselNext className="hidden sm:flex -right-12" />
                                        </Carousel>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchedItemsPage;
