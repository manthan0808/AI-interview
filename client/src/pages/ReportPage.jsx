import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  HiArrowLeft, HiBriefcase, HiStar, HiTrendingUp,
  HiTrendingDown, HiCheckCircle, HiXCircle, HiInformationCircle
} from "react-icons/hi";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Report Not Found</h2>
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

  // Aggregated analytics for Radar Chart
  const radarData = report.feedback.length > 0 ? [
    { subject: 'Technical', A: report.feedback.reduce((sum, f) => sum + (f.categories?.technical || 0), 0) / report.feedback.length, fullMark: 10 },
    { subject: 'Communication', A: report.feedback.reduce((sum, f) => sum + (f.categories?.communication || 0), 0) / report.feedback.length, fullMark: 10 },
    { subject: 'STAR/Context', A: report.feedback.reduce((sum, f) => sum + (f.categories?.star_context || 0), 0) / report.feedback.length, fullMark: 10 },
    { subject: 'Logic', A: report.feedback.reduce((sum, f) => sum + (f.categories?.logic || 0), 0) / report.feedback.length, fullMark: 10 },
    { subject: 'Confidence', A: report.feedback.reduce((sum, f) => sum + (f.categories?.confidence || 0), 0) / report.feedback.length, fullMark: 10 },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/history" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors mb-4">
            <HiArrowLeft /> Back to History
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Interview Report</h1>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-gray-700">
                  <HiBriefcase className="text-blue-500" /> {report.jobRole}
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

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <HiTrendingUp className="text-blue-500" />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Performance Breakdown</h3>
            </div>
            <div className="h-[300px] w-full">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#000"
                      fill="#000"
                      fillOpacity={0.1}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
                  Complete an interview to see aggregate analytics
                </div>
              )}
            </div>
          </motion.div>

          {/* Score Overview Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="glass-card p-6 text-center h-full flex flex-col justify-center">
               <div className={`text-5xl font-black mb-2 ${typeof avgScore === 'number' || !isNaN(parseFloat(avgScore)) ? getScoreColor(parseFloat(avgScore)) : 'text-gray-600'}`}>
                {avgScore}
              </div>
              <div className="text-gray-500 text-sm font-medium">Global Rating</div>
              <div className="mt-6 flex items-center justify-between text-left">
                <div>
                  <div className="text-xl font-bold text-green-500">{strengths.length}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Strong</div>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div>
                  <div className="text-xl font-bold text-orange-500">{weaknesses.length}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">Needs Prep</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

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
                      <span className="text-gray-500 text-sm font-medium">Q{index + 1}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase
                        ${q.type === "technical"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-green-500/10 text-green-400 border border-green-500/20"
                        }`}>
                        {q.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-black">{q.question}</h3>
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
                      <HiCheckCircle className="text-blue-500 text-sm" />
                      <span className="text-sm font-medium text-gray-700">Your Answer</span>
                    </div>
                    <p className="text-gray-800 bg-white rounded-xl p-4 text-sm leading-relaxed border border-gray-200">
                      {answer.answer}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <HiXCircle /> Not answered
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <HiStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-medium text-gray-700">AI Feedback</span>
                    </div>
                    <p className="text-gray-700 bg-primary-500/5 rounded-xl p-4 text-sm leading-relaxed border border-primary-500/10">
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
