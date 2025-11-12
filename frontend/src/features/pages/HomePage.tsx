import React, { useEffect, useState } from "react";
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

        if (parsed.UserProfilePic) {
          const fullPath = parsed.UserProfilePic.startsWith("http")
            ? parsed.UserProfilePic
            : `http://localhost:5000/${parsed.UserProfilePic}`;
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

  return (
    <main className="min-h-screen relative max-h-screen sm:max-h-none">
      <Header username={username} userProfilePicture={profilePic} />

      <section className="translate-y-[-300px] sm:translate-y-0 xl:translate-y-[70px] -z-10">
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

        <div className="-translate-y-[420px] text-[1rem] text-center text-white px-4 mt-10 sm:translate-y-0 md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:mt-40 xl:mt-60 xl:-translate-y-30">
          <h1 className="font-bold tracking-wide xl:text-[1.5rem]">
            {isFirstConnection ? (
              <div className="space-y-4">
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

            ) : (
              <div>
                Welcome back, {username}! // to be modified later
              </div>
            )}
          </h1>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
