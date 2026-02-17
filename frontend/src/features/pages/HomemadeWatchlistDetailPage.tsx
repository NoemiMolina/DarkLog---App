import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { IoSkull } from "react-icons/io5";
import RatingSkulls from "../../components/HomePageComponents/RatingSkulls";
import { API_URL } from "../../config/api";

interface Movie {
  _id: string;
  tmdb_id?: number;
  title: string;
  poster_path?: string;
  vote_average?: number;
}

interface Watchlist {
  _id: string;
  title: string;
  description?: string;
  posterPath?: string;
  movies: Movie[];
}

const HomemadeWatchlistDetailPage: React.FC = () => {
  const { watchlistId } = useParams<{ watchlistId: string }>();
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<Watchlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id;

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch(
          `${API_URL}/homemade-watchlists/${watchlistId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch watchlist");
        }
        const data = await response.json();
        setWatchlist(data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    if (watchlistId) {
      fetchWatchlist();
    }
  }, [watchlistId]);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleSave = async () => {
    if (!userId) {
      showMessage("⚠️ Please sign in to save");
      return;
    }

    if (rating === 0 && comment === "") {
      showMessage("⚠️ Please add a rating or comment");
      return;
    }

    try {
      if (rating > 0) {
        const rateRes = await fetch(`${API_URL}/homemade-watchlists/rate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId,
            watchlistId,
            rating,
          }),
        });

        if (!rateRes.ok) {
          throw new Error("Failed to save rating");
        }
      }

      if (comment.trim()) {
        const commentRes = await fetch(
          `${API_URL}/homemade-watchlists/comment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              userId,
              watchlistId,
              comment,
            }),
          }
        );

        if (!commentRes.ok) {
          throw new Error("Failed to save comment");
        }
      }

      showMessage("✔ Successfully saved!");
      setRating(0);
      setComment("");
    } catch (err) {
      console.error(err);
      showMessage("❌ Error saving.");
    }
  };

  const handleAddToWatchlist = async () => {
    if (!userId) {
      showMessage("⚠️ Please sign in to add to watchlist");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/homemade-watchlists/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId,
          watchlistId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        showMessage(`❌ ${errorData.message || "Error adding to watchlist"}`);
        return;
      }

      showMessage("✔ Added to your watchlists!");
    } catch (err) {
      console.error(err);
      showMessage("❌ Error adding to watchlist.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading...
      </div>
    );
  }

  if (!watchlist) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Watchlist not found</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
          >
            <ArrowLeft size={20} />
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-400 mb-2">
            {watchlist.title}
          </h1>
          {watchlist.description && (
            <p className="text-gray-400 text-lg">{watchlist.description}</p>
          )}
        </div>

        {/* Movies Carousel */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Films</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {watchlist.movies.length === 0 ? (
                <p className="text-gray-400">
                  There's no movies in this watchlist.
                </p>
              ) : (
                watchlist.movies.map((movie) => (
                  <CarouselItem
                    key={movie._id}
                    className={
                      watchlist.movies.length === 1
                        ? "basis-full px-1 sm:px-2"
                        : "basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 px-1 sm:px-2"
                    }
                  >
                    <div className="relative group">
                      <img
                        onClick={() =>
                          navigate(
                            `/item/movie/${movie.tmdb_id || movie._id}`
                          )
                        }
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "https://placehold.co/200x300?text=No+Image"
                        }
                        alt={movie.title}
                        loading="lazy"
                        className="rounded-lg shadow-md transition object-contain w-full h-auto hover:opacity-80 cursor-pointer aspect-[2/3] hover:-translate-y-2 hover:opacity-15 hover:shadow-xl"
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                        <div className="px-3 py-1 rounded bg-black bg-opacity-70 flex items-center gap-1">
                          <IoSkull className="text-yellow-400" size={16} />
                          {movie.vote_average != null
                            ? (Number(movie.vote_average) / 2).toFixed(1)
                            : "N/A"}
                          /5
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))
              )}
            </CarouselContent>

            {watchlist.movies.length > 1 && (
              <>
                <CarouselPrevious className="hidden sm:flex -left-12" />
                <CarouselNext className="hidden sm:flex -right-12" />
              </>
            )}
          </Carousel>
        </div>

        {/* Interaction Section */}
        <div className="space-y-6 max-w-2xl">
          <Button
            onClick={handleAddToWatchlist}
            className="w-full bg-gray-800/50 border border-purple-500/20 text-white hover:bg-gray-700/50"
          >
            ➕ Add to my watchlists
          </Button>

          <div>
            <h3 className="font-semibold mb-3 text-white text-lg">
              Rate this watchlist:
            </h3>
            <RatingSkulls
              key={rating}
              value={rating}
              onChange={(r) => {
                setRating(r);
              }}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-white text-lg">
              Write a comment:
            </h3>
            <Textarea
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
              rows={4}
              placeholder="Share your thoughts…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-gray-800/50 border border-purple-500/20 text-white hover:bg-gray-700/50"
          >
            Save rating & comment
          </Button>

          {message && (
            <p className="text-green-400 text-sm mt-2 text-center">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomemadeWatchlistDetailPage;
