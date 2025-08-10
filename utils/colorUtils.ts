
import { NationColor } from '../types';

export const COLOR_PALETTE: NationColor[] = [
  { fill: '#dc2626', stroke: '#f87171', fillOpacity: 0.8, tailwind: { bg: 'bg-red-600/80', border: 'border-red-400' } },
  { fill: '#0ea5e9', stroke: '#7dd3fc', fillOpacity: 0.8, tailwind: { bg: 'bg-sky-500/80', border: 'border-sky-300' } },
  { fill: '#059669', stroke: '#34d399', fillOpacity: 0.8, tailwind: { bg: 'bg-emerald-600/80', border: 'border-emerald-400' } },
  { fill: '#9333ea', stroke: '#c084fc', fillOpacity: 0.8, tailwind: { bg: 'bg-purple-600/80', border: 'border-purple-400' } },
  { fill: '#f59e0b', stroke: '#fcd34d', fillOpacity: 0.8, tailwind: { bg: 'bg-amber-500/80', border: 'border-amber-300' } },
  { fill: '#f43f5e', stroke: '#fda4af', fillOpacity: 0.8, tailwind: { bg: 'bg-rose-500/80', border: 'border-rose-300' } },
  { fill: '#14b8a6', stroke: '#5eead4', fillOpacity: 0.8, tailwind: { bg: 'bg-teal-500/80', border: 'border-teal-300' } },
  { fill: '#84cc16', stroke: '#bef264', fillOpacity: 0.8, tailwind: { bg: 'bg-lime-500/80', border: 'border-lime-300' } },
  { fill: '#6366f1', stroke: '#a5b4fc', fillOpacity: 0.8, tailwind: { bg: 'bg-indigo-500/80', border: 'border-indigo-300' } },
  { fill: '#c026d3', stroke: '#e879f9', fillOpacity: 0.8, tailwind: { bg: 'bg-fuchsia-600/80', border: 'border-fuchsia-400' } },
  { fill: '#ea580c', stroke: '#fb923c', fillOpacity: 0.8, tailwind: { bg: 'bg-orange-600/80', border: 'border-orange-400' } },
  { fill: '#06b6d4', stroke: '#67e8f9', fillOpacity: 0.8, tailwind: { bg: 'bg-cyan-500/80', border: 'border-cyan-300' } },
];

// Simple string hashing function to get a consistent color index
const stringToHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Gets a consistent color object from the palette based on a seed string.
 * @param seed A string, like a nation's name, to seed the color generation.
 * @returns An object with `bg` and `border` Tailwind CSS classes.
 */
export const getColorForSeed = (seed: string): NationColor => {
    const colorIndex = stringToHash(seed) % COLOR_PALETTE.length;
    return COLOR_PALETTE[colorIndex];
};