import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { body, captcha, rateLimit, HttpError, jsonError } from '@/lib/api';
import { site } from '@/lib/content';
export const runtime = 'nodejs';
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  subject: z.enum([
    'Reader inquiry',
    'Press & media inquiry',
    'Publishing & rights',
    'Book order support',
    'Other',
  ]),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(200).optional(),
  'cf-turnstile-response': z.string().max(2048).optional(),
});
export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await body(request));
    if (!parsed.success)
      throw new HttpError(
        400,
        'Please provide a valid name, email, subject, and message (10–5,000 characters).',
      );
    const data = parsed.data;
    if (data.website) throw new HttpError(400, 'Unable to submit this message.');
    await rateLimit(request, 'contact');
    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_FROM)
      throw new HttpError(
        503,
        `Online messaging is not available yet. Please email ${site.email}.`,
      );
    await captcha(data['cf-turnstile-response'] || '');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM,
        to: [site.email],
        reply_to: data.email,
        subject: `[Dennis Ross Books] ${data.subject}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\n${data.message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      throw new HttpError(503, `Your message could not be delivered. Please email ${site.email}.`);
    return NextResponse.json({ message: 'Your message was sent. Thank you for getting in touch.' });
  } catch (error) {
    return jsonError(error);
  }
}
