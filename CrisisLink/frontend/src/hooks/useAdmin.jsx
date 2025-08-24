import { useState } from "react";
import { adminAPI } from "../lib/api";
import toast from "react-hot-toast";

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);

  const getStats = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getStats();
      return data;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch statistics";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers(filters);
      return data;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch users";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSOSRequests = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await adminAPI.getSOSRequests(filters);
      return data;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch SOS requests";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getStats,
    getUsers,
    getSOSRequests
  };
};