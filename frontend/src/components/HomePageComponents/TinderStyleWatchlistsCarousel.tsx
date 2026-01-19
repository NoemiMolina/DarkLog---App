import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import HomemadeWatchlistsDialog from './HomemadeWatchlistsDialog';
import { useWatchlists } from '../../hooks/useWatchlists';

const TinderStyleWatchlistsCarousel = () => {
    const { watchlists, loading } = useWatchlists();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

    const currentWatchlist = watchlists[currentIndex];

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            setExitDirection('left');
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
                setExitDirection(null);
            }, 300);
        },
        onSwipedRight: () => {
            setExitDirection('right');
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
                setExitDirection(null);
            }, 300);
        },
        trackMouse: true,
    });

    if (loading) {
        return (
            <section className="w-full px-4 py-6 mb-5 -mt-8 sm:mt-0 sm:hidden">
                <h2 className="text-sm sm:text-xl font-bold text-white mb-4 tracking-wide text-center" style={{ fontFamily: "'Metal Mania', serif" }}>
                    Homemade Watchlists
                </h2>
                <div className="w-full h-80 flex items-center justify-center bg-[#2A2A2A] rounded-lg">
                    <p className="text-gray-400">Loading…</p>
                </div>
            </section>
        );
    }

    if (!currentWatchlist || currentIndex >= watchlists.length) {
        return (
            <section className="w-full px-4 py-6 mb-5 -mt-8 sm:mt-0 sm:hidden">
                <h2 className="text-sm sm:text-xl font-bold text-white mb-4 tracking-wide text-center" style={{ fontFamily: "'Metal Mania', serif" }}>
                    Homemade Watchlists
                </h2>
                <div className="w-full h-80 flex items-center justify-center bg-[#2A2A2A] rounded-lg">
                    <p className="text-gray-400">No more watchlists! 📋</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full px-4 py-6 mb-5 -mt-8 sm:hidden">
            <div className="-mt-3 mb-6 text-center text-xs text-gray-400">
                    <p>← Swipe LEFT or RIGHT to browse →</p>
            </div>
            <h2 className="text-sm font-bold text-white mb-7 tracking-wide text-center">
                Homemade Watchlists
            </h2>
            <div className="w-full flex flex-col items-center">
                <div
                    {...handlers}
                    className={`relative w-full max-w-sm h-80 bg-[#2A2A2A] rounded-xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-300 ${
                        exitDirection === 'left' ? 'translate-x-full opacity-0' : ''
                    } ${
                        exitDirection === 'right' ? '-translate-x-full opacity-0' : ''
                    }`}
                >
                    <HomemadeWatchlistsDialog watchlist={currentWatchlist} />
                </div>
            </div>
        </section>
    );
};

export default TinderStyleWatchlistsCarousel;
