import fs from 'node:fs/promises';
await fs.mkdir('public/fonts', { recursive: true });
for (const [name, family] of [
  ['cormorant', 'Cormorant+Garamond:wght@400;500;600;700'],
  ['cormorant-italic', 'Cormorant+Garamond:ital,wght@1,400;1,500;1,600;1,700'],
  ['inter', 'Inter:wght@100..900'],
]) {
  const response = await fetch(`https://fonts.googleapis.com/css2?family=${family}&display=swap`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    },
  });
  if (!response.ok) throw new Error('Font stylesheet unavailable');
  const css = await response.text();
  const blocks = [...css.matchAll(/\/\* latin \*\/[\s\S]*?src: url\(([^)]+)\)/g)];
  const fontUrl = blocks.at(-1)?.[1];
  if (!fontUrl) throw new Error('Latin font not found');
  const font = await fetch(fontUrl);
  if (!font.ok) throw new Error('Font download failed');
  await fs.writeFile(`public/fonts/${name}.woff2`, Buffer.from(await font.arrayBuffer()));
  console.log(`Downloaded ${name}`);
}
for (const family of ['cormorantgaramond', 'inter']) {
  const license = await fetch(
    `https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`,
  );
  if (license.ok) await fs.writeFile(`public/fonts/${family}-LICENSE.txt`, await license.text());
}
