const express = require("express");
const router = express.Router();
const { googleAuth, getMe, register, login } = require("../controllers/authController");
const isAuth = require("../middleware/isAuth");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", isAuth, getMe);

module.exports = router;
