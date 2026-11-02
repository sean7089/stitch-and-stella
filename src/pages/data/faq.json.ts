import type { APIRoute } from 'astro';
import faq from '../../data/faq.json';
import { jsonResponse } from '../../lib/http';

export const prerender = true;

export const GET: APIRoute = () => jsonResponse(faq);
