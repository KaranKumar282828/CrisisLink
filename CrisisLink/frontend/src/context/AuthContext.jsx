// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [role, setRole] = useState(() => localStorage.getItem("role")); // "user" | "volunteer" | "admin"
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  }, [token]);

  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [role]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const loginDemo = ({ role }) => {
    setToken("demo-token");
    setRole(role);
    setUser({ name: "Demo User", email: "demo@resqlink.app" });
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const value = { token, role, user, setToken, setRole, setUser, loginDemo, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
