import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "@radix-ui/react-separator";

interface NewsArticle {
  _id: string;
  title: string;
  coverImage: string;
  excerpt: string;
  content: string;
  publishedAt: string;
}

const News = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selected, setSelected] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/news`)
      .then(res => res.json())
      .then(setNews)
      .catch(console.error);
  }, []);

  return (
    <section className="max-w-[1400px] mx-auto px-4 text-white">
      <h2
        className="text-2xl  text-center"
        style={{ fontFamily: "'Metal Mania', serif" }}
      >
        Latest news
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map(article => (
          <div
            key={article._id}
            onClick={() => setSelected(article)}
            className="cursor-pointer group"
          >
            <img
              src={article.coverImage}
              className="rounded-lg mb-4 aspect-video object-cover group-hover:opacity-80 transition"
            />

            <p className="text-xs text-gray-400 mb-1">
              Published on{" "}
              {new Date(article.publishedAt).toLocaleDateString()}
            </p>

            <h3 className="text-lg font-semibold mb-2">
              {article.title}
            </h3>

            <p className="text-sm text-gray-300 line-clamp-3">
              {article.excerpt}
            </p>
          </div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-3xl text-white">
            <DialogHeader>
              <DialogTitle>{selected.title}</DialogTitle>
              <p className="text-xs text-gray-400">
                Published on{" "}
                {new Date(selected.publishedAt).toLocaleDateString()}
              </p>
            </DialogHeader>

            <img
              src={selected.coverImage}
              className="rounded-lg my-4"
            />

            <p className="whitespace-pre-line text-sm text-gray-200">
              {selected.content}
            </p>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};

export default News;
