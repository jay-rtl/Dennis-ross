// GitHub Pages is static hosting. Build a separate copy so the optional server
// integrations remain available in the original application.
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stage = path.join(root, '.pages-build', 'app');
const basePath = '/Dennis-ross';
const siteUrl = `https://jay-rtl.github.io${basePath}`;
function remove(target) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.join(root, '.pages-build') + path.sep))
    throw new Error('Refusing to remove files outside the Pages build directory');
  rmSync(resolved, { recursive: true, force: true });
}
remove(stage);
mkdirSync(stage, { recursive: true });
for (const entry of ['src', 'public', 'content', 'package.json', 'tsconfig.json'])
  cpSync(path.join(root, entry), path.join(stage, entry), { recursive: true });
for (const entry of ['src/app/api', 'src/proxy.ts', 'src/app/checkout'])
  remove(path.join(stage, entry));
// There are no article routes to export until real articles are published.
const articles = readdirSync(path.join(stage, 'content/articles')).filter((name) =>
  name.endsWith('.json'),
);
if (
  !articles.some(
    (name) =>
      JSON.parse(readFileSync(path.join(stage, 'content/articles', name), 'utf8')).published,
  )
)
  remove(path.join(stage, 'src/app/news/[slug]'));

writeFileSync(
  path.join(stage, 'next.config.ts'),
  `import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export', basePath: ${JSON.stringify(basePath)}, trailingSlash: true,
  images: { unoptimized: true }, poweredByHeader: false,
  turbopack: { root: ${JSON.stringify(root)} },
};
export default config;
`,
);
writeFileSync(
  path.join(stage, 'src/lib/integrations.ts'),
  'export const contactEnabled = () => false;\nexport const newsletterEnabled = () => false;\n',
);

function transform(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      transform(filename);
      continue;
    }
    if (!/\.(tsx?|css)$/.test(entry.name)) continue;
    let source = readFileSync(filename, 'utf8');
    source = source.replace(/from 'next\/image'/g, "from '@/components/pages-image'");
    source = source.replace(
      /export const dynamicParams = true;/g,
      'export const dynamicParams = false;',
    );
    source = source.replace(/url\('\/fonts\//g, `url('${basePath}/fonts/`);
    if (filename.endsWith(path.join('lib', 'intro.ts')))
      source = source.replace(
        "location.pathname !== '/'",
        `(location.pathname !== '${basePath}/' && location.pathname !== '${basePath}')`,
      );
    if (filename.endsWith(path.join('app', 'layout.tsx')))
      source = source
        .replace(/'\/brand\//g, `'${basePath}/brand/`)
        .replace("'/manifest.webmanifest'", `'${basePath}/manifest.webmanifest'`);
    if (filename.endsWith(path.join('app', 'manifest.ts')))
      source = source
        .replace(/'\/brand\//g, `'${basePath}/brand/`)
        .replace("start_url: '/'", `start_url: '${basePath}/'`);
    if (filename.endsWith(path.join('news', '[slug]', 'page.tsx')))
      source = 'export const dynamicParams = false;\n' + source;
    writeFileSync(filename, source);
  }
}
transform(path.join(stage, 'src'));
// Next Image does not automatically prepend basePath to public assets.
writeFileSync(
  path.join(stage, 'src/components/pages-image.tsx'),
  `import Image, { type ImageProps } from 'next/image';
export default function PagesImage(props: ImageProps) {
  const src = typeof props.src === 'string' && props.src.startsWith('/') && !props.src.startsWith('//')
    ? '${basePath}' + props.src : props.src;
  return <Image {...props} src={src} unoptimized />;
}
`,
);
for (const filename of ['robots.ts', 'sitemap.ts', 'manifest.ts']) {
  const target = path.join(stage, 'src/app', filename);
  writeFileSync(target, "export const dynamic = 'force-static';\n" + readFileSync(target, 'utf8'));
}
const result = spawnSync(
  process.execPath,
  [path.join(root, 'node_modules/next/dist/bin/next'), 'build'],
  {
    cwd: stage,
    stdio: 'inherit',
    env: {
      ...process.env,
      SITE_URL: siteUrl,
      STATIC_EXPORT: 'true',
      ADMIN_GITHUB_REPO: '',
      ADMIN_OAUTH_URL: '',
      CONTENT_DIRECTORY: '',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: '',
    },
  },
);
if (result.status !== 0) process.exit(result.status || 1);
const output = path.join(stage, 'out');
if (!existsSync(path.join(output, 'index.html'))) throw new Error('Static homepage missing');
// Next 16's segment export can retain Windows separators. Static hosts need
// the dotted filenames requested by the browser, including dynamic slugs.
function flattenSegments(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const nested = path.join(directory, entry.name);
    if (entry.name.startsWith('__next.')) {
      function copySegments(segmentDirectory) {
        for (const segment of readdirSync(segmentDirectory, { withFileTypes: true })) {
          const source = path.join(segmentDirectory, segment.name);
          if (segment.isDirectory()) copySegments(source);
          else {
            const suffix = path.relative(nested, source).split(path.sep).join('.');
            cpSync(source, path.join(directory, `${entry.name}.${suffix}`));
          }
        }
      }
      copySegments(nested);
    } else flattenSegments(nested);
  }
}
flattenSegments(output);
writeFileSync(path.join(output, '.nojekyll'), '');
console.log(`GitHub Pages output: ${output}\nPublic URL: ${siteUrl}/`);
