// Resizes the photos the journalism team uploads through Pages CMS so the site never serves a
// raw phone photo. Runs before every build (see "prebuild" in package.json) and can be run by
// hand with `node scripts/optimize-journalism-images.mjs`.
//
// For every JPEG, PNG or WebP under public/journalism/:
//   - rotate it the way the camera meant it,
//   - shrink it so neither side is over 1800px,
//   - re-encode it at web quality,
//   - drop the camera's metadata (including GPS location) and leave one tag that marks the
//     file as done, so a second run skips it instead of re-compressing it.
// The file keeps its name and format, so links in articles keep working.

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "journalism");
const MAX_SIDE = 1800;
const MARK = "care-web-optimized";
const ENCODERS = {
  ".jpg": (img) => img.jpeg({ quality: 80, mozjpeg: true, progressive: true }),
  ".jpeg": (img) => img.jpeg({ quality: 80, mozjpeg: true, progressive: true }),
  ".png": (img) => img.png({ compressionLevel: 9 }),
  ".webp": (img) => img.webp({ quality: 80 }),
};
const KNOWN_OTHER = new Set([".gif", ".svg", ".avif", ".heic", ".heif", ".md", ".txt", ".gitkeep"]);

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function optimize(file) {
  const ext = path.extname(file).toLowerCase();
  const encode = ENCODERS[ext];
  if (!encode) {
    if (!KNOWN_OTHER.has(ext) && !path.basename(file).startsWith(".")) {
      console.warn(`  skip  ${path.relative(ROOT, file)}: not a JPEG, PNG or WebP, so it is served as uploaded`);
    }
    return false;
  }

  const before = await fs.stat(file);
  const meta = await sharp(file).metadata();
  if (meta.exif && meta.exif.includes(MARK)) return false;

  // Phones and photo apps sometimes save JPEG data under a .png name (and the other way
  // round). Keep whatever the file really is, so a photo never balloons into a true PNG.
  const actual = ENCODERS[`.${meta.format}`] || encode;

  const tmp = `${file}.optimizing`;
  const img = sharp(file)
    .rotate()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
    .withExif({ IFD0: { ImageDescription: MARK } });
  const out = await actual(img).toFile(tmp);
  await fs.rename(tmp, file);
  console.log(
    `  done  ${path.relative(ROOT, file)}: ${meta.width}x${meta.height} ${kb(before.size)} -> ${out.width}x${out.height} ${kb(out.size)}`
  );
  return true;
}

async function main() {
  try {
    await fs.access(ROOT);
  } catch {
    return;
  }
  console.log("Journalism photos:");
  let changed = 0;
  let total = 0;
  for await (const file of walk(ROOT)) {
    total += 1;
    try {
      if (await optimize(file)) changed += 1;
    } catch (err) {
      console.warn(`  fail  ${path.relative(ROOT, file)}: ${err.message}`);
    }
  }
  console.log(`  ${changed} resized, ${total - changed} already fine.`);
}

await main();
