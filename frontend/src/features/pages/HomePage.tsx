import { useEffect, useState } from "react";
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
      fetchMovieCategory("satire", setSatireMovies);
    }
  }, [isTVShowMode]);

  return (
    <main className="min-h-screen relative">
      <Header username={username} userProfilePicture={profilePic} isTVShowMode={isTVShowMode} onToggleTVShowMode={setIsTVShowMode} />

      <section className="mt-8 px-4">
        <div className="mb-12">
          <PopularWFriendsSection />
        </div>

        <div className="mb-12">
          <TinderStyleWatchlistsCarousel />
          <HomemadeWatchlistsCarousel />
        </div>

        <div className="text-[1rem] text-center text-white">

            {!isTVShowMode ? (
            <>
              <>
                <TinderStyleCarousel title="Popular slashers" items={slasherMovies} />
                <CarouselItems title="Popular slashers" items={slasherMovies} />
              </>
              <>
                <TinderStyleCarousel title="Ghost and possession stories" items={supernaturalMovies} />
                <CarouselItems title="Ghost and possession stories" items={supernaturalMovies} />
              </>
              <>
                <TinderStyleCarousel title="Zombies universe" items={zombieMovies} />
                <CarouselItems title="Zombies universe" items={zombieMovies} />
              </>
              <>
                <TinderStyleCarousel title="Monster core" items={monsterMovies} />
                <CarouselItems title="Monster core" items={monsterMovies} />
              </>
              <>
                <TinderStyleCarousel title="Aliens" items={aliensMovies} />
                <CarouselItems title="Aliens" items={aliensMovies} />
              </>
              <>
                <TinderStyleCarousel title="Vampire" items={vampireMovies} />
                <CarouselItems title="Vampire" items={vampireMovies} />
              </>
              <>
                <TinderStyleCarousel title="Revenge" items={revengeStyleMovies} />
                <CarouselItems title="Revenge" items={revengeStyleMovies} />
              </>
              <>
                <TinderStyleCarousel title="Body horror" items={bodyHorrorMovies} />
                <CarouselItems title="Body horror" items={bodyHorrorMovies} />
              </>
              <>
                <TinderStyleCarousel title="Survival" items={survivalMovies} />
                <CarouselItems title="Survival" items={survivalMovies} />
              </>
              <>
                <TinderStyleCarousel title="Based on novel or book" items={basedOnNovelOrBooksMovies} />
                <CarouselItems title="Based on novel or book" items={basedOnNovelOrBooksMovies} />
              </>
              <>
                <TinderStyleCarousel title="Based on true story" items={basedOnTrueStoryMovies} />
                <CarouselItems title="Based on true story" items={basedOnTrueStoryMovies} />
              </>
              <>
                <TinderStyleCarousel title="Satire" items={satireMovies} />
                <CarouselItems title="Satire" items={satireMovies} />
              </>
            </>
          ) : (
            <>
              <>
                <TinderStyleCarousel title="Anime" items={animeTVShows} />
                <CarouselItems title="Anime" items={animeTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Popular slashers" items={slasherTVShows} />
                <CarouselItems title="Popular slashers" items={slasherTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Ghost and possession stories" items={supernaturalTVShows} />
                <CarouselItems title="Ghost and possession stories" items={supernaturalTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Zombies universe" items={zombieTVShows} />
                <CarouselItems title="Zombies universe" items={zombieTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Monster core" items={monsterTVShows} />
                <CarouselItems title="Monster core" items={monsterTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Aliens" items={aliensTVShows} />
                <CarouselItems title="Aliens" items={aliensTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Vampire" items={vampireTVShows} />
                <CarouselItems title="Vampire" items={vampireTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Revenge" items={revengeStyleTVShows} />
                <CarouselItems title="Revenge" items={revengeStyleTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Body horror" items={bodyHorrorTVShows} />
                <CarouselItems title="Body horror" items={bodyHorrorTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Survival" items={survivalTVShows} />
                <CarouselItems title="Survival" items={survivalTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Based on novel or book" items={basedOnNovelOrBooksTVShows} />
                <CarouselItems title="Based on novel or book" items={basedOnNovelOrBooksTVShows} />
              </>
              <>
                <TinderStyleCarousel title="Based on true story" items={basedOnTrueStoryTVShows} />
                <CarouselItems title="Based on true story" items={basedOnTrueStoryTVShows} />
              </>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default HomePage;