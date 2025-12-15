import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import ItemDialog from "../HomePageComponents/ItemDialog";
import AuthRequiredDialog from "./AuthRequiredDialog";
import { pendingWatchlistService } from "../../services/pendingWatchlistService";

const PublicSearchBar: React.FC = () => {
  const location = useLocation();
  const [isAddingToWatchlist, setIsAddingToWatchlist] = useState(false);
  const isForumPage = location.pathname === "/forum";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
    bottom: number;
  } | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const [dialogData, setDialogData] = useState<{
    trigger: React.ReactNode | null;
    item: any;
    type: "movie" | "tv" | null;
  }>({ trigger: null, item: null, type: null });

  const [authDialogState, setAuthDialogState] = useState<{
    isOpen: boolean;
    itemTitle: string;
  }>({ isOpen: false, itemTitle: '' });

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsVisible(false);
      return;
    }

    const fetchData = async () => {
      try {
        const encoded = encodeURIComponent(query);

        if (isForumPage) {
          const response = await fetch(`http://localhost:5000/forum/posts/search?q=${encoded}`);
          const data = response.ok ? await response.json() : { posts: [] };
          setResults(data.posts || []);
        } else {
          const [moviesRes, tvRes] = await Promise.all([
            fetch(`http://localhost:5000/search?query=${encoded}&type=movie`),
            fetch(`http://localhost:5000/search?query=${encoded}&type=tv`),
          ]);

          const movies = moviesRes.ok ? await moviesRes.json() : [];
          const tvs = tvRes.ok ? await tvRes.json() : [];
          const mergedMap = new Map<string | number, any>();
          [...movies, ...tvs].forEach((item: any) => {
            const id = item._id ?? item.id;
            if (id != null && !mergedMap.has(id)) mergedMap.set(id, item);
          });

          setResults(Array.from(mergedMap.values()));
        }

        setIsVisible(true);

        const r = inputRef.current?.getBoundingClientRect();
        if (r)
          setRect({
            top: r.top,
            left: r.left,
            width: r.width,
            bottom: r.bottom,
          });
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setIsVisible(false);
      }
    };

    const debounce = setTimeout(fetchData, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  useEffect(() => {
    const updateRect = () => {
      const r = inputRef.current?.getBoundingClientRect();
      if (r)
        setRect({
          top: r.top,
          left: r.left,
          width: r.width,
          bottom: r.bottom,
        });
    };
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, []);

  useEffect(() => {
    if (dialogData.trigger && triggerRef.current) {
      triggerRef.current.click();
    }
  }, [dialogData]);

  const handleAddToWatchlist = async (item: any, e: React.MouseEvent) => {
    e.stopPropagation();

    const type = item.type ?? item.media_type ?? (item.title ? "movie" : "tv");
    const title = item.title || item.name;
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');

    if (!token) {
      pendingWatchlistService.setPendingItem(item, type);
      setAuthDialogState({ isOpen: true, itemTitle: title });
      return;
    }

    setIsAddingToWatchlist(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user?._id;

      if (!userId) {
        throw new Error('User ID not found');
      }

      const itemId = item.tmdb_id || item.id;
      const route = type === "movie"
        ? `http://localhost:5000/users/${userId}/watchlist/movie/${itemId}`
        : `http://localhost:5000/users/${userId}/watchlist/tvshow/${itemId}`;

      const response = await fetch(route, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userToken');
        pendingWatchlistService.setPendingItem(item, type);
        setAuthDialogState({ isOpen: true, itemTitle: title });
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add to watchlist');
      }

      alert(`"${title}" added to your watchlist!`);
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
      alert('Failed to add to watchlist. Please try again.');
    } finally {
      setIsAddingToWatchlist(false);
    }
  };


  const handleResultClick = (item: any) => {
    console.log("Clicked item:", item);
    if (isForumPage) {
      window.location.hash = `post-${item._id}`;
      setTimeout(() => {
        const postElement = document.getElementById(`post-${item._id}`);
        if (postElement) {
          postElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      const type = item.type ?? item.media_type ?? (item.title ? "movie" : "tv");
      setDialogData({
        trigger: (
          <div
            ref={triggerRef}
            style={{ width: 1, height: 1 }}
            className="invisible"
          />
        ),
        item,
        type,
      });
    }

    setIsVisible(false);
    setQuery("");
    setResults([]);
  };

  const renderDropdownContent = () => {
    if (isForumPage) {
      return results.map((post) => {
        const author = post.author || {};
        const authorName = author.UserPseudo || author.username || author.UserFirstName || 'Unknown';
        const authorPic = author.UserProfilePicture;

        return (
          <div
            key={post._id}
            className="bg-black bg-opacity-100 text-white p-3 
              rounded-md w-full border border-white/30 mb-2 last:mb-0 cursor-pointer hover:bg-white/10"
            onClick={() => handleResultClick(post)}
          >
            <div className="flex items-center gap-2 mb-2">
              {authorPic ? (
                <img
                  src={authorPic.startsWith("http")
                    ? authorPic
                    : `http://localhost:5000/${authorPic}`}
                  alt={authorName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm font-semibold">{authorName}</span>
            </div>
            {post.title && (
              <h4 className="text-white font-bold text-sm mb-1">{post.title}</h4>
            )}
            <p className="text-sm text-gray-300 line-clamp-3">
              {post.content || 'No content'}
            </p>

            <div className="flex gap-3 mt-2 text-xs text-gray-400">
              <span>❤️ {post.likes?.length || 0}</span>
              <span>💬 {post.comments?.length || 0}</span>
            </div>
          </div>
        );
      });
    } else {
      return results.map((item) => {
        const id = item._id ?? item.id ?? `${item.type ?? "item"}-${item.title ?? item.name ?? Math.random()}`;
        const type = item.type ?? item.media_type ?? (item.title ? "movie" : "tv");
        const rawRating = item.vote_average ?? item.rating ?? null;
        const ratingStr = rawRating ? (Number(rawRating) / 2).toFixed(1) : "N/A";

        return (
          <div
            key={`${id}-${type}`}
            className="bg-black bg-opacity-100 text-white p-3 
              rounded-md w-full border border-white/30 mb-2 last:mb-0 hover:bg-white/10 relative group"
          >
            <div onClick={() => handleResultClick(item)} className="cursor-pointer">
              <h3 className="text-sm font-semibold">{item.title || item.name}</h3>
              <p className="text-xs italic text-gray-400">
                {type === "movie" ? "🎬 Movie" : "📺 TV Show"}
              </p>
              <p className="text-sm text-gray-300 line-clamp-4">{item.overview}</p>
              <p className="text-yellow-400 mt-1">⭐ {ratingStr}/5</p>
            </div>

            <Button
              onClick={(e) => handleAddToWatchlist(item, e)}
              disabled={isAddingToWatchlist}
              variant="outline"
              className="absolute top-2 right-2 bg-purple-600 hover:bg-purple-700 
                         text-white rounded-full p-2 opacity-0 group-hover:opacity-100 
                         transition-opacity duration-200 disabled:opacity-50"
            >
              Add to watchlist
            </Button>
          </div>
        );
      });
    }
  };
  const dropdown =
    isVisible && rect
      ? createPortal(
        <div
          style={{
            position: "fixed",
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 999999,
          }}
          className="transition-all duration-200 ease-in-out"
        >
          {results.length > 0 && (
            <div
              className="bg-black bg-opacity-100 text-white rounded-md border border-white/80 
                  shadow-2xl p-3 max-h-[15rem] overflow-y-auto modern-scrollbar pointer-events-auto xl:max-h-[25rem]"
            >
              {renderDropdownContent()}
            </div>
          )}
        </div>,
        document.body
      )
      : null;

  const placeholder = isForumPage
    ? "Search posts by keywords..."
    : "Search movies & TV shows...";

  return (
    <>
      <div className="relative z-[9999] mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-[2rem] ml-4">
        <div className="relative z-[10000]">
          <InputGroup className="w-70">
            <InputGroupInput
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-60"
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {dropdown}
      </div>
      {dialogData.trigger && dialogData.item && dialogData.type && (
        <ItemDialog
          trigger={dialogData.trigger}
          item={dialogData.item}
          type={dialogData.type}
        />
      )}
      <AuthRequiredDialog
        isOpen={authDialogState.isOpen}
        onClose={() => setAuthDialogState({ isOpen: false, itemTitle: '' })}
        itemTitle={authDialogState.itemTitle}
      />
    </>
  );
};

export default PublicSearchBar;