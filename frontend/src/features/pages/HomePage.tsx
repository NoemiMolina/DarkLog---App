import { useEffect, useState } from "react";
import Header from "../../components/Header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
interface Movie {
  _id: string;
  title: string;
  original_title?: string;
  poster_path: string | null;
  release_date?: string;
  popularity?: number;
  vote_average?: number;
}

const HomePage = () => {

  const [username, setUsername] = useState<string>("Guest");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [slasherMovies, setSlasherMovies] = useState<any[]>([]);
  const [supernaturalMovies, setSupernaturalMovies] = useState<any[]>([]);
  const [zombieMovies, setZombieMovies] = useState<any[]>([]);
  const [monsterMovies, setMonsterMovies] = useState<any[]>([]);

  const [isTVShowMode, setIsTVShowMode] = useState<boolean>(false);
  const [slasherTVShows, setSlasherTVShows] = useState<any[]>([]);
  const [supernaturalTVShows, setSupernaturalTVShows] = useState<any[]>([]);
  const [zombieTVShows, setZombieTVShows] = useState<any[]>([]);
  const [monsterTVShows, setMonsterTVShows] = useState<any[]>([]);


  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        const userPseudo =
          parsed.UserPseudo ||
          parsed.userPseudo ||
          parsed.pseudo ||
          parsed.username ||
          parsed.UserFirstName ||
          "Guest";
        setUsername(userPseudo);

        if (parsed.UserProfilePicture) {
          const fullPath = parsed.UserProfilePicture.startsWith("http")
            ? parsed.UserProfilePicture
            : `http://localhost:5000/${parsed.UserProfilePicture}`;
          setProfilePic(fullPath);
        }

      } catch {
        setUsername("Guest");
      }
    }

  }, []);

  async function fetchMovieCategory(endpoint: string, setter: any) {
    try {
      const res = await fetch(`http://localhost:5000/movies/style/${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (error) {
      console.error("Failed to fetch movie category:", error);
    }
  }

  async function fetchTVShowCategory(endpoint: string, setter: any) {
    try {
      const res = await fetch(`http://localhost:5000/tvshows/style/${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (error) {
      console.error("Failed to fetch TV show category:", error);
    }
  }

  useEffect(() => {
    if (isTVShowMode) {
      fetchTVShowCategory("slasher", setSlasherTVShows);
      fetchTVShowCategory("supernatural", setSupernaturalTVShows);
      fetchTVShowCategory("zombie", setZombieTVShows);
      fetchTVShowCategory("monster", setMonsterTVShows);
    } else {
      fetchMovieCategory("slasher", setSlasherMovies);
      fetchMovieCategory("supernatural", setSupernaturalMovies);
      fetchMovieCategory("zombie", setZombieMovies);
      fetchMovieCategory("monster", setMonsterMovies);
    }
  }, [isTVShowMode]); // will be completed

  const getPosterUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return `https://image.tmdb.org/t/p/w500${path}`;
    if (path.endsWith(".jpg") || path.endsWith(".jpeg") || path.endsWith(".png")) {
      return `http://localhost:5000/uploads/${path}`;
    }
    return path;
  };

  const renderCarousel = (title: string, items: Movie[]) => (
    <section className="mb-15 xl:-translate-y-50">
      <h2 className="text-xl font-bold text-white mb-4 tracking-wide">{title}</h2>

      <Carousel className="w-full max-w-[90%] mx-auto xl:mx-auto xl:max-w-[1100px]">
        <CarouselContent>
          {items.length === 0 ? (
            <p className="text-gray-400">Loading…</p>
          ) : (
            items.map((movie) => (
              <CarouselItem
                key={movie._id}
                className="basis-1/2 sm:basis-1/3 md:basis-1/5 lg:basis-1/7 "
              >
                <div className="relative group" tabIndex={0}>
                  <img
                    src={
                      movie.poster_path
                        ? getPosterUrl(movie.poster_path)
                        : "https://via.placeholder.com/200x300?text=No+Image"
                    }
                    alt={movie.title}
                    className="rounded-lg shadow-md transition object-contain w-full h-auto xl:w-80 hover:opacity-15"
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

  return (
    <main className="min-h-screen relative max-h-screen sm:max-h-none">
      <Header username={username} userProfilePicture={profilePic} isTVShowMode={isTVShowMode} onToggleTVShowMode={setIsTVShowMode} />

      <section className="translate-y-[-300px] sm:translate-y-0 xl:translate-y-[70px] -z-10">
        <div className="-translate-y-[420px] text-[1rem] text-center text-white px-4 mt-10 sm:translate-y-0 md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:mt-40 xl:mt-60 xl:-translate-y-30">
        
            

           {!isTVShowMode ? (
              <>
                {renderCarousel("Popular slashers", slasherMovies)}
                {renderCarousel("Ghost and possession stories", supernaturalMovies)}
                {renderCarousel("Zombies universe", zombieMovies)}
                {renderCarousel("Monster core", monsterMovies)}
              </>
            ) : (
              <>
                {renderCarousel("Ghost and possession stories", supernaturalTVShows)}
                {renderCarousel("Zombies universe", zombieTVShows)}
                {renderCarousel("Monster core", monsterTVShows)}
              </>
            )}
        
        </div>
      </section>
    </main>
  );
};

export default HomePage;
