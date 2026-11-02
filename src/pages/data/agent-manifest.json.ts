import type { APIRoute } from 'astro';
import business from '../../data/business.json';
import { jsonResponse } from '../../lib/http';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL(business.url)).origin;
  return jsonResponse({
    name: business.name,
    version: '1.0.0',
    updated: business.contentUpdated,
    description: business.description,
    facts: `${origin}/llms.txt`,
    factsFull: `${origin}/llms-full.txt`,
    catalog: `${origin}/data/catalog.json`,
    themes: `${origin}/data/themes.json`,
    neighborhoods: `${origin}/data/neighborhoods.json`,
    faq: `${origin}/data/faq.json`,
    business: `${origin}/data/business.json`,
    orderSchema: `${origin}/data/order-intent.schema.json`,
    actions: [
      {
        name: 'openDesigner',
        method: 'GET',
        href: `${origin}/customize`,
        query: ['theme', 'shape', 'fabric', 'size', 'edge', 'thread', 'motif', 'monogram'],
      },
      {
        name: 'composeStitchTicket',
        method: 'GET',
        href: `${origin}/contact`,
        description:
          'Shows a priced email draft. Does not charge a card and does not create an order. The order starts when the studio replies to the email.',
        query: [
          'ticket=1',
          'theme',
          'shape',
          'fabric',
          'size',
          'edge',
          'thread',
          'motif',
          'monogram',
          'name',
          'email',
          'dog',
          'neighborhood',
          'fulfillment',
          'note',
        ],
        neighborhood: ['the-heights', 'garden-oaks', 'other-houston'],
        fulfillment: ['heights-porch', 'garden-oaks-drop', 'ask'],
      },
    ],
  });
};
