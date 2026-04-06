const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const upload = require("../middleware/upload");
const {
  analyzeResume,
  createInterview,
  submitAnswer,
  getHistory,
  getInterviewById,
} = require("../controllers/interviewController");

router.post("/analyze-resume", isAuth, upload.single("resume"), analyzeResume);
router.post("/create", isAuth, createInterview);
router.post("/submit-answer", isAuth, submitAnswer);
router.get("/history", isAuth, getHistory);
router.get("/:id", isAuth, getInterviewById);

module.exports = router;
