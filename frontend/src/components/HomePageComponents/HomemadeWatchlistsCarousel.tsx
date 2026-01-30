import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "../../components/ui/carousel";
import HomemadeWatchlistsDialog from "./HomemadeWatchlistsDialog";
import { useWatchlists } from "../../hooks/useWatchlists";

const HomemadeWatchlistsCarousel = () => {
    const { watchlists, loading } = useWatchlists();

    if (loading) {
        return (
            <section className="2xl:translate-y-[-120px]">
                <h2 className="text-xl font-bold text-white mb-4 tracking-wide 2xl:translate-y-[40px]">
                    Homemade Watchlists
                </h2>
                <div className="w-full max-w-[90%] mx-auto mt-5 2xl:mx-auto 2xl:max-w-[1500px]">
                    <p className="text-gray-400">Loading…</p>
                </div>
            </section>
        );
    }

    return (
        <section className="hidden sm:block 2xl:translate-y-[-120px]">
            <h2 className="text-xl font-bold text-white mb-4 tracking-wide 2xl:translate-y-[40px] 2xl:text-center" style={{ fontFamily: "'Metal Mania', serif" }}>
                Homemade Watchlists
            </h2>
            <Carousel className="w-full max-w-[90%] mx-auto mt-52xl:mx-auto 2xl:max-w-[1500px]">
                <CarouselContent className="lg:gap-4">
                    {watchlists.length === 0 ? (
                        <p className="text-gray-400 2xl:translate-x-[20px]">
                            There's no watchlist available.
                        </p>
                    ) : (
                        watchlists.map((watchlist, idx) => (
                            <CarouselItem
                                key={watchlist._id}
                                className={`basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/5 2xl:basis-1/8 2xl:mt-15 px-2 bg-transparent ${idx === 0 ? 'ml-4' : ''}`}
                            >
                                <div className="relative group transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:opacity-15">
                                    <HomemadeWatchlistsDialog watchlist={watchlist} />
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded text-white text-sm opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[90%]">
                                        {watchlist.title}
                                    </div>
                                </div>
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
            </Carousel>
        </section>
    );
};

export default HomemadeWatchlistsCarousel;
