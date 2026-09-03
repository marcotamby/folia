const fs = require('fs');
const path = require('path');

const pngPath = path.resolve(__dirname, '../assets/logo.png');
const icoPath = path.resolve(__dirname, '../assets/icon.ico');

const pngBuffer = fs.readFileSync(pngPath);
const pngSize = pngBuffer.length;

// Create standard Windows ICO header with embedded 256x256 PNG
// Header: 6 bytes
// Icon Directory Entry: 16 bytes
// Image Data: pngSize bytes
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // Reserved (0)
header.writeUInt16LE(1, 2); // Type (1 = ICO)
header.writeUInt16LE(1, 4); // Number of images (1)

const dirEntry = Buffer.alloc(16);
dirEntry.writeUInt8(0, 0); // Width: 0 = 256px
dirEntry.writeUInt8(0, 1); // Height: 0 = 256px
dirEntry.writeUInt8(0, 2); // Colors (0 = no palette)
dirEntry.writeUInt8(0, 3); // Reserved (0)
dirEntry.writeUInt16LE(1, 4); // Color planes (1)
dirEntry.writeUInt16LE(32, 6); // Bits per pixel (32)
dirEntry.writeUInt32LE(pngSize, 8); // Size of image data
dirEntry.writeUInt32LE(22, 12); // Offset to image data (6 + 16 = 22)

const icoBuffer = Buffer.concat([header, dirEntry, pngBuffer]);
fs.writeFileSync(icoPath, icoBuffer);
console.log('Successfully generated valid binary icon.ico from logo.png (size:', icoBuffer.length, 'bytes)');
