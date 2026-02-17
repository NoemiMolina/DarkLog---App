import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";
import AuthRequiredDialog from "./AuthRequiredDialog";
import { IoSkull } from "react-icons/io5";

interface PublicSearchBarProps {
  onResultSelected?: () => void;
  isVisibleMobile?: boolean;
}

const PublicSearchBar: React.FC<PublicSearchBarProps> = ({
  onResultSelected,
  isVisibleMobile = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const [authDialogState, setAuthDialogState] = useState<{
    isOpen: boolean;
    itemTitle: string;
  }>({ isOpen: false, itemTitle: "" });

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
          const response = await fetch(
            `${API_URL}/forum/posts/search?q=${encoded}`,
          );
          const data = response.ok ? await response.json() : { posts: [] };
          setResults(data.posts || []);
        } else {
          const [moviesRes, tvRes] = await Promise.all([
            fetch(`${API_URL}/search?query=${encoded}&type=movie`),
            fetch(`${API_URL}/search?query=${encoded}&type=tv`),
          ]);

          const movies = moviesRes.ok ? await moviesRes.json() : [];
          const tvs = tvRes.ok ? await tvRes.json() : [];
          const mergedMap = new Map<string | number, any>();
          [...movies, ...tvs].forEach((item: any) => {
            const id = item._id ?? item.id;
            if (id != null && !mergedMap.has(id)) mergedMap.set(id, item);
          });

          const limitedResults = Array.from(mergedMap.values()).slice(0, 10);
          setResults(limitedResults);
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

    const debounce = setTimeout(fetchData, 600);
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

  const handleResultClick = (item: any) => {
    if (isForumPage) {
      window.location.hash = `post-${item._id}`;
      setTimeout(() => {
        const postElement = document.getElementById(`post-${item._id}`);
        if (postElement) {
          postElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      const type =
        item.type ?? item.media_type ?? (item.title ? "movie" : "tvshow");
      const itemId = item.tmdb_id || item.id;
      navigate(`/item/${type}/${itemId}`);
    }

    setIsVisible(false);
    setQuery("");
    setResults([]);
    setTimeout(() => {
      onResultSelected?.();
    }, 100);
  };

  const renderDropdownContent = () => {
    if (isForumPage) {
      return results.map((post) => {
        const author = post.author || {};
        const authorName =
          author.UserPseudo ||
          author.username ||
          author.UserFirstName ||
          "Unknown";
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
                  src={
                    authorPic.startsWith("http")
                      ? authorPic
                      : `${API_URL}/${authorPic}`
                  }
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
              <h4 className="text-white font-bold text-sm mb-1">
                {post.title}
              </h4>
            )}
            <p className="text-sm text-gray-300 line-clamp-3">
              {post.content || "No content"}
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
        const id =
          item._id ??
          item.id ??
          `${item.type ?? "item"}-${item.title ?? item.name ?? Math.random()}`;
        const type =
          item.type ?? item.media_type ?? (item.title ? "movie" : "tv");
        const rawRating = item.vote_average ?? item.rating ?? null;
        const ratingStr = rawRating
          ? (Number(rawRating) / 2).toFixed(1)
          : "N/A";

        return (
          <div
            key={`${id}-${type}`}
            className="bg-black bg-opacity-100 text-white p-3 
              rounded-md w-full border border-white/30 mb-2 last:mb-0 hover:bg-white/10 relative group"
          >
            <div
              onClick={() => handleResultClick(item)}
              className="cursor-pointer"
            >
              <h3 className="text-sm font-semibold">
                {item.title || item.name}
              </h3>
              <p className="text-xs italic text-gray-400">
                {type === "movie" ? "🎬 Movie" : "📺 TV Show"}
              </p>
              <p className="text-sm text-gray-300 line-clamp-4">
                {item.overview}
              </p>
              <p className="text-yellow-400 mt-1">
                <IoSkull /> {ratingStr}/5
              </p>
            </div>
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
                  shadow-2xl p-3 max-h-[15rem] overflow-y-auto modern-scrollbar pointer-events-auto 2xl:max-h-[25rem]"
              >
                {renderDropdownContent()}
              </div>
            )}
          </div>,
          document.body,
        )
      : null;

  const placeholder = isForumPage
    ? "Search posts by keywords..."
    : "Search movies & TV shows...";

  return (
    <>
      <div
        className={`relative z-[9999] mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg 2xl:max-w-xl mt-[2rem] ml-4 ${isVisibleMobile ? "" : "sm:block hidden"}`}
      >
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
      <AuthRequiredDialog
        isOpen={authDialogState.isOpen}
        onClose={() => setAuthDialogState({ isOpen: false, itemTitle: "" })}
        itemTitle={authDialogState.itemTitle}
      />
    </>
  );
};

export default PublicSearchBar;
