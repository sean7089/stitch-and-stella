import type { APIRoute } from 'astro';
import business from '../data/business.json';
import { textResponse } from '../lib/http';
import { llmsFullText } from '../lib/llms';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL(business.url)).origin;
  return textResponse(llmsFullText(origin));
};
