import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import backgroundOption1 from "@/assets/images/WelcomePageBackgroundImgs/evilDeadRiseMainHomePic.jpg";
import backgroundOption2 from "@/assets/images/WelcomePageBackgroundImgs/shaunOfTheDeadMainHomePic.jpg";
import backgroundOption3 from "@/assets/images/WelcomePageBackgroundImgs/terrifierMainHomePic.jpg";
import backgroundOption4 from "@/assets/images/WelcomePageBackgroundImgs/screamMainHomePic.jpg";
import backgroundOption5 from "@/assets/images/WelcomePageBackgroundImgs/jawsMainHomePic.jpg";
import backgroundOption6 from "@/assets/images/WelcomePageBackgroundImgs/fromDuskTillDawnMainHomePic.jpg";
import backgroundOption7 from "@/assets/images/WelcomePageBackgroundImgs/shiningMainHomePic.jpg";
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
            <Header isLoggedIn={isLoggedIn} onLogOut={handleLogout} />
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

export default WelcomePage;
