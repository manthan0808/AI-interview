import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import InterviewPage from "./pages/InterviewPage";
import HistoryPage from "./pages/HistoryPage";
import ReportPage from "./pages/ReportPage";
import PricingPage from "./pages/PricingPage";

import { fetchCurrentUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <div className="min-h-screen bg-dark-950 text-white">
        <Navbar />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e1e2e",
              color: "#e6e6e8",
              border: "1px solid rgba(108, 99, 255, 0.2)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#6c63ff",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Protected Routes */}
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report/:id"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
