import { useEffect, useState } from "react";
import Header from "../../components/Header";
import CarouselItems from "../../components/CarouselItems";
import PopularWFriendsSection from "../../components/PopularWFriendsSection";

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

  return (
    <main className="min-h-screen relative max-h-screen sm:max-h-none">
      <Header username={username} userProfilePicture={profilePic} isTVShowMode={isTVShowMode} onToggleTVShowMode={setIsTVShowMode} />

      <section className="translate-y-[-300px] sm:translate-y-0 xl:translate-y-[70px] -z-10">
        <div className="mb-10">
           <PopularWFriendsSection />
        </div>
        <div className="-translate-y-[420px] text-[1rem] text-center text-white px-4 mt-10 sm:translate-y-0 md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:mt-40 xl:mt-70 xl:-translate-y-30">
          {!isTVShowMode ? (
            <>
              {CarouselItems("Popular slashers", slasherMovies)}
              {CarouselItems("Ghost and possession stories", supernaturalMovies)}
              {CarouselItems("Zombies universe", zombieMovies)}
              {CarouselItems("Monster core", monsterMovies)}
            </>
          ) : (
            <>
              {CarouselItems("Ghost and possession stories", supernaturalTVShows)}
              {CarouselItems("Zombies universe", zombieTVShows)}
              {CarouselItems("Monster core", monsterTVShows)}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
