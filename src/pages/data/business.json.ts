import type { APIRoute } from 'astro';
import business from '../../data/business.json';
import { jsonResponse } from '../../lib/http';

export const prerender = true;

export const GET: APIRoute = () => jsonResponse(business);
