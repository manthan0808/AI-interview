import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiUpload, HiArrowRight, HiArrowLeft, HiCheck,
  HiLightningBolt, HiStar, HiPaperAirplane, HiChartBar
} from "react-icons/hi";
import { analyzeResume, createInterview, submitAnswer, nextQuestion, resetInterview } from "../store/slices/interviewSlice";
import { updateCredits } from "../store/slices/authSlice";
import toast from "react-hot-toast";

const InterviewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    questions, analysisLoading, currentInterview,
    currentQuestionIndex, submitLoading, latestFeedback, feedbackList, error
  } = useSelector((state) => state.interview);

  // Step 1 state
  const [step, setStep] = useState(1);
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("fresher");
  const [resumeFile, setResumeFile] = useState(null);

  // Step 2 state
  const [currentAnswer, setCurrentAnswer] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  const handleAnalyzeResume = async () => {
    if (!jobRole.trim()) {
      toast.error("Please enter a job role");
      return;
    }
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobRole", jobRole);
    formData.append("experience", experience);

    const result = await dispatch(analyzeResume(formData));

    if (analyzeResume.fulfilled.match(result)) {
      toast.success("Resume analyzed! Questions generated.");

      // Create interview session
      const createResult = await dispatch(
        createInterview({
          jobRole,
          jobDescription,
          experience,
          resumeText: result.payload.resumeText,
          questions: result.payload.questions,
        })
      );

      if (createInterview.fulfilled.match(createResult)) {
        setStep(2);
      } else {
        toast.error("Failed to create interview session");
      }
    } else {
      toast.error(result.payload || "Failed to analyze resume");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast.error("Please type your answer");
      return;
    }

    if (user.credits <= 0) {
      toast.error("No credits left! Purchase more to continue.");
      navigate("/pricing");
      return;
    }

    const result = await dispatch(
      submitAnswer({
        interviewId: currentInterview._id,
        questionId: questions[currentQuestionIndex].id,
        answer: currentAnswer,
      })
    );

    if (submitAnswer.fulfilled.match(result)) {
      toast.success("Feedback received!");
      dispatch(updateCredits(result.payload.remainingCredits));
    } else {
      toast.error(result.payload || "Failed to submit answer");
    }
  };

  const handleNextQuestion = () => {
    dispatch(nextQuestion());
    setCurrentAnswer("");
  };

  const handleFinishInterview = () => {
    if (currentInterview) {
      navigate(`/report/${currentInterview._id}`);
      dispatch(resetInterview());
    }
  };

  const isLastQuestion = currentQuestionIndex >= questions.length - 1;
  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-12">
      <div className="page-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 ? "Start Your Interview" : "Mock Interview"}
          </h1>
          <p className="text-dark-400">
            {step === 1
              ? "Fill in your details and upload your resume to begin"
              : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
          </p>

          {/* Progress bar for step 2 */}
          {step === 2 && (
            <div className="mt-4 w-full bg-dark-800 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ==================== STEP 1: FORM ==================== */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="max-w-2xl mx-auto"
            >
              <div className="glass-card p-6 sm:p-8 space-y-6">
                {/* Job Role */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Job Role *
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="e.g., Frontend Developer, Data Scientist"
                    className="input-field"
                  />
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Job Description (optional)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here for more tailored questions..."
                    rows={4}
                    className="textarea-field"
                  />
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Experience Level *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {["fresher", "junior", "mid", "senior", "lead"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setExperience(level)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200
                          ${experience === level
                            ? "bg-primary-500/20 border border-primary-500/50 text-primary-300"
                            : "bg-dark-900/50 border border-dark-700/50 text-dark-400 hover:border-dark-600 hover:text-dark-200"
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-2">
                    Upload Resume (PDF) *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
                      ${resumeFile
                        ? "border-primary-500/50 bg-primary-500/5"
                        : "border-dark-700/50 hover:border-dark-600 hover:bg-dark-900/30"
                      }`}
                    onClick={() => document.getElementById("resume-upload").click()}
                  >
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {resumeFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <HiCheck className="text-primary-400 text-2xl" />
                        <div>
                          <p className="text-white font-medium">{resumeFile.name}</p>
                          <p className="text-dark-400 text-sm">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <HiUpload className="text-dark-500 text-3xl mx-auto mb-3" />
                        <p className="text-dark-300 font-medium">Click to upload your resume</p>
                        <p className="text-dark-500 text-sm mt-1">PDF format, max 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleAnalyzeResume}
                  disabled={analysisLoading || !jobRole || !resumeFile}
                  className="btn-primary w-full flex items-center justify-center gap-2 !py-4"
                >
                  {analysisLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing Resume & Generating Questions...
                    </>
                  ) : (
                    <>
                      <HiLightningBolt />
                      Analyze Resume & Start Interview
                    </>
                  )}
                </button>

                {/* Credits info */}
                <p className="text-center text-dark-500 text-sm">
                  <HiLightningBolt className="inline text-yellow-400" /> You have{" "}
                  <span className="text-white font-semibold">{user?.credits || 0}</span> credits remaining.
                  Each answer costs 1 credit.
                </p>
              </div>
            </motion.div>
          )}

          {/* ==================== STEP 2: INTERVIEW ==================== */}
          {step === 2 && currentQ && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Question Card */}
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 sm:p-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase
                    ${currentQ.type === "technical"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-green-500/10 text-green-400 border border-green-500/20"
                    }`}>
                    {currentQ.type}
                  </span>
                  <span className="text-dark-500 text-sm">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h2>
              </motion.div>

              {/* Answer Input (only show if no feedback yet) */}
              {!latestFeedback && (
                <div className="glass-card p-6 sm:p-8">
                  <label className="block text-sm font-medium text-dark-200 mb-3">
                    Your Answer
                  </label>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here... Be as detailed as possible."
                    rows={6}
                    className="textarea-field mb-4"
                    disabled={submitLoading}
                  />
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={submitLoading || !currentAnswer.trim()}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {submitLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Getting AI Feedback...
                      </>
                    ) : (
                      <>
                        <HiPaperAirplane className="rotate-90" />
                        Submit Answer
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Feedback Card */}
              {latestFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 sm:p-8 border-primary-500/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">AI Feedback</h3>
                    <div className="flex items-center gap-1.5 bg-primary-500/10 px-3 py-1.5 rounded-full">
                      <HiStar className="text-yellow-400" />
                      <span className="text-white font-bold">{latestFeedback.rating}</span>
                      <span className="text-dark-400 text-sm">/10</span>
                    </div>
                  </div>

                  <p className="text-dark-200 leading-relaxed mb-6">
                    {latestFeedback.feedbackText}
                  </p>

                  {/* Next / Finish */}
                  <div className="flex gap-3">
                    {isLastQuestion ? (
                      <button
                        onClick={handleFinishInterview}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                      >
                        <HiChartBar />
                        View Full Report
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                      >
                        Next Question
                        <HiArrowRight />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewPage;
