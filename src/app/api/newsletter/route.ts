import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { body, captcha, rateLimit, HttpError, jsonError } from '@/lib/api';
import { siteUrl } from '@/lib/seo';
import { legal } from '@/lib/legal';
const schema = z.object({
  email: z.email().max(254),
  consent: z.literal('on'),
  segment: z.enum(['reader', 'reviewer', 'media']).default('reader'),
  website: z.string().max(200).optional(),
  'cf-turnstile-response': z.string().max(2048).optional(),
});
export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await body(request));
    if (!parsed.success)
      throw new HttpError(
        400,
        'Enter a valid email address and agree to receive marketing emails.',
      );
    const data = parsed.data;
    if (data.website) throw new HttpError(400, 'Unable to submit this request.');
    await rateLimit(request, 'newsletter');
    const listId = Number(process.env.BREVO_LIST_ID);
    const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
    if (
      !process.env.BREVO_API_KEY ||
      !legal.mailingAddress.trim() ||
      !Number.isInteger(listId) ||
      listId < 1 ||
      !Number.isInteger(templateId) ||
      templateId < 1
    )
      throw new HttpError(503, 'The newsletter is opening soon. Please check back later.');
    await captcha(data['cf-turnstile-response'] || '');
    const response = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        includeListIds: [listId],
        templateId,
        redirectionUrl: `${siteUrl}/newsletter/confirmed`,
        attributes: {
          SOURCE: 'Dennis Ross Books website',
          SEGMENT: data.segment,
          CONSENT_AT: new Date().toISOString(),
          CONSENT_VERSION: 'reader-list-v1',
        },
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      throw new HttpError(503, 'We could not process your signup. Please try again later.');
    return NextResponse.json({
      message:
        'Check your inbox for a confirmation email. Your signup is complete only after you confirm.',
    });
  } catch (error) {
    return jsonError(error);
  }
}
