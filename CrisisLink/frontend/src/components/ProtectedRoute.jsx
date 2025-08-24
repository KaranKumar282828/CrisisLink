import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allow = ["user", "volunteer", "admin"] }) {
  const { user, ready } = useAuth();

  if (!ready) return null; // or a loader
  if (!user) return <Navigate to="/login" replace />;

  if (!allow.includes(user.role)) return (<Navigate to="/" replace />);
  return <Outlet />;
}
