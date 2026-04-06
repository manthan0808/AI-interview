import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { HiCheck, HiLightningBolt, HiShieldCheck, HiStar } from "react-icons/hi";
import { updateCredits } from "../store/slices/authSlice";
import API from "../api/axios";
import toast from "react-hot-toast";

const PricingPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(null);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 5,
      description: "Get started with basic features",
      icon: HiLightningBolt,
      color: "from-gray-500 to-gray-600",
      features: [
        "5 AI Credits",
        "Resume Analysis",
        "AI-Generated Questions",
        "Basic Feedback",
        "Interview History",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹199",
      credits: 50,
      description: "For serious interview preparation",
      icon: HiShieldCheck,
      color: "from-primary-500 to-purple-500",
      features: [
        "50 AI Credits",
        "Resume Analysis",
        "AI-Generated Questions",
        "Detailed Feedback",
        "Full Interview Reports",
        "Priority Support",
      ],
      popular: true,
    },
    {
      id: "elite",
      name: "Elite",
      price: "₹499",
      credits: 150,
      description: "Maximum preparation power",
      icon: HiStar,
      color: "from-amber-500 to-orange-500",
      features: [
        "150 AI Credits",
        "Resume Analysis",
        "AI-Generated Questions",
        "Premium Feedback",
        "Full Interview Reports",
        "Priority Support",
        "Unlimited History",
      ],
      popular: false,
    },
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (planId) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to purchase credits");
      return;
    }

    if (planId === "free") {
      toast.success("You already have free credits!");
      return;
    }

    setLoading(planId);

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway");
        setLoading(null);
        return;
      }

      // Create order
      const { data } = await API.post("/api/payment/create-order", { plan: planId });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "InterviewAI",
        description: `${data.plan.name} — ${data.plan.credits} Credits`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyRes = await API.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: planId,
            });

            dispatch(updateCredits(verifyRes.data.credits));
            toast.success(verifyRes.data.message);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#6c63ff",
        },
        modal: {
          ondismiss: () => {
            setLoading(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-12">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Choose Your <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-dark-400 text-lg max-w-xl mx-auto">
            Start free and scale up as you prepare for more interviews.
            Each credit lets you submit one answer and receive AI feedback.
          </p>
          {isAuthenticated && user && (
            <div className="inline-flex items-center gap-2 bg-dark-800/80 border border-dark-700/50 px-4 py-2 rounded-full mt-6">
              <HiLightningBolt className="text-yellow-400" />
              <span className="text-sm text-dark-200">
                Current balance: <span className="text-white font-bold">{user.credits}</span> credits
              </span>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative glass-card p-6 sm:p-8 flex flex-col
                ${plan.popular ? "border-primary-500/50 shadow-lg shadow-primary-500/10" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-dark-400 text-sm mb-4">{plan.description}</p>
                <div className="text-4xl font-extrabold gradient-text">{plan.price}</div>
                <p className="text-dark-400 text-sm mt-1">{plan.credits} credits</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-dark-300">
                    <HiCheck className="text-primary-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePayment(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300
                  ${plan.popular
                    ? "btn-primary"
                    : "border border-dark-600 text-dark-200 hover:border-primary-500/30 hover:text-white hover:bg-primary-500/5"
                  } disabled:opacity-50`}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : plan.id === "free" ? (
                  "Current Plan"
                ) : (
                  `Buy ${plan.credits} Credits`
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* FAQ-like info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl mx-auto mt-16 text-center"
        >
          <p className="text-dark-500 text-sm">
            Credits never expire. Each answer submission costs 1 credit.
            Payments are securely processed by Razorpay. Need help?{" "}
            <a href="mailto:support@interviewai.com" className="text-primary-400 hover:underline">
              Contact us
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;
