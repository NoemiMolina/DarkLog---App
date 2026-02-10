import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { API_URL } from "../../config/api";
import ItemCard from "../../components/HomePageComponents/ItemCard";

export default function ItemPage() {
  const { itemId, type } = useParams<{ itemId: string; type: "movie" | "tvshow" }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!itemId || !type) return;

      try {
        const res = await fetch(`${API_URL}/${type}s/${itemId}`);
        if (!res.ok) throw new Error("Item not found");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex items-center justify-center">
        <p className="text-red-400 text-lg">{error || "Item not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 pt-20">
      {/* Close Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-colors text-white z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow mb-2">
          {item.title || item.name}
        </h1>
      </div>

      {/* Item Content */}
      <div className="max-w-6xl mx-auto px-4">
        <ItemCard
          item={item}
          type={type as "movie" | "tvshow"}
          onClose={() => navigate(-1)}
        />
      </div>
    </div>
  );
}
