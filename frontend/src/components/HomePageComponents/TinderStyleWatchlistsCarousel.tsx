import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { API_URL } from "../../config/api";
import { fetchWithCreds } from "../../config/fetchClient";

interface Movie {
  _id: string;
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
import { useWatchlists } from "../../hooks/useWatchlists";

const TinderStyleWatchlistsCarousel = () => {
  const { watchlists, loading } = useWatchlists();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [swipeDelta, setSwipeDelta] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [swipeDetected, setSwipeDetected] = useState(false);

  const currentWatchlist = watchlists[currentIndex];
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id;

  const addToWatchlist = async (watchlist: Watchlist) => {
    if (!userId) {
      return;
    }
    try {
      const res = await fetchWithCreds(`${API_URL}/homemade-watchlists/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          watchlistId: watchlist._id,
        }),
      });

      if (res.ok) {
        window.dispatchEvent(new Event("watchlistUpdated"));
      } else {
      }
    } catch (err) {}
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipeDetected(true);
      setExitDirection("left");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
        setSwipeDelta(0);
        setSwiping(false);
        setSwipeDetected(false);
      }, 300);
    },
    onSwipedRight: () => {
      setSwipeDetected(true);
      if (currentWatchlist) addToWatchlist(currentWatchlist);
      setExitDirection("right");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
        setSwipeDelta(0);
        setSwiping(false);
        setSwipeDetected(false);
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
  });

  if (loading) {
    return (
      <section className="w-full px-4 py-6 mb-5 -mt-8 sm:mt-0 sm:hidden">
        <h2
          className="text-sm sm:text-xl font-bold text-white mb-4 tracking-wide text-center"
          style={{ fontFamily: "'Metal Mania', serif" }}
        >
          Homemade Watchlists
        </h2>
        <div className="w-full h-80 flex items-center justify-center bg-[#2A2A2A] rounded-lg">
          <p className="text-gray-400">Loading…</p>
        </div>
      </section>
    );
  }

  if (!currentWatchlist || currentIndex >= watchlists.length) {
    return (
      <section className="w-full px-4 py-6 mb-5 -mt-8 sm:mt-0 sm:hidden">
        <h2
          className="text-sm sm:text-xl font-bold text-white mb-4 tracking-wide text-center"
          style={{ fontFamily: "'Metal Mania', serif" }}
        >
          Homemade Watchlists
        </h2>
        <div className="w-full h-80 flex items-center justify-center bg-[#2A2A2A] rounded-lg">
          <p className="text-gray-400">No more watchlists! 📋</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 py-9 mb-5 -mt-8 sm:hidden">
      <div
        className="-mt-3 mb-6 text-center text-xs text-gray-400"
        style={{ fontFamily: "'Metal Mania', serif" }}
      >
        <p>← Swipe LEFT to ignore, swipe RIGHT to add to your watchlist →</p>
        <p>CLICK to view watchlist details</p>
      </div>
      <h2
        className="text-sm font-bold text-white mb-7 tracking-wide text-center"
        style={{ fontFamily: "'Metal Mania', serif" }}
      >
        Homemade Watchlists
      </h2>
      <div className="w-full flex flex-col items-center">
        <div
          onClick={() => {
            // Only navigate if this wasn't a swipe action
            if (!swipeDetected) {
              navigate(`/homemade-watchlist/${currentWatchlist._id}`);
            }
          }}
          {...handlers}
          style={{
            transform: swiping
              ? `translateX(${swipeDelta}px)`
              : "translateX(0)",
            transition: swiping ? "none" : "transform 0.3s ease-out",
          }}
          className={`relative w-full h-80 bg-[#2A2A2A] rounded-xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 ${
            exitDirection === "left" ? "translate-x-full opacity-0" : ""
          } ${exitDirection === "right" ? "-translate-x-full opacity-0" : ""}`}
        >
          {currentWatchlist.posterPath && (
            <img
              src={`${API_URL}${currentWatchlist.posterPath}`}
              alt={currentWatchlist.title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 px-2 py-1 rounded text-white text-sm text-center truncate max-w-[140px]">
            {currentWatchlist.title}
          </div>
          {/* swipe right (green - Add to watchlist) */}
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
          {/* swipe left (red - Ignore) */}
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
    </section>
  );
};

export default TinderStyleWatchlistsCarousel;
