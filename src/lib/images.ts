import type { ImageMetadata } from 'astro';
import hero from '../assets/stella-hearts.jpg';
import stella from '../assets/stella-couch.jpg';
import mack from '../assets/mack-car.jpg';
import allie from '../assets/allie.jpg';
import halloween from '../assets/theme-halloween.jpg';
import christmas from '../assets/theme-christmas.jpg';

export const photos = {
  hero,
  stella,
  mack,
  allie,
  halloween,
  christmas,
  heights: mack,
  garden: allie,
} satisfies Record<string, ImageMetadata>;

export const dogs = [
  {
    key: 'stella',
    name: 'Stella',
    breed: 'Goldendoodle',
    alt: 'Stella, a cream goldendoodle, on a couch in a pink gingham bandana stitched with red hearts and the name Stella.',
  },
  {
    key: 'allie',
    name: 'Allie',
    breed: 'Bernedoodle',
    alt: 'Allie, a bernedoodle, wearing a pink gingham bandana with her name stitched on it, sitting beside a stone fireplace.',
  },
  {
    key: 'mack',
    name: 'Mack',
    breed: 'Mini Australian shepherd',
    alt: 'Mack, a mini Australian shepherd, wearing a pink gingham bandana stitched with red hearts and the name Mack.',
  },
] as const;

export function photoFor(key: string): ImageMetadata {
  if (key in photos) return photos[key as keyof typeof photos];
  return photos.hero;
}
