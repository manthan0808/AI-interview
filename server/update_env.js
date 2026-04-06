const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
let content = fs.readFileSync(envPath, 'utf8');

const newUri = "MONGO_URI=mongodb+srv://admin:MVP2005@cluster0.670kwqt.mongodb.net/?appName=Cluster0";

content = content.replace(/^MONGO_URI=.*/m, newUri);

fs.writeFileSync(envPath, content);
console.log("✅ Updated .env with new MONGO_URI");
