export function jsonResponse(data: unknown, extra: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      ...extra,
    },
  });
}

export function textResponse(body: string, type = 'text/plain; charset=utf-8'): Response {
  return new Response(body, {
    headers: {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
