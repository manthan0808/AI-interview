const admin = require("firebase-admin");

let db;

const initializeFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin SDK initialized");
    }
    db = admin.firestore();
  } catch (error) {
    console.error("❌ Firebase Admin SDK Error:", error.message);
    console.warn("⚠️  Google Auth and Database will not work without valid Firebase credentials");
  }
};

const getDb = () => {
    if (!db) {
        db = admin.firestore();
    }
    return db;
};

module.exports = { admin, getDb, initializeFirebase };
