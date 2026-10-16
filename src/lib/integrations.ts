import 'server-only';
import { legal } from './legal';
export const contactEnabled = () =>
  !!(
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_FROM &&
    (process.env.NODE_ENV !== 'production' ||
      (process.env.TURNSTILE_SECRET_KEY &&
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN &&
        process.env.TRUSTED_PROXY))
  );
export const newsletterEnabled = () =>
  !!(
    legal.mailingAddress.trim() &&
    process.env.BREVO_API_KEY &&
    process.env.BREVO_LIST_ID &&
    process.env.BREVO_DOI_TEMPLATE_ID &&
    (process.env.NODE_ENV !== 'production' ||
      (process.env.TURNSTILE_SECRET_KEY &&
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN &&
        process.env.TRUSTED_PROXY))
  );
