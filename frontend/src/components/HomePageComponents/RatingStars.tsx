import { useState } from "react";

// will be upgraded to custom skulls later instead of stars

interface RatingStarsProps {
    value?: number;            
    onChange?: (rating: number) => void;
}

export default function RatingStars({ value = 0, onChange }: RatingStarsProps) {
    const [rating, setRating] = useState(value);

    const handleClick = (index: number) => {
        const current = rating - index;

        let newValue = rating;
        if (current >= 1) {
            newValue = index + 0.5;
        }
        else if (current === 0.5) {
            newValue = index;
        }
        else {
            newValue = index + 1;
        }

        setRating(newValue);
        onChange && onChange(newValue);
    };

    const getState = (index: number) => {
        if (rating >= index + 1) return "full";
        if (rating >= index + 0.5) return "half";
        return "empty";
    };

    return (
        <div className="flex gap-1 cursor-pointer xl:text-2xl">
            {[0, 1, 2, 3, 4].map((i) => {
                const state = getState(i);

                return (
                    <div key={i} onClick={() => handleClick(i)}>
                        {state === "full" && "⭐"}
                        {state === "half" && "🌓"}
                        {state === "empty" && "☆"}
                    </div>
                );
            })}
        </div>
    );
}
