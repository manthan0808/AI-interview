import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { HiLightningBolt, HiShieldCheck, HiSparkles, HiMail, HiLockClosed, HiUser } from "react-icons/hi";
import { googleLogin, loginUser, registerUser, clearError } from "../store/slices/authSlice";
import toast from "react-hot-toast";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/interview");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailAuth = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    } else {
      if (!formData.name) return toast.error("Name is required for registration");
      if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
      dispatch(registerUser(formData));
    }
  };

  const handleGoogleLogin = () => {
    dispatch(googleLogin());
  };

  const features = [
    { icon: HiLightningBolt, text: "AI-Powered Questions" },
    { icon: HiShieldCheck, text: "Instant Feedback" },
    { icon: HiSparkles, text: "5 Free Credits" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 relative overflow-hidden py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 sm:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                <HiLightningBolt className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-bold text-white">
                Interview<span className="gradient-text">AI</span>
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-dark-400 text-sm">
              {isLogin ? "Sign in to continue practicing" : "Join today to start your AI interviews"}
            </p>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative overflow-hidden"
                >
                  <label className="block text-sm font-medium text-dark-300 mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-dark-900/50 border border-dark-700/50 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-dark-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-dark-900/50 border border-dark-700/50 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-dark-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-dark-900/50 border border-dark-700/50 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-dark-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 active:scale-[0.98] mt-2 disabled:opacity-50 flex items-center justify-center min-h-[52px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                dispatch(clearError());
              }}
              className="text-sm text-dark-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-dark-700/50" />
            <span className="text-dark-500 text-xs uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-dark-700/50" />
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            <FcGoogle className="text-xl" />
            Continue with Google
          </button>

          {/* Features */}
          <div className="space-y-3 pt-6 border-t border-dark-700/30">
            <p className="text-xs font-semibold text-dark-400 uppercase tracking-widest text-center mb-4">Platform Benefits</p>
            {features.map(({ icon: Icon, text }, index) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/50 border border-dark-700/30"
              >
                <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
                  <Icon className="text-primary-400 text-sm" />
                </div>
                <span className="text-sm text-dark-200">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
