import { useEffect, useState } from "react";
import { API_URL } from "../../config/api";
import Header from "../../components/HeaderComponents/Header";
import CarouselItems from "../../components/HomePageComponents/CarouselItems";
import TinderStyleCarousel from "../../components/HomePageComponents/TinderStyleCarousel";
import PopularWFriendsSection from "../../components/HomePageComponents/PopularWFriendsSection";
import HomemadeWatchlistsCarousel from "../../components/HomePageComponents/HomemadeWatchlistsCarousel";
import TinderStyleWatchlistsCarousel from "../../components/HomePageComponents/TinderStyleWatchlistsCarousel";
import { useNavigate } from "react-router-dom";
import { RiUserCommunityLine } from "react-icons/ri";
import { IoGameControllerOutline } from "react-icons/io5";

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

  const navigate = useNavigate();

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
        await Promise.all([
          fetchTVShowCategory("slasher", setSlasherTVShows),
          fetchTVShowCategory("supernatural", setSupernaturalTVShows),
          fetchTVShowCategory("zombie", setZombieTVShows),
        ]);

        setTimeout(() => {
          fetchTVShowCategory("monster", setMonsterTVShows);
          fetchTVShowCategory("alien", setAliensTVShows);
          fetchTVShowCategory("vampire", setVampireTVShows);
          fetchTVShowCategory("revenge", setRevengeStyleTVShows);
        }, 500);

        setTimeout(() => {
          fetchTVShowCategory("body horror", setBodyHorrorTVShows);
          fetchTVShowCategory("survival horror", setSurvivalTVShows);
          fetchTVShowCategory("based on novel or book", setBasedOnNovelOrBooksTVShows);
          fetchTVShowCategory("based on true story", setBasedOnTrueStoryTVShows);
          fetchTVShowCategory("anime", setAnimeTVShows);
        }, 1000);
      } else {
        await Promise.all([
          fetchMovieCategory("slasher", setSlasherMovies),
          fetchMovieCategory("supernatural", setSupernaturalMovies),
          fetchMovieCategory("zombie", setZombieMovies),
        ]);

        setTimeout(() => {
          fetchMovieCategory("monster", setMonsterMovies);
          fetchMovieCategory("alien", setAliensMovies);
          fetchMovieCategory("vampire", setVampireMovies);
          fetchMovieCategory("revenge", setRevengeStyleMovies);
        }, 500);

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
    {/* Container pour l'ordre desktop uniquement */}
    <div className="text-[1rem] text-center text-white lg:flex lg:flex-col">
      
      {/* VERSION MOBILE : Popular with friends en premier */}
      <div className="block lg:hidden mb-12">
        <PopularWFriendsSection />
      </div>

      {/* VERSION MOBILE : Watchlists */}
      <div className="block lg:hidden mb-12">
        <div className="sm:hidden">
          <TinderStyleWatchlistsCarousel />
        </div>
        <div className="hidden sm:block">
          <HomemadeWatchlistsCarousel />
        </div>
      </div>

      {/* Popular slashers - Premier sur desktop seulement */}
      <div className="mb-32 sm:mb-0 lg:order-1">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Popular slashers" items={slasherMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Popular slashers" items={slasherMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Popular slashers" items={slasherTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Popular slashers" items={slasherTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>
      
      {/* Zombies universe - Deuxième sur desktop seulement */}
      <div className="mb-32 sm:mb-0 lg:order-2">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Zombies universe" items={zombieMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Zombies universe" items={zombieMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Zombies universe" items={zombieTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Zombies universe" items={zombieTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>
      
      {/* Popular with friends - Troisième sur desktop seulement (caché sur mobile) */}
      <div className="hidden lg:block mb-12 lg:order-3">
        <PopularWFriendsSection />
      </div>

      {/* Watchlists carousel - Quatrième sur desktop (caché sur mobile) */}
      <div className="hidden lg:block mb-12 lg:order-4">
        <div className="hidden sm:block">
          <HomemadeWatchlistsCarousel />
        </div>
      </div>

      {/* Ghost and possession stories - Cinquième sur desktop */}
      <div className="mb-32 sm:mb-0 lg:order-5 lg:mb-16">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Ghost and possession stories" items={supernaturalMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Ghost and possession stories" items={supernaturalMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Ghost and possession stories" items={supernaturalTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Ghost and possession stories" items={supernaturalTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>

      {/* Cases Quiz et Forum - UNIQUEMENT SUR DESKTOP et alignées horizontalement */}
      <div className="hidden lg:flex lg:order-6 lg:justify-center lg:gap-8 lg:mb-16 lg:px-4">
        {/* Case Forum */}
        <div 
          className="flex flex-col items-center text-center p-6 border border-white rounded-lg bg-black/30 backdrop-blur-sm shadow-sm hover:bg-black/50 transition-all duration-300 cursor-pointer flex-1 max-w-md"
          onClick={() => navigate('/forum')}
        >
          <RiUserCommunityLine className="text-4xl mb-4" />
          <p className="text-sm sm:hidden">Join the horror community</p>
          <p className="text-sm hidden sm:block">
            Join a community of horror enthusiasts, participate in discussions, and stay updated with the latest news and trends in the horror genre with our dedicated forum.
          </p>
        </div>

        {/* Case Quiz */}
        <div 
          className="flex flex-col items-center text-center p-6 border border-white rounded-lg bg-black/30 backdrop-blur-sm shadow-sm hover:bg-black/50 transition-all duration-300 cursor-pointer flex-1 max-w-md"
          onClick={() => navigate('/quiz')}
        >
          <IoGameControllerOutline className="text-4xl mb-4" />
          <p className="text-sm sm:hidden">Challenge yourself</p>
          <p className="text-sm hidden sm:block">
            Challenge yourself with our home made horror-themed quizzes. Test your knowledge of horror movies, characters, and trivia in our interactive quiz section.
          </p>
        </div>
      </div>

      {/* Anime (seulement pour TV Shows) - en fin sur desktop */}
      {isTVShowMode && (
        <div className="mb-32 sm:mb-0 lg:order-21">
          <div className="sm:hidden">
            <TinderStyleCarousel title="Anime" items={animeTVShows} type="tvshow" />
          </div>
          <div className="hidden sm:block">
            <CarouselItems title="Anime" items={animeTVShows} type="tvshow" />
          </div>
        </div>
      )}

      {/* Les autres carrousels avec un ordre cohérent pour desktop */}
      <div className="mb-32 sm:mb-0 lg:order-7">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Monster core" items={monsterMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Monster core" items={monsterMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Monster core" items={monsterTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Monster core" items={monsterTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>
      
      <div className="mb-32 sm:mb-0 lg:order-8">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Aliens" items={aliensMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Aliens" items={aliensMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Aliens" items={aliensTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Aliens" items={aliensTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>
      
      <div className="mb-32 sm:mb-0 lg:order-9">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Vampire" items={vampireMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Vampire" items={vampireMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Vampire" items={vampireTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Vampire" items={vampireTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>
      
      <div className="mb-32 sm:mb-0 lg:order-10">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Revenge" items={revengeStyleMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Revenge" items={revengeStyleMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Revenge" items={revengeStyleTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Revenge" items={revengeStyleTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>
      
      <div className="mb-32 sm:mb-0 lg:order-11">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Body horror" items={bodyHorrorMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Body horror" items={bodyHorrorMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Body horror" items={bodyHorrorTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Body horror" items={bodyHorrorTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>
      
      <div className="mb-32 sm:mb-0 lg:order-12">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Survival" items={survivalMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Survival" items={survivalMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Survival" items={survivalTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Survival" items={survivalTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>
      
      <div className="mb-32 sm:mb-0 lg:order-13">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Based on novel or book" items={basedOnNovelOrBooksMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Based on novel or book" items={basedOnNovelOrBooksMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Based on novel or book" items={basedOnNovelOrBooksTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Based on novel or book" items={basedOnNovelOrBooksTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>
      
      <div className="mb-32 sm:mb-0 lg:order-14">
        {!isTVShowMode ? (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Based on true story" items={basedOnTrueStoryMovies} type="movie" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Based on true story" items={basedOnTrueStoryMovies} type="movie" />
            </div>
          </>
        ) : (
          <>
            <div className="sm:hidden">
              <TinderStyleCarousel title="Based on true story" items={basedOnTrueStoryTVShows} type="tvshow" />
            </div>
            <div className="hidden sm:block">
              <CarouselItems title="Based on true story" items={basedOnTrueStoryTVShows} type="tvshow" />
            </div>
          </>
        )}
      </div>
      
      {!isTVShowMode && (
        <div className="mb-32 sm:mb-0 lg:order-15">
          <div className="sm:hidden">
            <TinderStyleCarousel title="Satire" items={satireMovies} type="movie" />
          </div>
          <div className="hidden sm:block">
            <CarouselItems title="Satire" items={satireMovies} type="movie" />
          </div>
        </div>
      )}
      
    </div>
  </section>

    </main>
  );
};

export default HomePage;