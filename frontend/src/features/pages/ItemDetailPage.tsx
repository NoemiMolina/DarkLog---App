import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import { fetchWithCreds } from "../../config/fetchClient";
import ItemCard from "../../components/HomePageComponents/ItemCard";
import { ArrowLeft, Loader } from "lucide-react";

const ItemDetailPage: React.FC = () => {
  const { type, id } = useParams<{ type: "movie" | "tvshow"; id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!type || !id) return;

      try {
        setLoading(true);
        setError(null);

        const endpoint =
          type === "movie"
            ? `${API_URL}/movies/${id}`
            : `${API_URL}/tvShows/${id}`;

        const response = await fetchWithCreds(endpoint);

        if (!response.ok) {
          const text = await response.text();
          console.log("📍 Response body:", text);
          throw new Error(`Failed to fetch ${type} details`);
        }

        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error("❌ Error fetching item:", err);
        setError(err instanceof Error ? err.message : "Failed to load item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [type, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={40} />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Item not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
        {item.title || item.name}
      </h1>

      <ItemCard
        item={item}
        type={type || "movie"}
        onClose={() => navigate(-1)}
      />
    </div>
  );
};

export default ItemDetailPage;
