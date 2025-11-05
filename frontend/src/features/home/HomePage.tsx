import React, { useState } from "react";
import { createPortal } from "react-dom";
import backgroundOption1 from "@/assets/images/evilDeadRiseMainHomePic.jpg";
import backgroundOption2 from "@/assets/images/shaunOfTheDeadMainHomePic.jpg";
import backgroundOption3 from "@/assets/images/terrifierMainHomePic.jpg";
import backgroundOption4 from "@/assets/images/screamMainHomePic.jpg";
import backgroundOption5 from "@/assets/images/jawsMainHomePic.jpg";
import backgroundOption6 from "@/assets/images/fromDuskTillDawnMainHomePic.jpg";
import backgroundOption7 from "@/assets/images/shiningMainHomePic.jpg";
import appLogo from "@/assets/logo/appLogo.png";
import { Button } from "../../components/ui/button"
import GetLuckyButtonPopover from "../../components/GetLuckyButtonPopover";
import PublicSearchBar from "../../components/PublicSearchBar";
import { FaInstagram, FaTiktok } from "react-icons/fa";


const HomePage: React.FC = () => {
    const backgroundsImages = [
        backgroundOption1,
        backgroundOption2,
        backgroundOption3,
        backgroundOption4,
        backgroundOption5,
        backgroundOption6,
        backgroundOption7,
    ];
    const randomImageSelection =
        backgroundsImages[Math.floor(Math.random() * backgroundsImages.length)];

    return (
        <main className="min-h-screen relative max-h-screen sm:max-h-none">
            <header className="text-center -translate-y-[20px] flex flex-col items-center justify-center gap-4 p-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 sm:p-6 xl:flex-row xl:items-center xl:justify-center xl:gap-8 xl:space-x-6 xl:p-8 xl:mt-4 xl:translate-y-5">
                <img
                    src={appLogo}
                    alt="App Logo"
                    className="h-auto w-20 order-1 w-60 sm:w-32 md:w-40 xl:w-60 xl:translate-y-0"

                />
                <div className="order-3 -translate-y-[300px] w-20 pt-0.2 mr-60 sm:w-80 xl:translate-x-2 xl:translate-y-[-20px] xl:mr-0 xl:w-80 xl:gap-4">
                    <PublicSearchBar />
                </div>
                <div className="flex flex-row items-center -translate-y-[65px] order-2 gap-2 mb-50 sm:flex-row sm:gap-4 xl:mb-10 xl:translate-y-[-0px] xl:gap-4 xl:ml-2 xl:flex-row">
                    <Button
                        variant="outline"
                        size="sm"
                        className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold "
                    >
                        Log In
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold"
                    >
                        Sign Up
                    </Button>
                    <GetLuckyButtonPopover />
                </div>
            </header>

            <section className="translate-y-[-300px] sm:translate-y-0 xl:translate-y-[70px]">
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

                <div className="-translate-y-[420px] text-[1rem] text-center text-white px-4 mt-10 sm:translate-y-0  md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:mt-40 xl:mt-60 xl:-translate-y-30">
                    <h1
                        className="font-bold tracking-wide xl:text-[1.5rem]"
                    >
                        A logbook for the dark side of cinema.
                    </h1>
                    <div
                        className="flex items-center justify-center gap-3 mb-90 text-white xl:mt-5"
                        style={{ gap: "var(--join-gap, 0.5rem)" }}
                    >
                        <span className="font-small">Join us on</span>

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

            </section>
        </main>
    );
};

export default HomePage;


// do not touch anything from now