import { Navigate } from "react-router-dom";

// Dummy auth check (later replace with real auth logic)
const isAuthenticated = () => {
  return localStorage.getItem("authToken") ? true : false;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
