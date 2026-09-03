const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico').default || require('png-to-ico');

async function generate() {
  const logoPath = path.resolve(__dirname, '../assets/logo.png');
  const icoPath = path.resolve(__dirname, '../assets/icon.ico');
  const buildDir = path.resolve(__dirname, '../build');
  const buildIcoPath = path.resolve(__dirname, '../build/icon.ico');

  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  try {
    const buf = await pngToIco(logoPath);
    fs.writeFileSync(icoPath, buf);
    fs.writeFileSync(buildIcoPath, buf);
    console.log('Successfully generated real multi-resolution Windows ICO file (size: ' + buf.length + ' bytes)');
  } catch (err) {
    console.error('Error generating ICO:', err);
  }
}

generate();
