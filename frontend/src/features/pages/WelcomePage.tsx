import React, { useState, useEffect } from "react";
import Header from "../../components/HeaderComponents/Header";
import backgroundOption1 from "@/assets/images/WelcomePageBackgroundImgs/evilDeadRiseMainHomePic.jpg";
import backgroundOption2 from "@/assets/images/WelcomePageBackgroundImgs/shaunOfTheDeadMainHomePic.jpg";
import backgroundOption3 from "@/assets/images/WelcomePageBackgroundImgs/houseOf1000CorpsesMainHomePic.jpg";
import backgroundOption4 from "@/assets/images/WelcomePageBackgroundImgs/screamMainHomePic.jpg";
import backgroundOption5 from "@/assets/images/WelcomePageBackgroundImgs/alienMainHomePic.jpg";
import backgroundOption6 from "@/assets/images/WelcomePageBackgroundImgs/fromDuskTillDawnMainHomePic.jpg";
import backgroundOption7 from "@/assets/images/WelcomePageBackgroundImgs/shiningMainHomePic.jpg";
import backgroundOption8 from "@/assets/images/WelcomePageBackgroundImgs/midsommarMainHomePic.jpg";
import backgroundOption9 from "@/assets/images/WelcomePageBackgroundImgs/signsMainHomePic.jpg";
import backgroundOption10 from "@/assets/images/WelcomePageBackgroundImgs/dawnOfTheDeadMainHomePic.jpg";

import { IoSkullOutline } from "react-icons/io5";
import { LiaGhostSolid } from "react-icons/lia";
import { RiUserCommunityLine } from "react-icons/ri";
import { IoGameControllerOutline } from "react-icons/io5";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const WelcomePage: React.FC = () => {
    const backgroundsImages = [
        backgroundOption1,
        backgroundOption2,
        backgroundOption3,
        backgroundOption4,
        backgroundOption5,
        backgroundOption6,
        backgroundOption7,
        backgroundOption8,
        backgroundOption9,
        backgroundOption10,
    ];
    const randomImageSelection =
        backgroundsImages[Math.floor(Math.random() * backgroundsImages.length)];

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        setIsLoggedIn(false);
    };

    return (
        <main className="min-h-screen relative max-h-screen sm:max-h-none">
            <Header onLogOut={handleLogout} />
            <section className="translate-y-[-300px] sm:translate-y-0 xl:translate-y-[70px] -z-10">
                <div className="relative max-w-6xl crt-effect mb-90 mx-auto w-[90%] sm:w-[85%] md:w-[70%] lg:w-[100%] xl:-translate-y-[60px]">
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

                <div className="-translate-y-[420px] text-[1rem] text-center text-white px-4 mt-10 sm:translate-y-0  md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:mt-40 xl:mt-60 xl:-translate-y-110">
                    <h1
                        className="font-bold tracking-wide xl:text-[1.5rem]"
                    >
                        A logbook for the dark side of cinema.
                    </h1>
                    <div
                        className="flex items-center justify-center gap-3 mb-90 text-white xl:mt-5"
                        style={{ gap: "var(--join-gap, 0.5rem)" }}
                    >
                    
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="text-white hover:opacity-90 inline-flex items-center"
                        >
                            <FaInstagram color="#fff" className="w-6 h-6 md:w-7 md:h-7 xl:w-5" />
                        </a>
                        <a
                            href="#"
                            aria-label="TikTok"
                            className="text-white hover:opacity-90 inline-flex items-center"
                        >
                            <FaTiktok color="#fff" className="w-6 h-6 md:w-7 md:h-7 xl:w-5" />
                        </a>

                    </div>
                </div>
                <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:mt-12 xl:-translate-y-95 xl:w-[50%] xl:mx-auto">
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

            </section>
        </main>
    );
};

export default WelcomePage;
