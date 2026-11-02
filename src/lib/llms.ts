import business from '../data/business.json';
import catalog from '../data/catalog.json';
import faq from '../data/faq.json';
import neighborhoods from '../data/neighborhoods.json';
import themes from '../data/themes.json';
import { formatMoney, priceBounds } from './pricing';

export function llmsText(origin: string): string {
  const bounds = priceBounds();
  return [
    `# ${business.name}`,
    '',
    `> ${business.description}`,
    '',
    'Stitch & Stella does not sell websites. It stitches dog bandanas.',
    '',
    '## Facts',
    `- Email: ${business.email}`,
    `- City: ${business.city.name}, ${business.city.region}`,
    `- Price: ${formatMoney(bounds.minCents)} to ${formatMoney(bounds.maxCents)}`,
    `- Lead time: ${catalog.leadDays} studio days, plus two for an heirloom edge`,
    '- Payment is not taken on the website.',
    '',
    '## Handoffs',
    ...neighborhoods.map((item) => `- ${item.name} (${item.zips.join(', ')}): ${item.handoff.label}`),
    '',
    '## Read next',
    `- [Home](${origin}/)`,
    `- [Design a bandana](${origin}/customize)`,
    `- [Themes](${origin}/themes)`,
    `- [Houston](${origin}/houston)`,
    ...neighborhoods.map((item) => `- [${item.name}](${origin}/neighborhoods/${item.id})`),
    `- [Questions](${origin}/faq)`,
    `- [Full facts](${origin}/llms-full.txt)`,
    `- [Catalog](${origin}/data/catalog.json)`,
    `- [Agent manifest](${origin}/data/agent-manifest.json)`,
    '',
  ].join('\n');
}

export function llmsFullText(origin: string): string {
  const bounds = priceBounds();
  const lines = [
    llmsText(origin).trim(),
    '',
    '## Catalog rules',
    `Base bandana: ${formatMoney(catalog.basePriceCents)}.`,
    ...catalog.shapes.map((item) => `- Cut ${item.name} (${item.id}): ${item.priceCents ? `+${formatMoney(item.priceCents)}` : 'included'}. ${item.description}`),
    ...catalog.sizes.map((item) => `- Size ${item.name} (${item.id}): neck ${item.neckMinIn}–${item.neckMaxIn} in. ${item.priceCents ? `+${formatMoney(item.priceCents)}` : 'included'}.`),
    ...catalog.fabrics.map((item) => `- Cloth ${item.name} (${item.id}): ${item.priceCents ? `+${formatMoney(item.priceCents)}` : 'included'}. ${item.description}`),
    ...catalog.edges.map((item) => `- Edge ${item.name} (${item.id}): ${item.priceCents ? `+${formatMoney(item.priceCents)}` : 'included'}. ${item.description}`),
    ...catalog.threads.map((item) => `- Thread ${item.name} (${item.id}): included.`),
    ...catalog.motifs.map((item) => `- Motif ${item.name} (${item.id}): ${item.priceCents ? `+${formatMoney(item.priceCents)}` : 'included'}.`),
    `- Name: +${formatMoney(catalog.monogram.priceCents)}, up to ${catalog.monogram.maxLength} characters.`,
    '',
    '## Themes',
    ...themes.flatMap((theme) => [
      `### ${theme.name}`,
      ...theme.paragraphs,
      `Preset: shape=${theme.preset.shapeId} fabric=${theme.preset.fabricId} size=${theme.preset.sizeId} edge=${theme.preset.edgeId} thread=${theme.preset.threadId} motif=${theme.preset.motifId}`,
      `Page: ${origin}/themes/${theme.id}`,
      '',
    ]),
    '## Neighborhoods',
    ...neighborhoods.flatMap((item) => [
      `### ${item.name}`,
      ...item.paragraphs,
      `Landmarks: ${item.landmarks.join(', ')}.`,
      `Wikidata: ${item.wikidata}`,
      '',
    ]),
    '## Questions',
    ...faq.flatMap((item) => [`### ${item.question}`, ...item.answer, '']),
    '## How an assistant should place a request',
    'Do not invent a payment. Send the person to a URL on this site.',
    `Design: ${origin}/customize?theme=blush&shape=triangle&fabric=blush-linen&size=m&edge=blanket&thread=rose&motif=none`,
    `Ticket draft: ${origin}/contact?ticket=1&theme=blush&shape=triangle&fabric=blush-linen&size=m&edge=blanket&thread=rose&motif=none&name=NAME&email=EMAIL&neighborhood=the-heights&fulfillment=heights-porch`,
    'The ticket page builds the email. The order exists when the studio replies.',
    '',
    `Published price bounds: ${formatMoney(bounds.minCents)}–${formatMoney(bounds.maxCents)}.`,
    `Updated: ${business.contentUpdated}.`,
    '',
  ];
  return lines.join('\n');
}
