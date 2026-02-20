interface PendingWatchlistItem {
  id: number;
  type: "movie" | "tvshow";
  title: string;
  poster_path?: string;
  timestamp: number;
}

const STORAGE_KEY = "fearlog_pending_watchlist";
const EXPIRY_TIME = 30 * 60 * 1000;

export const pendingWatchlistService = {
  setPendingItem: (item: any, type: "movie" | "tvshow") => {
    const pendingItem: PendingWatchlistItem = {
      id: item.tmdb_id || item.id,
      type,
      title: item.title || item.name,
      poster_path: item.poster_path,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pendingItem));
  },

  getPendingItem: (): PendingWatchlistItem | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
      const item: PendingWatchlistItem = JSON.parse(stored);
      if (Date.now() - item.timestamp > EXPIRY_TIME) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return item;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  },

  clearPendingItem: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
