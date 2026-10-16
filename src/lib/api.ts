import 'server-only';
import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { siteUrl } from './seo';
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function jsonError(error: unknown) {
  if (error instanceof HttpError)
    return NextResponse.json({ error: error.message }, { status: error.status });
  console.error('Service request failed:', error instanceof Error ? error.name : 'Unknown error');
  return NextResponse.json(
    {
      error:
        'This service is temporarily unavailable. Please try again later or email readdennisross@gmail.com.',
    },
    { status: 503 },
  );
}
export async function body(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (
    origin !== new URL(siteUrl).origin &&
    !(process.env.NODE_ENV !== 'production' && origin === request.nextUrl.origin)
  )
    throw new HttpError(403, 'Please submit this form from our website.');
  if (!request.headers.get('content-type')?.includes('application/json'))
    throw new HttpError(415, 'Please use the website form.');
  if (Number(request.headers.get('content-length') || 0) > 16000)
    throw new HttpError(413, 'Your message is too long.');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, 'Please complete the form.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16000) {
      await reader.cancel();
      throw new HttpError(413, 'Your message is too long.');
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpError(400, 'Please check the form and try again.');
  }
}
const localLimits = new Map<string, { count: number; expires: number }>();
export async function rateLimit(request: NextRequest, scope: string) {
  const proxy = process.env.TRUSTED_PROXY;
  const ip =
    proxy === 'cloudflare'
      ? request.headers.get('cf-connecting-ip')
      : proxy === 'vercel'
        ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
        : 'development';
  if (
    process.env.NODE_ENV === 'production' &&
    (!['cloudflare', 'vercel'].includes(proxy || '') || !ip)
  )
    throw new HttpError(
      503,
      'Online submissions are being configured. Please contact us by email.',
    );
  const key = `dr:${scope}:${createHash('sha256')
    .update(ip || 'unknown')
    .digest('hex')}`;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, 600, 'NX'],
      ]),
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    });
    if (!response.ok) throw new HttpError(503, 'Please try again later.');
    const result = await response.json();
    if (result.some((r: { error?: string }) => r.error) || typeof result[0]?.result !== 'number')
      throw new HttpError(503, 'Please try again later.');
    if (result[0].result > 5)
      throw new HttpError(429, 'Too many attempts. Please try again in 10 minutes.');
  } else if (process.env.NODE_ENV === 'production')
    throw new HttpError(
      503,
      'Online submissions are being configured. Please contact us by email.',
    );
  else {
    const now = Date.now();
    for (const [k, v] of localLimits) {
      if (v.expires < now) localLimits.delete(k);
    }
    let record = localLimits.get(key);
    if (!record || record.expires < now) record = { count: 0, expires: now + 600000 };
    record.count++;
    localLimits.set(key, record);
    if (record.count > 5)
      throw new HttpError(429, 'Too many attempts. Please try again in 10 minutes.');
  }
}
export async function captcha(token: string) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    if (process.env.NODE_ENV === 'production')
      throw new HttpError(503, 'Online forms are being configured. Please email us directly.');
    return;
  }
  if (!token) throw new HttpError(400, 'Please complete the security check.');
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
    signal: AbortSignal.timeout(8000),
  });
  const result = await response.json();
  if (!result.success || result.hostname !== new URL(siteUrl).hostname)
    throw new HttpError(400, 'Security check expired or invalid. Please refresh and try again.');
}
