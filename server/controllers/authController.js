const jwt = require("jsonwebtoken");
const { admin } = require("../config/firebase");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * POST /api/auth/google
 * Verify Firebase Google token → create/find user → return JWT
 */
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { name, email, picture } = decodedToken;

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || "User",
        email,
        photoURL: picture || "",
        credits: 5,
      });
      console.log(`✅ New user created: ${email}`);
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error.message);
    res.status(500).json({ message: "Authentication failed", error: error.message });
  }
};

/**
 * GET /api/auth/me
 * Return current authenticated user
 */
const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      credits: user.credits,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get Me Error:", error.message);
    res.status(500).json({ message: "Failed to get user info" });
  }
};

/**
 * POST /api/auth/register
 * Register a new user with email and password
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a default avatar
    const defaultPhotoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      photoURL: defaultPhotoURL,
      credits: 5,
    });

    console.log(`✅ New user created via Email/Password: ${email}`);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

/**
 * POST /api/auth/login
 * Log in a user with email and password
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the user previously only signed up with Google
    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google Sign-In. Please click Continue with Google." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

module.exports = { googleAuth, getMe, register, login };
