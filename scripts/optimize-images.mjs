import sharp from 'sharp';
import { readdirSync, mkdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const inputDir = './public/images';
const outputDir = './public/images';

const files = readdirSync(inputDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const inputPath = join(inputDir, file);
  const ext = extname(file).toLowerCase();
  const base = basename(file, ext);
  const outputPath = join(outputDir, base + '.webp');

  const before = statSync(inputPath).size;
  totalBefore += before;

  // Product box images (small cards) — max 900px wide
  const isProductBox = file.toLowerCase().includes('box') || file.toLowerCase().includes('diamond') || file.toLowerCase().includes('kids');
  // Banner/model images — max 2400px wide
  const maxWidth = isProductBox ? 900 : 2400;

  try {
    await sharp(inputPath)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath);

    const after = statSync(outputPath).size;
    totalAfter += after;
    console.log(`✓ ${file} → ${base}.webp  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (-${Math.round((1-after/before)*100)}%)`);
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
  }
}

console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB (-${Math.round((1-totalAfter/totalBefore)*100)}%)`);
