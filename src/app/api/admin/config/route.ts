import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const field = (
  name: string,
  label: string,
  widget = 'string',
  extra: Record<string, unknown> = {},
) => ({ name, label, widget, ...extra });
export async function GET() {
  if (!process.env.ADMIN_GITHUB_REPO || !process.env.ADMIN_OAUTH_URL)
    return NextResponse.json({ error: 'CMS is not configured.' }, { status: 503 });
  return NextResponse.json(
    {
      load_config_file: false,
      backend: {
        name: 'github',
        repo: process.env.ADMIN_GITHUB_REPO,
        branch: process.env.ADMIN_GITHUB_BRANCH || 'main',
        base_url: process.env.ADMIN_OAUTH_URL,
        auth_endpoint: process.env.ADMIN_OAUTH_ENDPOINT || 'auth',
      },
      media_folder: 'public/media',
      public_folder: '/media',
      publish_mode: 'editorial_workflow',
      collections: [
        {
          name: 'settings',
          label: 'Site & author',
          files: [
            {
              name: 'legal',
              label: 'U.S. business & policy details',
              file: 'content/legal.json',
              fields: [
                field(
                  'operatorLegalName',
                  'Legal operator name (use only the verified business name)',
                  'string',
                  { required: false },
                ),
                field(
                  'mailingAddress',
                  'Verified business mailing address / registered PO box',
                  'text',
                  { required: false },
                ),
                field('country', 'Country'),
                field('updatedAt', 'Policy last-updated date', 'datetime', {
                  format: 'YYYY-MM-DD',
                  date_format: 'YYYY-MM-DD',
                  time_format: false,
                }),
              ],
            },
            {
              name: 'site',
              label: 'Site information',
              file: 'content/site.json',
              fields: [
                field('name', 'Website name'),
                field('author', 'Author'),
                field('email', 'Contact email'),
                field('biography', 'Approved biography', 'text', { required: false }),
                field('writingBackground', 'Writing background', 'text', { required: false }),
                field('literaryJourney', 'Literary journey', 'text', { required: false }),
                field('portrait', 'Author portrait', 'image', { required: false }),
                field('pressBiography', 'Approved press biography', 'text', { required: false }),
                field('mediaKit', 'Media kit file', 'file', { required: false }),
                field('socials', 'Official social profiles', 'list', {
                  required: false,
                  fields: [field('label', 'Label'), field('url', 'URL')],
                }),
              ],
            },
          ],
        },
        {
          name: 'books',
          label: 'Books',
          folder: 'content/books',
          create: true,
          extension: 'json',
          format: 'json',
          slug: '{{slug}}',
          fields: [
            field('slug', 'URL slug'),
            field('title', 'Title'),
            field('published', 'Approved for publication', 'boolean', { default: false }),
            field('featured', 'Featured on home', 'boolean', { default: false }),
            field('description', 'Full description (plain text)', 'text'),
            field('genre', 'Genre'),
            field('tagline', 'Cover tagline', 'string', { required: false }),
            field('purchaseMode', 'Purchase method', 'select', {
              options: ['stripe', 'external'],
              default: 'external',
            }),
            field('retailer', 'External retailer name', 'string', {
              required: false,
              default: 'Ingram',
            }),
            field('cover', 'Book cover', 'image'),
            field('isbn', 'ISBN', 'string', { required: false }),
            field('formats', 'Formats', 'list', {
              fields: [
                field('id', 'Format ID (e.g. paperback)'),
                field('label', 'Format name'),
                field('price', 'Price in minor units (e.g. cents)', 'number', {
                  value_type: 'int',
                  min: 1,
                  required: false,
                }),
                field('currency', 'Currency', 'select', { options: ['USD', 'GBP', 'EUR', 'CAD'] }),
                field('stripePriceId', 'Stripe Price ID', 'string', { required: false }),
                field('available', 'Available', 'boolean', { default: false }),
                field('needsShipping', 'Requires shipping', 'boolean', { default: true }),
                field('purchaseUrl', 'Ingram / retailer purchase URL (HTTPS)', 'string', {
                  required: false,
                }),
                field('availabilityNote', 'Edition availability note', 'string', {
                  required: false,
                }),
              ],
            }),
          ],
        },
        {
          name: 'articles',
          label: 'Journal & press releases',
          folder: 'content/articles',
          create: true,
          extension: 'json',
          format: 'json',
          slug: '{{slug}}',
          fields: [
            field('slug', 'URL slug'),
            field('title', 'Title'),
            field('published', 'Approved for publication', 'boolean', { default: false }),
            field('excerpt', 'Short description', 'text'),
            field('body', 'Article (plain text; blank lines separate paragraphs)', 'text'),
            field('category', 'Category', 'select', {
              options: ['Book releases', 'Author news', 'Writing updates', 'Press releases'],
            }),
            field('date', 'Publication date', 'datetime', {
              format: 'YYYY-MM-DD',
              date_format: 'YYYY-MM-DD',
              time_format: false,
            }),
            field('image', 'Article image', 'image', { required: false }),
          ],
        },
      ],
    },
    { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
  );
}
