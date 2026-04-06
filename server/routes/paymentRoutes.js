const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const { createOrder, verifyPayment } = require("../controllers/paymentController");

router.post("/create-order", isAuth, createOrder);
router.post("/verify", isAuth, verifyPayment);

module.exports = router;
