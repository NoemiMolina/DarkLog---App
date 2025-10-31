import React from "react";
import backgroundOption1 from "@/assets/images/evilDeadRiseMainHomePic.jpg";
import backgroundOption2 from "@/assets/images/shaunOfTheDeadMainHomePic.jpg";
import backgroundOption3 from "@/assets/images/terrifierMainHomePic.jpg";
import backgroundOption4 from "@/assets/images/screamMainHomePic.jpg";
import backgroundOption5 from "@/assets/images/jawsMainHomePic.jpg";
import { FaInstagram, FaTiktok } from "react-icons/fa";


const HomePage: React.FC = () => {
    const backgroundsImages = [
        backgroundOption1,
        backgroundOption2,
        backgroundOption3,
        backgroundOption4,
        backgroundOption5,
    ];
    const randomImageSelection =
        backgroundsImages[Math.floor(Math.random() * backgroundsImages.length)];

    return (
        <main className="min-h-screen relative">

            <header className="absolute top-0 left-0 w-full flex items-center justify-center px-10 sm:px-24 lg:px-32 py-6 z-50">
                <div className="w-[160px]" />
                <nav>
                    <p>Sign In</p> 
                    <p>Create Account</p>
                </nav>
            </header>

            <section className="py-12">
                <div className="relative mx-auto w-[60%] sm:w-[85%] md:w-[70%] lg:w-[60%] max-w-6xl">
                    <img
                        src={randomImageSelection}
                        alt="MainPic"
                        className="block mx-auto w-full h-auto object-contain mask-t-from-50% mask-r-from-90% mask-l-from-90% mask-l-to-100% mask-b-from-50% mask-b-to-100%"
                    />
                </div>

                <div className="md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 text-center text-white px-4 mt-8 md:mt-0">
                    <h1
                        className="font-bold tracking-wide"
                        style={{ fontSize: "var(--type-xxl)", lineHeight: "0.5" }}
                    >
                        Track every movies or tv Shows you've seen.
                    </h1>
                    <h1
                        className="font-bold tracking-wide mt-4"
                        style={{ fontSize: "var(--type-xxl)", lineHeight: "0.5" }}
                    >
                        Challenge yourself with themed quizzes.
                    </h1>
                    <h1
                        className="font-bold tracking-wide mt-4"
                        style={{ fontSize: "var(--type-xxl)", lineHeight: "0.5" }}
                    >
                        Take part on the horror community.
                    </h1>
                </div>

                <div className="md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 text-center text-white px-4 mt-8 md:mt-0">
                    <span
                        className="text-sm sm:text-base mb-2 font-medium"
                        style={{ lineHeight: "4.5" }}
                    >
                        Join us on <FaInstagram className="inline text-lg sm:text-xl" /> and{" "}
                        <FaTiktok className="inline text-lg sm:text-xl" />
                    </span>
                </div>
            </section>
        </main>
    );
};

export default HomePage;
