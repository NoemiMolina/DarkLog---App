import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import Header from "../../components/HeaderComponents/Header";
import CarouselItems from "../../components/HomePageComponents/CarouselItems";
import TinderStyleCarousel from "../../components/HomePageComponents/TinderStyleCarousel";
import PopularWFriendsSection from "../../components/HomePageComponents/PopularWFriendsSection";
import HomemadeWatchlistsCarousel from "../../components/HomePageComponents/HomemadeWatchlistsCarousel";
import TinderStyleWatchlistsCarousel from "../../components/HomePageComponents/TinderStyleWatchlistsCarousel";

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
  const [satireMovies, setSatireMovies] = useState<any[]>([]);

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
            : `${API_URL}/${parsed.UserProfilePicture}`;
          setProfilePic(fullPath);
        }

      } catch {
        setUsername("Guest");
      }
    }

  }, []);

  const fetchMovieCategory = async (endpoint: string, setter: any) => {
    try {
      const res = await fetch(`${API_URL}/movies/style/${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (error) {
      console.error("Failed to fetch movie category:", error);
    }
  };

  const fetchTVShowCategory = async (endpoint: string, setter: any) => {
    try {
      const res = await fetch(`${API_URL}/tvshows/style/${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (error) {
      console.error("Failed to fetch TV show category:", error);
    }
  };

  useEffect(() => {
    const loadCategoriesProgressively = async () => {
      if (isTVShowMode) {
        // Priority 1: Load critical categories first
        await Promise.all([
          fetchTVShowCategory("slasher", setSlasherTVShows),
          fetchTVShowCategory("supernatural", setSupernaturalTVShows),
          fetchTVShowCategory("zombie", setZombieTVShows),
        ]);

        // Priority 2: Load secondary categories
        setTimeout(() => {
          fetchTVShowCategory("monster", setMonsterTVShows);
          fetchTVShowCategory("alien", setAliensTVShows);
          fetchTVShowCategory("vampire", setVampireTVShows);
          fetchTVShowCategory("revenge", setRevengeStyleTVShows);
        }, 500);

        // Priority 3: Load remaining categories
        setTimeout(() => {
          fetchTVShowCategory("body horror", setBodyHorrorTVShows);
          fetchTVShowCategory("survival horror", setSurvivalTVShows);
          fetchTVShowCategory("based on novel or book", setBasedOnNovelOrBooksTVShows);
          fetchTVShowCategory("based on true story", setBasedOnTrueStoryTVShows);
          fetchTVShowCategory("anime", setAnimeTVShows);
        }, 1000);
      } else {
        // Priority 1: Load critical categories first
        await Promise.all([
          fetchMovieCategory("slasher", setSlasherMovies),
          fetchMovieCategory("supernatural", setSupernaturalMovies),
          fetchMovieCategory("zombie", setZombieMovies),
        ]);

        // Priority 2: Load secondary categories
        setTimeout(() => {
          fetchMovieCategory("monster", setMonsterMovies);
          fetchMovieCategory("alien", setAliensMovies);
          fetchMovieCategory("vampire", setVampireMovies);
          fetchMovieCategory("revenge", setRevengeStyleMovies);
        }, 500);

        // Priority 3: Load remaining categories
        setTimeout(() => {
          fetchMovieCategory("body horror", setBodyHorrorMovies);
          fetchMovieCategory("survival horror", setSurvivalMovies);
          fetchMovieCategory("based on novel or book", setBasedOnNovelOrBooksMovies);
          fetchMovieCategory("based on true story", setBasedOnTrueStoryMovies);
          fetchMovieCategory("satire", setSatireMovies);
        }, 1000);
      }
    };

    loadCategoriesProgressively();
  }, [isTVShowMode]);

  return (
    <main className="min-h-screen relative">
      <Header username={username} userProfilePicture={profilePic} isTVShowMode={isTVShowMode} onToggleTVShowMode={setIsTVShowMode} />

      <section className="mt-8 px-4">
        <div className="mb-12">
          <PopularWFriendsSection />
        </div>

        <div className="mb-12">
          <div className="sm:hidden">
            <TinderStyleWatchlistsCarousel />
          </div>
         
          <div className="hidden sm:block">
            <HomemadeWatchlistsCarousel />
          </div>
        </div>

        <div className="text-[1rem] text-center text-white">

            {!isTVShowMode ? (
            <>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Popular slashers" items={slasherMovies} type="movie" />
                <CarouselItems title="Popular slashers" items={slasherMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Ghost and possession stories" items={supernaturalMovies} type="movie" />
                <CarouselItems title="Ghost and possession stories" items={supernaturalMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Zombies universe" items={zombieMovies} type="movie" />
                <CarouselItems title="Zombies universe" items={zombieMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Monster core" items={monsterMovies} type="movie" />
                <CarouselItems title="Monster core" items={monsterMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Aliens" items={aliensMovies} type="movie" />
                <CarouselItems title="Aliens" items={aliensMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Vampire" items={vampireMovies} type="movie" />
                <CarouselItems title="Vampire" items={vampireMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Revenge" items={revengeStyleMovies} type="movie" />
                <CarouselItems title="Revenge" items={revengeStyleMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Body horror" items={bodyHorrorMovies} type="movie" />
                <CarouselItems title="Body horror" items={bodyHorrorMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Survival" items={survivalMovies} type="movie" />
                <CarouselItems title="Survival" items={survivalMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Based on novel or book" items={basedOnNovelOrBooksMovies} type="movie" />
                <CarouselItems title="Based on novel or book" items={basedOnNovelOrBooksMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Based on true story" items={basedOnTrueStoryMovies} type="movie" />
                <CarouselItems title="Based on true story" items={basedOnTrueStoryMovies} type="movie" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Satire" items={satireMovies} type="movie" />
                <CarouselItems title="Satire" items={satireMovies} type="movie" />
              </div>
            </>
          ) : (
            <>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Anime" items={animeTVShows} type="tvshow" />
                <CarouselItems title="Anime" items={animeTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Popular slashers" items={slasherTVShows} type="tvshow" />
                <CarouselItems title="Popular slashers" items={slasherTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Ghost and possession stories" items={supernaturalTVShows} type="tvshow" />
                <CarouselItems title="Ghost and possession stories" items={supernaturalTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Zombies universe" items={zombieTVShows} type="tvshow" />
                <CarouselItems title="Zombies universe" items={zombieTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Monster core" items={monsterTVShows} type="tvshow" />
                <CarouselItems title="Monster core" items={monsterTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Aliens" items={aliensTVShows} type="tvshow" />
                <CarouselItems title="Aliens" items={aliensTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Vampire" items={vampireTVShows} type="tvshow" />
                <CarouselItems title="Vampire" items={vampireTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Revenge" items={revengeStyleTVShows} type="tvshow" />
                <CarouselItems title="Revenge" items={revengeStyleTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Body horror" items={bodyHorrorTVShows} type="tvshow" />
                <CarouselItems title="Body horror" items={bodyHorrorTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Survival" items={survivalTVShows} type="tvshow" />
                <CarouselItems title="Survival" items={survivalTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Based on novel or book" items={basedOnNovelOrBooksTVShows} type="tvshow" />
                <CarouselItems title="Based on novel or book" items={basedOnNovelOrBooksTVShows} type="tvshow" />
              </div>
              <div className="mb-32 sm:mb-0">
                <TinderStyleCarousel title="Based on true story" items={basedOnTrueStoryTVShows} type="tvshow" />
                <CarouselItems title="Based on true story" items={basedOnTrueStoryTVShows} type="tvshow" />
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default HomePage;