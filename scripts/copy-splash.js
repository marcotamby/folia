const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'splash', 'splash.html');
const destDir = path.join(__dirname, '..', 'dist', 'splash');
const dest = path.join(destDir, 'splash.html');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Splash screen copied successfully to:', dest);
