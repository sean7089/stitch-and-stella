# Agent notes

Stitch & Stella is a Houston dog-bandana studio. The site does not sell web development. Pages, prices, and the order draft all read the JSON in `src/data/`.

## Change the business here

- `src/data/catalog.json` — cuts, cloth, sizes, edges, thread, motifs, base price, lead time
- `src/data/themes.json` — blush, Halloween, Christmas presets
- `src/data/neighborhoods.json` — Heights and Garden Oaks copy, ZIPs, handoff windows
- `src/data/faq.json` — questions and answers
- `src/data/business.json` — name, email, city, care, safety. `phone` is blank on purpose. A real number can be added later; the header shows a call link only when `phone` is set.

Do not hardcode a price in a page. Use `formatMoney`, `priceConfiguration`, and `priceBounds` from `src/lib/pricing.ts`.

If a catalog price changes, the designer, the questions page table, schema, and `llms-full.txt` follow. The FAQ prose does not list dollar amounts for that reason.

## How an order works

1. `/customize` is a GET form. Query keys: `theme`, `shape`, `fabric`, `size`, `edge`, `thread`, `motif`, `monogram`.
2. `/contact` reads that link in the browser and prices it with the same `priceConfiguration` function. The site is static, so the ticket is not rendered by a server.
3. The form on that page submits `ticket=1` plus `name`, `email`, `neighborhood`, `fulfillment`, and `note`. The browser then shows the email draft.
4. Nothing is charged and nothing is stored on a server. The order starts when the studio replies.

`neighborhood`: `the-heights`, `garden-oaks`, `other-houston`.

`fulfillment`: `heights-porch`, `garden-oaks-drop`, `ask`.

The honeypot field is `company_website`. Leave it empty.

Published copies of the same facts:

- `/llms.txt`
- `/llms-full.txt`
- `/data/catalog.json`
- `/data/business.json`
- `/data/themes.json`
- `/data/neighborhoods.json`
- `/data/faq.json`
- `/data/agent-manifest.json`
- `/data/order-intent.schema.json`

## Pages

Neighborhood essays live in `neighborhoods.json` and are rendered by `src/pages/neighborhoods/[slug].astro`. Do not add a neighborhood by copying a page and swapping the name. Add a record with its own handoff, ZIPs, and paragraphs.

Themes work the same way through `themes.json`.

## Speed and accessibility

Keep Lighthouse at 100 for performance, accessibility, best practices, and SEO.

- No web fonts and no third-party scripts.
- Photographs go through `astro:assets` in `src/lib/images.ts`.
- Do not force a CSS aspect ratio that fights the photo’s real ratio.
- The designer script is the only client script. It loads on `/customize` only.
- New text must stay dark on the blush background. Use `text-ink`, `text-ink-soft`, or `text-rose-800`. Do not put blush-colored text on a blush background.
- Do not invent reviews, rankings, a street address, or a phone number.

## Local search

The studio’s published area is the Heights (77008, 77009) and Garden Oaks (77018). Houston is the city page. Do not add doorway pages for neighborhoods the studio does not hand off in.
