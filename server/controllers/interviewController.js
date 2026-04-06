const pdfParse = require("pdf-parse");
const Interview = require("../models/Interview");
const User = require("../models/User");
const { generateQuestions, generateFeedback } = require("../utils/aiService");

/**
 * POST /api/interview/analyze-resume
 * Upload PDF → extract text → AI generates 10 questions
 */
const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF resume" });
    }

    const { jobRole, experience } = req.body;

    if (!jobRole) {
      return res.status(400).json({ message: "Job role is required" });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: "Could not extract sufficient text from the resume PDF" });
    }

    // Generate questions via AI
    const questions = await generateQuestions(resumeText, jobRole, experience || "fresher");

    res.status(200).json({
      message: "Resume analyzed successfully",
      resumeText,
      questions,
    });
  } catch (error) {
    console.error("Analyze Resume Error:", error.message);
    res.status(500).json({ message: "Failed to analyze resume", error: error.message });
  }
};

/**
 * POST /api/interview/create
 * Save a new interview session to Firestore
 */
const createInterview = async (req, res) => {
  try {
    const { jobRole, jobDescription, experience, resumeText, questions } = req.body;

    if (!jobRole || !questions || questions.length === 0) {
      return res.status(400).json({ message: "Job role and questions are required" });
    }

    const interview = await Interview.create({
      userId: req.user._id,
      jobRole,
      jobDescription: jobDescription || "",
      experience: experience || "fresher",
      resumeText: resumeText || "",
      questions,
      answers: [],
      feedback: [],
      status: "in-progress",
    });

    res.status(201).json({
      message: "Interview session created",
      interview,
    });
  } catch (error) {
    console.error("Create Interview Error:", error.message);
    res.status(500).json({ message: "Failed to create interview session" });
  }
};

/**
 * POST /api/interview/submit-answer
 * Save user answer → AI feedback → deduct 1 credit
 */
const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionId, answer } = req.body;

    if (!interviewId || questionId === undefined || !answer) {
      return res.status(400).json({ message: "Interview ID, question ID, and answer are required" });
    }

    // Check credits
    const user = await User.findById(req.user._id);
    if (!user || user.credits <= 0) {
      return res.status(403).json({ message: "Insufficient credits. Please purchase more credits to continue." });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview || interview.userId !== req.user._id) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Find the question text
    const questionObj = interview.questions.find((q) => q.id === questionId);
    if (!questionObj) {
      return res.status(404).json({ message: "Question not found in this interview" });
    }

    // Get AI feedback
    const aiFeedback = await generateFeedback(questionObj.question, answer);

    // Update interview arrays
    const updatedAnswers = [...interview.answers, {
      questionId,
      answer,
      submittedAt: new Date(),
    }];

    const updatedFeedback = [...interview.feedback, {
      questionId,
      feedbackText: aiFeedback.feedbackText,
      rating: aiFeedback.rating,
    }];

    // Check if all questions answered
    let status = interview.status;
    if (updatedAnswers.length >= interview.questions.length) {
      status = "completed";
    }

    await Interview.findByIdAndUpdate(interviewId, {
      answers: updatedAnswers,
      feedback: updatedFeedback,
      status
    });

    // Deduct 1 credit
    const remainingCredits = user.credits - 1;
    await User.findByIdAndUpdate(user._id, { credits: remainingCredits });

    res.status(200).json({
      message: "Answer submitted successfully",
      feedback: {
        questionId,
        feedbackText: aiFeedback.feedbackText,
        rating: aiFeedback.rating,
      },
      remainingCredits,
      interviewStatus: status,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error.message);
    res.status(500).json({ message: "Failed to submit answer", error: error.message });
  }
};

/**
 * GET /api/interview/history
 * Return all interviews for the logged-in user from Firestore
 */
const getHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id });
    
    // Sort manually as Firestore helper is simple
    const sortedInterviews = interviews.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({ interviews: sortedInterviews });
  } catch (error) {
    console.error("Get History Error:", error.message);
    res.status(500).json({ message: "Failed to fetch interview history" });
  }
};

/**
 * GET /api/interview/:id
 * Return single interview with full report
 */
const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview || interview.userId !== req.user._id) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json({ interview });
  } catch (error) {
    console.error("Get Interview Error:", error.message);
    res.status(500).json({ message: "Failed to fetch interview" });
  }
};

module.exports = {
  analyzeResume,
  createInterview,
  submitAnswer,
  getHistory,
  getInterviewById,
};
