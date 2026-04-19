import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiUpload, HiArrowRight, HiArrowLeft, HiCheck,
  HiLightningBolt, HiStar, HiPaperAirplane, HiChartBar,
  HiAdjustments, HiCode, HiUserGroup, HiMicrophone, HiClock, HiStop
} from "react-icons/hi";
import { FaUserTie, FaUserGraduate } from "react-icons/fa";
import { analyzeResume, createInterview, submitAnswer, nextQuestion, resetInterview } from "../store/slices/interviewSlice";
import { updateCredits } from "../store/slices/authSlice";
import toast from "react-hot-toast";

const PRESETS = [
  { label: "All Technical", icon: HiCode, tech: 10, hr: 0 },
  { label: "Balanced", icon: HiAdjustments, tech: 6, hr: 4 },
  { label: "All HR", icon: HiUserGroup, tech: 0, hr: 10 },
];

const InterviewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    questions, analysisLoading, currentInterview,
    currentQuestionIndex, submitLoading, latestFeedback, feedbackList, error
  } = useSelector((state) => state.interview);

  // Step state: 1 = form, 1.5 = question mix, 2 = interview
  const [step, setStep] = useState(1);
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("fresher");
  const [resumeFile, setResumeFile] = useState(null);

  // Step 1.5 state
  const [techCount, setTechCount] = useState(6);
  const [hrCount, setHrCount] = useState(4);
  const [activePreset, setActivePreset] = useState(1);
  const [persona, setPersona] = useState("friendly"); // friendly or strict
  const [timedMode, setTimedMode] = useState(false);

  // Step 2 state
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  // Voice STT Setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setCurrentAnswer(transcript);
    };
  }

  const toggleRecording = () => {
    if (!recognition) return toast.error("Speech recognition not supported in this browser");
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      toast.error("Please upload a valid PDF file");
    }
  };

  const handlePresetSelect = (index) => {
    setActivePreset(index);
    setTechCount(PRESETS[index].tech);
    setHrCount(PRESETS[index].hr);
  };

  const handleTechSlider = (val) => {
    const parsed = Math.max(0, Math.min(10, Number(val)));
    setTechCount(parsed);
    setHrCount(10 - parsed);
    setActivePreset(-1);
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
    formData.append("techCount", String(techCount));
    formData.append("hrCount", String(hrCount));
    formData.append("persona", persona);

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
          persona,
        })
      );

      if (createInterview.fulfilled.match(createResult)) {
        setStep(2);
        if (timedMode) {
          setTimeLeft(120);
          setTimerActive(true);
        }
      } else {
        toast.error("Failed to create interview session");
      }
    } else {
      toast.error(result.payload || "Failed to analyze resume");
    }
  };

  // Timer side effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0 && !latestFeedback && !submitLoading) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive && !latestFeedback && !submitLoading) {
      handleSubmitAnswer();
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, latestFeedback, submitLoading]);

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
    if (timedMode) {
      setTimeLeft(120);
      setTimerActive(true);
    }
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="page-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-black mb-2">
            {step === 1 && "Start Your Interview"}
            {step === 1.5 && "Choose Question Mix"}
            {step === 2 && "Mock Interview"}
          </h1>
          <p className="text-gray-600">
            {step === 1 && "Fill in your details and upload your resume to begin"}
            {step === 1.5 && "Decide how many Technical and HR questions you want"}
            {step === 2 && `Question ${currentQuestionIndex + 1} of ${questions.length}`}
          </p>

          {/* Step indicator */}
          {step !== 2 && (
            <div className="flex items-center gap-2 mt-4">
              {[{ n: 1, label: "Details" }, { n: 1.5, label: "Question Mix" }, { n: 2, label: "Interview" }].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                    ${step === s.n ? "bg-black text-white" : step > s.n ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {step > s.n ? <HiCheck className="text-xs" /> : <span>{i + 1}</span>}
                    {s.label}
                  </div>
                  {i < 2 && <div className={`h-px w-6 ${step > s.n ? "bg-green-300" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          )}

          {/* Progress bar for step 2 */}
          {step === 2 && (
            <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
              <motion.div
                className="bg-black h-2 rounded-full"
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
                  <label className="block text-sm font-medium text-gray-800 mb-2">
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
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Job Description <span className="text-gray-400 font-normal">(optional)</span>
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
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Experience Level *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {["fresher", "junior", "mid", "senior", "lead"].map((level) => (
                      <button
                        key={level}
                        onClick={() => setExperience(level)}
                        className={`px-4 py-2.5 rounded-md text-sm font-medium capitalize transition-all duration-200
                          ${experience === level
                            ? "bg-black text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-black hover:text-black"
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Upload Resume (PDF) *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
                      ${resumeFile
                        ? "border-black bg-gray-50"
                        : "border-gray-300 hover:border-black"
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
                        <HiCheck className="text-black text-2xl" />
                        <div>
                          <p className="text-black font-medium">{resumeFile.name}</p>
                          <p className="text-gray-600 text-sm">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <HiUpload className="text-gray-400 text-3xl mx-auto mb-3" />
                        <p className="text-gray-700 font-medium">Click to upload your resume</p>
                        <p className="text-gray-500 text-sm mt-1">PDF format, max 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Credits info */}
                <p className="text-center text-gray-600 text-sm bg-gray-100/80 rounded-md py-3 px-4 border border-gray-200">
                  <HiLightningBolt className="inline text-yellow-500 mr-1" />
                  You have <span className="text-black font-bold">{user?.credits || 0}</span> credits.
                  Each answer costs 1 credit — a full 10-question interview costs 10 credits.
                </p>

                {/* Next: go to question mix */}
                <button
                  onClick={() => {
                    if (!jobRole.trim()) return toast.error("Please enter a job role");
                    if (!resumeFile) return toast.error("Please upload your resume");
                    setStep(1.5);
                  }}
                  disabled={!jobRole || !resumeFile}
                  className="btn-primary w-full flex items-center justify-center gap-2 !py-4"
                >
                  Next: Choose Question Mix
                  <HiArrowRight />
                </button>
              </div>
            </motion.div>
          )}

          {/* ==================== STEP 1.5: QUESTION MIX ==================== */}
          {step === 1.5 && (
            <motion.div
              key="step1-5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="max-w-2xl mx-auto"
            >
              <div className="glass-card p-6 sm:p-8 space-y-8">

                {/* Preset buttons */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
                    Quick Presets
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {PRESETS.map((preset, index) => (
                      <button
                        key={preset.label}
                        onClick={() => handlePresetSelect(index)}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200
                          ${activePreset === index
                            ? "border-black bg-black text-white shadow-md"
                            : "border-gray-200 bg-white text-gray-700 hover:border-black"
                          }`}
                      >
                        <preset.icon className={`text-2xl ${activePreset === index ? 'text-white' : 'text-black'}`} />
                        <span className="font-semibold text-sm">{preset.label}</span>
                        <span className={`text-xs ${activePreset === index ? "text-gray-300" : "text-gray-500"}`}>
                          {preset.tech > 0 && `${preset.tech} Tech`}
                          {preset.tech > 0 && preset.hr > 0 && " · "}
                          {preset.hr > 0 && `${preset.hr} HR`}
                        </span>
                        {activePreset === index && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <HiCheck className="text-black text-xs" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Persona Selection */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wider">
                    Interviewer Persona
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPersona("friendly")}
                      className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all
                        ${persona === "friendly" 
                          ? "border-black bg-black text-white shadow-md" 
                          : "border-gray-200 bg-white text-gray-700 hover:border-black"}`}
                    >
                      <FaUserGraduate className="text-xl" />
                      <div className="text-left">
                        <p className="font-bold text-sm">Friendly HR</p>
                        <p className={`text-[10px] ${persona === "friendly" ? "text-gray-300" : "text-gray-500"}`}>Encouraging & Behavioral</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setPersona("strict")}
                      className={`flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition-all
                        ${persona === "strict" 
                          ? "border-black bg-black text-white shadow-md" 
                          : "border-gray-200 bg-white text-gray-700 hover:border-black"}`}
                    >
                      <FaUserTie className="text-xl" />
                      <div className="text-left">
                        <p className="font-bold text-sm">Strict FAANG</p>
                        <p className={`text-[10px] ${persona === "strict" ? "text-gray-300" : "text-gray-500"}`}>Deep Technical Rigor</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Timed Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                      <HiClock className="text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">Timed Stress-Test</p>
                      <p className="text-xs text-gray-500">120 seconds per answer</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTimedMode(!timedMode)}
                    className={`w-12 h-6 rounded-full transition-all relative ${timedMode ? "bg-black" : "bg-gray-300"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${timedMode ? "left-7" : "left-1"}`} />
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-medium flex items-center gap-1">
                    <HiAdjustments /> Custom Mix
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Custom slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <HiCode className="text-blue-500 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Technical</p>
                        <p className="text-xs text-gray-500">Coding, system design, concepts</p>
                      </div>
                    </div>
                    <div className="w-14 h-10 bg-gray-50 border border-gray-300 rounded-md flex items-center justify-center">
                      <span className="text-xl font-bold text-black">{techCount}</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={techCount}
                    onChange={(e) => handleTechSlider(e.target.value)}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-black"
                    style={{ background: `linear-gradient(to right, #000 ${techCount * 10}%, #e5e7eb ${techCount * 10}%)` }}
                  />

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <HiUserGroup className="text-green-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">HR / Behavioral</p>
                        <p className="text-xs text-gray-500">Soft skills, situational, culture fit</p>
                      </div>
                    </div>
                    <div className="w-14 h-10 bg-gray-50 border border-gray-300 rounded-md flex items-center justify-center">
                      <span className="text-xl font-bold text-black">{hrCount}</span>
                    </div>
                  </div>
                </div>

                {/* Summary pill */}
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex gap-4">
                    {techCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium text-gray-700">{techCount} Technical</span>
                      </div>
                    )}
                    {hrCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span className="text-sm font-medium text-gray-700">{hrCount} HR</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">10 questions total · 10 credits</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary flex items-center gap-2 !px-5"
                  >
                    <HiArrowLeft /> Back
                  </button>
                  <button
                    onClick={handleAnalyzeResume}
                    disabled={analysisLoading || (techCount === 0 && hrCount === 0)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 !py-4"
                  >
                    {analysisLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Resume &amp; Generating Questions...
                      </>
                    ) : (
                      <>
                        <HiLightningBolt />
                        Generate {techCount + hrCount} Questions &amp; Start
                      </>
                    )}
                  </button>
                </div>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                    ${currentQ.type === "technical"
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "bg-green-50 text-green-600 border border-green-100"
                    }`}>
                    {currentQ.type === "technical" ? "💻 Technical" : "🤝 HR / Behavioral"}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  {timedMode && (
                    <div className={`ml-auto flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${timeLeft < 20 ? "bg-red-50 text-red-600 border-red-100" : "bg-gray-50 text-gray-600 border-gray-100"}`}>
                      <HiClock className={timeLeft < 20 ? "animate-pulse" : ""} />
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-black leading-relaxed">
                  {currentQ.question}
                </h2>
              </motion.div>

              {/* Answer Input (only show if no feedback yet) */}
              {!latestFeedback && (
                <div className="glass-card p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-800">
                      Your Answer
                    </label>
                    <button
                      onClick={toggleRecording}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all
                        ${isRecording 
                          ? "bg-red-500 text-white animate-pulse" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"}`}
                    >
                      {isRecording ? <HiStop /> : <HiMicrophone />}
                      {isRecording ? "Stop Recording" : "Voice Answer"}
                    </button>
                  </div>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type or speak your answer here... Be as detailed as possible."
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
                  className="glass-card p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-black">AI Feedback</h3>
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                      <HiStar className="text-yellow-500" />
                      <span className="text-black font-bold">{latestFeedback.rating}</span>
                      <span className="text-gray-500 text-sm">/10</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
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
