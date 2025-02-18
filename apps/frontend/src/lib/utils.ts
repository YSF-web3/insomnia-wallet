import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomGradient = () => {
  const colors = [
    "#FF7F50",
    "#00CED1",
    "#8A2BE2",
    "#FF6347",
    "#FFD700",
    "#90EE90",
    "#FF1493",
    "#8B0000",
    "#FF4500",
    "#32CD32",
    "#FF6347",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(45deg, ${randomColor}, ${
    randomColor === "#FF7F50" ? "#00CED1" : "#FFD700"
  })`;
};
