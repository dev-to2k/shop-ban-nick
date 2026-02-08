import sharp from 'sharp';
import { readdir, rename } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BANNERS_DIR = join(__dirname, '../apps/web/public/banners');
const WIDTH = 2560;
const HEIGHT = 1097;

const files = await readdir(BANNERS_DIR);
const images = files.filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));

for (const file of images) {
  const src = join(BANNERS_DIR, file);
  const tmp = join(BANNERS_DIR, `.tmp-${file}`);
  await sharp(src)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
    .toFile(tmp);
  await rename(tmp, src);
  console.log(`Resized ${file} -> ${WIDTH}x${HEIGHT}`);
}

console.log(`Done. ${images.length} banner(s) applied.`);
