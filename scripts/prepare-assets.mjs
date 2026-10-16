import sharp from 'sharp';
import fs from 'node:fs/promises';
await fs.mkdir('public/brand', { recursive: true });
const original = 'public/brand/original-logo.jpg';
await sharp(original)
  .resize(700, 700, { fit: 'inside' })
  .webp({ quality: 90 })
  .toFile('public/brand/logo.webp');
for (const [size, name] of [
  [32, 'favicon'],
  [180, 'apple-touch-icon'],
  [192, 'icon-192'],
  [512, 'icon-512'],
]) {
  await sharp(original)
    .extract({ left: 310, top: 90, width: 1390, height: 1300 })
    .resize(size, size, { fit: 'contain', background: '#ffffff' })
    .png()
    .toFile(`public/brand/${name}.png`);
}
const logo = await sharp(original).resize(430, 430).png().toBuffer();
const text = Buffer.from(
  `<svg width="1200" height="630"><rect width="1200" height="630" fill="#081b33"/><rect x="35" y="35" width="1130" height="560" fill="none" stroke="#c6a76b" stroke-opacity=".5"/><text x="555" y="255" fill="#c6a76b" font-family="Georgia" font-size="19" letter-spacing="5">THE OFFICIAL AUTHOR WEBSITE</text><text x="555" y="330" fill="#ffffff" font-family="Georgia" font-size="58">Dennis Ross</text><text x="558" y="385" fill="#ffffff" font-family="Georgia" font-size="33">Books &amp; Publications</text><path d="M558 425h80" stroke="#c6a76b"/></svg>`,
);
await sharp(text)
  .composite([{ input: logo, left: 85, top: 100 }])
  .jpeg({ quality: 90 })
  .toFile('public/brand/social.jpg');
console.log('Official logo optimized; icons and social preview prepared.');
