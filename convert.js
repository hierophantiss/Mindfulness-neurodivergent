import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const files = ['chap1.png', 'chap3.png', 'chap4.png'];

async function convert() {
  for (const file of files) {
    const inputPath = path.join('public', file);
    if (!fs.existsSync(inputPath)) continue;
    
    const ext = path.extname(file);
    const basename = path.basename(file, ext);
    const outputPath = path.join('public', `${basename}.webp`);
    
    console.log(`Processing ${file}...`);
    try {
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
        
      console.log(`Converted ${file} to ${basename}.webp`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
}

convert().catch(console.error);
