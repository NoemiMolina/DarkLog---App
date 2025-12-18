import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";
import ItemDialog from "./ItemDialog";

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
        return `http://localhost:5000/uploads/${path}`;
    }
    return path;
};

const CarouselItems = ({ title, items }: { title: string; items: Movie[] }) => (
    <section className="xl:translate-y-[-120px]">
        <h2 className="text-xl font-bold text-white mb-4 tracking-wide xl:translate-y-[40px]">{title}</h2>
        <Carousel className="w-full max-w-[90%] mx-auto mt-5 xl:mx-auto xl:max-w-[1500px]">
            <CarouselContent>
                {items.length === 0 ? (
                    <p className="text-gray-400 xl:translate-x-[20px]">Loading…</p>
                ) : (
                    items.map((movie) => (
                        <CarouselItem
                            key={movie._id}
                            className="basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/5 xl:basis-1/8 xl:mt-15 px-2"
                        >
                            <div className="relative group" tabIndex={0}>
                                <ItemDialog
                                    item={movie}
                                    type="movie"
                                    trigger={
                                        <img
                                            src={movie.poster_path ? getPosterUrl(movie.poster_path) : "https://via.placeholder.com/200x300?text=No+Image"}
                                            alt={movie.title}
                                            className="rounded-lg shadow-md transition object-contain w-full h-auto xl:w-80 hover:opacity-15 cursor-pointer aspect-[2/3] "
                                        />
                                    }
                                />
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 group-focus:opacity-100">
                                    <div className="text-white text-sm font-semibold px-3 py-1 rounded">
                                        ⭐{" "}
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

            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </section>
);

export default CarouselItems;
