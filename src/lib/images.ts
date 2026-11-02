import type { ImageMetadata } from 'astro';
import hero from '../assets/hero-porch.jpg';
import stitch from '../assets/stitch-detail.jpg';
import halloween from '../assets/theme-halloween.jpg';
import christmas from '../assets/theme-christmas.jpg';
import heights from '../assets/heights-walk.jpg';
import flatlay from '../assets/flatlay-bandanas.jpg';
import garden from '../assets/garden-oaks-yard.jpg';

export const photos = {
  hero,
  stitch,
  halloween,
  christmas,
  heights,
  flatlay,
  garden,
} satisfies Record<string, ImageMetadata>;

export function photoFor(key: string): ImageMetadata {
  if (key in photos) return photos[key as keyof typeof photos];
  return photos.hero;
}
