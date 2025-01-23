import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const historicalEras = [
  {
    id: "ancient",
    name: "Ancient Civilizations",
    image: "https://images.unsplash.com/photo-1712264496898-09eed0caa1c1",
    period: "3000 BCE - 500 CE"
  },
  {
    id: "medieval",
    name: "Medieval Period",
    image: "https://images.unsplash.com/photo-1713711188046-c716c9de586a",
    period: "500 CE - 1500 CE"
  },
  {
    id: "modern",
    name: "Modern Era",
    image: "https://images.unsplash.com/photo-1591030094831-940197bb27ae",
    period: "1500 CE - Present"
  },
  {
    id: "war",
    name: "World Wars",
    image: "https://images.unsplash.com/photo-1571578352024-644c537ae251",
    period: "1914 - 1945"
  },
  {
    id: "revolution",
    name: "Revolutionary Movements",
    image: "https://images.unsplash.com/photo-1698090513815-9122739978d1",
    period: "Various"
  }
];

export function formatDuration(minutes: number): string {
  return `${minutes} min read`;
}
