import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (baseUrl = null) => {
  if (!socket) {
    const url = baseUrl || import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    socket = io(url, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // Handle connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initSocket() first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Socket event constants
export const SOCKET_EVENTS = {
  // SOS Events
  SOS_CREATED: 'sos_created',
  SOS_ACCEPTED: 'sos_accepted',
  SOS_UPDATED: 'sos_updated',
  SOS_RESOLVED: 'sos_resolved',
  
  // Volunteer Events
  VOLUNTEER_AVAILABLE: 'volunteer_available',
  VOLUNTEER_UNAVAILABLE: 'volunteer_unavailable',
  
  // Location Events
  LOCATION_UPDATE: 'location_update',
  
  // Chat Events
  MESSAGE_SENT: 'message_sent',
  MESSAGE_RECEIVED: 'message_received',
  
  // System Events
  USER_CONNECTED: 'user_connected',
  USER_DISCONNECTED: 'user_disconnected'
};