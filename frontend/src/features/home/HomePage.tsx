import React from "react";
import backgroundOption1 from "@/assets/images/evilDeadRiseMainHomePic.jpg";
import backgroundOption2 from "@/assets/images/shaunOfTheDeadMainHomePic.jpg";
import backgroundOption3 from "@/assets/images/terrifierMainHomePic.jpg";
import backgroundOption4 from "@/assets/images/screamMainHomePic.jpg";
import backgroundOption5 from "@/assets/images/jawsMainHomePic.jpg";
import backgroundOption6 from "@/assets/images/fromDuskTillDawnMainHomePic.jpg";
import backgroundOption7 from "@/assets/images/shiningMainHomePic.jpg";
import appLogo from "@/assets/logo/appLogo.png";
import { Button } from "../../components/ui/button"
import GetLuckyButton from "../../components/GetLuckyButton";
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
        <main className="min-h-screen relative">

            <header className="flex flex-col items-center justify-center gap-4 p-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6 sm:p-6 text-center -translate-y-[20px]">

                <img
                    src={appLogo}
                    alt="App Logo"
                    className="logoWebsite w-20 order-1 w-60 sm:w-32 md:w-40 xl:w-60 h-auto"

                />

                <div className="PublicSearchBar order-2 -translate-y-[50px] w-20 pt-0.2 mr-60 sm:w-80 xl:mb-15">
                    <PublicSearchBar />
                </div>
                <div className="flex flex-col items-center -translate-y-[95px] order-3 mb-50 sm:flex-row sm:gap-4 xl:mb-10">
                    <Button
                        variant="outline"
                        size="sm"
                        className="headerButton button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold "
                    >
                        Log In
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="headerButton button-text mt-9 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold"
                    >
                        Create an account
                    </Button>
                    <GetLuckyButton />
                </div>


            </header>

            <section className="py-10 -translate-y-[350px] sm:translate-y-0">
                <div className="relative mb-90 mx-auto w-[90%] sm:w-[85%] md:w-[70%] lg:w-[60%] max-w-6xl crt-effect xl:-translate-y-[100px]">
                    <img
                        src={randomImageSelection}
                        alt="MainPic"
                        className="mainPic block mx-auto w-full h-auto object-contain
        mask-t-from-85% mask-t-to-100%
        mask-b-from-40% mask-b-to-100%
        mask-l-from-85% mask-l-to-100%
        mask-r-from-85% mask-r-to-100%
        transition-all duration-500"
                    />
                </div>

                <div className="md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 text-center text-white px-4 mt-10 md:mt-40 xl:mt-60 -translate-y-[420px] font-small sm:translate-y-0">
                    <h1
                        className="homePageCatchPhrase font-bold tracking-wide"
                        style={{ fontSize: "var(--type-small)" }}
                    >
                        A logbook for the dark side of cinema.
                    </h1>

                    <div
                        className="flex items-center justify-center gap-3 xl:mt-5 mb-90 text-white"
                        style={{ gap: "var(--join-gap, 0.5rem)"}}
                    >
                        <span className="join-us font-small" style={{ fontSize: "var(--type-small)" }}>Join us on</span>

                        <a
                            href="#"
                            aria-label="Instagram"
                            className="text-white hover:opacity-90 inline-flex items-center"
                        >
                            <FaInstagram color="#fff" className="w-6 h-6 md:w-7 md:h-7" />
                        </a>
                        <a
                            href="#"
                            aria-label="TikTok"
                            className="text-white hover:opacity-90 inline-flex items-center"
                        >
                            <FaTiktok color="#fff" className="w-6 h-6 md:w-7 md:h-7" />
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
