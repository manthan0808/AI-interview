import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX, HiLightningBolt, HiLogout, HiUser } from "react-icons/hi";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentInterview } = useSelector((state) => state.interview);

  const handleLinkClick = (e, path) => {
    if (currentInterview && path !== "/interview" && !isActive(path)) {
      e.preventDefault();
      toast.error("Finish or Leave your interview first!");
    } else {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMobileOpen(false);
  };

  const navLinks = isAuthenticated
    ? [
        { name: "Home", path: "/" },
        { name: "Interview", path: "/interview" },
        { name: "History", path: "/history" },
        { name: "Pricing", path: "/pricing" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Pricing", path: "/pricing" },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <HiLightningBolt className="text-black text-2xl transition-transform group-hover:scale-110" />
            <span className="text-xl md:text-2xl font-black text-black tracking-tighter">
              InterviewAI
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.path)
                    ? "text-blue-500 bg-blue-50"
                    : currentInterview && link.path !== "/interview"
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Credits Badge */}
                <div className="flex items-center gap-1.5 bg-gray-100/80 border border-dark-700/50 px-3 py-1.5 rounded-full">
                  <HiLightningBolt className="text-yellow-400 text-sm" />
                  <span className="text-sm font-semibold text-black">{user.credits}</span>
                  <span className="text-xs text-gray-500">credits</span>
                </div>

                {/* User Avatar */}
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-blue-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <HiUser className="text-blue-500" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  title="Logout"
                >
                  <HiLogout className="text-lg" />
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn-primary text-sm !px-5 !py-2">
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX className="text-xl" /> : <HiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => handleLinkClick(e, link.path)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${isActive(link.path)
                      ? "text-blue-500 bg-blue-50"
                      : currentInterview && link.path !== "/interview"
                      ? "text-gray-400"
                      : "text-gray-600 hover:text-black hover:bg-gray-100"
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2.5">
                    <HiLightningBolt className="text-yellow-400" />
                    <span className="text-sm text-black font-semibold">{user.credits} credits</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center btn-primary text-sm mt-2"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
