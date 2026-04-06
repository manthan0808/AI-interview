const { getDb } = require("../config/firebase");

// Helper to get collection
const getInterviewsCollection = () => getDb().collection("interviews");

/**
 * Interview Helper Functions
 */
const Interview = {
  // Find by ID
  findById: async (id) => {
    const doc = await getInterviewsCollection().doc(id).get();
    return doc.exists ? { _id: doc.id, ...doc.data() } : null;
  },

  // Find by User ID
  find: async (query) => {
    let q = getInterviewsCollection();
    if (query.userId) {
      q = q.where("userId", "==", query.userId);
    }
    const snapshot = await q.get();
    return snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
  },

  // Create new interview
  create: async (interviewData) => {
    const newInterview = {
      ...interviewData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: interviewData.status || "in-progress",
    };
    const docRef = await getInterviewsCollection().add(newInterview);
    return { _id: docRef.id, ...newInterview };
  },

  // Update interview
  findByIdAndUpdate: async (id, update) => {
    const docRef = getInterviewsCollection().doc(id);
    await docRef.update({
      ...update,
      updatedAt: new Date(),
    });
    const updatedDoc = await docRef.get();
    return { _id: updatedDoc.id, ...updatedDoc.data() };
  },

  // Find by ID and remove
  findByIdAndDelete: async (id) => {
    const docRef = getInterviewsCollection().doc(id);
    await docRef.delete();
    return true;
  },
};

module.exports = Interview;
