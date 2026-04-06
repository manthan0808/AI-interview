import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiBriefcase, HiClock, HiChevronRight, HiDocumentReport } from "react-icons/hi";
import { fetchHistory } from "../store/slices/interviewSlice";

const HistoryPage = () => {
  const dispatch = useDispatch();
  const { history, historyLoading } = useSelector((state) => state.interview);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAverageScore = (feedback) => {
    if (!feedback || feedback.length === 0) return null;
    const avg = feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length;
    return avg.toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    if (score >= 4) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-12">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Interview History</h1>
          <p className="text-dark-400">Review your past interview sessions and track your progress</p>
        </motion.div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-12 text-center"
          >
            <HiDocumentReport className="text-dark-600 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Interviews Yet</h3>
            <p className="text-dark-400 mb-6">Start your first mock interview to see your history here.</p>
            <Link to="/interview" className="btn-primary inline-flex items-center gap-2">
              Start Interview
              <HiChevronRight />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {history.map((interview, index) => {
              const avgScore = getAverageScore(interview.feedback);

              return (
                <motion.div
                  key={interview._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/report/${interview._id}`}
                    className="glass-card-hover p-5 sm:p-6 flex items-center justify-between gap-4 group block"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <HiBriefcase className="text-primary-400 text-xl" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-semibold truncate">{interview.jobRole}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-dark-400 text-sm flex items-center gap-1">
                            <HiClock className="text-xs" />
                            {formatDate(interview.createdAt)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase
                            ${interview.status === "completed"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            }`}>
                            {interview.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      {avgScore && (
                        <div className="text-center hidden sm:block">
                          <div className={`text-2xl font-bold ${getScoreColor(parseFloat(avgScore))}`}>
                            {avgScore}
                          </div>
                          <div className="text-dark-500 text-xs">Avg Score</div>
                        </div>
                      )}
                      <div className="text-center hidden sm:block">
                        <div className="text-lg font-semibold text-dark-200">
                          {interview.answers?.length || 0}/{interview.questions?.length || 0}
                        </div>
                        <div className="text-dark-500 text-xs">Answered</div>
                      </div>
                      <HiChevronRight className="text-dark-500 text-xl group-hover:text-primary-400 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
