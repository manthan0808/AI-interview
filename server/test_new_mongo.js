const mongoose = require('mongoose');

const uri = "mongodb+srv://admin:MVP2005@cluster0.670kwqt.mongodb.net/?appName=Cluster0";

console.log("Attempting connection with new SRV URI...");
mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ FAILURE:", err.message);
    process.exit(1);
  });
