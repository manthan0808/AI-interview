const mongoose = require('mongoose');

const uri = "mongodb://admin:MVP2005@ac-5taiobj-shard-00-00.wfyu50d.mongodb.net:27017,ac-5taiobj-shard-00-01.wfyu50d.mongodb.net:27017,ac-5taiobj-shard-00-02.wfyu50d.mongodb.net:27017/ai-interview-agent?ssl=true&replicaSet=atlas-5taiobj-shard-0&authSource=admin&retryWrites=true&w=majority";

console.log("Attempting legacy connection layout...");
mongoose.connect(uri)
  .then(() => {
    console.log("✅ SUCCESS!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ FAILURE:", err.message);
    process.exit(1);
  });
