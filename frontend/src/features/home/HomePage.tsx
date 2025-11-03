import React from "react";
import backgroundOption1 from "@/assets/images/evilDeadRiseMainHomePic.jpg";
import backgroundOption2 from "@/assets/images/shaunOfTheDeadMainHomePic.jpg";
import backgroundOption3 from "@/assets/images/terrifierMainHomePic.jpg";
import backgroundOption4 from "@/assets/images/screamMainHomePic.jpg";
import backgroundOption5 from "@/assets/images/jawsMainHomePic.jpg";
import backgroundOption6 from "@/assets/images/fromDuskTillDawnMainHomePic.jpg";
import backgroundOption7 from "@/assets/images/shiningMainHomePic.jpg";    
import appLogo from "@/assets/logo/appLogo.png";
// import { Button } from frontend\src\components\ui\button.tsx;
import { Button } from "../../components/ui/button"

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

            <header className="absolute top-[-10px] left-5 w-full p-4 z-10 gap-5 flex justify-center">
                <img
                    src={appLogo}
                    alt="App Logo" 
                    className="h-23 top-10 left-5 mt-3"
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-9 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold "
                >
                    Log In
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="mt-9 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold"
                >
                    Create an account
                </Button>
                 <Button
                    variant="outline"
                    size="sm"
                    className="mt-9 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold"
                >
                   Trouver un truc
                </Button>
                 <Button
                    variant="outline"
                    size="sm"
                    className="mt-9 text-white hover:bg-[#4C4C4C] px-6 py-3 text-sm font-semibold"
                >
                   Trouver un truc
                </Button>
           </header>

            <section className="py-12">
                <div className="relative mx-auto w-[60%] sm:w-[85%] md:w-[70%] lg:w-[60%] max-w-6xl crt-effect">
                    <img
                        src={randomImageSelection}
                        alt="MainPic"
                        className="block mx-auto w-full h-auto object-contain mask-t-from-50% mask-r-from-90% mask-l-from-90% mask-l-to-100% mask-b-from-50% mask-b-to-100%"
                    />
                </div>

                <div className="md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 text-center text-white px-4 mt-10 md:mt-30">
                    <h1
                        className="font-bold tracking-wide"
                        style={{ fontSize: "var(--type-xxl)", lineHeight: "1" }}
                    >
                        Track every movies or tv Shows you've seen.
                    </h1>
                    <h1
                        className="font-bold tracking-wide mt-4"
                        style={{ fontSize: "var(--type-xxl)", lineHeight: "1" }}
                    >
                        Challenge yourself with themed quizzes.
                    </h1>
                    <h1
                        className="font-bold tracking-wide mt-4"
                        style={{ fontSize: "var(--type-xxl)", lineHeight: "1" }}
                    >
                        Take part on the horror community.
                    </h1>

                </div>

                <div className="mt-1 flex justify-center">
                    <div
                        className="flex items-center whitespace-nowrap"
                        style={{ gap: "var(--join-gap, 0.5rem)" }}
                    >
                        <span className="font-medium">Join us on</span>

                        <div className="flex items-center" style={{ gap: "var(--join-gap, 0.5rem)" }}>
                            <a href="#" aria-label="Instagram" className="text-white hover:opacity-90">
                                <FaInstagram color="#fff" className="text-white w-6 h-6 md:w-7 md:h-7" />
                            </a>
                            <a href="#" aria-label="TikTok" className="text-white hover:opacity-90">
                                <FaTiktok color="#fff" className="text-white w-6 h-6 md:w-7 md:h-7" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
