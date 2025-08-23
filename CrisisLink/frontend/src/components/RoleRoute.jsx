// src/components/RoleRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allow = [] }) => {
  const { role } = useAuth();
  if (!role) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to={`/dashboard/${role}`} replace />;
  return <Outlet />;
};

export default RoleRoute;
