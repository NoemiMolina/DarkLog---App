import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { API_URL } from "../../config/api";
import { jwtDecode } from "jwt-decode";

interface Movie {
  _id: string;
  tmdb_id?: number;
  title: string;
  original_title?: string;
  poster_path: string | null;
  release_date?: string;
  popularity?: number;
  vote_average?: number;
}

const getPosterUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `https://image.tmdb.org/t/p/w500${path}`;
  if (
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg") ||
    path.endsWith(".png")
  ) {
    return `${API_URL}/uploads/${path}`;
  }
  return path;
};

interface TinderStyleCarouselProps {
  title: string;
  items: Movie[];
  type?: "movie" | "tvshow";
}

const TinderStyleCarousel = ({
  title,
  items,
  type = "movie",
}: TinderStyleCarouselProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [swipeDelta, setSwipeDelta] = useState(0);
  const [swiping, setSwiping] = useState(false);

  const token = localStorage.getItem("token");
  const userId = token ? jwtDecode<any>(token).id : null;
  const currentMovie = items[currentIndex];
  const addToWatchlist = async (movie: Movie) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add to watchlist");
        return;
      }
      const url = `${API_URL}/users/${userId}/watchlist/movie/${movie._id}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        console.log("✅ Movie added to watchlist successfully:", movie.title);
      } else {
        console.error("❌ Server error", response.statusText);
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setExitDirection("left");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
        setSwipeDelta(0);
        setSwiping(false);
      }, 300);
    },
    onSwipedRight: () => {
      addToWatchlist(currentMovie);
      setExitDirection("right");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
        setSwipeDelta(0);
        setSwiping(false);
      }, 300);
    },
    onSwiping: (eventData) => {
      setSwiping(true);
      setSwipeDelta(eventData.deltaX);
    },
    onSwiped: () => {
      if (!exitDirection) {
        setSwipeDelta(0);
        setSwiping(false);
      }
    },
    trackMouse: true,
    delta: 10,
  });

  if (!currentMovie || currentIndex >= items.length) {
    return (
      <section className="w-full px-4 py-6 mb-5 -mt-8 sm:mt-0">
        <h2
          className="text-sm font-bold text-white mb-5 tracking-wide sm:hidden"
          style={{ fontFamily: "'Metal Mania', serif !important" }}
        >
          {title}
        </h2>
        <div className="w-full h-80 flex items-center justify-center rounded-lg sm:hidden">
          <p className="text-gray-400">No more movies to swipe! 🎬</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 -mt-2 sm:mt-0 sm:translate-y-[-120px] overflow-hidden -mb-18">
      <h2
        className="text-sm sm:text-xl font-bold text-white mb-4 tracking-wide text-center"
        style={{ fontFamily: "'Metal Mania', serif" }}
      >
        {title}
      </h2>
      <div className="sm:hidden w-full flex flex-col items-center relative overflow-hidden">
        <div className="relative w-full max-w-xs overflow-hidden">
          {currentIndex + 1 < items.length && (
            <div
              className="absolute inset-0 w-full aspect-[2/3] rounded-lg overflow-hidden z-0 transform translate-y-3 scale-95"
              style={{
                opacity: 0.1 + (Math.abs(swipeDelta) / 100) * 0.9,
                transition: swiping ? "none" : "opacity 0.3s ease-out",
              }}
            >
              <img
                src={
                  items[currentIndex + 1].poster_path
                    ? getPosterUrl(items[currentIndex + 1].poster_path)
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={items[currentIndex + 1].title}
                loading="lazy"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          <div
            onClick={() => {
              const itemId = currentMovie.tmdb_id || currentMovie._id;
              navigate(`/item/${type}/${itemId}`);
            }}
            {...handlers}
            style={{
              transform: swiping
                ? `translateX(${swipeDelta}px)`
                : "translateX(0)",
              transition: swiping ? "none" : "transform 0.3s ease-out",
            }}
            className={`relative w-full max-w-xs aspect-[2/3] overflow-hidden rounded-lg cursor-grab active:cursor-grabbing z-10 touch-none ${
              exitDirection === "left" ? "opacity-0" : ""
            } ${exitDirection === "right" ? "opacity-0" : ""}`}
          >
            <img
              src={
                currentMovie.poster_path
                  ? getPosterUrl(currentMovie.poster_path)
                  : "https://placehold.co/200x300?text=No+Image"
              }
              alt={currentMovie.title}
              loading="lazy"
              className="w-full h-full object-contain rounded-lg"
            />
                {swipeDelta > 30 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="font-bold text-xl px-4 py-2 rounded-lg text-white"
                      style={{
                        backgroundColor: "rgba(0, 100, 0, 0.8)",
                        fontFamily: "'Metal Mania', serif",
                      }}
                    >
                      ✓ Add to watchlist
                    </div>
                  </div>
                )}
                {swipeDelta < -30 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className="font-bold text-xl px-4 py-2 rounded-lg text-white"
                      style={{
                        backgroundColor: "rgba(139, 0, 0, 0.8)",
                        fontFamily: "'Metal Mania', serif",
                      }}
                    >
                      ✗ Ignore
                    </div>
                  </div>
                )}
              </div>
        </div>
      </div>
    </section>
  );
};

export default TinderStyleCarousel;
