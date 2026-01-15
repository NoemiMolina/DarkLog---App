import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import RatingStars from "./RatingSkulls";
import ItemDialog from "./ItemDialog";

interface Movie {
    _id: string;
    title: string;
    poster_path?: string;
    vote_average?: number;
}

interface Watchlist {
    _id: string;
    title: string;
    description?: string;
    posterPath?: string;
    movies: Movie[];
}

const HomemadeWatchlistsDialog = ({ watchlist, isOpen, onOpenChange }: { watchlist: Watchlist; isOpen?: boolean; onOpenChange?: (open: boolean) => void }) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isOpen !== undefined ? isOpen : internalOpen;
    const setOpen = onOpenChange || setInternalOpen;
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);

    console.log('🎪 HomemadeWatchlistsDialog received:', { _id: watchlist._id, title: watchlist.title, posterPath: watchlist.posterPath });

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const userId = user?._id;
    const token = localStorage.getItem("token");
    useEffect(() => {
        const loadUserData = async () => {
            if (!userId || !watchlist._id) return;

            try {
                const res = await fetch(
                    `http://localhost:5000/users/${userId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    console.log("✅ User data loaded:", data);
                } else if (res.status === 403 || res.status === 401) {
                    console.warn("⚠ Unauthorized access when loading user data");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            } catch (err) {
                console.error("❌ Error loading user data:", err);
            }
        };

        loadUserData();
    }, [userId, watchlist._id, token]);

    const showMessage = (text: string) => {
        setMessage(text);
        setTimeout(() => setMessage(null), 2000);
    };

    const handleSave = async () => {
        if (!userId) {
            showMessage("⚠️ Please sign in to save");
            return;
        }

        if (rating === 0 && comment === "") {
            showMessage("⚠️ Please add a rating or comment");
            return;
        }

        try {
            if (rating > 0) {
                const rateRes = await fetch(
                    "http://localhost:5000/homemade-watchlists/rate",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userId,
                            watchlistId: watchlist._id,
                            rating,
                        }),
                    }
                );

                if (!rateRes.ok) {
                    throw new Error("Failed to save rating");
                }
            }

            if (comment.trim()) {
                const commentRes = await fetch(
                    "http://localhost:5000/homemade-watchlists/comment",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            userId,
                            watchlistId: watchlist._id,
                            comment,
                        }),
                    }
                );

                if (!commentRes.ok) {
                    throw new Error("Failed to save comment");
                }
            }

            showMessage("✔ Successfully saved!");
            setRating(0);
            setComment("");
        } catch (err) {
            console.error(err);
            showMessage("❌ Error saving.");
        }
    };

    const handleAddToWatchlist = async () => {
        if (!userId) {
            showMessage("⚠️ Please sign in to add to watchlist");
            return;
        }

        try {
            const res = await fetch(
                "http://localhost:5000/homemade-watchlists/add",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        userId,
                        watchlistId: watchlist._id,
                    }),
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                showMessage(`❌ ${errorData.message || "Error adding to watchlist"}`);
                return;
            }

            showMessage("✔ Added to your watchlists!");
        } catch (err) {
            console.error(err);
            showMessage("❌ Error adding to watchlist.");
        }
    };

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className={`relative group cursor-pointer rounded-lg shadow-md overflow-hidden aspect-[2/3] w-full h-auto xl:w-40 flex items-center justify-center transition-transform hover:scale-105 mx-12`}
            >
                {watchlist.posterPath ? (
                    <img
                        src={`http://localhost:5000${watchlist.posterPath}`}
                        alt={watchlist.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-800" />
                )}
                    <p className="text-white text-sm font-semibold px-3 py-1 bg-opacity-70 rounded xl:translate-y-[50px]">
                        {watchlist.movies.length} movies
                    </p>
            </div>
            <Dialog key={`dialog-${watchlist._id}`} open={open} onOpenChange={setOpen}>
                <DialogContent className="w-screen h-screen rounded-none p-2 sm:w-auto sm:h-auto sm:max-w-4xl sm:rounded-lg sm:p-6 bg-gray-900 border-gray-700 flex flex-col">
                    <DialogHeader className="sm:block hidden">
                        <DialogTitle className="text-white text-2xl">
                            {watchlist.title}
                        </DialogTitle>
                        {watchlist.description && (
                            <p className="text-gray-400 text-sm mt-2">
                                {watchlist.description}
                            </p>
                        )}
                    </DialogHeader>
                    <div className="mt-2 sm:mt-6 flex-1 overflow-y-auto">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {watchlist.movies.length === 0 ? (
                                    <p className="text-gray-400">
                                        There's no movies in this watchlist.
                                    </p>
                                ) : (
                                    watchlist.movies.map((movie) => (
                                        <CarouselItem
                                            key={movie._id}
                                            className="basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 px-1 sm:px-2"
                                        >
                                            <div className="relative group">
                                                <ItemDialog
                                                    item={movie}
                                                    type="movie"
                                                    trigger={
                                                        <img
                                                            src={
                                                                movie.poster_path
                                                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                                    : "https://via.placeholder.com/200x300?text=No+Image"
                                                            }
                                                            alt={movie.title}
                                                            className="rounded-lg shadow-md transition object-contain w-full h-auto hover:opacity-80 cursor-pointer aspect-[2/3]"
                                                        />
                                                    }
                                                />
                                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100">
                                                    <div className="text-white text-sm font-semibold px-3 py-1 rounded bg-black bg-opacity-70">
                                                        ⭐{" "}
                                                        {movie.vote_average
                                                            ? (
                                                                Number(
                                                                    movie.vote_average
                                                                ) / 2
                                                            ).toFixed(1)
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
                    </div>
                    <div className="mt-8 space-y-4 pb-4">
                        <Button
                            onClick={handleAddToWatchlist}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                            ➕ Add to my watchlists
                        </Button>
                        <div>
                            <h3 className="font-semibold mb-2 text-white">Rate this watchlist:</h3>
                            <RatingStars
                                key={rating}
                                value={rating}
                                onChange={(r) => {
                                    console.log("Rating set:", r);
                                    setRating(r);
                                }}
                            />
                        </div>


                        <div>
                            <h3 className="font-semibold mb-2 text-white">Write a comment:</h3>
                            <Textarea
                                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white"
                                rows={4}
                                placeholder="Share your thoughts…"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handleSave}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            Save rating & comment
                        </Button>
                        {message && (
                            <p className="text-green-400 text-sm mt-2">
                                {message}
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default HomemadeWatchlistsDialog;
