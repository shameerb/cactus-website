// @ts-check
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_SVG = path.join(process.cwd(), 'public/icon.svg');
const OUTPUT_DIR = path.join(process.cwd(), 'public/icons');

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const ICON_SIZES = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'favicon.png', size: 32 },
  { name: 'favicon-16.png', size: 16 },
];

async function generateIcons() {
  console.log(`Generating icons from ${SOURCE_SVG}...`);
  
  for (const { name, size } of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, name);
    
    console.log(`Generating ${name} (${size}x${size})...`);
    
    await sharp(SOURCE_SVG)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Created ${outputPath}`);
  }
  
  // Also create favicon.ico (copy from favicon.png)
  const faviconPath = path.join(OUTPUT_DIR, 'favicon.ico');
  fs.copyFileSync(path.join(OUTPUT_DIR, 'favicon.png'), faviconPath);
  console.log(`✅ Created ${faviconPath}`);
  
  // Copy favicon.ico to the public directory root for better compatibility
  const rootFaviconPath = path.join(process.cwd(), 'public/favicon.ico');
  fs.copyFileSync(faviconPath, rootFaviconPath);
  console.log(`✅ Created ${rootFaviconPath}`);
  
  console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
}); 