import type { APIRoute } from 'astro';
import catalog from '../../data/catalog.json';
import { jsonResponse } from '../../lib/http';

export const prerender = true;

export const GET: APIRoute = () => jsonResponse(catalog);
