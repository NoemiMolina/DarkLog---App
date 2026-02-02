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
  isSatirical?: boolean;
}

interface NewsProps {
  newsCarouselClassName?: string;
}

const News = ({ newsCarouselClassName = "" }: NewsProps) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selected, setSelected] = useState<NewsArticle | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/news`)
      .then(res => res.json())
      .then(setNews)
      .catch(console.error);
  }, []);

  return (
    <section className="2xl:translate-y-0 2xl:mb-20">
      <h2
        className="text-xl mt-10 text-center text-white 2xl:text-xl 2xl:-translate-y-[30px] font-bold mb-4 tracking-wide 2xl:text-center"
        style={{ fontFamily: "'Metal Mania', serif" }}
      >
        Latest news
      </h2>

      <div className="mt-8">
        <Carousel
          className={`w-full -mt-5 overflow-x-auto scroll-smooth ${newsCarouselClassName}`}
        >

          <CarouselContent className="gap-6 lg:-translate-x-[20px]">
            {news.map((article, idx) => (
              <CarouselItem
                key={article._id}
                className={`max-w-[300px] cursor-pointer group bg-gray-500/20 p-3 rounded-lg hover:bg-gray-600 transition 2xl:max-w-[350px] 2xl:max-h-[450px] ${idx === 0 ? 'ml-9 lg:ml-13' : ''}`}
                onClick={() => setSelected(article)}
              >
                <img
                  src={article.coverImage}
                  className="rounded-lg mb-4 aspect-video object-cover group-hover:opacity-80 transition"
                />
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-200">
                    Published on {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  {article.isSatirical && (
                    <span className="text-[0.65rem] text-red-700 italic font-normal">(satirical)</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  {article.title}
                </h3>
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
                <DialogTitle>
                  <span className="flex items-center gap-2">
                    {selected.title}
                    {selected.isSatirical && (
                      <span className="text-xs text-red-700 font-semibold">(satirical)</span>
                    )}
                  </span>
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-200">
                    Published on {new Date(selected.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </DialogHeader>

              <img
                src={selected.coverImage}
                className="rounded-lg my-4 object-cover max-h-[100%] w-full"
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
