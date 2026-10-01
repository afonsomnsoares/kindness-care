const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'src', 'images');
const files = fs.readdirSync(imagesDir).filter(f => /\.(jpe?g|png)$/i.test(f));

const MAX_WIDTH = 1920;
const QUALITY = 80;

async function convert(file) {
  const input = path.join(imagesDir, file);
  const output = path.join(imagesDir, file.replace(/\.(jpe?g|png)$/i, '.webp'));

  if (fs.existsSync(output)) return;

  const metadata = await sharp(input).metadata();

  const resize = metadata.width > MAX_WIDTH
    ? { width: MAX_WIDTH }
    : undefined;

  await sharp(input)
    .resize(resize)
    .webp({ quality: QUALITY })
    .toFile(output);

  const inSize = (fs.statSync(input).size / 1024).toFixed(0);
  const outSize = (fs.statSync(output).size / 1024).toFixed(0);
  const saved = ((1 - outSize / inSize) * 100).toFixed(0);
  console.log(`${file.padEnd(25)} ${inSize}KB → ${outSize}KB (${saved}% menor)`);
}

(async () => {
  console.log('A converter imagens para WebP...\n');
  for (const f of files) {
    await convert(f);
  }
  console.log('\nConcluído!');
})();
