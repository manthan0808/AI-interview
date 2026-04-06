require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getDb, initializeFirebase } = require("./config/firebase");

// Import routes
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
console.log(`Starting server process on port ${PORT}...`);

// Initialize Firebase
initializeFirebase();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🚀 AI Interview Agent API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/payment", paymentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: "Internal server error" });
});

// Start server
const startServer = async () => {
    // Attempt to access Firestore collection as a connectivity check
    try {
        await getDb().collection("users").limit(1).get();
        console.log("✅ Firestore collection check success");
    } catch (error) {
        console.error("❌ Firestore connection failed:", error.message);
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
};

startServer();
