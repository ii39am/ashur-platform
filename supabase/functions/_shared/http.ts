const productionOrigins = new Set(['https://ashurplatform.com', 'https://www.ashurplatform.com']);
const localhostPattern = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/;

export function approvedOrigin(request: Request) {
  const origin = request.headers.get('Origin');
  if (!origin) return null;
  if (productionOrigins.has(origin)) return origin;
  if (Deno.env.get('ALLOW_LOCALHOST_ORIGINS') === 'true' && localhostPattern.test(origin)) return origin;
  return false;
}

export function responseHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

export function json(origin: string | null, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(origin) });
}

export function authorizeOrigin(request: Request): { origin: string | null; rejection?: Response } {
  const origin = approvedOrigin(request);
  if (origin === false) return { origin: null, rejection: json(null, { error: 'origin_not_allowed' }, 403) };
  return { origin };
}

export async function readLimitedText(request: Request, maxBytes: number): Promise<string> {
  const declared = Number(request.headers.get('Content-Length') ?? 0);
  if (Number.isFinite(declared) && declared > maxBytes) throw new Error('body_too_large');
  if (!request.body) return '';
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > maxBytes) { await reader.cancel(); throw new Error('body_too_large'); }
    chunks.push(value);
  }
  const combined = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { combined.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(combined);
}

export async function readLimitedJson(request: Request, maxBytes: number): Promise<unknown> {
  const text = await readLimitedText(request, maxBytes);
  try { return JSON.parse(text); } catch { throw new Error('invalid_json'); }
}

export function bearerToken(request: Request) {
  const value = request.headers.get('Authorization');
  if (!value?.startsWith('Bearer ')) return null;
  const token = value.slice(7).trim();
  return token || null;
}
