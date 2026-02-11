import { useState, useEffect } from "react";
import { API_URL } from "../config/api";

interface Watchlist {
  _id: string;
  title: string;
  description?: string;
  posterPath?: string;
  movies: any[];
  createdAt: string;
}
let cachedWatchlists: Watchlist[] | null = null;
let fetchPromise: Promise<Watchlist[]> | null = null;

export const useWatchlists = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedWatchlists) {
      setWatchlists(cachedWatchlists);
      setLoading(false);
      return;
    }
    if (fetchPromise) {
      fetchPromise
        .then((data) => {
          setWatchlists(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
      return;
    }

    const fetch_watchlists = async () => {
      try {
        const response = await fetch(`${API_URL}/homemade-watchlists`);
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data: Watchlist[] = await response.json();
        cachedWatchlists = data;
        setWatchlists(data);
        setLoading(false);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMsg);
        setLoading(false);
        throw err;
      }
    };

    fetchPromise = fetch_watchlists();
    fetchPromise
      .then(() => {
        fetchPromise = null;
      })
      .catch(() => {
        fetchPromise = null;
      });
  }, []);

  return { watchlists, loading, error };
};
