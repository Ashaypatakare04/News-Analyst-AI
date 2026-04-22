const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'ai', 'index.ts');
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
content = content.replace(/\\\\n/g, '\\n');
content = content.replace(/\\\\s\+/g, '\\s+');

fs.writeFileSync(filePath, content, 'utf-8');
