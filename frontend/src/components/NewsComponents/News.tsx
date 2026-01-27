import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "../../components/ui/carousel";

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
    <section className="xl:translate-y-0 xl:mb-20">
      <h2
        className="text-[1rem] text-center text-white"
        style={{ fontFamily: "'Metal Mania', serif" }}
      >
        Latest news
      </h2>

      <div className="mt-8">
        <Carousel className="w-full mt-8 overflow-x-auto scroll-smooth">
          <CarouselContent className="gap-6">
            {news.map((article, idx) => (
              <CarouselItem
                key={article._id}
                className={`max-w-[300px] cursor-pointer group bg-gray-500/20 p-3 rounded-lg hover:bg-gray-600 transition xl:max-w-[350px] xl:max-h-[450px] ${idx === 0 ? 'ml-9 xl:ml-50' : ''}`}
                onClick={() => setSelected(article)}
              >
                <img
                  src={article.coverImage}
                  className="rounded-lg mb-4 aspect-video object-cover group-hover:opacity-80 transition"
                />
                <p className="text-xs text-gray-200 mb-1">
                  Published on {new Date(article.publishedAt).toLocaleDateString()}
                </p>
                <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                <p className="text-sm text-gray-200 line-clamp-3">{article.excerpt}</p>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-3xl text-white bg-gray-500/40 rounded-lg p-6 sm:max-h-[80vh] sm:overflow-auto max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col h-full">
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <p className="text-xs text-gray-200">
                  Published on {new Date(selected.publishedAt).toLocaleDateString()}
                </p>
              </DialogHeader>

              <img
                src={selected.coverImage}
                className="rounded-lg my-4"
              />

              <div className="flex-1 overflow-y-auto">
                <p className="whitespace-pre-line text-sm text-gray-200">
                  {selected.content}
                </p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};

export default News;
