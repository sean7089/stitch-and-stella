import type { APIRoute } from 'astro';
import themes from '../../data/themes.json';
import { jsonResponse } from '../../lib/http';

export const prerender = true;

export const GET: APIRoute = () => jsonResponse(themes);
