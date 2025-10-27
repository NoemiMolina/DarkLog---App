import React from "react";
import background from "@/assets/images/shaunOfTheDeadMainHomePic.jpg";

const HomePage = () => {
    return (
        <div className="bg-black">
            <img
                src={background}
                alt="Shaun of the Dead main background"
                className="w-full h-full object-cover mask-x-from-75% mask-x-to-110% mask-b-from-20% mask-b-to-120% bg-[url('@/assets/images/shaunOfTheDeadMainHomePic.jpg')] "
            />

        </div>
    );
};

export default HomePage;
