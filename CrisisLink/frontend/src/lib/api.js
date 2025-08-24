import api from './axios';

export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  throw new Error(error.message || 'Something went wrong');
};

export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateProfile: async (updates) => {
    try {
      const response = await api.patch('/auth/profile', updates);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

export const sosAPI = {
  create: async (sosData) => {
    try {
      const response = await api.post('/sos', sosData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getMyRequests: async () => {
    try {
      const response = await api.get('/sos/my');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getNearby: async (lat, lng, maxDistance = 10000) => {
    try {
      const response = await api.get('/sos/nearby', {
        params: { lat, lng, maxDistance }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  accept: async (sosId) => {
    try {
      const response = await api.post(`/sos/${sosId}/accept`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  updateStatus: async (sosId, status) => {
    try {
      const response = await api.patch(`/sos/${sosId}/status`, { status });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

export const adminAPI = {
  getStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getUsers: async (filters = {}) => {
    try {
      const response = await api.get('/admin/users', { params: filters });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getSOSRequests: async (filters = {}) => {
    try {
      const response = await api.get('/admin/sos', { params: filters });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};