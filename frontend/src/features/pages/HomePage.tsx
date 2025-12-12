import { useEffect, useState } from "react";
import Header from "../../components/HeaderComponents/Header";
import CarouselItems from "../../components/HomePageComponents/CarouselItems";
import PopularWFriendsSection from "../../components/HomePageComponents/PopularWFriendsSection";

const HomePage = () => {

  const [username, setUsername] = useState<string>("Guest");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [slasherMovies, setSlasherMovies] = useState<any[]>([]);
  const [supernaturalMovies, setSupernaturalMovies] = useState<any[]>([]);
  const [zombieMovies, setZombieMovies] = useState<any[]>([]);
  const [monsterMovies, setMonsterMovies] = useState<any[]>([]);
  const [basedOnTrueStoryMovies, setBasedOnTrueStoryMovies] = useState<any[]>([]);
  const [basedOnNovelOrBooksMovies, setBasedOnNovelOrBooksMovies] = useState<any[]>([]);
  const [revengeStyleMovies, setRevengeStyleMovies] = useState<any[]>([]);
  const [bodyHorrorMovies, setBodyHorrorMovies] = useState<any[]>([]);
  const [vampireMovies, setVampireMovies] = useState<any[]>([]);
  const [survivalMovies, setSurvivalMovies] = useState<any[]>([]);
  const [aliensMovies, setAliensMovies] = useState<any[]>([]);  

  const [isTVShowMode, setIsTVShowMode] = useState<boolean>(false);
  const [slasherTVShows, setSlasherTVShows] = useState<any[]>([]);
  const [supernaturalTVShows, setSupernaturalTVShows] = useState<any[]>([]);
  const [zombieTVShows, setZombieTVShows] = useState<any[]>([]);
  const [monsterTVShows, setMonsterTVShows] = useState<any[]>([]);
  const [basedOnTrueStoryTVShows, setBasedOnTrueStoryTVShows] = useState<any[]>([]);
  const [basedOnNovelOrBooksTVShows, setBasedOnNovelOrBooksTVShows] = useState<any[]>([]);
  const [revengeStyleTVShows, setRevengeStyleTVShows] = useState<any[]>([]);
  const [bodyHorrorTVShows, setBodyHorrorTVShows] = useState<any[]>([]);
  const [vampireTVShows, setVampireTVShows] = useState<any[]>([]);
  const [survivalTVShows, setSurvivalTVShows] = useState<any[]>([]);
  const [animeTVShows, setAnimeTVShows] = useState<any[]>([]);
  const [aliensTVShows, setAliensTVShows] = useState<any[]>([]);

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
      fetchTVShowCategory("alien", setAliensTVShows);
      fetchTVShowCategory("vampire", setVampireTVShows);
      fetchTVShowCategory("revenge", setRevengeStyleTVShows);
      fetchTVShowCategory("body horror", setBodyHorrorTVShows);
      fetchTVShowCategory("survival horror", setSurvivalTVShows);
      fetchTVShowCategory("based on novel or book", setBasedOnNovelOrBooksTVShows);
      fetchTVShowCategory("based on true story", setBasedOnTrueStoryTVShows);
      fetchTVShowCategory("anime", setAnimeTVShows);
    } else {
      fetchMovieCategory("slasher", setSlasherMovies);
      fetchMovieCategory("supernatural", setSupernaturalMovies);
      fetchMovieCategory("zombie", setZombieMovies);
      fetchMovieCategory("monster", setMonsterMovies);
      fetchMovieCategory("alien", setAliensMovies);
      fetchMovieCategory("vampire", setVampireMovies);
      fetchMovieCategory("revenge", setRevengeStyleMovies);
      fetchMovieCategory("body horror", setBodyHorrorMovies);
      fetchMovieCategory("survival horror", setSurvivalMovies);
      fetchMovieCategory("based on novel or book", setBasedOnNovelOrBooksMovies);
      fetchMovieCategory("based on true story", setBasedOnTrueStoryMovies);
    }
  }, [isTVShowMode]);

  return (
    <main className="min-h-screen relative">
      <Header username={username} userProfilePicture={profilePic} isTVShowMode={isTVShowMode} onToggleTVShowMode={setIsTVShowMode} />

      <section className="mt-8 px-4">
        <div className="mb-12">
          <PopularWFriendsSection />
        </div>
        <div className="text-[1rem] text-center text-white">

          {!isTVShowMode ? (
            <>
              {CarouselItems("Popular slashers", slasherMovies)}
              {CarouselItems("Ghost and possession stories", supernaturalMovies)}
              {CarouselItems("Zombies universe", zombieMovies)}
              {CarouselItems("Monster core", monsterMovies)}
              {CarouselItems("Aliens", aliensMovies)}
              {CarouselItems("Vampire", vampireMovies)}
              {CarouselItems("Revenge", revengeStyleMovies)}
              {CarouselItems("Body horror", bodyHorrorMovies)}
              {CarouselItems("Survival", survivalMovies)}
              {CarouselItems("Based on novel or book", basedOnNovelOrBooksMovies)}
              {CarouselItems("Based on true story", basedOnTrueStoryMovies)}

            </>
          ) : (
            <>
              {CarouselItems("Anime", animeTVShows)}
              {CarouselItems("Popular slashers", slasherTVShows)}
              {CarouselItems("Ghost and possession stories", supernaturalTVShows)}
              {CarouselItems("Zombies universe", zombieTVShows)}
              {CarouselItems("Monster core", monsterTVShows)}
              {CarouselItems("Aliens", aliensTVShows)}
              {CarouselItems("Vampire", vampireTVShows)}
              {CarouselItems("Revenge", revengeStyleTVShows)}
              {CarouselItems("Body horror", bodyHorrorTVShows)}
              {CarouselItems("Survival", survivalTVShows)}
              {CarouselItems("Based on novel or book", basedOnNovelOrBooksTVShows)}
              {CarouselItems("Based on true story", basedOnTrueStoryTVShows)}

            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default HomePage;