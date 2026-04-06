import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiLightningBolt, HiDocumentText, HiChatAlt2, HiChartBar,
  HiUpload, HiQuestionMarkCircle, HiAnnotation, HiTrendingUp,
  HiCheck, HiArrowRight
} from "react-icons/hi";
import Footer from "../components/Footer";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { staggerChildren: 0.1 },
};

const HomePage = () => {
  const features = [
    {
      icon: HiDocumentText,
      title: "Smart Resume Analysis",
      description: "Upload your PDF resume and our AI extracts key skills, experience, and generates tailored interview questions.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: HiChatAlt2,
      title: "AI Mock Interviews",
      description: "Practice with realistic interview questions — 6 technical and 4 HR questions customized for your target role.",
      color: "from-primary-500 to-purple-500",
    },
    {
      icon: HiChartBar,
      title: "Instant AI Feedback",
      description: "Get detailed feedback and ratings for every answer. Know your strengths and improve your weaknesses.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: HiTrendingUp,
      title: "Track Your Progress",
      description: "View detailed reports of all your interviews with scores, feedback, and areas for improvement over time.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const steps = [
    { icon: HiUpload, title: "Upload Resume", description: "Upload your PDF resume and enter your target job role" },
    { icon: HiQuestionMarkCircle, title: "Get AI Questions", description: "Our AI analyzes your resume and generates 10 tailored questions" },
    { icon: HiAnnotation, title: "Answer & Get Feedback", description: "Answer each question and receive instant AI-powered feedback" },
    { icon: HiChartBar, title: "View Your Report", description: "Get a comprehensive interview report with scores and suggestions" },
  ];

  const plans = [
    { name: "Free", price: "₹0", credits: "5", features: ["5 AI Credits", "Resume Analysis", "Basic Feedback", "Interview History"], popular: false },
    { name: "Pro", price: "₹199", credits: "50", features: ["50 AI Credits", "Resume Analysis", "Detailed Feedback", "Full Reports", "Priority Support"], popular: true },
    { name: "Elite", price: "₹499", credits: "150", features: ["150 AI Credits", "Resume Analysis", "Premium Feedback", "Full Reports", "Priority Support", "Unlimited History"], popular: false },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(108,99,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(108,99,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative z-10 page-container text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-6">
              <HiLightningBolt className="text-primary-400 text-sm" />
              <span className="text-primary-300 text-sm font-medium">AI-Powered Interview Practice</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Ace Your Next
              <br />
              <span className="gradient-text">Interview</span> with AI
            </h1>

            <p className="text-dark-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your resume, practice with AI-generated questions tailored to your target role,
              and get instant expert feedback to improve.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="btn-primary text-lg !px-8 !py-4 flex items-center gap-2">
                Start Practicing Free
                <HiArrowRight />
              </Link>
              <a href="#features" className="btn-secondary text-lg !px-8 !py-4">
                Learn More
              </a>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center justify-center gap-8 sm:gap-12 mt-16"
            >
              {[
                { value: "10K+", label: "Interviews" },
                { value: "95%", label: "Satisfaction" },
                { value: "50+", label: "Job Roles" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-dark-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding">
        <div className="page-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Our AI interview platform provides all the tools you need to prepare, practice, and excel.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-card-hover p-6 sm:p-8 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5
                              group-hover:shadow-lg transition-all duration-300`}>
                  <feature.icon className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-dark-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-dark-900/30">
        <div className="page-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Get started in just four simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center p-6"
              >
                <div className="w-16 h-16 bg-primary-500/10 border border-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 relative">
                  <step.icon className="text-primary-400 text-2xl" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="section-padding">
        <div className="page-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Start free and upgrade when you're ready
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative glass-card p-6 sm:p-8 ${plan.popular ? "border-primary-500/50 shadow-lg shadow-primary-500/10" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-extrabold gradient-text">{plan.price}</div>
                  <p className="text-dark-400 text-sm mt-1">{plan.credits} credits</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-dark-300">
                      <HiCheck className="text-primary-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === "Free" ? "/auth" : "/pricing"}
                  className={`block text-center w-full py-3 rounded-xl font-semibold transition-all duration-300
                    ${plan.popular
                      ? "btn-primary"
                      : "border border-dark-600 text-dark-200 hover:border-primary-500/30 hover:text-white"
                    }`}
                >
                  {plan.name === "Free" ? "Get Started" : "Buy Credits"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="page-container">
          <motion.div
            {...fadeInUp}
            className="glass-card p-8 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-purple-500/5" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Ace Your Interview?
              </h2>
              <p className="text-dark-300 text-lg max-w-xl mx-auto mb-8">
                Join thousands of candidates who improved their interview skills with AI-powered practice.
              </p>
              <Link to="/auth" className="btn-primary text-lg !px-8 !py-4 inline-flex items-center gap-2">
                Start Now — It's Free
                <HiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
