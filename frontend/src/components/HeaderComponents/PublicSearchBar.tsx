import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Search } from "lucide-react";
import ItemDialog from "../HomePageComponents/ItemDialog";

const PublicSearchBar: React.FC = () => {
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

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsVisible(false);
      return;
    }

    const fetchMoviesAndTVShows = async () => {
      try {
        const encoded = encodeURIComponent(query);
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

        const merged = Array.from(mergedMap.values());
        setResults(merged);
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

    const debounce = setTimeout(fetchMoviesAndTVShows, 400);
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
              {results.map((item) => {
                const id =
                  item._id ??
                  item.id ??
                  `${item.type ?? "item"}-${item.title ?? item.name ?? Math.random()
                  }`;
                const type =
                  item.type ??
                  item.media_type ??
                  (item.title ? "movie" : "tv");

                const rawRating = item.vote_average ?? item.rating ?? null;
                const ratingStr = rawRating
                  ? (Number(rawRating) / 2).toFixed(1)
                  : "N/A";

                return (
                  <div
                    key={`${id}-${type}`}
                    className="bg-black bg-opacity-100 text-white p-3 
               rounded-md w-full border border-white/30 mb-2 last:mb-0 cursor-pointer hover:bg-white/10"
                    onClick={() => {
                      console.log("Clicked item:", item);
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
                      setIsVisible(false);
                      setQuery("");
                      setResults([]);
                    }}
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
                    <p className="text-yellow-400 mt-1">⭐ {ratingStr}/5</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>,
        document.body
      )
      : null;

  return (
    <>
      <div className="relative z-[9999] mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mt-[2rem] ml-4">
        <div className="relative z-[10000]">
          <InputGroup className="w-70">
            <InputGroupInput
              ref={inputRef}
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

        {dropdown}
      </div>

      {/* ⭐ ItemDialog rendu EN DEHORS du dropdown */}
      {dialogData.trigger && dialogData.item && dialogData.type && (
        <ItemDialog
          trigger={dialogData.trigger}
          item={dialogData.item}
          type={dialogData.type}
        />
      )}
    </>
  );
};

export default PublicSearchBar;
