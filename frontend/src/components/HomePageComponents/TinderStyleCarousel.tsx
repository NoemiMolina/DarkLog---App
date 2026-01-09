import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

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

interface TinderStyleCarouselProps {
    title: string;
    items: Movie[];
}

const TinderStyleCarousel = ({ title, items }: TinderStyleCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
    const [swipeDelta, setSwipeDelta] = useState(0); 
    const [swiping, setSwiping] = useState(false);
    const currentMovie = items[currentIndex];
    const addToWatchlist = async (movie: Movie) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token ? 'Existe ✅' : 'N\'existe pas ❌');
            
            if (!token) {
                alert('Please log in to add to watchlist');
                return;
            }

            console.log('Ajout du film à la watchlist:', movie.title);
            const response = await fetch('http://localhost:5000/watchlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    mediaId: movie._id,
                    mediaType: 'movie',
                    title: movie.title,
                    poster: movie.poster_path,
                }),
            });

            console.log('Réponse du serveur:', response.status);
            if (response.ok) {
                console.log('✅ Movie added to watchlist successfully:', movie.title);
            } else {
                console.error('❌ Server error', response.statusText);
            }
        } catch (error) {
            console.error('Error adding to watchlist:', error);
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            console.log('✅ Left swipe successful', currentMovie.title);
            addToWatchlist(currentMovie);
            setExitDirection('left');
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
                setExitDirection(null);
                setSwipeDelta(0);
                setSwiping(false);
            }, 300);
        },
        onSwipedRight: () => {
            console.log('✅ Right swipe successful', currentMovie.title);
            setExitDirection('right');
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
                setExitDirection(null);
                setSwipeDelta(0);
                setSwiping(false);
            }, 300);
        },
        onSwiping: (eventData) => {
            setSwiping(true);
            setSwipeDelta(eventData.deltaX);
        },
        onSwiped: () => {
            if (!exitDirection) {
                setSwipeDelta(0);
                setSwiping(false);
            }
        },
        trackMouse: true,
        delta: 10,
    });

    if (!currentMovie || currentIndex >= items.length) {
        return (
            <section className="w-full px-4 py-6 mb-5 -mt-8 sm:mt-0">
                <h2 className="text-sm font-bold text-white mb-4 tracking-wide sm:hidden">
                    {title}
                </h2>
                <div className="w-full h-80 flex items-center justify-center rounded-lg sm:hidden">
                    <p className="text-gray-400">No more movies to swipe! 🎬</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full px-4 py-6 mb-5 -mt-8 sm:mt-0 sm:translate-y-[-120px]">
            <h2 className="text-sm font-bold text-white mb-4 tracking-wide sm:hidden">
                {title}
            </h2>
            <div className="sm:hidden w-full flex flex-col items-center">
                <div
                    {...handlers}
                    style={{
                        transform: swiping ? `translateX(${swipeDelta}px)` : 'translateX(0)',
                        transition: swiping ? 'none' : 'transform 0.3s ease-out',
                    }}
                    className={`relative w-full max-w-xs aspect-[2/3] overflow-hidden rounded-lg cursor-grab active:cursor-grabbing ${
                        exitDirection === 'left' ? 'opacity-0' : ''
                    } ${
                        exitDirection === 'right' ? 'opacity-0' : ''
                    }`}
                >
                    <img
                        src={
                            currentMovie.poster_path
                                ? getPosterUrl(currentMovie.poster_path)
                                : 'https://via.placeholder.com/200x300?text=No+Image'
                        }
                        alt={currentMovie.title}
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>
                <div className="mt-4 text-sm text-white">
                    {currentIndex + 1} / {items.length}
                </div>
            </div>
        </section>
    );
};

export default TinderStyleCarousel;
