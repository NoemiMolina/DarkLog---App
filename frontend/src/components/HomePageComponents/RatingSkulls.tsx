import { IoSkull, IoSkullOutline } from "react-icons/io5";
import halfSkullImg from "../../assets/homemadeIcons/halfskull.png";

interface RatingSkullsProps {
  value: number; 
  onChange: (value: number) => void;
}

export default function RatingSkulls({ value, onChange }: RatingSkullsProps) {
  const handleClick = (index: number) => {
    const current = value - index;
    let newValue = index + 1;
    
    if (current >= 1) {
      newValue = index + 0.5;
    } else if (current === 0.5) {
      newValue = index;
    }
    
    onChange(newValue);
  };

  const getSkullState = (index: number) => {
    const fullValue = index + 1;

    if (value >= fullValue) return "full";
    if (value === fullValue - 0.5) return "half-moon";
    return "empty";
  };

  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((index) => {
        const state = getSkullState(index);

        return (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="cursor-pointer"
          >
            {state === "full" && (
              <IoSkull className="w-6 h-6 text-yellow-400" />
            )}

            {state === "half-moon" && (
              <img src={halfSkullImg} alt="half skull" className="w-6 h-6 object-contain relative top-0.5" />
            )}

            {state === "empty" && (
              <IoSkullOutline className="w-6 h-6 text-gray-500" />
            )}
          </div>
        );
      })}
    </div>
  );
}
