import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pendingWatchlistService } from "../../services/pendingWatchlistService";
import { API_URL } from "../../config/api";
import { fetchWithCreds } from "../../config/fetchClient";
import RatingSkulls from "./RatingSkulls";

interface ItemCardProps {
  item: any;
  type: "movie" | "tvshow";
  onClose?: () => void;
}

const ItemCard = ({ item, type, onClose }: ItemCardProps) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?._id;

  const itemId = item.tmdb_id || item.id;
  const itemTitle = item.title || item.name;

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId || !itemId) return;

      try {
        const res = await fetchWithCreds(
          `${API_URL}/users/${userId}/items/${itemId}?type=${type}`,
        );

        if (res.ok) {
          const data = await res.json();
          setRating(data.myRating || 0);
          setReview(data.myReview || "");
        } else if (res.status === 403 || res.status === 401) {
          console.warn("⚠ Unauthorized access when loading user data");
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("❌ Error loading user data:", err);
      }
    };

    loadUserData();
  }, [userId, itemId, type]);

  const poster = item.poster_path
    ? item.poster_path.startsWith("http")
      ? item.poster_path
      : `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null;

  const releaseYear =
    type === "movie"
      ? item.release_date?.slice(0, 4)
      : item.first_air_date?.slice(0, 4);

  const showMessage = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleSave = async () => {
    if (!userId) {
      showMessage("⚠️ Please sign in to save");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      const res = await fetchWithCreds(
        `${API_URL}/users/${userId}/items/${itemId}/rating-review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            rating,
            reviewText: review,
            itemTitle,
          }),
        },
      );

      if (res.status === 403 || res.status === 401) {
        localStorage.removeItem("user");
        showMessage("⚠️ Session expired. Please sign in again.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to save");
      }

      showMessage("✔ Successfully saved!");

      setTimeout(() => {
        window.dispatchEvent(new Event("userDataUpdated"));
        if (onClose) {
          onClose();
        }
      }, 500);
    } catch (err) {
      console.error(err);
      showMessage("❌ Error saving.");
    }
  };

  const handleAddToWatchlist = async () => {
    const userId = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)?._id
      : null;
    if (!userId) {
      pendingWatchlistService.setPendingItem(item, type);
      navigate("/login");
      return;
    }
    const route =
      type === "movie"
        ? `${API_URL}/users/${userId}/watchlist/movie/${itemId}`
        : `${API_URL}/users/${userId}/watchlist/tvshow/${itemId}`;

    try {
      const res = await fetchWithCreds(route, {
        method: "POST",
        headers: {},
      });

      if (res.status === 403 || res.status === 401) {
        console.warn("⚠️ Token expired, saving item and redirecting...");

        localStorage.removeItem("user");

        pendingWatchlistService.setPendingItem(item, type);

        showMessage("⚠️ Session expired. Please sign in again.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ Error response:", errorData);
        showMessage(`❌ ${errorData.message || "Error adding to watchlist"}`);
        return;
      }
      const data = await res.json();
      console.log("🎉 Watchlist updated:", data);
      showMessage("🎬 Successfully added to watchlist!");
      setTimeout(() => {
        window.dispatchEvent(new Event("watchlistUpdated"));
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      console.error("❌ Error adding to watchlist:", err);
      showMessage("❌ Error adding to watchlist.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 mt-2  ">
      <div className="w-full md:w-1/3 flex justify-center">
        {poster ? (
          <img
            src={poster}
            alt={item.title || item.name}
            loading="lazy"
            className="rounded-lg xl:w-70 xl:h-100 xl:mt-25 xl:rounded-lg 2xl:w-70 2xl:h-100 2xl:mt-11 2xl:rounded-lg"
          />
        ) : (
          <div className="w-64 h-96 bg-gray-700 rounded-lg" />
        )}
      </div>

      <div className="w-full md:w-2/3 space-y-4">
        <p className="text-gray-300 italic">Release year : {releaseYear}</p>
        <p className="text-sm md:text-base leading-relaxed">{item.overview}</p>
        {item.trailer_key && (
          <div>
            <a
              href={`https://www.youtube.com/watch?v=${item.trailer_key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline font-semibold"
            >
              Trailer
            </a>
          </div>
        )}

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Main cast:</h3>

          {item.cast?.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {item.cast.slice(0, 10).map((actor: any) => (
                <div
                  key={actor._id || actor.name}
                  className="flex flex-col items-center w-20"
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "https://placehold.co/100x100?text=?"
                    }
                    alt={actor.name}
                    loading="lazy"
                    className="w-16 h-16 rounded-full object-cover border border-gray-600 shadow-md"
                  />

                  <p className="text-xs text-center mt-2 leading-tight">
                    {actor.name}
                  </p>

                  <p className="text-[10px] text-gray-400 text-center leading-tight">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No cast information available.
            </p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Available on:</h3>
          {item.platforms?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {item.platforms.map((p: any) => (
                <div
                  key={p.provider_id}
                  className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-lg"
                >
                  {p.logo_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
                      loading="lazy"
                      className="w-5 h-5"
                    />
                  )}
                  <span>{p.provider_name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Not available on any platform for now, sorry.
            </p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-1">Your rating:</h3>
          <RatingSkulls
            key={rating}
            value={rating}
            onChange={(r) => {
              console.log("Rating set:", r);
              setRating(r);
            }}
          />
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Write a review:</h3>
          <textarea
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm"
            rows={4}
            placeholder="Share your thoughts…"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4 md:justify-start justify-center">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-gray-800/50 border border-purple-500/20 text-white transition font-semibold text-white"
          >
            Save
          </button>

          <button
            onClick={handleAddToWatchlist}
            className="px-4 py-2 rounded-lg bg-gray-800/50 border border-purple-500/20 transition font-semibold text-white"
          >
            + Add to watchlist
          </button>
        </div>
        {message && <p className="text-green-400 text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default ItemCard;
