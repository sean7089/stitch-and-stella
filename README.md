# Stitch & Stella

Handmade dog bandanas for Houston’s Heights and Garden Oaks. The site is a static Astro build with Tailwind, a bandana-and-stitch designer, and machine-readable catalog files.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` writes the site to `dist/`.

## Deploy

The production build is static. No server and no database.

- **Cloudflare Pages:** framework preset Astro, build command `npm run build`, output `dist`.
- **Netlify:** `netlify.toml` is already set.
- **Any static host:** publish `dist/`.

Before a public domain goes live, set `site` in `astro.config.mjs` to that origin. Canonical URLs, the sitemap, and the JSON files use it.

`public/_headers` sets basic security headers for hosts that read that file.

## Photos

The files in `Photos/` were empty exports. The photographs used on the site are in `src/assets/` and are turned into AVIF during the build.
