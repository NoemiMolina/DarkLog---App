import { useEffect, useState } from "react";
import Header from "../../components/Header";
import backgroundOption1 from "@assets/images/HomePageBackgroundImgs/AlienHomePagePic.jpg";
import backgroundOption2 from "@assets/images/HomePageBackgroundImgs/DawnOfTheDeadHomePagePic.jpg";
import backgroundOption3 from "@assets/images/HomePageBackgroundImgs/HouseOf1000CorpsesHomePagePic.jpg";
import backgroundOption4 from "@assets/images/HomePageBackgroundImgs/MidsommarHomePagePic.jpg";
import backgroundOption5 from "@assets/images/HomePageBackgroundImgs/SignsHomePagePic.jpg";
import { IoSkullOutline } from "react-icons/io5";
import { LiaGhostSolid } from "react-icons/lia";
import { RiUserCommunityLine } from "react-icons/ri";
import { IoGameControllerOutline } from "react-icons/io5";
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
  const backgroundsImages = [
    backgroundOption1,
    backgroundOption2,
    backgroundOption3,
    backgroundOption4,
    backgroundOption5,
  ];
  const randomImageSelection =
    backgroundsImages[Math.floor(Math.random() * backgroundsImages.length)];

  const [isFirstConnection, setIsFirstConnection] = useState<boolean>(false);
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

    const firstConn = localStorage.getItem("firstConnection");
    if (firstConn === "true") {
      setIsFirstConnection(true);
      setTimeout(() => {
        localStorage.setItem("firstConnection", "false");
      }, 3000);
    } else {
      setIsFirstConnection(false);
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
          <h1 className="font-bold tracking-wide xl:text-[1.5rem]">
            {isFirstConnection ? (
              <div className="space-y-4">
                <div className="relative max-w-6xl crt-effect mb-90 mx-auto w-[90%] sm:w-[85%] md:w-[70%] lg:w-[70%] xl:-translate-y-[60px]">
                  <img
                    src={randomImageSelection}
                    alt="MainPic"
                    className="block mx-auto w-full h-auto object-contain
              mask-t-from-85% mask-t-to-100%
              mask-b-from-40% mask-b-to-100%
              mask-l-from-85% mask-l-to-100%
              mask-r-from-85% mask-r-to-100%
              transition-all duration-500"
                  />
                </div>
                <div className="mt-5 text-sm xl:mt-1 xl:text-xl xl:mt-12">
                  <p>Welcome {username} to Fearlog, here's what this horrific app has been created for :</p>
                </div>

                <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:mt-12 xl:mt-20">
                  <div className="flex flex-col items-center text-center p-4 border border-white rounded-lg bg-black/30 backdrop-blur-sm shadow-sm">
                    <IoSkullOutline className="text-4xl mb-2" />
                    <p className="text-sm">Discover and explore a vast collection of horror movies or series. Rate and comment the ones you've already seen, add to your wishlist the ones you did not watch yet.</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 border border-white rounded-lg bg-black/30 backdrop-blur-sm shadow-sm">
                    <LiaGhostSolid className="text-4xl mb-2" />
                    <p className="text-sm">Connect with your friends, see what they are watching, and share your own horror movie or tv show experiences.</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 border border-white rounded-lg bg-black/30 backdrop-blur-sm shadow-sm">
                    <RiUserCommunityLine className="text-4xl mb-2" />
                    <p className="text-sm">Join a community of horror enthusiasts, participate in discussions, and stay updated with the latest news and trends in the horror genre with our dedicated forum.</p>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 border border-white rounded-lg bg-black/30 backdrop-blur-sm shadow-sm">
                    <IoGameControllerOutline className="text-4xl mb-2" />
                    <p className="text-sm">Challenge yourself with our home made horror-themed quizzes.</p>
                  </div>
                </div>
              </div>

            ) : !isTVShowMode ? (
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
          </h1>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
