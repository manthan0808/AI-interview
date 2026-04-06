import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, token } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-dark-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
