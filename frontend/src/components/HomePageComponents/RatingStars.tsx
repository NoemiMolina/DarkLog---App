import { Star, Moon } from "lucide-react";

interface RatingStarsProps {
  value: number; 
  onChange: (value: number) => void;
}

export default function RatingStars({ value, onChange }: RatingStarsProps) {
  function handleClick(index: number) {
    const current = value - index;
    let newValue = index + 1;
    
    if (current >= 1) {
      newValue = index + 0.5;
    } else if (current === 0.5) {
      newValue = index;
    }
    
    onChange(newValue);
  }

  function getStarState(index: number) {
    const fullValue = index + 1;

    if (value >= fullValue) return "full";
    if (value === fullValue - 0.5) return "half-moon";
    return "empty";
  }

  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((index) => {
        const state = getStarState(index);

        return (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="cursor-pointer"
          >
            {state === "full" && (
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            )}

            {state === "half-moon" && (
              <Moon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            )}

            {state === "empty" && (
              <Star className="w-6 h-6 text-gray-500" />
            )}
          </div>
        );
      })}
    </div>
  );
}
