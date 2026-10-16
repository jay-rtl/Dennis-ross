import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import siteData from '../../content/site.json';

const asset = z
  .string()
  .regex(/^\/(?:media|brand)\/[a-zA-Z0-9_./ -]+$/)
  .refine((s) => !s.includes('..'));
export const formatSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(1),
  price: z.number().int().positive().optional(),
  currency: z.enum(['USD', 'GBP', 'EUR', 'CAD']).default('USD'),
  stripePriceId: z
    .string()
    .regex(/^price_[a-zA-Z0-9]+$/)
    .optional()
    .or(z.literal('')),
  available: z.boolean().default(false),
  needsShipping: z.boolean().default(true),
  purchaseUrl: z
    .url()
    .refine((value) => {
      if (!URL.canParse(value)) return false;
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password;
    }, 'Use an HTTPS retailer URL without credentials')
    .optional()
    .or(z.literal('')),
  availabilityNote: z.string().optional(),
});
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const bookSchema = z
  .object({
    slug,
    title: z.string().min(1),
    description: z.string().min(30),
    genre: z.string().min(1),
    tagline: z.string().optional(),
    purchaseMode: z.enum(['stripe', 'external']).default('stripe'),
    retailer: z.string().min(1).default('Retailer'),
    cover: asset,
    isbn: z.string().optional(),
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    formats: z
      .array(formatSchema)
      .default([])
      .refine(
        (formats) => new Set(formats.map((f) => f.id)).size === formats.length,
        'Format IDs must be unique',
      ),
  })
  .superRefine((book, context) => {
    if (book.purchaseMode === 'stripe')
      book.formats.forEach((format, index) => {
        if (format.price === undefined)
          context.addIssue({
            code: 'custom',
            path: ['formats', index, 'price'],
            message: 'A real price is required for Stripe formats',
          });
      });
  });
export const articleSchema = z.object({
  slug,
  title: z.string().min(1),
  excerpt: z.string().min(20),
  body: z.string().min(50),
  category: z.enum(['Book releases', 'Author news', 'Writing updates', 'Press releases']),
  date: z.iso.date(),
  image: asset.optional().or(z.literal('')),
  published: z.boolean().default(false),
});
export type Book = z.infer<typeof bookSchema>;
export type BookFormat = z.infer<typeof formatSchema>;
export type Article = z.infer<typeof articleSchema>;
export const site = z
  .object({
    name: z.string().min(1),
    author: z.string().min(1),
    email: z.email(),
    biography: z.string(),
    writingBackground: z.string(),
    literaryJourney: z.string(),
    portrait: asset.or(z.literal('')),
    pressBiography: z.string(),
    mediaKit: asset.or(z.literal('')),
    socials: z.array(
      z.object({
        label: z.string().min(1),
        url: z.url().refine((url) => url.startsWith('https://')),
      }),
    ),
  })
  .parse(siteData);
export const aboutReady = !!(
  site.biography &&
  site.writingBackground &&
  site.literaryJourney &&
  site.portrait
);

function readCollection<T extends { published: boolean; slug: string }>(
  folder: string,
  schema: z.ZodType<T>,
): T[] {
  const directory =
    process.env.CONTENT_DIRECTORY === 'test-fixtures'
      ? path.join(process.cwd(), 'tests', 'fixtures', folder)
      : path.join(process.cwd(), 'content', folder);
  if (!fs.existsSync(directory)) return [];
  const seen = new Set<string>();
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .flatMap((file) => {
      const data = JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'));
      if (!data.published) return [];
      const result = schema.safeParse(data);
      if (!result.success)
        throw new Error(`Invalid published content: ${folder}/${file}: ${result.error.message}`);
      if (seen.has(result.data.slug))
        throw new Error(`Duplicate slug: ${folder}/${result.data.slug}`);
      seen.add(result.data.slug);
      const assetPath =
        'cover' in result.data
          ? result.data.cover
          : 'image' in result.data
            ? result.data.image
            : '';
      if (
        typeof assetPath === 'string' &&
        assetPath &&
        !fs.existsSync(path.join(process.cwd(), 'public', assetPath))
      ) {
        throw new Error(`Missing content image: ${assetPath}`);
      }
      return [result.data];
    });
}
export const getBooks = () => readCollection('books', bookSchema);
export const getArticles = () =>
  readCollection('articles', articleSchema).sort((a, b) => b.date.localeCompare(a.date));
export const money = (price: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price / 100);
export function publicBook(book: Book) {
  return {
    ...book,
    formats: book.formats.map(({ stripePriceId, ...format }) => ({
      ...format,
      purchasable:
        book.purchaseMode === 'stripe' &&
        !!stripePriceId &&
        format.available &&
        format.price !== undefined,
    })),
  };
}
