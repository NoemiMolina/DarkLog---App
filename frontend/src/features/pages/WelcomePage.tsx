import React from "react";
import Header from "../../components/HeaderComponents/Header";
import appLogo from "@/assets/logo/appLogo.png";
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
import News from "../../components/NewsComponents/News";

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

    const handleLogout = () => {
        localStorage.removeItem("userToken");
    };

    return (
        <main className="min-h-screen relative">
            <Header onLogOut={handleLogout} />
            <section className="translate-y-0 sm:translate-y-0 2xl:translate-y-[70px] -z-10">
                <div className="relative crt-effect mb-20 sm:mb-90 w-screen mx-0 sm:w-[85%] sm:mx-auto sm:max-w-6xl md:w-[70%] lg:w-[100%] 2xl:-translate-y-[60px]">
                    <img
                        src={randomImageSelection}
                        alt="MainPic"
                        style={{
                            height: window.innerWidth < 640 ? '30vh' : 'auto'
                        }}
                        className="block mx-auto w-screen sm:w-full sm:h-auto object-cover sm:object-contain
        mask-t-from-85% mask-t-to-100%
        mask-b-from-40% mask-b-to-100%
        mask-l-from-85% mask-l-to-100%
        mask-r-from-85% mask-r-to-100%
        transition-all duration-500"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 sm:hidden z-10">
                        <img
                            src={appLogo}
                            alt="App Logo"
                            className="h-2 w-2 sm:h-auto sm:w-10"
                        />
                    </div>
                </div>

                <div className="translate-y-0 text-[0.75rem] sm:text-[1rem] text-center text-white px-4 -mt-16 sm:mt-10 sm:-translate-y-[420px] md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:mt-40 xl:-translate-y-95 xl:mt-40 2xl:mt-50 2xl:-translate-y-110">
                    <h1
                        className="font-bold tracking-wide text-[0.85rem] sm:text-[1rem] xl:text-[1.5rem] 2xl:text-[1.5rem] italic"
                        style={{ fontFamily: "'Workbench', monospace" }}
                    >
                        A logbook for the dark side of cinema.
                    </h1>
                    <div
                        className="flex items-center justify-center gap-3 mb-10 sm:mb-90 mt-4 text-white xl:mt-5 2xl:mt-5"
                        style={{ gap: "var(--join-gap, 0.5rem)" }}
                    >

                        <a
                            href="https://www.instagram.com/fearlogapp/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-white hover:opacity-90 inline-flex items-center"
                        >
                            <FaInstagram color="#fff" className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 2xl:w-5" />
                        </a>
                        <a
                            href="https://www.tiktok.com/@fearlogapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            className="text-white hover:opacity-90 inline-flex items-center"
                        >
                            <FaTiktok color="#fff" className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 2xl:w-5" />
                        </a>

                    </div>
                </div>
                <div className="grid grid-cols-1 -mt-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:mt-12 lg:-w-[90%] xl:max-w-[80%] xl:translate-x-35 xl:-translate-y-80 2xl:-translate-y-95 2xl:translate-x-0 2xl:w-[60%] 2xl:mx-auto px-4 sm:px-0">
                        <div className="flex flex-col items-center text-center p-4 border border-white rounded-lg bg-black/30 backdrop-blur-sm shadow-sm">
                        <IoSkullOutline className="text-2xl sm:text-4xl mb-2" />
                        <p className="text-sm sm:hidden">Explore and rate horror movies</p>
                        <p className="text-sm hidden sm:block">Discover and explore a vast collection of horror movies or series. Rate and comment the ones you've already seen, add to your wishlist the ones you did not watch yet.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 border border-white rounded-lg bg-black/30 backdrop-blur-sm shadow-sm">
                        <LiaGhostSolid className="text-2xl sm:text-4xl mb-2" />
                        <p className="text-sm sm:hidden">See what your friends are watching</p>
                        <p className="text-sm hidden sm:block">Connect with your friends, see what they are watching, and share your own horror movie or tv show experiences.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 border border-white rounded-lg bg-black/30 backdrop-blur-sm shadow-sm">
                        <RiUserCommunityLine className="text-2xl sm:text-4xl mb-2" />
                        <p className="text-sm sm:hidden">Join the horror community</p>
                        <p className="text-sm hidden sm:block">Join a community of horror enthusiasts, participate in discussions, and stay updated with the latest news and trends in the horror genre with our dedicated forum.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 border border-white rounded-lg bg-black/30 backdrop-blur-sm shadow-sm">
                        <IoGameControllerOutline className="text-2xl sm:text-4xl mb-2" />
                        <p className="text-sm sm:hidden">Challenge yourself</p>
                        <p className="text-sm hidden sm:block">Challenge yourself with our home made horror-themed quizzes.</p>
                    </div>
                </div>
                <div className="xl:-mt-70 2xl:-mt-80">
                   <News newsCarouselClassName="lg:ml-[-250px] xl:pl-90 xl:w-[1540px] 2xl:pl-150 2xl:w-[1770px]" />
                </div>


            </section>
        </main>
    );
};

export default WelcomePage;
