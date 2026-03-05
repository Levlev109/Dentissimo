const fs = require('fs');
const path = require('path');

function processDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) { processDir(full); continue; }
    if (!/\.(tsx|ts)$/.test(f)) continue;
    let c = fs.readFileSync(full, 'utf8');
    const n = c.replace(/\/images\/([^"']+)\.(png|jpg|jpeg)/g, '/images/$1.webp');
    if (c !== n) { fs.writeFileSync(full, n); console.log('Updated: ' + f); }
  }
}
processDir('./src');
console.log('Done!');
