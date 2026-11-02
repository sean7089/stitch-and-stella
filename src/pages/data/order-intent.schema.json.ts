import type { APIRoute } from 'astro';
import schema from '../../data/order-intent.schema.json';
import { jsonResponse } from '../../lib/http';

export const prerender = true;

export const GET: APIRoute = () => jsonResponse(schema);
