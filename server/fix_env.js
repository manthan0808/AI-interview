const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let lines = fs.readFileSync(envPath, 'utf8').split('\n');

const newUri = "MONGO_URI=mongodb+srv://admin:MVP2005@cluster0.670kwqt.mongodb.net/?appName=Cluster0";

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith("MONGO_URI=")) {
    lines[i] = newUri;
    break;
  }
}

fs.writeFileSync(envPath, lines.join('\n'));
console.log("✅ Fixed .env lines");
