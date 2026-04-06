const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const { admin } = require("../config/firebase");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Credit plans
const PLANS = {
  pro: { amount: 19900, credits: 50, name: "Pro Plan" },       // ₹199
  elite: { amount: 49900, credits: 150, name: "Elite Plan" },   // ₹499
};

/**
 * POST /api/payment/create-order
 * Create a Razorpay order
 */
const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const selectedPlan = PLANS[plan];

    const options = {
      amount: selectedPlan.amount, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        plan,
        credits: selectedPlan.credits,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      message: "Order created successfully",
      order,
      plan: selectedPlan,
    });
  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

/**
 * POST /api/payment/verify
 * Verify Razorpay payment signature → add credits using Firestore increment
 */
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return res.status(400).json({ message: "Missing payment verification data" });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed — invalid signature" });
    }

    // Add credits
    const selectedPlan = PLANS[plan];
    if (!selectedPlan) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    // Atomic increment in Firestore
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { credits: admin.firestore.FieldValue.increment(selectedPlan.credits) }
    );

    res.status(200).json({
      message: `Payment successful! ${selectedPlan.credits} credits added.`,
      credits: user.credits,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

module.exports = { createOrder, verifyPayment };
