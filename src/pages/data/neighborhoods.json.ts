import type { APIRoute } from 'astro';
import neighborhoods from '../../data/neighborhoods.json';
import { jsonResponse } from '../../lib/http';

export const prerender = true;

export const GET: APIRoute = () => jsonResponse(neighborhoods);
