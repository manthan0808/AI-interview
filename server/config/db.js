// DEPRECATED: This project now uses Firebase Firestore.
// Connection logic has been moved to config/firebase.js
module.exports = () => {
    console.log("⚠️ Legacy MongoDB connection attempt blocked. Using Firestore instead.");
};
