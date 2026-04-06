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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center
                          group-hover:shadow-lg group-hover:shadow-primary-500/25 transition-all duration-300">
              <HiLightningBolt className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-white">
              Interview<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.path)
                    ? "text-primary-400 bg-primary-500/10"
                    : "text-dark-300 hover:text-white hover:bg-dark-800"
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
                <div className="flex items-center gap-1.5 bg-dark-800/80 border border-dark-700/50 px-3 py-1.5 rounded-full">
                  <HiLightningBolt className="text-yellow-400 text-sm" />
                  <span className="text-sm font-semibold text-white">{user.credits}</span>
                  <span className="text-xs text-dark-400">credits</span>
                </div>

                {/* User Avatar */}
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-primary-500/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <HiUser className="text-primary-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-dark-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
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
            className="md:hidden p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800"
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
            className="md:hidden bg-dark-900/95 backdrop-blur-xl border-b border-dark-800/50"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${isActive(link.path)
                      ? "text-primary-400 bg-primary-500/10"
                      : "text-dark-300 hover:text-white hover:bg-dark-800"
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2.5">
                    <HiLightningBolt className="text-yellow-400" />
                    <span className="text-sm text-white font-semibold">{user.credits} credits</span>
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
