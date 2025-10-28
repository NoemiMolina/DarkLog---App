import React from "react";
import backgroundOption1 from "@/assets/images/evilDeadRiseMainHomePic.jpg";
import backgroundOption2 from "@/assets/images/shaunOfTheDeadMainHomePic.jpg";
import backgroundOption3 from "@/assets/images/terrifierMainHomePic.jpg";
import backgroundOption4 from "@/assets/images/screamMainHomePic.jpg";
import backgroundOption5 from "@/assets/images/jawsMainHomePic.jpg";

const HomePage: React.FC = () => {

    const backgroundsImages = [backgroundOption1, backgroundOption2, backgroundOption3, backgroundOption4, backgroundOption5];
    const randomImageSelection = backgroundsImages[Math.floor(Math.random() * backgroundsImages.length)];

    return (
        <main className="min-h-screen">
            <section className="py-16">
                <div className="relative mx-auto w-[60%] max-w-6xl">
                    <img
                        src={randomImageSelection}
                        alt="MainPic"
                        className="block mx-auto w-full h-auto object-contain mask-t-from-50% mask-r-from-90% mask-l-from-90% mask-l-to-100% mask-b-from-50% mask-b-to-100% "
                    />
                </div>
                <div className="absolute top-3/5 left-1/2 transform -translate-x-1/2 text-center text-white">
                    <h1 className="text-5xl font-bold tracking-wide">TRACK EVERY FILM OR TV SHOW YOU'VE SEEN.</h1>
                    <h1 className="text-5xl font-bold tracking-wide">CHALLENGE YOURSELF WITH THEMED QUIZZ.</h1>
                    <h1 className="text-5xl font-bold tracking-wide">TAKE PART OF blabla sur le forum</h1>
                </div>

            </section>

        </main>
    );
};

export default HomePage;
