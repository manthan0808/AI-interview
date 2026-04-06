const { getDb } = require("../config/firebase");

// Helper to get collection
const getUsersCollection = () => getDb().collection("users");

/**
 * User Helper Functions
 */
const User = {
  // Find by ID
  findById: async (id) => {
    const doc = await getUsersCollection().doc(id).get();
    return doc.exists ? { _id: doc.id, ...doc.data() } : null;
  },

  // Find by email
  findOne: async (query) => {
    if (query.email) {
      const snapshot = await getUsersCollection().where("email", "==", query.email.toLowerCase()).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return { _id: doc.id, ...doc.data() };
    }
    return null;
  },

  // Create new user
  create: async (userData) => {
    const { email, ...rest } = userData;
    const newUser = {
      ...rest,
      email: email.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
      credits: userData.credits || 5,
    };
    const docRef = await getUsersCollection().add(newUser);
    return { _id: docRef.id, ...newUser };
  },

  // Update user
  findByIdAndUpdate: async (id, update) => {
    const docRef = getUsersCollection().doc(id);
    await docRef.update({
      ...update,
      updatedAt: new Date(),
    });
    const updatedDoc = await docRef.get();
    return { _id: updatedDoc.id, ...updatedDoc.data() };
  },
};

module.exports = User;
