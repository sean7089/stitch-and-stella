// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.stitchandstella.com',
  output: 'static',
  compressHTML: true,
  trailingSlash: 'never',
  prefetch: false,
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/data/') && !page.endsWith('/llms.txt'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
