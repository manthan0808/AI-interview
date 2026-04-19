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
    { name: "Free", price: "₹0", credits: "50", features: ["50 AI Credits (5 interviews)", "Resume Analysis", "Custom Question Mix", "Basic Feedback", "Interview History"], popular: false },
    { name: "Pro", price: "₹199", credits: "50", features: ["50 AI Credits", "Resume Analysis", "Detailed Feedback", "Full Reports", "Priority Support"], popular: true },
    { name: "Elite", price: "₹499", credits: "150", features: ["150 AI Credits", "Resume Analysis", "Premium Feedback", "Full Reports", "Priority Support", "Unlimited History"], popular: false },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
        {/* Background Effects */}
        <div className="absolute inset-0">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 page-container pt-24 pb-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="text-blue-500 text-sm font-bold tracking-wider uppercase">#1 AI Career Tool for GenZ</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-black leading-[1.1] tracking-tight mb-6">
                An AI interview copilot that automates entire interview preparations.
              </h1>

              <p className="text-gray-700 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed font-medium">
                Built for ambitious professionals. InterviewAI automates your entire prep with AI from generating tailored mock interviews to instant critical feedback.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Link to="/auth" className="btn-primary text-lg !px-8 !py-4 flex items-center justify-center gap-2">
                  Land more interviews for free
                  <HiArrowRight />
                </Link>
              </div>
              <Link to="/pricing" className="inline-block mt-4 text-sm text-blue-500 font-medium hover:underline">
                Purchasing for your university? Click here
              </Link>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-8 sm:gap-12 mt-16"
              >
                {[
                  { value: "10K+", label: "Interviews" },
                  { value: "95%", label: "Satisfaction" },
                  { value: "50+", label: "Job Roles" },
                ].map((stat) => (
                  <div key={stat.label} className="text-left">
                    <div className="text-2xl sm:text-3xl font-black text-black">{stat.value}</div>
                    <div className="text-gray-500 text-sm mt-1 font-medium">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <img 
                src="/hero-illustration.png" 
                alt="GenZ Career Illustration" 
                className="w-full h-auto object-contain max-h-[600px] hover:scale-[1.02] transition-transform duration-500"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding">
        <div className="page-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
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
                  <feature.icon className="text-black text-xl" />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-gray-50">
        <div className="page-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
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
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-5 relative">
                  <step.icon className="text-blue-500 text-2xl" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-black mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="section-padding">
        <div className="page-container">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
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
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-500 to-purple-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
                  <div className="text-4xl font-extrabold gradient-text">{plan.price}</div>
                  <p className="text-gray-500 text-sm mt-1">{plan.credits} credits</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <HiCheck className="text-blue-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.name === "Free" ? "/auth" : "/pricing"}
                  className={`block text-center w-full py-3 rounded-xl font-semibold transition-all duration-300
                    ${plan.popular
                      ? "btn-primary"
                      : "border border-gray-300 text-gray-700 hover:border-primary-500/30 hover:text-black"
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
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
                Ready to Ace Your Interview?
              </h2>
              <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
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
