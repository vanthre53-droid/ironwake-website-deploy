// ponytail: one-shot icon builder. Regenerates app/favicon.ico + app/apple-icon.png
// from the canonical app/icon.svg + app/apple-icon.svg sources. Idempotent.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const pngBuf = (svgPath, size) =>
  sharp(svgPath).resize(size, size).png().toBuffer();

// 1. favicon.ico — multi-size 16/32/48 ICO
async function buildFavicon() {
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => pngBuf(path.join(root, 'app/icon.svg'), s)));
  const headerSize = 6;
  const dirSize = 16 * sizes.length;
  let offset = headerSize + dirSize;
  const dirEntries = sizes.map((size, i) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(pngs[i].length, 8); // bytes
    entry.writeUInt32LE(offset, 12); // offset
    offset += pngs[i].length;
    return entry;
  });
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(sizes.length, 4);
  const ico = Buffer.concat([header, ...dirEntries, ...pngs]);
  await writeFile(path.join(root, 'app/favicon.ico'), ico);
  console.log('wrote app/favicon.ico', ico.length, 'bytes');
}

// 2. apple-icon.png — 180x180 PNG
async function buildAppleIcon() {
  const png = await pngBuf(path.join(root, 'app/apple-icon.svg'), 180);
  await writeFile(path.join(root, 'app/apple-icon.png'), png);
  console.log('wrote app/apple-icon.png', png.length, 'bytes');
}

// 3. public/logo.png — 512x512 PNG for crawlers + social
async function buildPublicLogo() {
  const png = await pngBuf(path.join(root, 'app/icon.svg'), 512);
  await writeFile(path.join(root, 'public/logo.png'), png);
  console.log('wrote public/logo.png', png.length, 'bytes');
}

await buildFavicon();
await buildAppleIcon();
await buildPublicLogo();
