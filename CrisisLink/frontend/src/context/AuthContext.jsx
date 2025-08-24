import { createContext, useEffect, useState, useContext } from "react";
import { authAPI } from "../lib/api";
import { setAuthToken, removeAuthToken } from "../lib/axios";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setUser(data.user);
      setAuthToken(data.token);
    } catch (error) {
      setUser(null);
      removeAuthToken();
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
    } else {
      setReady(true);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login({ email, password });
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      setAuthToken(data.token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    removeAuthToken();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    try {
      const data = await authAPI.updateProfile(updates);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthCtx.Provider value={{ 
      user, 
      ready, 
      loading,
      login, 
      register, 
      logout, 
      updateProfile,
      refreshUser: fetchProfile 
    }}>
      {children}
    </AuthCtx.Provider>
  );
}