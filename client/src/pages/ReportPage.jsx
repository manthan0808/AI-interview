import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  HiArrowLeft, HiBriefcase, HiStar, HiTrendingUp,
  HiTrendingDown, HiCheckCircle, HiXCircle
} from "react-icons/hi";
import { fetchInterviewById } from "../store/slices/interviewSlice";

const ReportPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { report, reportLoading } = useSelector((state) => state.interview);

  useEffect(() => {
    if (id) {
      dispatch(fetchInterviewById(id));
    }
  }, [id, dispatch]);

  if (reportLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-dark-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Report Not Found</h2>
          <Link to="/history" className="btn-primary">Go to History</Link>
        </div>
      </div>
    );
  }

  const avgScore =
    report.feedback.length > 0
      ? (report.feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / report.feedback.length).toFixed(1)
      : "N/A";

  const strengths = report.feedback.filter((f) => f.rating >= 7);
  const weaknesses = report.feedback.filter((f) => f.rating < 7);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    if (score >= 4) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score >= 8) return "bg-green-500/10 border-green-500/20";
    if (score >= 6) return "bg-yellow-500/10 border-yellow-500/20";
    if (score >= 4) return "bg-orange-500/10 border-orange-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-12">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/history" className="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors mb-4">
            <HiArrowLeft /> Back to History
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Interview Report</h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-dark-300">
                  <HiBriefcase className="text-primary-400" /> {report.jobRole}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase
                  ${report.status === "completed"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}>
                  {report.status}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Score Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          <div className="glass-card p-6 text-center">
            <div className={`text-4xl font-extrabold mb-1 ${typeof avgScore === 'number' || !isNaN(parseFloat(avgScore)) ? getScoreColor(parseFloat(avgScore)) : 'text-dark-400'}`}>
              {avgScore}
            </div>
            <div className="text-dark-400 text-sm">Average Score</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-extrabold text-green-400 mb-1 flex items-center justify-center gap-1">
              <HiTrendingUp className="text-2xl" />
              {strengths.length}
            </div>
            <div className="text-dark-400 text-sm">Strong Answers</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-4xl font-extrabold text-orange-400 mb-1 flex items-center justify-center gap-1">
              <HiTrendingDown className="text-2xl" />
              {weaknesses.length}
            </div>
            <div className="text-dark-400 text-sm">Needs Improvement</div>
          </div>
        </motion.div>

        {/* Questions & Answers */}
        <div className="space-y-4">
          {report.questions.map((q, index) => {
            const answer = report.answers.find((a) => a.questionId === q.id);
            const feedback = report.feedback.find((f) => f.questionId === q.id);

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="glass-card p-6 sm:p-8"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-dark-500 text-sm font-medium">Q{index + 1}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase
                        ${q.type === "technical"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-green-500/10 text-green-400 border border-green-500/20"
                        }`}>
                        {q.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{q.question}</h3>
                  </div>
                  {feedback && (
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${getScoreBg(feedback.rating)}`}>
                      <HiStar className="text-yellow-400 text-sm" />
                      <span className={`font-bold text-sm ${getScoreColor(feedback.rating)}`}>
                        {feedback.rating}/10
                      </span>
                    </div>
                  )}
                </div>

                {/* Answer */}
                {answer ? (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <HiCheckCircle className="text-primary-400 text-sm" />
                      <span className="text-sm font-medium text-dark-300">Your Answer</span>
                    </div>
                    <p className="text-dark-200 bg-dark-900/50 rounded-xl p-4 text-sm leading-relaxed border border-dark-700/30">
                      {answer.answer}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-dark-500 text-sm mb-4">
                    <HiXCircle /> Not answered
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <HiStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-medium text-dark-300">AI Feedback</span>
                    </div>
                    <p className="text-dark-300 bg-primary-500/5 rounded-xl p-4 text-sm leading-relaxed border border-primary-500/10">
                      {feedback.feedbackText}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 mt-10"
        >
          <Link to="/interview" className="btn-primary flex items-center gap-2">
            Start New Interview
          </Link>
          <Link to="/history" className="btn-secondary flex items-center gap-2">
            View All History
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportPage;
