require("dotenv").config();
const { getDb, initializeFirebase } = require("./config/firebase");

// Initialize
initializeFirebase();

const giveCredits = async (email, amount) => {
  try {
    const usersCollection = getDb().collection("users");
    const snapshot = await usersCollection.where("email", "==", email.toLowerCase()).limit(1).get();

    if (snapshot.empty) {
      console.log(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      credits: amount,
      updatedAt: new Date()
    });

    console.log(`✅ Success! User ${email} now has ${amount} credits.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating credits:", error.message);
    process.exit(1);
  }
};

// --- SET THE EMAIL AND AMOUNT HERE ---
const TARGET_EMAIL = "patelmanthan0808@gmail.com";
const CREDIT_AMOUNT = 1000;

giveCredits(TARGET_EMAIL, CREDIT_AMOUNT);
