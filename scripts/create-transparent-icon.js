const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pngToIco = require('png-to-ico').default || require('png-to-ico');

const inputPath = path.join(__dirname, '../assets/logo.png');
const outputPath = path.join(__dirname, '../assets/logo.png');
const icoBuildPath = path.join(__dirname, '../build/icon.ico');
const icoAssetsPath = path.join(__dirname, '../assets/icon.ico');

const data = fs.readFileSync(inputPath);
const png = PNG.sync.read(data);

const width = png.width;
const height = png.height;

// Find leaf bounding box
let minX = width, maxX = 0, minY = height, maxY = 0;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    const a = png.data[idx + 3];

    // Check if pixel is part of the green leaf
    const isLeaf = (g > r + 5 && g > b + 5) || (g > 60 && r < 180 && b < 160 && g > r);
    const isBg = (r > 230 && g > 230 && b > 220);

    if (isLeaf && !isBg && a > 20) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

// Add 8px margin
const cropX = Math.max(0, minX - 8);
const cropY = Math.max(0, minY - 8);
const cropW = Math.min(width - cropX, (maxX - minX) + 16);
const cropH = Math.min(height - cropY, (maxY - minY) + 16);

// Create square canvas so icon is not distorted
const size = Math.max(cropW, cropH);
const squarePng = new PNG({ width: size, height: size });

// Center leaf
const offsetX = Math.floor((size - cropW) / 2);
const offsetY = Math.floor((size - cropH) / 2);

// Fill with 100% transparent
for (let i = 0; i < squarePng.data.length; i += 4) {
  squarePng.data[i] = 0;
  squarePng.data[i + 1] = 0;
  squarePng.data[i + 2] = 0;
  squarePng.data[i + 3] = 0; // Alpha = 0
}

// Copy pixels with transparency mask
for (let y = 0; y < cropH; y++) {
  for (let x = 0; x < cropW; x++) {
    const srcX = cropX + x;
    const srcY = cropY + y;
    const srcIdx = (width * srcY + srcX) << 2;

    const destX = offsetX + x;
    const destY = offsetY + y;
    const destIdx = (size * destY + destX) << 2;

    const r = png.data[srcIdx];
    const g = png.data[srcIdx + 1];
    const b = png.data[srcIdx + 2];
    const a = png.data[srcIdx + 3];

    if (a === 0) continue;

    // Detect background vs leaf
    const isBg = (r >= 232 && g >= 232 && b >= 222);
    const isSoftEdge = (r >= 210 && g >= 210 && b >= 200 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20);

    if (isBg) {
      squarePng.data[destIdx + 3] = 0; // 100% transparent
    } else if (isSoftEdge) {
      const brightness = (r + g + b) / 3;
      const alpha = Math.max(0, Math.min(255, Math.floor(255 - (brightness - 210) * 11)));
      squarePng.data[destIdx] = r;
      squarePng.data[destIdx + 1] = g;
      squarePng.data[destIdx + 2] = b;
      squarePng.data[destIdx + 3] = alpha;
    } else {
      squarePng.data[destIdx] = r;
      squarePng.data[destIdx + 1] = g;
      squarePng.data[destIdx + 2] = b;
      squarePng.data[destIdx + 3] = 255; // 100% solid leaf
    }
  }
}

const buffer = PNG.sync.write(squarePng);
fs.writeFileSync(outputPath, buffer);
console.log('Saved transparent PNG logo:', outputPath);

async function createIco() {
  try {
    const icoBuffer = await pngToIco(outputPath);
    fs.writeFileSync(icoBuildPath, icoBuffer);
    fs.writeFileSync(icoAssetsPath, icoBuffer);
    console.log('Generated transparent ICO icons successfully! Size:', icoBuffer.length);
  } catch (err) {
    console.error('Error creating ICO:', err);
  }
}

createIco();
