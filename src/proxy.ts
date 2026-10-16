import { NextRequest, NextResponse } from 'next/server';
export function proxy(request: NextRequest) {
  if (process.env.CANONICAL_REDIRECTS !== 'true' || !process.env.SITE_URL)
    return NextResponse.next();
  const canonical = new URL(process.env.SITE_URL);
  const host = request.headers.get('host');
  const protocol =
    request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');
  if (host !== canonical.host || protocol !== canonical.protocol.replace(':', '')) {
    const target = new URL(request.nextUrl.pathname + request.nextUrl.search, canonical);
    return NextResponse.redirect(target, 308);
  }
  return NextResponse.next();
}
export const config = { matcher: ['/((?!api|_next|brand|fonts|media|favicon.ico).*)'] };
