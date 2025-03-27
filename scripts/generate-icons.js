import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sizes = [
  { width: 16, height: 16, name: 'favicon-16x16.png' },
  { width: 32, height: 32, name: 'favicon-32x32.png' },
  { width: 180, height: 180, name: 'apple-touch-icon.png' },
  { width: 192, height: 192, name: 'android-chrome-192x192.png' },
  { width: 512, height: 512, name: 'android-chrome-512x512.png' },
];

async function generateIcons() {
  // Ensure icons directory exists
  await fs.mkdir('public/icons', { recursive: true });

  // Read the source SVG
  const sourceBuffer = await fs.readFile('public/icon.svg');

  // Generate each size
  for (const size of sizes) {
    await sharp(sourceBuffer)
      .resize(size.width, size.height)
      .png()
      .toFile(`public/icons/${size.name}`);
    
    console.log(`Generated ${size.name}`);
  }
}

generateIcons().catch(console.error); 