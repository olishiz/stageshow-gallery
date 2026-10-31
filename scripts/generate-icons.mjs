// Renders the app icons from one SVG mark. Run with `npm run icons`.
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const OUT = new URL("../public/icons/", import.meta.url);

// The mark on a 32-unit grid: a tall tile and two small ones, like a bento.
const mark = `
  <rect x="6" y="6" width="11" height="20" rx="3" fill="#fafafa"/>
  <rect x="19" y="6" width="7" height="9" rx="2.5" fill="#38bdf8"/>
  <rect x="19" y="17" width="7" height="9" rx="2.5" fill="#52525b"/>`;

/** `inset` is the share of the canvas the mark's 32-unit box occupies. */
function svg({ size, rounded, inset }) {
  const box = size * inset;
  const offset = (size - box) / 2;
  const s = box / 32;
  const bg = rounded
    ? `<rect width="${size}" height="${size}" rx="${size * 0.225}" fill="#0a0a0a"/>`
    : `<rect width="${size}" height="${size}" fill="#0a0a0a"/>`;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${bg}<g transform="translate(${offset} ${offset}) scale(${s})">${mark}</g></svg>`,
  );
}

const ICONS = [
  { file: "icon-192.png", size: 192, rounded: true, inset: 1 },
  { file: "icon-512.png", size: 512, rounded: true, inset: 1 },
  // Maskable icons keep the mark inside the 80% safe circle.
  { file: "maskable-192.png", size: 192, rounded: false, inset: 0.78 },
  { file: "maskable-512.png", size: 512, rounded: false, inset: 0.78 },
  { file: "apple-touch-icon.png", size: 180, rounded: false, inset: 0.9 },
  { file: "favicon-32.png", size: 32, rounded: true, inset: 1 },
];

await mkdir(OUT, { recursive: true });
for (const icon of ICONS) {
  await sharp(svg(icon)).png().toFile(new URL(icon.file, OUT).pathname);
  console.log(`icons/${icon.file}`);
}
