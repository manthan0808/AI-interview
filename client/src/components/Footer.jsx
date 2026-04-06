import { Link } from "react-router-dom";
import { HiLightningBolt, HiHeart } from "react-icons/hi";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark-950 border-t border-dark-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                <HiLightningBolt className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">
                Interview<span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed">
              AI-powered interview practice platform. Ace your next interview with real-time AI feedback.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Pricing", path: "/pricing" },
                { name: "Start Interview", path: "/interview" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-dark-400 hover:text-primary-400 text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              {["AI Questions", "Resume Analysis", "Real-time Feedback", "Interview Reports"].map(
                (feature) => (
                  <li key={feature} className="text-dark-400 text-sm">
                    {feature}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: FaGithub, href: "#" },
                { icon: FaTwitter, href: "#" },
                { icon: FaLinkedin, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 bg-dark-800/50 border border-dark-700/50 rounded-xl flex items-center justify-center
                           text-dark-400 hover:text-primary-400 hover:border-primary-500/30 transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-dark-800/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} InterviewAI. All rights reserved.
          </p>
          <p className="text-dark-500 text-sm flex items-center gap-1">
            Made with <HiHeart className="text-red-500" /> using AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
