import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";
import ItemDialog from "./ItemDialog";
import { IoSkull } from "react-icons/io5";
import { API_URL } from '../../config/api';

interface Movie {
    _id: string;
    title: string;
    original_title?: string;
    poster_path: string | null;
    release_date?: string;
    popularity?: number;
    vote_average?: number;
}

const getPosterUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return `https://image.tmdb.org/t/p/w500${path}`;
    if (path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".png")) {
        return `${API_URL}/uploads/${path}`;
    }
    return path;
};

const CarouselItems = ({ title, items, type }: { title: string; items: Movie[]; type: "movie" | "tvshow" }) => (
    <section className="hidden sm:block 2xl:translate-y-0 2xl:mb-20">
        <h2 className="text-xl font-bold text-white mb-6 tracking-wide 2xl:translate-y-10 2xl:mb-2" style={{ fontFamily: "'Metal Mania', serif" }}>{title}</h2>
        <Carousel className="w-full max-w-[90%] mx-auto mt-8 2xl:mx-auto 2xl:max-w-[1500px] 2xl:mt-2">
            <CarouselContent>
                {items.length === 0 ? (
                    <p className="text-gray-400 2xl:translate-x-[20px]">Loading…</p>
                ) : (
                    items.map((movie, idx) => (
                        <CarouselItem
                            key={movie._id}
                            className={`basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/5 xl:basis-1/7 2xl:basis-1/8 2xl:mt-15 px-2 ${idx === 0 ? 'ml-4' : ''}`}
                        >
                            <div className="relative group" tabIndex={0}>
                                <ItemDialog
                                    item={movie}
                                    type={type}
                                    trigger={
                                        <img
                                            src={movie.poster_path ? getPosterUrl(movie.poster_path) : "https://via.placeholder.com/200x300?text=No+Image"}
                                            alt={movie.title}
                                            className="rounded-lg shadow-md transition-all duration-300 object-contain w-full h-auto 2xl:w-80 hover:opacity-15 cursor-pointer aspect-[2/3] hover:-translate-y-2 hover:shadow-xl"
                                        />
                                    }
                                />
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                                    <div className="text-white text-sm font-semibold px-3 py-1 rounded flex items-center gap-1 bg-black/70 backdrop-blur-sm">
                                        <IoSkull className="text-yellow-400" size={16} />
                                        {movie.vote_average != null
                                            ? (Number(movie.vote_average) / 2).toFixed(1)
                                            : "N/A"}
                                        /5
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))
                )}
            </CarouselContent>
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden" />
        </Carousel>
    </section>
);

export default CarouselItems;