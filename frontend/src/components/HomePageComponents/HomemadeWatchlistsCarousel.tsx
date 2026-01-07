import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";
import HomemadeWatchlistsDialog from "./HomemadeWatchlistsDialog";

interface Watchlist {
    _id: string;
    title: string;
    description?: string;
    posterPath?: string;
    movies: any[];
    createdAt: Date;
    updatedAt: Date;
}

const HomemadeWatchlistsCarousel = () => {
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlists = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/homemade-watchlists"
                );
                if (!response.ok) throw new Error("Erreur lors du chargement");
                const data = await response.json();
                setWatchlists(data);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlists();
    }, []);

    if (loading) {
        return (
            <section className="xl:translate-y-[-120px]">
                <h2 className="text-xl font-bold text-white mb-4 tracking-wide xl:translate-y-[40px]">
                    Homemade Watchlists
                </h2>
                <div className="w-full max-w-[90%] mx-auto mt-5 xl:mx-auto xl:max-w-[1500px]">
                    <p className="text-gray-400">Loading…</p>
                </div>
            </section>
        );
    }

    return (
        <section className="xl:translate-y-[-120px]">
            <h2 className="text-xl font-bold text-white mb-4 tracking-wide xl:translate-y-[40px] xl:text-center">
                Homemade Watchlists
            </h2>
            <Carousel className="w-full max-w-[90%] mx-auto mt-5 xl:mx-auto xl:max-w-[1500px]">
                <CarouselContent>
                    {watchlists.length === 0 ? (
                        <p className="text-gray-400 xl:translate-x-[20px]">
                            There's no watchlist available.
                        </p>
                    ) : (
                        watchlists.map((watchlist) => (
                            <CarouselItem
                                key={watchlist._id}
                                className="basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/5 xl:basis-1/8 xl:mt-15 px-16"
                            >
                                <HomemadeWatchlistsDialog watchlist={watchlist} />
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    );
};

export default HomemadeWatchlistsCarousel;
